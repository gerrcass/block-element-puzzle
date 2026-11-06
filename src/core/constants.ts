export const BOARD_SIZE = 10;
export const TRAY_SIZE = 3;

export const ELEMENTS = ['fire', 'water', 'earth', 'lightning', 'light'] as const;
export type Element = (typeof ELEMENTS)[number];
