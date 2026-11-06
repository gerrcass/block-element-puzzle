# Glossary — Element Blocks Clone

## Core
- **Board**: 10×10 grid of cells where blocks are placed.
- **Cell**: A single board position `(row, col)`, empty or occupied by a placed **Block**.
- **Block**: One unit occupying a cell; carries an **Element** (visual/mechanical theme) and may carry a **Star** marker.
- **Piece**: A polyomino shape composed of one or more blocks in a fixed local layout; cannot be rotated. Placed from the **Tray** onto the **Board**.
- **Tray**: The set of 3 **Pieces** available to place. Refilled only after all 3 are placed (or when refill rules apply).
- **Placement**: Drag/drop (or keyboard commit) of a Piece onto the Board at a valid anchor where all its blocks land on empty cells.
- **Line Clear**: Removal of all blocks in a fully occupied row or column after a Placement. A single Placement may clear multiple lines (**Combo**).
- **Combo**: Clearing 2+ lines from one Placement; grants bonus score and multiplier progress.
- **Game Over**: State where no current Tray Piece has any valid Placement on the Board.

## Economy & Power-ups
- **Star**: Collectible currency. Appears on some blocks within newly generated Tray Pieces; collected when that block participates in a Line Clear.
- **Dynamite**: Power-up costing stars (base 15, escalating). Player selects a cell; clears blocks in the 3×3 area centered on it.
- **Lightning**: Power-up costing stars (base 25, escalating). Player selects an **Element**; clears all blocks of that Element from the Board.
- **Inventory**: Player may hold at most 1 Dynamite and 1 Lightning at a time.

## Elements
- **Element**: Thematic type assigned to blocks — `fire`, `water`, `earth`, `lightning`, `light`. Drives visuals and Lightning targeting. Cosmetic for placement/clearing except Lightning.
