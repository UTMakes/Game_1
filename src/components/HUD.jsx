// HUD.jsx — Credits, tick count, level, heat indicator, audio & market toggles
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import useAudioStore from '../store/audioStore';
import soundEngine from '../audio/SoundEngine';

export default function HUD() {
  const credits = useGameStore((s) => s.credits);
  const tick = useGameStore((s) => s.tick);
  const level = useGameStore((s) => s.level);
  const marketOpen = useGameStore((s) => s.marketOpen);
  const toggleMarket = useGameStore((s) => s.toggleMarket);
  const running = useGameStore((s) => s.running);
  const toggleRunning = useGameStore((s) => s.toggleRunning);
  const speed = useGameStore((s) => s.speed);
  const setSpeed = useGameStore((s) => s.setSpeed);

  const muted = useAudioStore((s) => s.muted);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const audioControlsOpen = useAudioStore((s) => s.audioControlsOpen);
  const toggleAudioControls = useAudioStore((s) => s.toggleAudioControls);
  const audioReady = useAudioStore((s) => s.audioReady);

  const handleToggleMarket = () => {
    if (audioReady) soundEngine.play('uiClick');
    toggleMarket();
  };

  const handleToggleAudioControls = () => {
    if (audioReady) soundEngine.play('uiClick');
    toggleAudioControls();
  };

  const handleToggleMute = () => {
    // Play before muting so you hear the click, or after unmuting
    if (audioReady && muted) soundEngine.play('uiClick');
    toggleMute();
    if (audioReady && !muted) {
      setTimeout(() => soundEngine.play('uiClick'), 50);
    }
  };

  const handleToggleRunning = () => {
    if (audioReady) soundEngine.play('uiClick');
    toggleRunning();
  };

  const handleSetSpeed = (s) => {
    if (audioReady && s !== speed) soundEngine.play('uiClick');
    setSpeed(s);
  };

  return (
    <div className="hud" id="hud-bar">
      {/* Left: GRIDFLOW title + credits */}
      <div className="hud-left">
        <span className="hud-title">GRIDFLOW</span>

        <div className="hud-stat" id="hud-credits">
          <span className="hud-stat-icon">⚡</span>
          <div>
            <div className="hud-stat-label">Credits</div>
            <motion.div
              className="hud-stat-value credits"
              key={credits}
              initial={{ scale: 1.2, color: '#FFFFFF' }}
              animate={{ scale: 1, color: '#EF9F27' }}
              transition={{ duration: 0.3 }}
            >
              {credits.toLocaleString()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Center: Level */}
      <div className="hud-center">
        <div className="hud-stat" id="hud-level">
          <span className="hud-stat-icon">◈</span>
          <div>
            <div className="hud-stat-label">Level</div>
            <div className="hud-stat-value level">{level}</div>
          </div>
        </div>
      </div>

      {/* Right: Tick + Heat + Audio + Market toggles */}
      <div className="hud-right">
        {/* Game Loop Controls */}
        <div className="hud-controls" style={{ display: 'flex', gap: '8px', marginRight: '16px', alignItems: 'center' }}>
          <button 
            className={`control-btn ${running ? 'active' : ''}`}
            onClick={handleToggleRunning}
            style={{ padding: '4px 12px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: 'var(--text-bright)', borderRadius: '4px', cursor: 'pointer' }}
          >
            {running ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
          <div className="speed-toggles" style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 4].map(s => (
              <button
                key={s}
                className={`speed-btn ${speed === s ? 'active' : ''}`}
                onClick={() => handleSetSpeed(s)}
                style={{ 
                  padding: '4px 8px', 
                  background: speed === s ? 'var(--accent-color)' : 'var(--panel-bg)', 
                  border: '1px solid var(--border-color)', 
                  color: speed === s ? '#000' : 'var(--text-bright)', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="hud-stat" id="hud-tick">
          <span className="hud-stat-icon">⟳</span>
          <div>
            <div className="hud-stat-label">Tick</div>
            <div className="hud-stat-value tick">{tick}</div>
          </div>
        </div>

        <div className="hud-heat-indicator" id="hud-heat">
          <span className="heat-dot" title="System temperature: Normal"></span>
          <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>COOL</span>
        </div>

        {/* Audio mute toggle */}
        <button
          className={`audio-toggle-btn ${muted ? 'muted' : ''}`}
          onClick={handleToggleMute}
          id="audio-mute"
          title={muted ? 'Unmute audio' : 'Mute audio'}
        >
          <span>{muted ? '🔇' : '🔊'}</span>
        </button>

        {/* Audio controls panel toggle */}
        <button
          className={`audio-toggle-btn ${audioControlsOpen ? 'open' : ''}`}
          onClick={handleToggleAudioControls}
          id="audio-controls-toggle"
          title="Audio settings"
        >
          <span>🎛️</span>
          <span>AUDIO</span>
        </button>

        <button
          className={`market-toggle-btn ${marketOpen ? 'open' : ''}`}
          onClick={handleToggleMarket}
          id="market-toggle"
          title="Toggle Commodity Market"
        >
          <span>📊</span>
          <span>MARKET</span>
        </button>
      </div>
    </div>
  );
}
