// networkStore.js — Zustand: node positions, wire connections, signal state, selected node type
import { create } from 'zustand';

const NETWORK_TOOLS = [
  { id: 'select',   label: 'Select',   icon: '◇' },
  { id: 'monitor',  label: 'Monitor',  icon: '◉' },
  { id: 'throttle', label: 'Throttle', icon: '⊘' },
  { id: 'alarm',    label: 'Alarm',    icon: '⚠' },
  { id: 'bridge',   label: 'Bridge',   icon: '⌁' },
];

const useNetworkStore = create((set) => ({
  nodes: [],
  wires: [],
  signals: {},
  selectedNodeType: 'select',
  tools: NETWORK_TOOLS,

  setNodes: (nodes) => set({ nodes }),
  setWires: (wires) => set({ wires }),
  setSelectedNodeType: (nodeType) => set({ selectedNodeType: nodeType }),
}));

export default useNetworkStore;
