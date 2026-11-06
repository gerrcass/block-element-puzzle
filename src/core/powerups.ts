import { BOARD_SIZE } from './constants';
import { applyClears } from './clears';
import { isGameOver } from './tray';
import type { Element } from './constants';
import type { Board, GameState } from './types';

export const DYNAMITE_BASE = 15;
export const LIGHTNING_BASE = 25;
export const POWERUP_STEP = 5;
export const POWERUP_CAP = 60;

function escalate(cost: number): number {
  return Math.min(POWERUP_CAP, cost + POWERUP_STEP);
}

export function buyDynamite(state: GameState): GameState | null {
  if (state.gameOver || state.hasDynamite || state.stars < state.dynamiteCost) return null;
  return { ...state, stars: state.stars - state.dynamiteCost, hasDynamite: true, dynamiteCost: escalate(state.dynamiteCost) };
}

export function buyLightning(state: GameState): GameState | null {
  if (state.gameOver || state.hasLightning || state.stars < state.lightningCost) return null;
  return { ...state, stars: state.stars - state.lightningCost, hasLightning: true, lightningCost: escalate(state.lightningCost) };
}

function afterBoardEffect(state: GameState, board: Board): GameState {
  const clear = applyClears(board); // board may already have holes; clears only remove full lines (none expected) but safe
  // Dynamite/Lightning remove arbitrary cells, not line clears by rule, but stars on removed cells? Spec doesn't state; keep simple: no star collect, no score, just board change.
  void clear;
  return { ...state, board, gameOver: isGameOver(board, state.tray) };
}

export function useDynamite(state: GameState, row: number, col: number): GameState | null {
  if (state.gameOver || !state.hasDynamite) return null;
  const next = state.board.map((r) => r.slice());
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const rr = row + dr, cc = col + dc;
      if (rr >= 0 && rr < BOARD_SIZE && cc >= 0 && cc < BOARD_SIZE && next[rr]) next[rr]![cc] = null;
    }
  }
  return afterBoardEffect({ ...state, hasDynamite: false }, next);
}

export function useLightning(state: GameState, element: Element): GameState | null {
  if (state.gameOver || !state.hasLightning) return null;
  const next = state.board.map((r) => r.map((cell) => (cell?.element === element ? null : cell)));
  return afterBoardEffect({ ...state, hasLightning: false }, next);
}
