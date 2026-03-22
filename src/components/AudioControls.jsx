// AudioControls.jsx — Slide-out panel for volume controls
// Mirrors the MarketPanel slide-in UX with glass-panel styling.
import { motion, AnimatePresence } from 'framer-motion';
import useAudioStore from '../store/audioStore';
import soundEngine from '../audio/SoundEngine';

const CATEGORY_META = [
  { key: 'factory', label: 'Factory', icon: '⚡' },
  { key: 'network', label: 'Network', icon: '◉' },
  { key: 'ui',      label: 'UI',      icon: '🔘' },
  { key: 'ambient', label: 'Ambient',  icon: '🌌' },
];

function VolumeSlider({ label, icon, value, onChange, id }) {
  return (
    <div className="audio-slider-row" id={id}>
      <span className="audio-slider-icon">{icon}</span>
      <span className="audio-slider-label">{label}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(value * 100)}
        onChange={(e) => onChange(parseInt(e.target.value, 10) / 100)}
        className="audio-slider"
      />
      <span className="audio-slider-value">{Math.round(value * 100)}%</span>
    </div>
  );
}

export default function AudioControls() {
  const audioControlsOpen = useAudioStore((s) => s.audioControlsOpen);
  const setAudioControlsOpen = useAudioStore((s) => s.setAudioControlsOpen);
  const masterVolume = useAudioStore((s) => s.masterVolume);
  const setMasterVolume = useAudioStore((s) => s.setMasterVolume);
  const muted = useAudioStore((s) => s.muted);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const categoryVolumes = useAudioStore((s) => s.categoryVolumes);
  const setCategoryVolume = useAudioStore((s) => s.setCategoryVolume);

  const handleTestSound = () => {
    soundEngine.play('uiClick');
  };

  return (
    <AnimatePresence>
      {audioControlsOpen && (
        <motion.div
          className="audio-controls-panel glass-panel"
          id="audio-controls-panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="audio-controls-header">
            <span className="audio-controls-title">🔊 AUDIO</span>
            <button
              className="audio-controls-close"
              onClick={() => setAudioControlsOpen(false)}
              title="Close audio controls"
              id="audio-close-btn"
            >
              ✕
            </button>
          </div>

          {/* Master Volume */}
          <div className="audio-section">
            <div className="audio-section-label">Master</div>
            <VolumeSlider
              label="Volume"
              icon="🔊"
              value={muted ? 0 : masterVolume}
              onChange={setMasterVolume}
              id="audio-master-slider"
            />
            <button
              className={`audio-mute-btn ${muted ? 'muted' : ''}`}
              onClick={toggleMute}
              id="audio-mute-toggle"
            >
              {muted ? '🔇 Unmute' : '🔈 Mute'}
            </button>
          </div>

          {/* Divider */}
          <div className="audio-divider" />

          {/* Category Volumes */}
          <div className="audio-section">
            <div className="audio-section-label">Categories</div>
            {CATEGORY_META.map((cat) => (
              <VolumeSlider
                key={cat.key}
                label={cat.label}
                icon={cat.icon}
                value={categoryVolumes[cat.key]}
                onChange={(v) => setCategoryVolume(cat.key, v)}
                id={`audio-cat-${cat.key}`}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="audio-divider" />

          {/* Test Sound */}
          <button
            className="audio-test-btn"
            onClick={handleTestSound}
            id="audio-test-btn"
          >
            ▶ Test Sound
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
