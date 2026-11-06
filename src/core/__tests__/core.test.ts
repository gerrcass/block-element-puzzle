import { describe, expect, it } from 'vitest';
import { applyClears } from '../clears';
import { applyPlacement, canPlace, createBoard, hasValidPlacement } from '../board';
import { createGameWithRng, placeTrayPiece } from '../game';
import { mulberry32, sequenceRng } from '../rng';
import { isGameOver, refillTray } from '../tray';
import type { Piece, Tray } from '../types';
import { boardFromStrings, countOccupied, makeDotPiece } from './helpers';

function empty10() {
  return Array.from({ length: 10 }, () => '.'.repeat(10));
}

describe('placement', () => {
  it('accepts valid placement and rejects occupied/out-of-bounds', () => {
    const board = createBoard();
    const piece: Piece = { id: 'dom', shapeId: 'dom-h', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }], element: 'water', starIndex: null };
    expect(canPlace(board, piece, { row: 0, col: 0 })).toBe(true);
    expect(canPlace(board, piece, { row: 0, col: 9 })).toBe(false);
    const b1 = applyPlacement(board, piece, { row: 0, col: 0 });
    expect(b1).not.toBeNull();
    expect(canPlace(b1!, piece, { row: 0, col: 0 })).toBe(false);
  });
});

describe('clears', () => {
  it('clears a full row and reports combo count', () => {
    const rows = empty10();
    rows[0] = 'xxxxxxxxx.'; // needs (0,9)
    const board = boardFromStrings(rows);
    const placed = applyPlacement(board, makeDotPiece(), { row: 0, col: 9 })!;
    const res = applyClears(placed);
    expect(res.clearedRows).toEqual([0]);
    expect(res.clearedCols).toEqual([]);
    expect(res.linesCleared).toBe(1);
    expect(res.cellsCleared).toBe(10);
    expect(countOccupied(res.board)).toBe(0);
  });

  it('clears row+column intersection once with linesCleared=2', () => {
    const rows = empty10();
    // row 0 full except (0,0), col 0 full except (0,0)
    rows[0] = '.xxxxxxxxx';
    for (let r = 1; r < 10; r++) rows[r] = 'x' + '.'.repeat(9);
    const board = boardFromStrings(rows);
    expect(countOccupied(board)).toBe(18);
    const placed = applyPlacement(board, makeDotPiece(), { row: 0, col: 0 })!;
    const res = applyClears(placed);
    expect(res.clearedRows).toEqual([0]);
    expect(res.clearedCols).toEqual([0]);
    expect(res.linesCleared).toBe(2);
    expect(res.cellsCleared).toBe(19); // union
    expect(countOccupied(res.board)).toBe(0);
  });

  it('collects stars from cleared cells', () => {
    const rows = empty10();
    rows[0] = 'xxxxxxxxx.';
    const board = boardFromStrings(rows);
    const starDot: Piece = { ...makeDotPiece('s'), starIndex: 0 };
    const placed = applyPlacement(board, starDot, { row: 0, col: 9 })!;
    const res = applyClears(placed);
    expect(res.collectedStars).toBe(1);
  });
});

describe('tray/refill and determinism', () => {
  it('refills only when all slots are empty and is deterministic for same RNG', () => {
    const tray: Tray = [null, makeDotPiece(), null];
    const same = refillTray(tray, mulberry32(1));
    expect(same[1]?.id).toBe('dot'); // unchanged because not all empty

    const rngA = mulberry32(123);
    const rngB = mulberry32(123);
    const a = refillTray([null, null, null], rngA);
    const b = refillTray([null, null, null], rngB);
    expect(a.map((p) => p?.shapeId)).toEqual(b.map((p) => p?.shapeId));
    expect(a.map((p) => p?.element)).toEqual(b.map((p) => p?.element));
  });

  it('sequenceRng is deterministic and throws when exhausted', () => {
    const rng = sequenceRng([0.1, 0.9]);
    expect(rng.next()).toBe(0.1);
    expect(rng.next()).toBe(0.9);
    expect(() => rng.next()).toThrow(/exhausted/);
  });
});

describe('game over', () => {
  it('detects when no tray piece can be placed', () => {
    // 9x9 block filled top-left leaves a 1-cell gap? easier: fill all except not enough for a 2x2; use dot pieces
    const rows = empty10().map(() => 'xxxxxxxxxx');
    // leave only (9,9) empty
    rows[9] = 'xxxxxxxxx.';
    const board = boardFromStrings(rows);
    const tray: Tray = [
      { id: 'd1', shapeId: 'dom-h', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }], element: 'fire', starIndex: null },
      null,
      null,
    ];
    expect(hasValidPlacement(board, tray[0]!)).toBe(false);
    expect(isGameOver(board, tray)).toBe(true);

    rows[9] = 'xxxxxxxx..';
    const board2 = boardFromStrings(rows);
    expect(isGameOver(board2, tray)).toBe(false);
  });

  it('placeTrayPiece rejects invalid moves and resolves valid moves', () => {
    const rng = mulberry32(42);
    const state = createGameWithRng(42, rng);
    const bad = placeTrayPiece(state, 0, { row: 99, col: 99 }, rng);
    expect(bad.ok).toBe(false);
    const piece = state.tray.find((p) => p != null)!;
    const slot = state.tray.indexOf(piece);
    const ok = placeTrayPiece(state, slot, { row: 0, col: 0 }, rng);
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.state.tray[slot]).toBeNull();
  });
});
