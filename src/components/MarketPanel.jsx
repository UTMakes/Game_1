// MarketPanel.jsx — Live commodity price display (slide-in side panel)
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import useAudioStore from '../store/audioStore';
import soundEngine from '../audio/SoundEngine';

const TREND_SYMBOLS = {
  up: '▲',
  down: '▼',
  stable: '▸',
};

export default function MarketPanel() {
  const marketPrices = useGameStore((s) => s.marketPrices);
  const marketOpen = useGameStore((s) => s.marketOpen);
  const setMarketOpen = useGameStore((s) => s.setMarketOpen);
  const audioReady = useAudioStore((s) => s.audioReady);

  const handleClose = () => {
    if (audioReady) soundEngine.play('uiClick');
    setMarketOpen(false);
  };

  return (
    <div className="market-panel-wrapper">
      <AnimatePresence>
        {marketOpen && (
          <motion.div
            className="market-panel"
            id="market-panel"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="market-panel-header">
              <span className="market-panel-title">📈 Commodity Market</span>
              <button
                className="market-close-btn"
                onClick={handleClose}
                id="market-close"
                title="Close market panel"
              >
                ✕
              </button>
            </div>

            {Object.entries(marketPrices).map(([key, commodity]) => (
              <motion.div
                className="market-commodity"
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * Object.keys(marketPrices).indexOf(key) }}
              >
                <div className="commodity-info">
                  <span className="commodity-name">{commodity.name}</span>
                  <span className="commodity-category">{commodity.category}</span>
                </div>
                <div className="commodity-price-area">
                  <span className="commodity-price">{commodity.price}cr</span>
                  <span className={`commodity-trend ${commodity.trend}`}>
                    {TREND_SYMBOLS[commodity.trend]}
                  </span>
                </div>
              </motion.div>
            ))}

            <div style={{
              marginTop: 'auto',
              paddingTop: 'var(--space-sm)',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '10px',
              color: 'var(--text-dim)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
            }}>
              PRICES UPDATE EVERY 45s
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
