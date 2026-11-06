import { applyPlacement, createBoard } from './board';
import { applyClears } from './clears';
import { mulberry32 } from './rng';
import type { Rng } from './rng';
import { SHAPE_CATALOG } from './shapes';
import { createEmptyTray, isGameOver, refillTray } from './tray';
import type { GameState, PlaceResult, Point } from './types';

export function createGame(seed = Date.now()): GameState {
  const rng = mulberry32(seed);
  return createGameWithRng(seed, rng);
}

export function createGameWithRng(seed: number, rng: Rng): GameState {
  const board = createBoard();
  const tray = refillTray(createEmptyTray(), rng, SHAPE_CATALOG, 0);
  return {
    board,
    tray,
    score: 0,
    multiplier: 1,
    stars: 0,
    highScore: 0,
    bestCombo: 0,
    lifetimeStars: 0,
    gameOver: isGameOver(board, tray),
    dynamiteCost: 15,
    lightningCost: 25,
    hasDynamite: false,
    hasLightning: false,
    rngSeed: seed,
  };
}

export function placeTrayPiece(state: GameState, slot: number, anchor: Point, rng: Rng): PlaceResult {
  if (state.gameOver) return { ok: false, reason: 'game_over' };
  const piece = state.tray[slot];
  if (!piece) return { ok: false, reason: 'invalid_slot' };

  const placed = applyPlacement(state.board, piece, anchor);
  if (!placed) return { ok: false, reason: 'invalid_placement' };

  const clear = applyClears(placed);
  const tray1 = state.tray.slice();
  tray1[slot] = null;
  let tray2 = tray1;
  let refilled = false;
  if (tray1.every((s) => s == null)) {
    tray2 = refillTray(tray1, rng, SHAPE_CATALOG, state.score + clear.linesCleared);
    refilled = true;
  }

  const stars = state.stars + clear.collectedStars;
  const bestCombo = Math.max(state.bestCombo, clear.linesCleared);
  // minimal scoring placeholder (ticket 04 expands)
  const gained = piece.cells.length + clear.linesCleared * 10 * Math.max(1, clear.linesCleared);
  const score = state.score + gained;
  const next: GameState = {
    ...state,
    board: clear.board,
    tray: tray2,
    score,
    stars,
    bestCombo,
    highScore: Math.max(state.highScore, score),
    lifetimeStars: state.lifetimeStars + clear.collectedStars,
    gameOver: isGameOver(clear.board, tray2),
  };
  return { ok: true, state: next, clear, refilled };
}
