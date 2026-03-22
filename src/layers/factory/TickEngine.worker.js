// TickEngine.worker.js — Web Worker: packet movement, machine processing
// Runs the factory simulation tick loop off the main thread via Comlink.

import { expose } from 'comlink';
import { DIR_OFFSET, GRID, CONVEYOR, SOURCE, JAM } from '../../config/GameConfig.js';

class SimulationEngine {
  constructor() {
    this.width = GRID.WIDTH;
    this.height = GRID.HEIGHT;
    this.grid = [];
    this.config = null;
    
    // Simulation state
    this.packets = []; 
    this.earnedCredits = 0;
    this.soldPacketsCount = 0;
    this.jams = [];
    this.heatMap = {}; // not fully implemented yet
    this.events = [];  // queued events to send back to main thread
  }

  // --- Setup & Input ---

  init(state) {
    this.width = state.width;
    this.height = state.height;
    this.grid = state.grid || [];
    this.packets = state.packets || [];
    console.log('[TickEngine] Initialized with grid size:', this.width, 'x', this.height);
  }

  // Hot-replace the grid (e.g., player built something)
  updateGrid(gridData) {
    this.grid = gridData;
  }

  // --- Simulation Helpers ---

  _idx(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
    return y * this.width + x;
  }

  getTile(x, y) {
    const idx = this._idx(x, y);
    if (idx === -1) return null;
    return this.grid[idx];
  }

  getTargetXY(x, y, direction) {
    const offset = DIR_OFFSET[direction];
    if (!offset) return null;
    return { x: x + offset.dx, y: y + offset.dy };
  }

  // Find index of the packet currently on a specific cell
  getPacketOn(x, y) {
    return this.packets.findIndex(p => p.x === x && p.y === y);
  }

  // --- Primary Tick Loop ---

  tick() {
    this.events = [];
    const creditsPrev = this.earnedCredits;

    // 1. Process Machines (decrement timers, consume buffer, emit output)
    this._processMachines();

    // 2. Spawn from Sources
    this._processSources();

    // 3. Move Packets
    this._movePackets();

    // 4. Update Jams
    this._detectJams();

    // Return the diff to the main thread
    return {
      packets: this.packets,
      newCredits: this.earnedCredits - creditsPrev, // send delta
      jams: this.jams,
      events: this.events, // Array of { type: 'TICK_EVENT', payload: ... }
    };
  }

  // --- Sub-routines ---

  _processSources() {
    for (let i = 0; i < this.grid.length; i++) {
      const tile = this.grid[i];
      if (!tile || tile.type !== 'source') continue;

      // Decrement cooldown
      if (tile.props.spawnCooldown > 0) {
        tile.props.spawnCooldown--;
      }

      // If ready to spawn
      if (tile.props.spawnCooldown === 0) {
        // Can we spawn? (Is our cell empty of packets?)
        if (this.getPacketOn(tile.x, tile.y) === -1) {
          // Spawn!
          this.packets.push({
            id: `pkt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            x: tile.x,
            y: tile.y,
            resourceType: tile.props.resourceType,
            stuckTicks: 0
          });
          // Reset cooldown
          tile.props.spawnCooldown = tile.props.spawnInterval;
        }
      }
    }
  }

  _processMachines() {
    for (let i = 0; i < this.grid.length; i++) {
      const tile = this.grid[i];
      if (!tile || tile.type !== 'machine') continue;

      // If processing, advance timer
      if (tile.props.processing) {
        tile.props.progressTicks++;
        if (tile.props.progressTicks >= tile.props.totalTicks) {
           // Finished! Produce output if tile is empty
           if (this.getPacketOn(tile.x, tile.y) === -1) {
             this.packets.push({
               id: `pkt_${Date.now()}`,
               x: tile.x,
               y: tile.y,
               resourceType: tile.props.outputPacket,
               stuckTicks: 0
             });
             tile.props.processing = false;
           }
        }
      } else {
        // Not processing: check if input buffer has enough materials to start
        // Very basic stub: if we have 1 item in buffer, start processing
        if (tile.props.inputBuffer && tile.props.inputBuffer.length > 0) {
           tile.props.inputBuffer.pop(); // consume 1
           tile.props.processing = true;
           tile.props.progressTicks = 0;
           tile.props.totalTicks = 10; // temp fallback
           tile.props.outputPacket = 'refined_metal'; // temp fallback
        }
      }
    }
  }

  _movePackets() {
    const packetsToRemove = new Set();
    
    // Determine movement intent for each packet
    for (let i = 0; i < this.packets.length; i++) {
      const p = this.packets[i];
      const currentTile = this.getTile(p.x, p.y);
      
      if (!currentTile) continue; // Off grid? Should not happen.
      
      // Determine where it wants to go
      let wantsToMove = false;
      let targetPos = null;

      if (currentTile.type === 'conveyor' || currentTile.type === 'source' || currentTile.type === 'machine' || currentTile.type === 'splitter' || currentTile.type === 'merger') {
         targetPos = this.getTargetXY(p.x, p.y, currentTile.direction);
         wantsToMove = true;
      } else if (currentTile.type === 'output') {
         // Reached output: sell it!
         this.earnedCredits += 10; // TODO: read from live market price
         this.soldPacketsCount++;
         packetsToRemove.add(i);
         this.events.push({ type: 'PACKET_SOLD', payload: { resourceType: p.resourceType, amount: 10 }});
         continue;
      }

      if (wantsToMove && targetPos) {
        const targetTile = this.getTile(targetPos.x, targetPos.y);
        
        // Can it enter the target tile?
        // 1. Target tile must exist and accept input
        // 2. Target tile cannot currently hold a packet (simple collision model)
        let canEnter = false;
        if (targetTile && targetTile.props !== undefined) { // Check if valid game tile
          const isTargetOccupied = this.getPacketOn(targetPos.x, targetPos.y) !== -1;
          
          if (!isTargetOccupied) {
            canEnter = true;
            // Additional checks based on target type
            if (targetTile.type === 'machine') {
              // Target is machine: absorb packet into buffer
              targetTile.props.inputBuffer = targetTile.props.inputBuffer || [];
              targetTile.props.inputBuffer.push(p.resourceType);
              packetsToRemove.add(i);
              canEnter = true;
            }
          }
        }

        if (canEnter && !packetsToRemove.has(i)) {
          // Moved successfully
          p.x = targetPos.x;
          p.y = targetPos.y;
          p.stuckTicks = 0;
        } else {
          // Stuck
          p.stuckTicks++;
        }
      }
    }

    // Cleanup absorbed/sold packets
    this.packets = this.packets.filter((_, idx) => !packetsToRemove.has(idx));
  }

  _detectJams() {
    this.jams = [];
    for (let i = 0; i < this.packets.length; i++) {
      const p = this.packets[i];
      if (p.stuckTicks >= JAM.THRESHOLD_TICKS) {
        this.jams.push({ x: p.x, y: p.y });
        // Only trigger event once per packet going jammed
        if (p.stuckTicks === JAM.THRESHOLD_TICKS) {
           this.events.push({ type: 'JAM_DETECTED', payload: { x: p.x, y: p.y }});
        }
      }
    }
  }
}

// Instantiate and expose the engine via Comlink
const instance = new SimulationEngine();
expose(instance);
