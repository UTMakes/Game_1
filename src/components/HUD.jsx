// HUD.jsx — Credits, tick count, level, heat indicator, market toggle
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

export default function HUD() {
  const credits = useGameStore((s) => s.credits);
  const tick = useGameStore((s) => s.tick);
  const level = useGameStore((s) => s.level);
  const marketOpen = useGameStore((s) => s.marketOpen);
  const toggleMarket = useGameStore((s) => s.toggleMarket);

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

      {/* Right: Tick + Heat + Market toggle */}
      <div className="hud-right">
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

        <button
          className={`market-toggle-btn ${marketOpen ? 'open' : ''}`}
          onClick={toggleMarket}
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
