// HUD.jsx — Floating minimalist top layout
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import useAudioStore from '../store/audioStore';
import soundEngine from '../audio/SoundEngine';

export default function HUD() {
  const credits = useGameStore((s) => s.credits);
  const tick = useGameStore((s) => s.tick);
  const level = useGameStore((s) => s.level);
  const marketOpen = useGameStore((s) => s.marketOpen);
  const toggleMarket = useGameStore((s) => s.toggleMarket);
  
  const muted = useAudioStore((s) => s.muted);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const audioControlsOpen = useAudioStore((s) => s.audioControlsOpen);
  const toggleAudioControls = useAudioStore((s) => s.toggleAudioControls);
  const audioReady = useAudioStore((s) => s.audioReady);

  const handleToggleMarket = () => {
    if (audioReady) soundEngine.play('uiClick');
    toggleMarket();
  };

  const handleToggleAudio = () => {
    if (audioReady) soundEngine.play('uiClick');
    toggleAudioControls();
  };

  const handleToggleMute = () => {
    if (audioReady && muted) soundEngine.play('uiClick');
    toggleMute();
    if (audioReady && !muted) {
      setTimeout(() => soundEngine.play('uiClick'), 50);
    }
  };

  return (
    <div className="floating-hud">
      {/* ─── Top Left: Branding & Stats ─── */}
      <div className="hud-group">
        <div className="hud-logo">GRIDFLOW</div>
        
        <div className="hud-stat-minimal">
          <span className="text-label">Credits</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              className="text-value"
              key={credits}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
            >
              {credits.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="hud-stat-minimal">
          <span className="text-label">Level</span>
          <span className="text-value">{level}</span>
        </div>
      </div>

      {/* ─── Top Right: Environment & Toggles ─── */}
      <div className="hud-group hud-items-right">
        <div className="hud-stat-minimal">
          <span className="text-value">{tick}</span>
          <span className="text-label">Tick</span>
        </div>

        <div className="hud-stat-minimal">
          <span className="text-value" style={{ color: 'var(--status-up)' }}>COOL</span>
          <span className="text-label">Sys Temp</span>
        </div>

        <button 
          className="interactive-text-btn"
          onClick={handleToggleMute}
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {muted ? '🔇 UNMUTE' : '🔊 MUTE'}
        </button>

        <button 
          className="interactive-text-btn"
          onClick={handleToggleAudio}
        >
          🎛️ AUDIO
        </button>

        <button 
          className="interactive-text-btn"
          onClick={handleToggleMarket}
        >
          {marketOpen ? 'CLOSE MARKET' : 'OPEN MARKET'}
        </button>
      </div>
    </div>
  );
}
