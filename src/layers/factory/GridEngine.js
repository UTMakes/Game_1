// GridEngine.js — Tile logic, conveyor routing, machine state
// Manages the factory floor grid: tile placement, rotation, validation, and layout logic.

import { GRID, DIR_OFFSET, DIRECTIONS, TILE_COSTS } from '../../config/GameConfig.js';
import { createTileInstance } from './tiles/TileTypes.js';

export class GridEngine {
  constructor(width = GRID.WIDTH, height = GRID.HEIGHT) {
    this.width = width;
    this.height = height;
    // Flat 1D array representing 2D grid
    this.grid = new Array(width * height).fill(null);
  }

  // --- Core Grid Management ---

  _idx(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
    return y * this.width + x;
  }

  getTile(x, y) {
    const idx = this._idx(x, y);
    if (idx === -1) return null;
    return this.grid[idx];
  }

  setTile(x, y, tile) {
    const idx = this._idx(x, y);
    if (idx !== -1) {
      if (tile) {
        // Enforce x,y coordinate storing directly on the tile instance
        tile.x = x;
        tile.y = y;
      }
      this.grid[idx] = tile;
    }
  }

  // --- Actions ---

  // Attempt to place a tile. Returns true if successful, false otherwise.
  placeTile(x, y, typeId, direction = 'N') {
    const existing = this.getTile(x, y);
    if (existing) return false; // cell occupied

    const cost = TILE_COSTS[typeId];
    if (cost === undefined) return false;

    const newTile = createTileInstance(typeId, direction);
    if (!newTile) return false;

    this.setTile(x, y, newTile);
    return true; // Success (note: credit deduction happens in the store)
  }

  // Remove a tile. Returns the removed tile (or null if cell was empty)
  removeTile(x, y) {
    const tile = this.getTile(x, y);
    if (tile) {
      this.setTile(x, y, null);
    }
    return tile;
  }

  // Cycle the rotation of a rotatable tile
  rotateTile(x, y) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    
    // Only rotate if the tile type definition says it's rotatable
    if (tile.type === 'conveyor' || tile.type === 'machine' || 
        tile.type === 'splitter' || tile.type === 'merger') {
      
      const currentIdx = DIRECTIONS.indexOf(tile.direction);
      const nextIdx = (currentIdx + 1) % DIRECTIONS.length;
      tile.direction = DIRECTIONS[nextIdx];
      return true;
    }
    return false;
  }

  // --- Neigbor Lookup ---

  // Returns array of adjacent tiles
  getNeighbors(x, y) {
    const neighbors = [];
    for (const dir of DIRECTIONS) {
      const r = this.getTileAtOffset(x, y, dir);
      if (r) neighbors.push(r);
    }
    return neighbors;
  }

  getTileAtOffset(x, y, direction) {
    const offset = DIR_OFFSET[direction];
    if (!offset) return null;
    return this.getTile(x + offset.dx, y + offset.dy);
  }

  // Returns the tile exactly one cell away in the direction this cell is facing
  getForwardNeighbor(x, y) {
    const tile = this.getTile(x, y);
    if (!tile) return null;
    return this.getTileAtOffset(x, y, tile.direction);
  }

  // Find all conveyor tiles pointing INTO this specified cell
  // Splitters and Mergers are also checked.
  getIncomingNeighbors(x, y) {
    const incoming = [];
    for (const d of DIRECTIONS) {
      const n = this.getTileAtOffset(x, y, d);
      if (!n) continue;

      // Check if neighbor is pointing its output into our cell
      if ((n.type === 'conveyor' || n.type === 'machine' || 
           n.type === 'splitter' || n.type === 'merger' || n.type === 'source') 
          && this._pointsTo(n, x, y)) {
        incoming.push(n);
      }
    }
    return incoming;
  }

  // Helper: does tile n point to coordinate (tx, ty)?
  _pointsTo(tile, tx, ty) {
    const off = DIR_OFFSET[tile.direction];
    if (!off) return false;
    // Normal straight path
    if (tile.x + off.dx === tx && tile.y + off.dy === ty) return true;
    
    // Special logic for splitters (they output straight and maybe sideways)
    // We'll keep it simple for now and just say they point in their primary direction
    // TODO: implement 90-degree splitter logic in simulation.
    return false;
  }

  // --- Serialization ---

  // Export grid state for the store/worker
  exportState() {
    return {
      width: this.width,
      height: this.height,
      grid: this.grid.map(t => t ? JSON.parse(JSON.stringify(t)) : null)
    };
  }

  // Load grid state
  importState(state) {
    if (!state || !state.grid) return;
    this.width = state.width;
    this.height = state.height;
    this.grid = state.grid.map(t => t ? JSON.parse(JSON.stringify(t)) : null);
  }
}

export default GridEngine;
