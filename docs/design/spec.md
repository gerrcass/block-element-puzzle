# Spec: Element Blocks Clone

## Problem Statement
Players want a quick, satisfying, replayable block-puzzle game they can play in a browser: place elemental block shapes on a grid, clear lines, chase high scores, and recover from tight boards using earned power-ups. The repo currently has only scaffolding; we need a faithful, polished clone experience deployable to GitHub Pages.

## Solution
Build a static web game (Vite + TypeScript) with a deterministic `core/` rules engine and a canvas `ui/`. Implement 10×10 1010-style placement with 3 non-rotatable tray pieces, element-themed blocks (fire/water/earth/lightning/light), line clears/combos/scoring, star collection, Dynamite (3×3) and Lightning (clear-by-element) power-ups with escalating costs, responsive input (pointer + keyboard), persistence, tests, CI, and Pages deployment.

## User Stories
1. As a player, I want to see a 10×10 board and 3 available pieces, so that I can start planning placements immediately.
2. As a player, I want to drag a piece onto the board, so that I can place it intuitively.
3. As a player, I want invalid placements to be rejected with clear feedback, so that I understand the rules.
4. As a player, I want pieces to not rotate, so that placement is a spatial challenge like 1010/Element Blocks.
5. As a player, I want a completed row or column to clear, so that I free space and score points.
6. As a player, I want multiple lines cleared by one placement to score as a combo, so that skillful play is rewarded.
7. As a player, I want my score and multiplier/high-score feedback to update live, so that I can track performance.
8. As a player, I want new pieces dealt after I place all 3, so that the game continues smoothly.
9. As a player, I want blocks to show nature elements (fire/water/earth/lightning/light), so that the game feels thematic.
10. As a player, I want some piece blocks to carry stars, so that I can earn currency.
11. As a player, I want stars collected when their blocks are cleared in a line, so that I’m rewarded for planning.
12. As a player, I want to buy/hold Dynamite (3×3 clear) with stars, so that I can recover space.
13. As a player, I want to buy/hold Lightning (clear all of a chosen element) with stars, so that I can recover strategically.
14. As a player, I want power-up costs to escalate with use, so that power-ups remain meaningful choices.
15. As a player, I want to hold at most one of each power-up, so that inventory is simple and bounded.
16. As a player, I want the game to end when no tray piece fits anywhere, so that rounds have a clear outcome.
17. As a player, I want to see game over with my score and high score and restart, so that I can replay.
18. As a player, I want my high score/stats saved locally, so that progress persists across visits.
19. As a keyboard/touch user, I want non-drag placement and visible focus, so that the game is accessible.
20. As a user with motion sensitivity, I want reduced-motion behavior respected, so that animations don’t cause discomfort.
21. As a mobile/desktop user, I want the layout to adapt responsively, so that I can play on different screens.
22. As a developer, I want core rules unit-tested with deterministic RNG, so that regressions are caught.
23. As a maintainer, I want CI (typecheck/test/build) and GitHub Pages deployment, so that the game is reliably published.
24. As a visitor, I want a README with gameplay, controls, dev commands, screenshot, and Pages link, so that I understand the project.

## Implementation Decisions
- **Stack:** Vite + TypeScript, static output for GitHub Pages. Vitest for tests.
- **Architecture:** Pure `src/core/` (state, rules, RNG injection, actions/selectors) + `src/ui/` (canvas rendering, input, HUD). Config/constants isolated for tuning.
- **Board/Pieces:** 10×10 grid; curated 1010-style shape catalog; 3-piece tray; no rotation; fair-random weighted refill (soft anti-pathology), not solvability-guaranteed.
- **Elements:** 5 types (`fire, water, earth, lightning, light`) on blocks; visual + Lightning targeting; distributed for variety.
- **Clears:** Post-placement, clear all full rows/cols simultaneously; intersection blocks removed once. Combo = lines cleared.
- **Scoring:** Base placement points + line/combo points + multiplier meter (fills/decays, capped). Constants tunable/tested.
- **Stars:** Per-piece spawn chance; star on a block within piece; collected only when that block cleared.
- **Power-ups:** Dynamite base 15★, 3×3 centered clear; Lightning base 25★, clear all blocks of selected element. Each escalates +5★ per use in-run (capped). Max 1 each. Applied immediately; game-over rechecked.
- **Game over:** No valid placement for any current tray piece (checked after refill/board effects).
- **Input/A11y:** Pointer drag/drop; keyboard select/move/commit/cancel; power-up shortcuts; ARIA status/live region; visible focus; reduced-motion support.
- **Persistence:** localStorage for high score, best combo, lifetime stars, settings.
- **Art:** Original procedural/canvas element visuals (no copyrighted Famobi assets). Respectful attribution in README.
- **ADR:** 0001 deterministic core + canvas view.

## Testing Decisions
- **Good tests:** Test external behavior of pure core functions/state transitions; no implementation-detail coupling; deterministic via injected RNG.
- **Modules tested:** placement validity, line detection/clear/combos (incl. intersections), refill/game-over, scoring/multiplier, star spawn/collect, power-up effects/cost escalation/caps/inventory, serialization of persisted stats.
- **Prior art:** Standard Vitest unit pattern (repo will establish it). UI smoke/manual only if needed.

## Out of Scope
- Server/backend, accounts, leaderboards.
- Copying Famobi proprietary art/audio/binaries.
- Guaranteed-solvable generator.
- Sound effects/music (placeholder settings only).
- Undo/rewind, daily challenges, levels/campaign.

## Further Notes
- Use `GLOSSARY.md` and ADR 0001. Keep core framework-free. Deploy via GitHub Actions to Pages; include screenshot + Pages link in README.
- Workflow artifacts live under `docs/` and `.scratch/element-blocks/` as appropriate.
