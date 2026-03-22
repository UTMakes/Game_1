// TileTypes.js — Factory tile type definitions
// Each tile type defines its behavior, visual properties, and simulation rules.

import { TILE_COSTS, SOURCE, CONVEYOR } from '../../../config/GameConfig.js';

// ─── Tile Type Registry ───

const TILE_TYPES = {
  source: {
    id: 'source',
    label: 'Source',
    icon: '◆',
    cost: TILE_COSTS.source,
    description: 'Spawns raw resource packets at a fixed interval.',
    // Which raw material this source produces (set on placement)
    defaultProps: {
      resourceType: 'ore',             // changeable per-instance
      spawnInterval: SOURCE.SPAWN_INTERVAL_TICKS,
      spawnCooldown: 0,                // ticks remaining until next spawn
    },
    rotatable: false,
    acceptsInput: false,
    hasOutput: true,
  },

  conveyor: {
    id: 'conveyor',
    label: 'Belt',
    icon: '⟶',
    cost: TILE_COSTS.conveyor,
    description: 'Moves packets in the facing direction. Upgradeable to 2x speed.',
    defaultProps: {
      speed: CONVEYOR.BASE_SPEED,
      upgraded: false,
      packet: null,                    // the packet currently on this belt (or null)
      stuckTicks: 0,                   // how many ticks the packet has been unable to move
    },
    rotatable: true,
    acceptsInput: true,
    hasOutput: true,
  },

  machine: {
    id: 'machine',
    label: 'Machine',
    icon: '⚙',
    cost: TILE_COSTS.machine,
    description: 'Processes input materials into outputs via a recipe.',
    defaultProps: {
      tier: 1,
      recipeId: null,                  // set by player — which recipe this machine runs
      inputBuffer: [],                 // materials waiting to be processed
      processing: false,
      progressTicks: 0,                // ticks into current recipe
      totalTicks: 0,                   // recipe duration (adjusted by tier speed)
      outputPacket: null,              // finished product waiting to leave
      heat: 0,
    },
    rotatable: true,
    acceptsInput: true,
    hasOutput: true,
  },

  output: {
    id: 'output',
    label: 'Output',
    icon: '▣',
    cost: TILE_COSTS.output,
    description: 'Sells arriving packets for credits at current market price.',
    defaultProps: {
      totalSold: 0,
      totalCredits: 0,
    },
    rotatable: false,
    acceptsInput: true,
    hasOutput: false,
  },

  splitter: {
    id: 'splitter',
    label: 'Split',
    icon: '⑂',
    cost: TILE_COSTS.splitter,
    description: 'One input, two outputs. Splits stream 50/50 by default.',
    defaultProps: {
      ratio: [1, 1],                   // weight for output A vs B
      nextOutput: 0,                   // alternates: 0 or 1
      packet: null,
      stuckTicks: 0,
    },
    rotatable: true,
    acceptsInput: true,
    hasOutput: true,
    outputCount: 2,
  },

  merger: {
    id: 'merger',
    label: 'Merge',
    icon: '⑃',
    cost: TILE_COSTS.merger,
    description: 'Two inputs, one output. First-come-first-served by default.',
    defaultProps: {
      mode: 'fifo',                    // 'fifo' | 'priority' (network-controlled)
      packet: null,
      stuckTicks: 0,
    },
    rotatable: true,
    acceptsInput: true,
    hasOutput: true,
    inputCount: 2,
  },

  heatsink: {
    id: 'heatsink',
    label: 'Cooling',
    icon: '❄',
    cost: TILE_COSTS.heatsink,
    description: 'Absorbs heat from adjacent machine tiles.',
    defaultProps: {},
    rotatable: false,
    acceptsInput: false,
    hasOutput: false,
  },
};

// ─── Helpers ───

export function getTileType(typeId) {
  return TILE_TYPES[typeId] || null;
}

export function createTileInstance(typeId, direction = 'N', overrides = {}) {
  const typeDef = TILE_TYPES[typeId];
  if (!typeDef) return null;

  return {
    type: typeId,
    direction,
    props: { ...typeDef.defaultProps, ...overrides },
  };
}

export function getAllTileTypes() {
  return Object.values(TILE_TYPES);
}

export default TILE_TYPES;
