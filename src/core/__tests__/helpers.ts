import type { Board, Cell, Piece } from '../types';

export function boardFromStrings(rows: string[]): Board {
  return rows.map((row) =>
    Array.from(row).map((ch): Cell => (ch === '.' ? null : { element: 'fire' })),
  );
}

export function emptyBoardStrings() {
  return Array.from({ length: 10 }, () => '.'.repeat(10));
}

export function countOccupied(board: Board): number {
  let n = 0;
  for (const row of board) for (const cell of row) if (cell) n++;
  return n;
}

export function makeDotPiece(id = 'dot'): Piece {
  return { id, shapeId: 'dot', cells: [{ row: 0, col: 0 }], element: 'fire', starIndex: null };
}
