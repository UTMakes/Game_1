// App.jsx — GRIDFLOW main game shell
// Layout: HUD (top) → Layers (center) → Toolbar (bottom) + Side Panels
import { useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

import HUD from './components/HUD';
import Toolbar from './components/Toolbar';
import MarketPanel from './components/MarketPanel';
import AudioControls from './components/AudioControls';
import FactoryFloor from './components/FactoryFloor';
import NetworkCanvas from './components/NetworkCanvas';
import useGameStore from './store/gameStore';
import useAudioStore from './store/audioStore';
import soundEngine from './audio/SoundEngine';
import { useGameLoop } from './hooks/useGameLoop';

function App() {
  const activeLayer = useGameStore((s) => s.activeLayer);
  const incrementTick = useGameStore((s) => s.incrementTick);
  const initAudio = useAudioStore((s) => s.initAudio);
  const audioReady = useAudioStore((s) => s.audioReady);
  const audioInitRef = useRef(false);

  // ── Initialize audio on first user interaction (browser autoplay policy) ──
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioInitRef.current) {
        audioInitRef.current = true;
        initAudio();
        // Start the ambient drone after a short delay
        setTimeout(() => {
          soundEngine.startLoop('ambientDrone', { stressLevel: 0 });
        }, 300);
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initAudio]);

  // ── Cleanup loops on unmount ──
  useEffect(() => {
    return () => {
      soundEngine.stopAllLoops();
    };
  }, []);

  // Initialize Game Loop Web Worker Action
  useGameLoop();

  // Keyboard shortcut: Tab to toggle layers
  const toggleLayer = useGameStore((s) => s.toggleLayer);
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      toggleLayer();
      // Play UI click on layer switch
      if (audioReady) soundEngine.play('uiClick');
    }
  }, [toggleLayer, audioReady]);

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

      {/* ─── Side Panels ─── */}
      <MarketPanel />
      <AudioControls />
    </div>
  );
}

export default App;
