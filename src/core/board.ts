import { BOARD_SIZE } from './constants';
import type { Board, Cell, Piece, Point } from './types';

export function createBoard(size = BOARD_SIZE): Board {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null as Cell));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice());
}

export function inBounds(row: number, col: number, size = BOARD_SIZE): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

export function canPlace(board: Board, piece: Pick<Piece, 'cells'>, anchor: Point): boolean {
  for (const d of piece.cells) {
    const r = anchor.row + d.row;
    const c = anchor.col + d.col;
    if (!inBounds(r, c) || board[r]?.[c] != null) return false;
  }
  return true;
}

export function applyPlacement(
  board: Board,
  piece: Piece,
  anchor: Point,
): Board | null {
  if (!canPlace(board, piece, anchor)) return null;
  const next = cloneBoard(board);
  for (let i = 0; i < piece.cells.length; i++) {
    const d = piece.cells[i]!;
    const r = anchor.row + d.row;
    const c = anchor.col + d.col;
    const row = next[r];
    if (!row) return null;
    row[c] = { element: piece.element, star: piece.starIndex === i };
  }
  return next;
}

export function hasValidPlacement(board: Board, piece: Pick<Piece, 'cells'>): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canPlace(board, piece, { row: r, col: c })) return true;
    }
  }
  return false;
}
