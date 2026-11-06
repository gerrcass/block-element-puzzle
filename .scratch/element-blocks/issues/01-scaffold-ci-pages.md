# 01: Scaffold Vite+TS app, CI, and GitHub Pages deploy

**What to build:** A working Vite + TypeScript project in the repo that builds a static site, runs tests with Vitest, typechecks, and deploys to GitHub Pages via GitHub Actions. The app boots and renders a basic canvas/shell (title/board placeholder) so the delivery path is proven end-to-end.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Vite+TS project initialized with scripts (`dev`, `build`, `test`, `typecheck`/`tsc`).
- [ ] Vitest configured; at least one trivial passing test.
- [ ] GitHub Actions workflow runs install, typecheck, test, build on PR/push.
- [ ] GitHub Pages deployment workflow publishes build output; app loads.
- [ ] `.gitignore` and basic project structure (`src/core`, `src/ui`) in place.
