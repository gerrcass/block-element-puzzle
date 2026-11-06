# ADR 0001: Deterministic core with canvas view

- Status: Accepted
- Date: 2026-11-06

## Context
We need a testable, maintainable Element Blocks clone deployable as a static site. Game rules (placement, clears, scoring, stars, power-ups) must be correct and easy to verify.

## Decision
Implement a pure TypeScript `core/` that owns state transitions and accepts an injected RNG/clock where needed. Implement `ui/` as a canvas renderer + input adapter over core state/actions. Tests target `core/`.

## Consequences
- **Positive:** High-confidence rules via unit tests; rendering changes don't risk logic regressions; deterministic tests.
- **Negative:** Slight upfront structure; canvas UI needs its own smoke/manual verification.
- **Alternatives considered:** DOM-only grid (harder animations/overdraw), full game framework (heavier than needed).
