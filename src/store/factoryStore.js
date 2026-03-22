// factoryStore.js — Zustand: grid state, machine tiers, heat map, selected tool
import { create } from 'zustand';
import GridEngine from '../layers/factory/GridEngine.js';
import { TILE_COSTS } from '../config/GameConfig.js';
import useGameStore from './gameStore.js';

const FACTORY_TOOLS = [
  { id: 'select',   label: 'Select',   icon: '◇' },
  { id: 'source',   label: 'Source',   icon: '◆' },
  { id: 'conveyor', label: 'Belt',     icon: '⟶' },
  { id: 'machine',  label: 'Machine',  icon: '⚙' },
  { id: 'output',   label: 'Output',   icon: '▣' },
  { id: 'splitter', label: 'Split',    icon: '⑂' },
  { id: 'merger',   label: 'Merge',    icon: '⑃' },
  { id: 'heatsink', label: 'Cooling',  icon: '❄' },
];

export const engine = new GridEngine(); // Singleton for the main thread

const useFactoryStore = create((set, get) => ({
  // Raw grid array from engine
  grid: engine.exportState().grid, 
  width: engine.width,
  height: engine.height,
  
  // Simulation state brought back from worker
  packets: [],
  jams: [],
  heatMap: {},
  machines: [], // placeholder for specialized UI loops

  selectedTool: 'select',
  tools: FACTORY_TOOLS,

  setSelectedTool: (toolId) => set({ selectedTool: toolId }),

  // --- Grid Actions ---

  placeTile: (x, y, toolId, direction = 'N') => {
    const cost = TILE_COSTS[toolId];
    if (cost === undefined) return false;

    const gameStore = useGameStore.getState();
    if (gameStore.credits < cost) return false;

    const success = engine.placeTile(x, y, toolId, direction);
    if (success) {
      gameStore.spendCredits(cost);
      set({ grid: engine.exportState().grid });
      return true;
    }
    return false;
  },

  removeTile: (x, y) => {
    const tileType = engine.getTile(x, y)?.type;
    const removed = engine.removeTile(x, y);
    if (removed) {
      // Refund partial cost (e.g. 50%)
      const cost = TILE_COSTS[tileType] || 0;
      useGameStore.getState().addCredits(Math.floor(cost * 0.5));
      set({ grid: engine.exportState().grid });
    }
  },

  rotateTile: (x, y) => {
    const success = engine.rotateTile(x, y);
    if (success) {
      set({ grid: engine.exportState().grid });
    }
  },

  // Called by the useGameLoop hook when the worker returns a tick result
  syncFromTick: (tickResult) => set({
    packets: tickResult.packets || [],
    jams: tickResult.jams || [],
    // heatMap: tickResult.heatMap, // when implemented
  }),

}));

export default useFactoryStore;
