import { BOARD_SIZE, ELEMENTS } from '../core/constants';
import type { Element } from '../core/constants';
import { buyDynamite, buyLightning, useDynamite, useLightning } from '../core/powerups';
import { canPlace, createGame, mulberry32, placeTrayPiece } from '../core';
import type { GameState } from '../core/types';
import { drawBoard, drawPiece, elementColor } from './render';

const STORE_KEY = 'element-blocks-v1';
type Persist = { highScore: number; bestCombo: number; lifetimeStars: number };

function loadPersist(): Persist {
  try { return { highScore: 0, bestCombo: 0, lifetimeStars: 0, ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') }; } catch { return { highScore: 0, bestCombo: 0, lifetimeStars: 0 }; }
}
function savePersist(s: GameState) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ highScore: s.highScore, bestCombo: s.bestCombo, lifetimeStars: s.lifetimeStars })); } catch {}
}

export function mountApp(root: HTMLDivElement | null): void {
  if (!root) return;
  let persist = loadPersist();
  let rng = mulberry32(Date.now() >>> 0);
  let state: GameState = { ...createGame(Date.now() >>> 0), ...persist };
  let selectedSlot: number | null = null;
  let ghost: { slot: number; row: number; col: number } | null = null;
  let drag: { slot: number; pointerId: number } | null = null;
  let armed: { type: 'dynamite' } | { type: 'lightning'; element?: Element } | null = null;
  let statusMsg = 'Drag a piece onto the board, or select one and use arrow keys + Enter.';
  let statusKind: '' | 'good' | 'bad' = '';

  root.innerHTML = `
    <div class="app">
      <div class="top"><h1>Element Blocks</h1><div class="hud" id="hud"></div></div>
      <div class="main">
        <section class="card board-wrap">
          <canvas id="board" width="560" height="560" tabindex="0" aria-label="Game board, 10 by 10 grid"></canvas>
          <div class="overlay" id="over" hidden><div class="box"><h2 id="overTitle">Game Over</h2><p id="overText"></p><button id="restart">Play again</button></div></div>
          <div class="tray" id="tray"></div>
          <div class="controls" id="powers"></div>
          <p class="status" id="status" aria-live="polite"></p>
        </section>
        <aside class="card help">
          <strong>How to play</strong>
          <ul>
            <li>Place 3 shapes on the 10×10 board. Shapes do not rotate.</li>
            <li>Fill a full row or column to clear it. Combos score more.</li>
            <li>Stars on blocks are collected when cleared; spend them on power-ups.</li>
            <li><strong>Dynamite</strong> clears a 3×3 area. <strong>Lightning</strong> clears all blocks of one element.</li>
            <li>Keyboard: 1-3 select, arrows move, Enter place, Esc cancel, D/L power-ups, R restart.</li>
          </ul>
        </aside>
      </div>
      <div class="sr-only" id="live" aria-live="polite"></div>
    </div>`;

  const boardCanvas = root.querySelector<HTMLCanvasElement>('#board')!;
  const boardCtx = boardCanvas.getContext('2d')!;
  const hud = root.querySelector<HTMLDivElement>('#hud')!;
  const trayEl = root.querySelector<HTMLDivElement>('#tray')!;
  const powersEl = root.querySelector<HTMLDivElement>('#powers')!;
  const statusEl = root.querySelector<HTMLParagraphElement>('#status')!;
  const over = root.querySelector<HTMLDivElement>('#over')!;
  const overText = root.querySelector<HTMLParagraphElement>('#overText')!;

  function setStatus(msg: string, kind: '' | 'good' | 'bad' = '') { statusMsg = msg; statusKind = kind; render(); }
  function persistAnd(fn: (s: GameState) => GameState | null) {
    const n = fn(state);
    if (!n) return false;
    state = n; savePersist(state); render(); return true;
  }

  function restart() {
    persist = loadPersist();
    rng = mulberry32(Date.now() >>> 0);
    state = { ...createGame(Date.now() >>> 0), ...persist };
    selectedSlot = null; ghost = null; drag = null; armed = null;
    setStatus('New game. Good luck!');
  }

  function ghostPiece() {
    if (!ghost) return null;
    const piece = state.tray[ghost.slot];
    if (!piece) return null;
    return { piece, row: ghost.row, col: ghost.col, valid: canPlace(state.board, piece, { row: ghost.row, col: ghost.col }) };
  }

  function placeAt(slot: number, row: number, col: number) {
    const res = placeTrayPiece(state, slot, { row, col }, rng);
    if (!res.ok) { setStatus(res.reason === 'invalid_placement' ? 'That piece does not fit there.' : 'Cannot place piece.', 'bad'); return; }
    state = res.state; savePersist(state);
    selectedSlot = null; ghost = null; armed = null;
    if (res.clear.linesCleared > 0) setStatus(`Cleared ${res.clear.linesCleared} line${res.clear.linesCleared > 1 ? 's' : ''}!${res.clear.collectedStars ? ` +${res.clear.collectedStars}★` : ''}`, 'good');
    else setStatus(res.clear.collectedStars ? `Collected ${res.clear.collectedStars}★` : 'Placed.');
    render();
  }

  function boardPos(clientX: number, clientY: number) {
    const rect = boardCanvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (boardCanvas.width / rect.width);
    const y = (clientY - rect.top) * (boardCanvas.height / rect.height);
    const cell = boardCanvas.width / BOARD_SIZE;
    return { col: Math.floor(x / cell), row: Math.floor(y / cell) };
  }

  function render() {
    state.highScore = Math.max(state.highScore, persist.highScore);
    state.bestCombo = Math.max(state.bestCombo, persist.bestCombo);
    state.lifetimeStars = Math.max(state.lifetimeStars, persist.lifetimeStars);
    drawBoard(boardCtx, state.board, ghostPiece());
    hud.innerHTML = [
      `<span class="pill">Score <strong>${state.score}</strong></span>`,
      `<span class="pill">High <strong>${state.highScore}</strong></span>`,
      `<span class="pill">Stars <strong>${state.stars}</strong></span>`,
      `<span class="pill">Best combo <strong>${state.bestCombo}</strong></span>`,
    ].join('');
    // tray
    trayEl.innerHTML = '';
    state.tray.forEach((piece, i) => {
      const c = document.createElement('canvas');
      c.width = 160; c.height = 120;
      c.tabIndex = piece ? 0 : -1;
      c.setAttribute('role', 'button');
      c.setAttribute('aria-label', piece ? `Tray piece ${i + 1}, ${piece.shapeId}, element ${piece.element}${piece.starIndex != null ? ', has star' : ''}` : `Tray slot ${i + 1} empty`);
      c.className = [selectedSlot === i ? 'selected' : '', !piece ? 'used' : ''].join(' ').trim();
      drawPiece(c.getContext('2d')!, piece, selectedSlot === i);
      c.addEventListener('pointerdown', (e) => {
        if (!piece || state.gameOver) return;
        selectedSlot = i; drag = { slot: i, pointerId: e.pointerId }; c.setPointerCapture(e.pointerId);
        ghost = { slot: i, row: 0, col: 0 }; render();
      });
      c.addEventListener('click', () => { if (piece && !state.gameOver) { selectedSlot = i; ghost = { slot: i, row: 4, col: 4 }; setStatus(`Selected piece ${i + 1}. Move with arrows, Enter to place.`); } });
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } });
      trayEl.appendChild(c);
    });
    // powers
    powersEl.innerHTML = '';
    const dBtn = document.createElement('button');
    dBtn.textContent = `Dynamite ${state.hasDynamite ? '(ready)' : `★${state.dynamiteCost}`}`;
    dBtn.disabled = state.gameOver || (!state.hasDynamite && state.stars < state.dynamiteCost);
    dBtn.onclick = () => {
      if (state.hasDynamite) { armed = { type: 'dynamite' }; setStatus('Dynamite armed: click a board cell to clear 3×3.'); }
      else if (persistAnd(buyDynamite)) setStatus('Bought Dynamite. Click it again to arm.', 'good');
    };
    const lBtn = document.createElement('button');
    lBtn.textContent = `Lightning ${state.hasLightning ? '(ready)' : `★${state.lightningCost}`}`;
    lBtn.disabled = state.gameOver || (!state.hasLightning && state.stars < state.lightningCost);
    lBtn.onclick = () => {
      if (state.hasLightning) {
        armed = { type: 'lightning' };
        setStatus('Choose element: ' + ELEMENTS.map((e) => e).join(', '));
        renderLightningPicker();
      } else if (persistAnd(buyLightning)) setStatus('Bought Lightning. Click it again to choose an element.', 'good');
    };
    const rBtn = document.createElement('button'); rBtn.textContent = 'Restart'; rBtn.onclick = restart;
    powersEl.append(dBtn, lBtn, rBtn);
    statusEl.textContent = statusMsg; statusEl.className = `status ${statusKind}`.trim();
    over.hidden = !state.gameOver;
    if (state.gameOver) overText.textContent = `Score ${state.score} · High score ${state.highScore}. No moves left.`;
  }

  function renderLightningPicker() {
    Array.from(powersEl.querySelectorAll('[data-el]')).forEach((n) => n.remove());
    if (armed?.type !== 'lightning') return;
    ELEMENTS.forEach((el) => {
      const b = document.createElement('button');
      b.dataset.el = el; b.textContent = el;
      b.style.borderColor = elementColor(el)!.fill;
      b.onclick = () => { if (persistAnd((s) => useLightning(s, el))) { armed = null; setStatus(`Lightning cleared ${el} blocks.`, 'good'); } };
      powersEl.appendChild(b);
    });
  }

  boardCanvas.addEventListener('pointermove', (e) => {
    if (drag && drag.pointerId === e.pointerId) {
      const p = boardPos(e.clientX, e.clientY); ghost = { slot: drag.slot, row: p.row, col: p.col }; render();
    }
  });
  boardCanvas.addEventListener('pointerup', (e) => {
    if (drag && drag.pointerId === e.pointerId) {
      const p = boardPos(e.clientX, e.clientY);
      placeAt(drag.slot, p.row, p.col);
      drag = null;
    }
  });
  boardCanvas.addEventListener('click', (e) => {
    const p = boardPos(e.clientX, e.clientY);
    if (armed?.type === 'dynamite') {
      if (persistAnd((s) => useDynamite(s, p.row, p.col))) { armed = null; setStatus('Dynamite used!', 'good'); }
      return;
    }
    if (selectedSlot != null && !drag) placeAt(selectedSlot, p.row, p.col);
  });
  boardCanvas.addEventListener('keydown', (e) => {
    if (state.gameOver && e.key.toLowerCase() === 'r') { restart(); return; }
    if (armed?.type === 'lightning' && e.key === 'Escape') { armed = null; setStatus('Cancelled.'); return; }
    if (selectedSlot == null && ['1','2','3'].includes(e.key)) { const i = Number(e.key)-1; if (state.tray[i]) { selectedSlot=i; ghost={slot:i,row:4,col:4}; render(); } }
    if (selectedSlot == null) return;
    if (!ghost) ghost = { slot: selectedSlot, row: 4, col: 4 };
    if (e.key === 'ArrowUp') { ghost.row--; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { ghost.row++; e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { ghost.col--; e.preventDefault(); }
    else if (e.key === 'ArrowRight') { ghost.col++; e.preventDefault(); }
    else if (e.key === 'Enter') { placeAt(ghost.slot, ghost.row, ghost.col); e.preventDefault(); return; }
    else if (e.key === 'Escape') { selectedSlot=null; ghost=null; armed=null; setStatus('Cancelled.'); return; }
    else if (e.key.toLowerCase() === 'd') { (powersEl.querySelector('button') as HTMLButtonElement)?.click(); }
    else if (e.key.toLowerCase() === 'l') { (powersEl.querySelectorAll('button')[1] as HTMLButtonElement)?.click(); }
    else if (e.key.toLowerCase() === 'r') { restart(); return; }
    else return;
    ghost.row = Math.max(-5, Math.min(9, ghost.row));
    ghost.col = Math.max(-5, Math.min(9, ghost.col));
    render();
  });

  root.querySelector<HTMLButtonElement>('#restart')!.onclick = restart;
  render();
}
