# 02: Core rules — board, pieces, placement, clears, refill, game over

**What to build:** Deterministic pure-TS core that models a 10×10 board, a curated non-rotatable shape catalog, a 3-piece tray, valid placement, line clears (rows+cols, intersection once), refill after all placed, and game-over detection when no tray piece fits. RNG is injectable.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] 10×10 board state and occupancy checks.
- [ ] Shape catalog (1010-style set) with elements assignable; 3-piece tray.
- [ ] Placement validation and application; no rotation.
- [ ] Post-placement clear of all full rows/columns simultaneously; combo count (lines cleared).
- [ ] Refill tray after 3 placed using fair-random weighted selection (injectable RNG).
- [ ] Game-over detection when no current piece has any valid placement.
- [ ] Unit tests cover validity, clears/combos (incl. intersection), refill determinism, game over.
