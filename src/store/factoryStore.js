// factoryStore.js — Zustand: grid state, machine tiers, heat map, selected tool
import { create } from 'zustand';

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

const useFactoryStore = create((set) => ({
  grid: [],
  machines: [],
  heatMap: {},
  selectedTool: 'select',
  tools: FACTORY_TOOLS,

  setGrid: (grid) => set({ grid }),
  addMachine: (machine) => set((state) => ({ machines: [...state.machines, machine] })),
  setSelectedTool: (toolId) => set({ selectedTool: toolId }),
}));

export default useFactoryStore;
