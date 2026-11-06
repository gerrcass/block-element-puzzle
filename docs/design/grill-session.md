# Grill Session — Element Blocks Clone (grill-with-docs)

Date: 2026-11-06  
Mode: Grill-with-docs. Per user request, I proceeded without waiting for decisions and chose recommended answers throughout. This document records the resolved design tree.

## Objective (challenging)
Ship a **production-quality, test-driven, accessible, deployable web clone** of Famobi's *Element Blocks*: faithful 10×10/3-piece/no-rotation core, element-themed visuals, stars + two power-ups (Dynamite/Lightning) with escalating costs, deterministic game core with tests, responsive canvas UI, persistence, CI, and GitHub Pages deployment.

## Design Tree & Resolved Frontier

### Round 1 — Product/stack foundations
**Q1 — Platform & stack?** (static GH Pages deploy required; needs drag/drop, animation, tests)
- Options: (A) Plain HTML/CSS/JS, (B) Vite + TypeScript + Canvas with deterministic core module, (C) React/Phaser.
- ➡️ **B (chosen).** Vite+TS gives fast builds, tests (Vitest), and clean separation: pure game logic (no DOM) + canvas renderer/input layer. No heavy framework needed.

**Q2 — Grid and placement rules?**
- ➡️ **10×10 board, 3 tray pieces, no rotation, drag-and-drop + click/tap-to-select-place fallback for accessibility.** Matches 1010/Element Blocks behavior; fallback aids keyboard/touch edge cases.

**Q3 — Visual fidelity target?**
- ➡️ **Faithful-but-original art direction**: nature/element palette and iconography (fire/water/earth/lightning/light) rendered procedurally in canvas/SVG assets we create (no copyrighted Famobi art/audio ripped). Clear, polished “clone in spirit”.

**Q4 — License/source posture?**
- ➡️ **Original implementation, MIT license for our code, asset attribution noted in README.** No proprietary assets.

### Round 2 — Core mechanics (depends on Q1–Q2)
**Q5 — Piece generation?** (affects fairness/difficulty)
- Options: (A) uniform random, (B) weighted bag avoiding repeats, (C) solvability-guaranteed generator.
- ➡️ **B with gentle constraints (chosen).** Weighted random from a curated 1010-style shape set, avoid giving 3 large pieces in pathological streaks when board is crowded (soft heuristic), but **do not guarantee solvability** (keeps tension; full guarantee is complex and changes feel). Documented as “fair-random”.

**Q6 — Line clear timing and combos?**
- ➡️ **After placement resolves, clear all completed rows/columns simultaneously (a block in an intersection clears once).** Combo = number of lines cleared by that placement; awards bonus. Standard 1010 feel.

**Q7 — Scoring & multiplier?**
- ➡️ **Points per block placed (small) + points per line cleared × combo factor; a visible multiplier meter fills on clears/placements and boosts subsequent clears, decaying gently on low-action turns (capped).** Tuned constants in config; tested.

**Q8 — Star spawning & collection?**
- ➡️ **Each newly generated tray piece has an independent chance to carry 1 star on one of its blocks (tunable, ~12–18% per piece). Star collected only when that starred block is removed in a line clear.** Stars persist as wallet currency.

### Round 3 — Power-ups & game over (depends on Q2,Q8)
**Q9 — Power-up rules (precise)?**
- ➡️ **Dynamite:** base cost 15★, clears 3×3 centered on chosen cell (only occupied cells affected). **Lightning:** base cost 25★, player picks an element present/any element; clears all blocks of that element. **Escalation:** cost increases by 5★ per use of that power-up type during the run (tracked separately), capped at a sane max. **Inventory:** max 1 of each held; can buy when affordable and slot empty. **Usable anytime** (not consuming a tray turn except the effect happens immediately).

**Q10 — Elements: cosmetic or mechanical?**
- ➡️ **Both, lightly.** Every block has an element (5 types) used for rendering and required for Lightning targeting. Placement/line-clear rules ignore element except visuals. Tray generation distributes elements for variety.

**Q11 — Game-over condition?**
- ➡️ **Game over when none of the 3 current tray pieces can be placed anywhere on the board.** Checked after refill and after any board-changing effect (clear/power-up). Show score, high score, restart.

### Round 4 — UX, quality, delivery (depends on Q1)
**Q12 — Input & accessibility?**
- ➡️ **Pointer drag/drop primary; keyboard mode:** focus tray piece, move ghost on grid with arrows, Enter to place, Esc cancel, shortcuts for power-ups. Visible focus/ghost. ARIA labels for status/score; respects reduced-motion.

**Q13 — Persistence & meta?**
- ➡️ **localStorage:** high score, best combo, total stars earned (lifetime), settings (sound placeholder off by default/no audio assets required), reduced-motion flag. No backend.

**Q14 — Testing strategy?**
- ➡️ **Vitest unit tests for pure core (placement validity, line clear/combos, scoring, star economy, power-up effects/cost escalation, game-over).** Deterministic RNG injection for tests. Light smoke test for app boot if cheap; core correctness prioritized.

**Q15 — Repo/CI/deploy?**
- ➡️ **GitHub repo (origin already set), branch/PR workflow, GitHub Actions: install, typecheck, test, build; deploy to GitHub Pages (Actions).** README updated with gameplay, dev commands, screenshot, and Pages link.

## ADRs (offered, minimal)
- **ADR 0001 — Deterministic core, canvas view:** Keep rules/scoring in pure TS modules with injected RNG; render via canvas. *Hard to reverse in feel, surprising without context, real trade-off (simplicity vs DOM).* Accepted.

## Resolved Seams (for spec)
Single primary seam: `core/` (pure game state transitions) ↔ `ui/` (canvas renderer + input). Tests target `core/` exclusively for rules; UI is thin.
