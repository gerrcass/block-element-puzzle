import { BOARD_SIZE } from '../core/constants';
import type { Element } from '../core/constants';
import type { Board, Piece } from '../core/types';

const ELEMENT_COLORS: Record<Element, { fill: string; stroke: string; glow: string }> = {
  fire: { fill: '#ff6b3d', stroke: '#ffd166', glow: 'rgba(255,107,61,.35)' },
  water: { fill: '#38bdf8', stroke: '#bae6fd', glow: 'rgba(56,189,248,.3)' },
  earth: { fill: '#65a30d', stroke: '#d9f99d', glow: 'rgba(101,163,13,.3)' },
  lightning: { fill: '#a78bfa', stroke: '#ede9fe', glow: 'rgba(167,139,250,.35)' },
  light: { fill: '#facc15', stroke: '#fef9c3', glow: 'rgba(250,204,21,.3)' },
};

export function elementColor(el: Element) {
  return ELEMENT_COLORS[el]!;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, el: Element, opts?: { ghost?: boolean; invalid?: boolean; star?: boolean }) {
  const c = ELEMENT_COLORS[el]!;
  const pad = Math.max(1, s * 0.08);
  const bx = x + pad, by = y + pad, bw = s - pad * 2, bh = s - pad * 2;
  ctx.save();
  ctx.globalAlpha = opts?.ghost ? (opts.invalid ? 0.35 : 0.55) : 1;
  const g = ctx.createLinearGradient(bx, by, bx, by + bh);
  g.addColorStop(0, opts?.invalid ? '#ff7b7b' : c.stroke);
  g.addColorStop(1, opts?.invalid ? '#b91c1c' : c.fill);
  ctx.fillStyle = g;
  roundRect(ctx, bx, by, bw, bh, Math.max(2, s * 0.18));
  ctx.fill();
  ctx.strokeStyle = opts?.invalid ? '#fecaca' : 'rgba(255,255,255,.22)';
  ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.stroke();
  if (opts?.star) {
    ctx.fillStyle = '#fff7cc';
    ctx.font = `${Math.max(8, s * 0.38)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', x + s / 2, y + s / 2 + 1);
  }
  ctx.restore();
}

export function drawBoard(
  ctx: CanvasRenderingContext2D,
  board: Board,
  ghost?: { piece: Piece; row: number; col: number; valid: boolean } | null,
) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const cell = w / BOARD_SIZE;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0c1628';
  ctx.fillRect(0, 0, w, h);
  // grid
  ctx.strokeStyle = 'rgba(159,176,204,0.14)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= BOARD_SIZE; i++) {
    const p = i * cell;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(w, p); ctx.stroke();
  }
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const b = board[r]?.[c];
      if (b) drawBlock(ctx, c * cell, r * cell, cell, b.element, { star: b.star });
    }
  }
  if (ghost) {
    for (let i = 0; i < ghost.piece.cells.length; i++) {
      const d = ghost.piece.cells[i]!;
      const r = ghost.row + d.row, c = ghost.col + d.col;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        drawBlock(ctx, c * cell, r * cell, cell, ghost.piece.element, { ghost: true, invalid: !ghost.valid, star: ghost.piece.starIndex === i });
      }
    }
  }
}

export function drawPiece(ctx: CanvasRenderingContext2D, piece: Piece | null, selected = false) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  if (!piece) return;
  const maxR = Math.max(...piece.cells.map((p) => p.row)) + 1;
  const maxC = Math.max(...piece.cells.map((p) => p.col)) + 1;
  const cell = Math.min(w / 5, h / 5, 34);
  const ox = (w - maxC * cell) / 2;
  const oy = (h - maxR * cell) / 2;
  if (selected) {
    ctx.strokeStyle = 'rgba(124,247,197,.35)';
    ctx.lineWidth = 2;
    roundRect(ctx, 4, 4, w - 8, h - 8, 10);
    ctx.stroke();
  }
  for (let i = 0; i < piece.cells.length; i++) {
    const d = piece.cells[i]!;
    drawBlock(ctx, ox + d.col * cell, oy + d.row * cell, cell, piece.element, { star: piece.starIndex === i });
  }
}
