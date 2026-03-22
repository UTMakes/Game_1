// FactoryFloor.jsx — Placeholder for the factory grid area
// Will be replaced with Pixi.js canvas for tile rendering, packet animation, etc.
import { motion } from 'framer-motion';

export default function FactoryFloor() {
  return (
    <div className="factory-placeholder animate-fade-in">
      <motion.div
        className="placeholder-icon"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        ⚙
      </motion.div>
      <div className="placeholder-title">Factory Floor</div>
      <div className="placeholder-subtitle">
        Place sources, conveyors, and machines to build your production line
      </div>

      {/* Decorative grid coordinates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '4px',
        marginTop: '24px',
        opacity: 0.15,
      }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '24px',
              height: '24px',
              border: '1px solid var(--factory-primary)',
              borderRadius: '2px',
            }}
          />
        ))}
      </div>
    </div>
  );
}
