import { BOARD_SIZE } from '../core/constants';

export function mountApp(root: HTMLDivElement | null): void {
  if (!root) return;
  root.innerHTML = `
    <main class="shell">
      <h1>Element Blocks</h1>
      <p class="sub">Scaffold ready — ${BOARD_SIZE}×${BOARD_SIZE} board placeholder</p>
      <canvas id="game" width="500" height="500" aria-label="Element Blocks board placeholder"></canvas>
    </main>
  `;
  const canvas = root.querySelector<HTMLCanvasElement>('#game');
  if (canvas) drawPlaceholder(canvas);
}

function drawPlaceholder(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = canvas.width;
  const cell = size / BOARD_SIZE;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#162033';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(159,176,204,0.25)';
  for (let i = 0; i <= BOARD_SIZE; i++) {
    const p = i * cell;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke();
  }
}
