import { BOARD_SIZE } from './constants';
import type { Board, ClearResult } from './types';

export function applyClears(board: Board): ClearResult {
  const clearedRows: number[] = [];
  const clearedCols: number[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row = board[r];
    if (row && row.every((c) => c != null)) clearedRows.push(r);
  }
  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (board[r]?.[c] == null) { full = false; break; }
    }
    if (full) clearedCols.push(c);
  }

  const toClear = new Set<string>();
  for (const r of clearedRows) for (let c = 0; c < BOARD_SIZE; c++) toClear.add(`${r},${c}`);
  for (const c of clearedCols) for (let r = 0; r < BOARD_SIZE; r++) toClear.add(`${r},${c}`);

  let collectedStars = 0;
  const next: Board = board.map((row, r) =>
    row.map((cell, c) => {
      if (toClear.has(`${r},${c}`)) {
        if (cell?.star) collectedStars += 1;
        return null;
      }
      return cell;
    }),
  );

  return {
    board: next,
    clearedRows,
    clearedCols,
    linesCleared: clearedRows.length + clearedCols.length,
    cellsCleared: toClear.size,
    collectedStars,
  };
}
