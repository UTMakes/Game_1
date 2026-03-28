// App.jsx — GRIDFLOW Minimal Overlapping Fullscreen Layout
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

function App() {
  const activeLayer = useGameStore((s) => s.activeLayer);
  const incrementTick = useGameStore((s) => s.incrementTick);
  const toggleLayer = useGameStore((s) => s.toggleLayer);

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

  // Tick simulation
  useEffect(() => {
    const interval = setInterval(incrementTick, 1000);
    return () => clearInterval(interval);
  }, [incrementTick]);

  // Keyboard shortcut: Tab to toggle layers
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (audioReady) soundEngine.play('uiClick');
      toggleLayer();
    }
  }, [toggleLayer, audioReady]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="game-shell">
      {/* ─── Floating Transparent UI Layer ─── */}
      <HUD />
      <Toolbar />
      <MarketPanel />
      <AudioControls />

      {/* ─── Fullscreen Overlapping Game Canvases ─── */}
      <AnimatePresence mode="wait">
        {activeLayer === 'factory' ? (
          <motion.div
            key="factory-layer"
            className="layer-container layer-factory-bg"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="hex-overlay"></div>
            <FactoryFloor />
          </motion.div>
        ) : (
          <motion.div
            key="network-layer"
            className="layer-container layer-network-bg"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="dot-overlay"></div>
            <NetworkCanvas />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
