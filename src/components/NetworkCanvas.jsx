// NetworkCanvas.jsx — Fullscreen placeholder for network node area
import { motion } from 'framer-motion';

export default function NetworkCanvas() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      color: 'var(--network-primary)'
    }}>
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '48px', marginBottom: '24px', opacity: 0.8 }}
      >
        ◈
      </motion.div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 600, letterSpacing: '0.2em' }}>
        CONTROL NETWORK
      </div>
      <div className="text-label" style={{ marginTop: '16px', opacity: 0.8 }}>
        AWAITING SIGNAL CONNECTIONS
      </div>

      {/* Decorative center reticle */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        border: '1px solid var(--border-faint)',
        borderRadius: '50%',
        pointerEvents: 'none',
        opacity: 0.5
      }} />
    </div>
  );
}
