import type { Point, ShapeDef } from './types';

function n(cells: Point[]): Point[] {
  const minR = Math.min(...cells.map((p) => p.row));
  const minC = Math.min(...cells.map((p) => p.col));
  return cells.map((p) => ({ row: p.row - minR, col: p.col - minC }));
}

const def = (id: string, cells: Point[], weight: number): ShapeDef => ({ id, cells: n(cells), weight });

export const SHAPE_CATALOG: readonly ShapeDef[] = [
  def('dot', [{ row: 0, col: 0 }], 12),
  def('dom-h', [{ row: 0, col: 0 }, { row: 0, col: 1 }], 10),
  def('dom-v', [{ row: 0, col: 0 }, { row: 1, col: 0 }], 10),
  def('tri-h', [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }], 9),
  def('tri-v', [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }], 9),
  def('corner', [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }], 8),
  def('corner-r', [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }], 8),
  def('corner-t', [{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }], 8),
  def('corner-l', [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }], 8),
  def('sq2', [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }], 8),
  def('tet-h', [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }], 6),
  def('tet-v', [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }], 6),
  def('L4', [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }], 6),
  def('J4', [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 2, col: 0 }], 6),
  def('T4', [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }], 6),
  def('S4', [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }], 5),
  def('Z4', [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }, { row: 1, col: 2 }], 5),
  def('pent-h', [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], 3),
  def('pent-v', [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }, { row: 4, col: 0 }], 3),
  def('sq3', [
    { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
    { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 },
    { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
  ], 2),
  def('bigL', [
    { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
  ], 3),
];
