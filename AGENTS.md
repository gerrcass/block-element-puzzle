# Agent guide — Element Blocks clone

## Pointers (read before acting)
- Spec: `docs/design/spec.md` (source issue: #1). Grill decisions: `docs/design/grill-session.md`.
- Domain terms: `GLOSSARY.md`. ADRs: `docs/adr/`.
- Tickets (local): `.scratch/element-blocks/issues/01-*.md`–`08-*.md` (dependency order). Tracker: issues #2–#9.

## Working rules
- Keep game rules in pure `src/core/` (inject RNG/time for tests). `src/ui/` renders/interacts only.
- Test core behavior with Vitest; deterministic tests.
- No copyrighted Famobi assets. Static deploy target: GitHub Pages.
- When creating PRs: use `/pr` skill guidance, attach evidence (`gh`), follow repo workflow. Run code review before merging.
