import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, ELEMENTS, TRAY_SIZE } from '../constants';

describe('scaffold', () => {
  it('exposes core constants', () => {
    expect(BOARD_SIZE).toBe(10);
    expect(TRAY_SIZE).toBe(3);
    expect(ELEMENTS).toHaveLength(5);
  });
});
