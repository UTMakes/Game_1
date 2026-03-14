// gameStore.js — Zustand: credits, level, market prices, events
import { create } from 'zustand';

const useGameStore = create((set) => ({
  credits: 0,
  level: 1,
  marketPrices: {},
  events: [],

  // TODO: Implement credits, level progression, market price system, events
  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  setLevel: (level) => set({ level }),
}));

export default useGameStore;
