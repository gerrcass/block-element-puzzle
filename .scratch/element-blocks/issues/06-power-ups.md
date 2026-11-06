# 06: Power-ups — Dynamite and Lightning with escalation

**What to build:** Purchasable/usable Dynamite (base 15★, 3×3 clear at chosen cell) and Lightning (base 25★, clear all blocks of a chosen element). Costs escalate +5★ per use per type in-run (capped), inventory max 1 each, effects apply immediately, and game-over is rechecked. UI supports buying, targeting, and applying.

**Blocked by:** 05.

**Status:** ready-for-agent

- [ ] Core power-up state: wallet spend, per-type escalating cost/cap, inventory (max 1 each).
- [ ] Dynamite clears 3×3 centered on target (occupied cells only).
- [ ] Lightning clears all blocks of selected element.
- [ ] Effects apply immediately; post-effect clear/game-over rules handled correctly.
- [ ] UI to buy, hold, activate, and target power-ups; clear feedback/affordance.
- [ ] Unit tests cover costs/escalation/caps, effects, inventory, and edge cases.
