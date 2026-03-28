# GRIDFLOW — Development Progress

## 2026-03-21 — Game Loop Foundations (v0.2.0)

### ✅ Completed

#### Core Simulation Engine (Web Worker)
- **`src/layers/factory/TickEngine.worker.js`** — Main simulation loop running off-thread via Comlink.
  - Handles packet spawning based on `source` cooldowns.
  - Moves packets directionally along `conveyor` tiles.
  - Processes `machine` queues (absorbing incoming packets, advancing timers, outputting results).
  - Routes finished products to `output` tiles to earn credits.
  - Detects `jam` conditions when packets are stuck > 5 ticks.
- **`src/layers/factory/GridEngine.js`** — 2D uniform grid logic.
  - Handles tile placement checking and cost validation.
  - Tile rotation and array-index coordination.
  - Exposes `exportState()` for transferring the static map layout to the Web Worker.

#### Configuration & Data Structures
- **`src/config/GameConfig.js`** — Centralized simulation tunables (grid sizing, tick rate base 200ms, tile placement costs, machine tier stats, jam thresholds).
- **`src/config/Recipes.js`** — Defined 3 major resource crafting chains (Metals, Energy, Bio-Tech) dictating what materials turn into what.
- **`src/layers/factory/tiles/TileTypes.js`** — Data-driven registry defining properties for the 7 physical tile types (source, conveyor, machine, output, splitter, merger, heatsink).

#### Store state and Bridge Wiring
- **`src/store/factoryStore.js`** — Wraps `GridEngine` singleton and syncs high-frequency tick data (packets, jams, heat) back from the Worker.
- **`src/store/gameStore.js`** — Expanded with running state, speed multiplier, tick ingestion, and a `fluctuateMarket` action simulating price drift.
- **`src/bridge/EventBus.js`** — Expanded with strongly typed event constants and `once()` support.
- **`src/bridge/BridgeController.js`** — Listens to `PACKET_SOLD` events from the factory simulation to add real credits, and intercepts `JAM_DETECTED` events for the network layer.

#### UI Integration
- **`src/hooks/useGameLoop.js`** — The React bridge hook. Initiates the Worker, runs a controlled `requestAnimationFrame` loop synced to the game speed, invokes the worker's `tick()`, and dispatches EventBus emissions.
- **`src/components/HUD.jsx`** — Added playback controls (`PLAY/PAUSE`) and speed controls (`1x, 2x, 4x`) to the top right of the HUD.
- **`src/App.jsx`** — Replaced the placeholder 1-second interval with the real simulation hook.

#### Audio UI Integration
- **Audio Hooks** — Added `uiClick` sound triggers to all interactive elements across `Toolbar.jsx` (layer toggle, tool buttons), `HUD.jsx` (mute, audio panel toggle, market toggle, play/pause, speed controls), and `MarketPanel.jsx` (close button).

## 2026-03-28 — Minimal Overlapping Fullscreen Redesign (v0.1.1)

### ✅ Completed
- **Layout Overhaul**: Replaced the CSS Grid split-view panels with absolute positioned, overlapping fullscreen layers.
- **Floating UI**: Removed all heavy solid background blocks and thick borders.
  - HUD is now floating text blocks in the top corners.
  - Toolbar is a frosted glass pill floating at the bottom center.
  - Market Panel is a minimalist floating list overlay.
- **Layer Swapping Anim**: Added smooth Framer Motion scaling and fading when toggling between the massive Factory and Network canvases.
- **Extreme Transparency**: Adjusted the core design system in `index.css` to rely exclusively on spacing, clean fonts, and very faint glass backgrounds rather than boxes.
- **Audio Integration Maintained**: Restored UI audio hooks (`uiClick`) to all buttons in the new `HUD.jsx` and `Toolbar.jsx`, and integrated the `AudioControls` hotkey initialization and overlay into the new `App.jsx` layout.

---

## 2026-03-21 — Basic Visual Interface (v0.1.0)

#### Core Design System
- **`src/index.css`** — Full sci-fi CSS design system
  - Color palette: near-black background `#0A0A0F`, amber/orange factory palette, teal/blue network palette
  - CSS custom properties for colors, spacing, radii, shadows, transitions
  - Hex grid and dot grid background patterns (CSS-based)
  - Glass-panel effects with backdrop blur
  - Scrollbar styling, selection colors
  - Keyframe animations: pulse-glow, scan-line, fade-in, shimmer

#### Layout
- **`src/App.css`** — Game shell layout styles
  - CSS Grid layout: HUD (top) → Layers (center) → Toolbar (bottom)
  - Split-view on screens >1200px, tabbed view on mobile
  - Subtle CRT scanline overlay effect
  - Responsive breakpoints for mobile/tablet

#### Components
- **`src/App.jsx`** — Main game shell
  - Dual-layer split/tabbed layout with animated transitions
  - Tick counter incrementing every second
  - Tab key shortcut to toggle layers
- **`src/components/HUD.jsx`** — Top HUD bar
  - GRIDFLOW gradient title
  - Credits display (animated on change), Level, Tick counter
  - Heat indicator (placeholder), Market toggle button
- **`src/components/Toolbar.jsx`** — Bottom toolbar
  - Layer toggle with animated dot indicator
  - Dynamic tool picker: factory tools (Source, Belt, Machine, Output, Split, Merge, Cooling) and network tools (Monitor, Throttle, Alarm, Bridge)
  - Active tool glow highlight
- **`src/components/MarketPanel.jsx`** — Side market panel
  - Slide-in/out animation (Framer Motion spring)
  - 6 commodities with name, category, price, trend arrows
  - Staggered entry animation for commodity rows
- **`src/components/FactoryFloor.jsx`** — Factory placeholder
  - Spinning gear icon, decorative mini grid
  - Ready for Pixi.js canvas replacement
- **`src/components/NetworkCanvas.jsx`** — Network placeholder
  - Pulsing node icon, decorative SVG node network
  - Ready for ReactFlow replacement

#### Stores (Zustand)
- **`src/store/gameStore.js`** — Credits (500), level, tick, active layer, market prices (6 commodities), market open/close
- **`src/store/factoryStore.js`** — Factory tool definitions and selected tool state
- **`src/store/networkStore.js`** — Network node type definitions and selected node type state

#### Fonts & Entry
- **`index.html`** — Google Fonts (IBM Plex Mono, Syne) preconnect + stylesheet links

---

### 🔮 Next Steps
- Implement the Pixi.js factory grid rendering to see the simulation visually
- Wiring actual UI interaction (clicks) into the `placeTile` actions
- Integrate ReactFlow for the network node canvas
- Connect sound effects to Events
- Implement the upgrade shop
- Campaign level loading
