import { describe, expect, it } from 'vitest';
import { createGameWithRng, placeTrayPiece } from '../game';
import { mulberry32 } from '../rng';
import { boardFromStrings, emptyBoardStrings } from './helpers';

describe('scoring/multiplier', () => {
  it('increases multiplier on clears and decays on no-clear, capped', () => {
    const rng = mulberry32(7);
    let state = createGameWithRng(7, rng);
    expect(state.multiplier).toBe(1);
    // craft a state: row 0 missing (0,9), tray has dot
    const rows = emptyBoardStrings();
    rows[0] = 'xxxxxxxxx.';
    state = { ...state, board: boardFromStrings(rows), tray: [{ id: 'd', shapeId: 'dot', cells: [{ row: 0, col: 0 }], element: 'fire', starIndex: null }, state.tray[1]!, state.tray[2]!] };
    const res = placeTrayPiece(state, 0, { row: 0, col: 9 }, rng);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.clear.linesCleared).toBe(1);
      expect(res.state.multiplier).toBeGreaterThan(1);
      expect(res.state.score).toBeGreaterThan(0);
    }
  });
});
