⚡ GRIDFLOW — Complete Game Design Document

Core Concept
A sci-fi factory builder where you construct physical production lines and design the data networks that control them. The factory floor is the physical layer — conveyors, machines, resources moving as discrete packets. The control network is the logic layer — nodes, signals, and processors that automate and optimize the factory in real time. The two layers are deeply intertwined: a well-designed network speeds up machines, reroutes conveyors dynamically, responds to failures, and reacts to a live commodity market faster than any human could manually.
The factory runs fine manually, but to hit high scores you must build a data network to control it. The network IS the automation.

Two-Layer System
LayerWhat it isHow you interactFactory FloorGrid-based tile mapPlace/rotate conveyors, machines, sources, outputsControl NetworkFreeform node canvasWire signal nodes that monitor and control factory tiles
Players toggle between layers with a single button — like switching between a blueprint view and an overhead operations view. On wide screens both layers are visible simultaneously (split view). On mobile they are tabbed.

Gameplay Loop

Place raw factory infrastructure on the grid (sources, conveyors, machines, outputs)
Run it manually — earn baseline credits, spot bottlenecks
Switch to network view — wire up control nodes to factory tiles
Network monitors throughput, detects jams, sends speed/reroute signals to machines
Credits scale with how optimized your combined system is
Random events (power surges, corrupted packets, machine failures) test your network's resilience
Watch the live commodity market — reroute production toward high-value outputs
Spend credits to expand the grid, buy new node types, upgrade machines and tiers

Factory Floor — Full Depth
Resource Chains & Recipes
Six to eight raw materials with multi-step crafting chains:
Ore → Refined Metal → Circuit Board → Processor Chip → Quantum Core
Energy Crystal → Plasma Cell → Power Module
Bio Matter → Synthetic Fiber → Nano Weave
Each step requires a different machine type. Complex recipes require multiple input streams converging on one machine simultaneously — forcing intricate conveyor routing and network coordination.
Machine Tiers
Every machine has three tiers:
TierNameSpeedInputsHeat GeneratedCost1Basic1x1Low30cr2Advanced2.5x2Medium150cr3Quantum6x3High800cr
Higher tiers generate heat. Too much heat in a grid zone causes machine slowdown, then failure. Players must build heat sinks (a tile type) or route cooling signals through the network layer to manage thermal load.
Conveyor System

Four directional orientations, rotatable on placement
Upgradeable to move 2 packets per tick (costs 25cr per tile)
Splitter tiles — one input, two outputs (splits stream 50/50 or weighted)
Merger tiles — two inputs, one output (first-come-first-served or network-controlled priority)
Belt speed visible as animated packet dots — faster belts = faster dot movement

Economy & Live Market
A commodity ticker runs in the HUD. Output prices for each material fluctuate every 45 seconds based on simulated supply/demand. Selling Processor Chips might earn 200cr now but drop to 80cr as you flood the market. Players — or their AI nodes — must dynamically reroute production toward whatever is currently most valuable. This makes the network layer essential for competitive play.

Control Network — Full Depth
Core Node Types (Original)

Monitor node — attaches to a conveyor tile, reads packet flow rate, feeds live data into the network
Throttle node — attaches to a machine, speeds it up or slows it down based on incoming signal strength
Alarm node — detects jams or failures on the factory floor, broadcasts an alert signal to connected nodes
Bridge node — connects two physically distant factory tiles through the network, bypassing conveyor distance
AI node (late game) — autonomously optimizes connected machines using a visual rule engine the player defines

Logic Gate Network
The network layer supports full boolean logic:
GateBehaviorANDSends signal only if ALL inputs are activeORSends signal if ANY input is activeNOTInverts a signalXORSends signal if exactly ONE input is activeLATCHHolds a signal state until manually reset
Example use: IF (machine_3 is jammed) AND (backup_conveyor is free) THEN send reroute signal. This turns the network into a visual programming puzzle — deeply satisfying for technical players.
Signal Timing & Propagation Delay
Network signals are not instant. Propagation delay = wire length × 0.8ms. Players must account for this when designing time-sensitive automations. A throttle signal triggered by a jam monitor might arrive 40ms too late if the wire path is inefficient — the player must shorten the path or add a predictive trigger node. This adds a timing puzzle layer on top of the logic layer.
Network Vulnerabilities & Redundancy

Corrupted data packets can travel up the network layer and disable control nodes, not just factory machines
Power surge events can cascade through the network and knock out connected nodes in sequence
Players must design redundant network paths — if the primary wire path is severed, a backup route takes over automatically
This mirrors real infrastructure engineering and rewards defensive design

Programmable AI Nodes — Visual Scripting
AI nodes have a pop-up visual scripting panel. Players drag and connect condition blocks and action blocks:
Condition blocks: flow_rate < N, machine_state == jammed, market_price > N, heat_level > N, tick_count % N == 0
Action blocks: boost_speed(target), reduce_speed(target), reroute_conveyor(tile, direction), send_alarm(), pause_machine(target), prioritize_input(slot)
Multiple conditions chain with logic gates. Multiple actions can fire from one node. This is the Upload Labs DNA taken to its logical conclusion — players are essentially writing factory control programs without writing code.

New Combined Node Types
Unique to GRIDFLOW's dual-layer design:

Market Responder node — reads the live commodity ticker, automatically signals machines to switch recipes when a more valuable output is available
Thermal Manager node — monitors heat levels across a grid zone, throttles nearby machines before they overheat
Cascade Breaker node — detects a network fault propagating through wires and isolates the affected segment before it spreads
Priority Router node — on a merger tile, dynamically weights which input stream gets priority based on a network signal
Echo node — repeats a signal along a long wire path to prevent signal degradation over distance

