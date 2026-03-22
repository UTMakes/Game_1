// gameStore.js — Zustand: credits, level, market prices, events, active layer, tick
import { create } from 'zustand';

const INITIAL_MARKET_PRICES = {
  refined_metal:   { name: 'Refined Metal',   category: 'Metals',    price: 45,  trend: 'stable' },
  circuit_board:   { name: 'Circuit Board',    category: 'Electronics', price: 120, trend: 'up' },
  processor_chip:  { name: 'Processor Chip',   category: 'Electronics', price: 280, trend: 'up' },
  quantum_core:    { name: 'Quantum Core',     category: 'Quantum',   price: 800, trend: 'down' },
  plasma_cell:     { name: 'Plasma Cell',      category: 'Energy',    price: 95,  trend: 'stable' },
  nano_weave:      { name: 'Nano Weave',       category: 'Bio-Tech',  price: 210, trend: 'up' },
};

const useGameStore = create((set) => ({
  credits: 500,
  level: 1,
  tick: 0,
  activeLayer: 'factory', // 'factory' | 'network'
  marketPrices: INITIAL_MARKET_PRICES,
  marketOpen: false,
  events: [],

  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  spendCredits: (amount) => set((state) => ({
    credits: Math.max(0, state.credits - amount)
  })),
  setLevel: (level) => set({ level }),
  incrementTick: () => set((state) => ({ tick: state.tick + 1 })),
  toggleLayer: () => set((state) => ({
    activeLayer: state.activeLayer === 'factory' ? 'network' : 'factory'
  })),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  toggleMarket: () => set((state) => ({ marketOpen: !state.marketOpen })),
  setMarketOpen: (open) => set({ marketOpen: open }),
}));

export default useGameStore;
