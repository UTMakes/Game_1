// App.jsx — GRIDFLOW main game shell
// Layout: HUD (top) → Layers (center) → Toolbar (bottom) + Market Panel (side)
import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

import HUD from './components/HUD';
import Toolbar from './components/Toolbar';
import MarketPanel from './components/MarketPanel';
import FactoryFloor from './components/FactoryFloor';
import NetworkCanvas from './components/NetworkCanvas';
import useGameStore from './store/gameStore';

function App() {
  const activeLayer = useGameStore((s) => s.activeLayer);
  const incrementTick = useGameStore((s) => s.incrementTick);

  // Tick counter — increments every second (will be replaced by simulation tick later)
  useEffect(() => {
    const interval = setInterval(() => {
      incrementTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [incrementTick]);

  // Keyboard shortcut: Tab to toggle layers
  const toggleLayer = useGameStore((s) => s.toggleLayer);
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      toggleLayer();
    }
  }, [toggleLayer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isWideScreen = typeof window !== 'undefined' && window.innerWidth > 1200;

  return (
    <div className="game-shell" id="game-shell">
      {/* ─── HUD (Top Bar) ─── */}
      <HUD />

      {/* ─── Layer Container ─── */}
      {isWideScreen ? (
        /* Split View on wide screens */
        <div className="layer-container split-view" id="layer-container">
          <div className="layer-panel factory-layer hex-grid-bg">
            <span className="layer-label factory">⚡ Factory</span>
            <FactoryFloor />
          </div>
          <div className="layer-panel network-layer dot-grid-bg">
            <span className="layer-label network">◉ Network</span>
            <NetworkCanvas />
          </div>
        </div>
      ) : (
        /* Tabbed View on narrow screens */
        <div className="layer-container" id="layer-container">
          <AnimatePresence mode="wait">
            {activeLayer === 'factory' ? (
              <motion.div
                className="layer-panel factory-layer hex-grid-bg"
                key="factory"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <span className="layer-label factory">⚡ Factory</span>
                <FactoryFloor />
              </motion.div>
            ) : (
              <motion.div
                className="layer-panel network-layer dot-grid-bg"
                key="network"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <span className="layer-label network">◉ Network</span>
                <NetworkCanvas />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ─── Toolbar (Bottom Bar) ─── */}
      <Toolbar />

      {/* ─── Market Panel (Side Slide-in) ─── */}
      <MarketPanel />
    </div>
  );
}

export default App;
