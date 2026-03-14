// factoryStore.js — Zustand: grid state, machine tiers, heat map
import { create } from 'zustand';

const useFactoryStore = create((set) => ({
  grid: [],
  machines: [],
  heatMap: {},
  
  // TODO: Implement grid state management, machine tier tracking, heat map
  setGrid: (grid) => set({ grid }),
  addMachine: (machine) => set((state) => ({ machines: [...state.machines, machine] })),
}));

export default useFactoryStore;
