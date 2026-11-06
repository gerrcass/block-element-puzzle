# 05: Element variety and star economy (spawn + collect)

**What to build:** Blocks carry one of 5 elements (fire/water/earth/lightning/light) with clear visual distinction and varied distribution. Tray pieces sometimes include a starred block; stars are collected into the player wallet only when that block is removed in a line clear, and displayed in the HUD.

**Blocked by:** 04.

**Status:** ready-for-agent

- [ ] 5 elements assigned/rendered consistently; tray generation distributes elements.
- [ ] Star spawn chance on generated piece blocks (tunable, injectable RNG); star marker visible.
- [ ] Star collected only when starred block participates in a line clear; wallet updates.
- [ ] HUD shows star count; core tests cover spawn determinism and collection rules.
