// NetworkCanvas.jsx — Placeholder for the network node/wire area
// Will be replaced with ReactFlow for drag-and-drop nodes, bezier wires, etc.
import { motion } from 'framer-motion';

export default function NetworkCanvas() {
  return (
    <div className="network-placeholder animate-fade-in">
      <motion.div
        className="placeholder-icon"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        ◉
      </motion.div>
      <div className="placeholder-title">Control Network</div>
      <div className="placeholder-subtitle">
        Wire monitor, throttle, and logic nodes to automate your factory
      </div>

      {/* Decorative node network */}
      <svg
        width="160"
        height="80"
        viewBox="0 0 160 80"
        style={{ marginTop: '24px', opacity: 0.15 }}
      >
        {/* Wires */}
        <line x1="20" y1="40" x2="60" y2="20" stroke="var(--network-primary)" strokeWidth="1" />
        <line x1="20" y1="40" x2="60" y2="60" stroke="var(--network-primary)" strokeWidth="1" />
        <line x1="60" y1="20" x2="100" y2="40" stroke="var(--network-primary)" strokeWidth="1" />
        <line x1="60" y1="60" x2="100" y2="40" stroke="var(--network-primary)" strokeWidth="1" />
        <line x1="100" y1="40" x2="140" y2="30" stroke="var(--network-primary)" strokeWidth="1" />
        <line x1="100" y1="40" x2="140" y2="55" stroke="var(--network-primary)" strokeWidth="1" />
        {/* Nodes */}
        <circle cx="20" cy="40" r="5" fill="var(--network-primary)" />
        <circle cx="60" cy="20" r="4" fill="var(--network-primary)" />
        <circle cx="60" cy="60" r="4" fill="var(--network-primary)" />
        <circle cx="100" cy="40" r="5" fill="var(--network-secondary)" />
        <circle cx="140" cy="30" r="3" fill="var(--network-primary)" />
        <circle cx="140" cy="55" r="3" fill="var(--network-primary)" />
      </svg>
    </div>
  );
}
