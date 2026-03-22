// GameConfig.js — Central game constants and tuning knobs
// All simulation parameters live here so they can be tweaked in one place.

export const GRID = {
  WIDTH: 12,
  HEIGHT: 8,
  CELL_SIZE: 64, // px — used by renderer
};

export const TICK = {
  RATE_MS: 200,       // base tick interval in ms (5 ticks/sec)
  SPEED_OPTIONS: [1, 2, 4], // multiplier choices
};

export const DIRECTIONS = ['N', 'E', 'S', 'W'];

// Direction → grid offset
export const DIR_OFFSET = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  W: { dx: -1, dy: 0 },
};

// Tile placement costs
export const TILE_COSTS = {
  source:   50,
  conveyor: 5,
  machine:  30,
  output:   40,
  splitter: 20,
  merger:   20,
  heatsink: 25,
};

// Machine tier definitions (per GAME PLAN)
export const MACHINE_TIERS = {
  1: { name: 'Basic',    speedMultiplier: 1,   maxInputs: 1, heatPerTick: 0.2, cost: 30 },
  2: { name: 'Advanced', speedMultiplier: 2.5, maxInputs: 2, heatPerTick: 0.6, cost: 150 },
  3: { name: 'Quantum',  speedMultiplier: 6,   maxInputs: 3, heatPerTick: 1.5, cost: 800 },
};

// Heat thresholds
export const HEAT = {
  SLOWDOWN_THRESHOLD: 70,  // machine slows at this heat level
  FAILURE_THRESHOLD: 100,  // machine fails at this heat level
  HEATSINK_RATE: 1.5,      // heat absorbed per tick per heatsink
  DISSIPATION_RATE: 0.1,   // natural heat loss per tick
};

// Conveyor upgrade
export const CONVEYOR = {
  BASE_SPEED: 1,           // packets per tick
  UPGRADED_SPEED: 2,       // packets per tick after upgrade
  UPGRADE_COST: 25,        // per tile
};

// Jam detection
export const JAM = {
  THRESHOLD_TICKS: 5,      // packet stuck for this many ticks → jammed
};

// Market fluctuation config
export const MARKET = {
  FLUCTUATION_INTERVAL_TICKS: 225, // ~45 seconds at 5 ticks/sec
  MAX_DRIFT_PERCENT: 15,          // prices swing ±15%
};

// Source spawn interval
export const SOURCE = {
  SPAWN_INTERVAL_TICKS: 4, // spawn a packet every N ticks
};