Polish & Feel
Feedback & Juice

Screen shake on machine failures — intensity scales with machine tier
Particle explosions when a jam clears — packets burst outward then reform on the conveyor
Heartbeat pulse on machines running at full efficiency — a slow rhythmic glow that feels alive
Network signal visualization — when a signal fires, a bright pulse travels visibly along the wire in real time, showing the player exactly what their network is doing
Heat shimmer on overheating machines — a subtle distortion effect on the tile
Jam indicator — a pulsing red exclamation that grows more urgent the longer a jam persists

Sound Design

Conveyor hum that scales in pitch with belt speed
Distinct processing click per machine tier (Basic: mechanical clunk, Advanced: electronic beep, Quantum: deep synthesized tone)
Satisfying chime when an output delivers a packet, pitch varies with packet value
Network signal fire — a short crisp electronic blip that travels in stereo from left to right matching wire direction
Alarm node trigger — a tense low buzz, not annoying but clearly urgent
Ambient space station background drone that reacts to factory stress level

Visual Style

Background — near-black (#0A0A0F) with a faint hex grid overlay at 4% opacity
Factory floor — warm amber and orange palette for conveyors (#EF9F27), machines glow orange-red when active
Network layer — cool teal and electric blue for wires (#1D9E75, #378ADD), node bodies are dark with glowing borders
Network-controlled tiles — factory tiles with an attached network node get a teal outline glow, clearly showing "this tile is under network control"
Packets — warm amber dots on the factory floor, fast cool teal pulses on the network layer
UI — dark panels, IBM Plex Mono for all numbers and data readouts, Syne for headings and titles
Corruption visual — corrupted packets are deep red with a flickering animation
Heat zones — tiles in a hot zone get a subtle red-orange tint that deepens as temperature rises

Progression Arc
LevelFactory ChallengeNetwork ChallengeNew Feature Unlocked1Single resource, 3 machines, small gridNo network — manual onlyTutorial, conveyor basics2Two resources, basic recipesMonitor + Throttle nodesNetwork layer introduced3Larger grid, time pressure, splittersRouting, merging, basic logic gatesAND/OR gates, signal delay4Random machine failures, heat introducedAlarm + auto-reroute nodesThermal Manager node, redundancy5Multi-resource recipes, market fluctuationsMarket Responder nodeLive commodity ticker6Multi-zone grid, tier 3 machinesFull logic gate system, AI nodesVisual scripting panel7+Cascading failures, corrupted packetsNetwork vulnerability managementCascade Breaker, Echo nodesEndlessProcedural layouts, escalating events

Rendering Architecture

Factory floor → Pixi.js canvas via @pixi/react — handles tile rendering, packet dot animation, heat shimmer, particle bursts at 60fps regardless of factory size
Network canvas → ReactFlow — drag-and-drop nodes, bezier wire connections, animated signal pulses along paths
UI layer → React + Framer Motion — HUD, shop, market ticker, story log, all panels
Both layers simultaneously on screens wider than 1200px (split view). Tabbed on mobile.

Performance

Both simulation engines (tick + signal) run in Web Workers via Comlink — UI never blocks even with massive factories
IndexedDB via idb for all save states — handles arbitrarily large factory/network layouts, no LocalStorage size limits
PWA support — add a vite-plugin-pwa config so players can install GRIDFLOW to desktop like a native app with one click, including offline play for campaign levels

GitHub → Vercel Pipeline

Push to GitHub
Vercel → New Project → Import repo
Auto-detects Vite: build command npm run build, output dir dist
Every push to main = live production deploy
Every PR = isolated preview URL for testing
Add env vars in Vercel dashboard (market seed, analytics keys, etc.)

And here setup for full tech stack:
npx create vite@latest gridflow -- --template react
cd gridflow
npm install zustand framer-motion reactflow @pixi/react
npm install comlink idb

```

`comlink` — clean interface for Web Workers
`idb` — IndexedDB wrapper for save states

### Folder Structure
```

src/
layers/
factory/
GridEngine.js ← tile logic, conveyor simulation, machine state
TickEngine.worker.js ← Web Worker: packet movement, heat, jam detection
tiles/ ← tile type definitions and render components
network/
SignalEngine.worker.js ← Web Worker: signal propagation, timing, fault detection
nodes/ ← all node type definitions (Monitor, Throttle, AI, etc.)
LogicGates.js ← AND/OR/NOT/XOR/LATCH gate logic
VisualScripter.jsx ← drag-and-drop AI node programming UI
bridge/
BridgeController.js ← links factory tile state ↔ network node signals
EventBus.js ← shared event system between both layers
components/
HUD.jsx ← credits, tick, market ticker, heat warning
Toolbar.jsx ← tile/node picker, layer toggle
UpgradeShop.jsx ← machine/conveyor/node upgrades
MarketPanel.jsx ← live commodity price display
CampaignLog.jsx ← story text unlock viewer
store/
factoryStore.js ← Zustand: grid state, machine tiers, heat map
networkStore.js ← Zustand: node positions, wire connections, signal state
gameStore.js ← Zustand: credits, level, market prices, events
saveStore.js ← IndexedDB read/write via idb
levels/
level_01.json through level_07.json
endless_seed.js ← procedural level generator
workers/
TickEngine.worker.js
SignalEngine.worker.js
public/
assets/
sounds/ ← conveyor hum, machine clicks, alarm, chime
fonts/ ← IBM Plex Mono, Syne. -- should look something like this
