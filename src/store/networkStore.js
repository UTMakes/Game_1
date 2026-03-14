// networkStore.js — Zustand: node positions, wire connections, signal state
import { create } from 'zustand';

const useNetworkStore = create((set) => ({
  nodes: [],
  wires: [],
  signals: {},

  // TODO: Implement node position tracking, wire connections, signal state
  setNodes: (nodes) => set({ nodes }),
  setWires: (wires) => set({ wires }),
}));

export default useNetworkStore;
