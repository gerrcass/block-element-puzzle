import { ELEMENTS, TRAY_SIZE } from './constants';
import { hasValidPlacement } from './board';
import { pickWeightedIndex, randomInt } from './rng';
import type { Rng } from './rng';
import { SHAPE_CATALOG } from './shapes';
import type { Board, Piece, ShapeDef, Tray } from './types';

export function createEmptyTray(): Tray {
  return Array.from({ length: TRAY_SIZE }, () => null);
}

export function makePiece(def: ShapeDef, rng: Rng, seq: number): Piece {
  const element = ELEMENTS[randomInt(rng, ELEMENTS.length)]!;
  // ~15% chance to carry a star on a random block
  const hasStar = rng.next() < 0.15 && def.cells.length > 0;
  const starIndex = hasStar ? randomInt(rng, def.cells.length) : null;
  return { id: `${def.id}-${seq}`, shapeId: def.id, cells: def.cells, element, starIndex };
}

export function refillTray(current: Tray, rng: Rng, catalog: readonly ShapeDef[] = SHAPE_CATALOG, seqBase = 0): Tray {
  if (!current.every((s) => s == null)) return current.slice();
  const weights = catalog.map((s) => s.weight);
  return Array.from({ length: TRAY_SIZE }, (_, i) => {
    const def = catalog[pickWeightedIndex(weights, rng)]!;
    return makePiece(def, rng, seqBase + i);
  });
}

export function isGameOver(board: Board, tray: Tray): boolean {
  const pieces = tray.filter((p): p is Piece => p != null);
  if (pieces.length === 0) return false;
  return !pieces.some((p) => hasValidPlacement(board, p));
}
