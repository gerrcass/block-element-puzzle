import { describe, expect, it } from 'vitest';
import { createBoard } from '../board';
import { createGameWithRng } from '../game';
import { buyDynamite, useDynamite, useLightning } from '../powerups';
import { mulberry32 } from '../rng';

describe('powerups', () => {
  it('buys with escalation and inventory limits', () => {
    let s = createGameWithRng(1, mulberry32(1));
    s = { ...s, stars: 100 };
    const b1 = buyDynamite(s)!;
    expect(b1.hasDynamite).toBe(true);
    expect(b1.stars).toBe(85);
    expect(b1.dynamiteCost).toBe(20);
    expect(buyDynamite(b1)).toBeNull(); // already held
  });

  it('dynamite clears 3x3 and rechecks game over', () => {
    let s = createGameWithRng(1, mulberry32(1));
    const b = createBoard();
    b[5]![5] = { element: 'fire' };
    s = { ...s, board: b, hasDynamite: true };
    const n = useDynamite(s, 5, 5)!;
    expect(n.board[5]![5]).toBeNull();
    expect(n.hasDynamite).toBe(false);
  });

  it('lightning clears selected element', () => {
    let s = createGameWithRng(1, mulberry32(1));
    const b = createBoard();
    b[0]![0] = { element: 'fire' };
    b[0]![1] = { element: 'water' };
    s = { ...s, board: b, hasLightning: true };
    const n = useLightning(s, 'fire')!;
    expect(n.board[0]![0]).toBeNull();
    expect(n.board[0]![1]?.element).toBe('water');
  });
});
