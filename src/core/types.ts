import type { Element } from './constants';

export interface Block {
  element: Element;
  star?: boolean;
}

export type Cell = Block | null;
export type Board = Cell[][]; // [row][col], 10x10

export interface Point {
  row: number;
  col: number;
}

export interface ShapeDef {
  id: string;
  cells: readonly Point[]; // normalized local coords, min at 0
  weight: number;
}

export interface Piece {
  id: string;
  shapeId: string;
  cells: readonly Point[];
  element: Element;
  starIndex: number | null; // index into cells
}

export type Tray = (Piece | null)[];

export interface ClearResult {
  board: Board;
  clearedRows: number[];
  clearedCols: number[];
  linesCleared: number;
  cellsCleared: number;
  collectedStars: number;
}

export interface GameState {
  board: Board;
  tray: Tray;
  score: number;
  multiplier: number; // display/effect multiplier (ticket 04+), kept simple now
  stars: number;
  highScore: number;
  bestCombo: number;
  lifetimeStars: number;
  gameOver: boolean;
  dynamiteCost: number;
  lightningCost: number;
  hasDynamite: boolean;
  hasLightning: boolean;
  rngSeed: number;
}

export interface PlaceOk {
  ok: true;
  state: GameState;
  clear: ClearResult;
  refilled: boolean;
}

export interface PlaceErr {
  ok: false;
  reason: 'game_over' | 'invalid_slot' | 'invalid_placement';
}

export type PlaceResult = PlaceOk | PlaceErr;
