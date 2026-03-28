// MarketPanel.jsx — Clean floating list overlay
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

const TREND_SYMBOLS = {
  up: '▲',
  down: '▼',
  stable: '—',
};

const getTrendColor = (trend) => {
  if (trend === 'up') return 'var(--status-up)';
  if (trend === 'down') return 'var(--status-down)';
  return 'var(--status-stable)';
};

export default function MarketPanel() {
  const marketPrices = useGameStore((s) => s.marketPrices);
  const marketOpen = useGameStore((s) => s.marketOpen);

  return (
    <AnimatePresence>
      {marketOpen && (
        <motion.div
          className="floating-market-overlay glass-panel"
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-label" style={{ marginBottom: '8px' }}>Live Market Data</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(marketPrices).map(([key, commodity]) => (
              <div className="market-row-minimal" key={key}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="text-value">{commodity.name}</span>
                  <span className="text-label" style={{ fontSize: '7px' }}>{commodity.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="text-label">{commodity.price}CR</span>
                  <span 
                    className="market-trend" 
                    style={{ color: getTrendColor(commodity.trend) }}
                  >
                    {TREND_SYMBOLS[commodity.trend]}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
