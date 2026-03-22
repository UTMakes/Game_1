// gameStore.js — Zustand: credits, level, market prices, events, active layer, tick
import { create } from 'zustand';
import { MARKET } from '../config/GameConfig.js';

const INITIAL_MARKET_PRICES = {
  refined_metal:   { name: 'Refined Metal',   category: 'Metals',      price: 45,  trend: 'stable' },
  circuit_board:   { name: 'Circuit Board',   category: 'Electronics', price: 120, trend: 'up' },
  processor_chip:  { name: 'Processor Chip',  category: 'Electronics', price: 280, trend: 'up' },
  quantum_core:    { name: 'Quantum Core',    category: 'Quantum',     price: 800, trend: 'down' },
  plasma_cell:     { name: 'Plasma Cell',     category: 'Energy',      price: 95,  trend: 'stable' },
  nano_weave:      { name: 'Nano Weave',      category: 'Bio-Tech',    price: 210, trend: 'up' },
};

const useGameStore = create((set, get) => ({
  credits: 500,
  level: 1,
  tick: 0,
  
  // Game Loop Controls
  running: false,
  speed: 1, // 1x, 2x, 4x
  
  activeLayer: 'factory', // 'factory' | 'network'
  marketPrices: INITIAL_MARKET_PRICES,
  marketOpen: false,
  events: [],

  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  spendCredits: (amount) => set((state) => ({
    credits: Math.max(0, state.credits - amount)
  })),
  setLevel: (level) => set({ level }),
  
  // Sets the tick from the worker loop
  setTick: (newTick) => set({ tick: newTick }),
  
  toggleRunning: () => set((state) => ({ running: !state.running })),
  setSpeed: (speed) => set({ speed }),

  toggleLayer: () => set((state) => ({
    activeLayer: state.activeLayer === 'factory' ? 'network' : 'factory'
  })),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  toggleMarket: () => set((state) => ({ marketOpen: !state.marketOpen })),
  setMarketOpen: (open) => set({ marketOpen: open }),

  // Basic market fluctuation: random drift within ±MAX_DRIFT_PERCENT
  fluctuateMarket: () => set((state) => {
    const newPrices = { ...state.marketPrices };
    Object.keys(newPrices).forEach(key => {
      const item = newPrices[key];
      // -1.0 to 1.0 drift
      const drift = (Math.random() * 2) - 1; 
      const changePct = drift * (MARKET.MAX_DRIFT_PERCENT / 100);
      const newPrice = Math.max(5, Math.floor(item.price * (1 + changePct)));
      
      let trend = 'stable';
      if (newPrice > item.price + 2) trend = 'up';
      else if (newPrice < item.price - 2) trend = 'down';

      newPrices[key] = { ...item, price: newPrice, trend };
    });
    return { marketPrices: newPrices };
  }),

  // Add event to the UI log
  logEvent: (evtStr) => set((state) => ({
    events: [evtStr, ...state.events].slice(0, 50) // keep last 50
  })),
}));

export default useGameStore;
