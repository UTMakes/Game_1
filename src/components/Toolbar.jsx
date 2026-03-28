// Toolbar.jsx — Floating frosted pill toolbar at bottom
import { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import useFactoryStore from '../store/factoryStore';
import useNetworkStore from '../store/networkStore';
import useAudioStore from '../store/audioStore';
import soundEngine from '../audio/SoundEngine';

export default function Toolbar() {
  const activeLayer = useGameStore((s) => s.activeLayer);
  const toggleLayer = useGameStore((s) => s.toggleLayer);

  const factoryTools = useFactoryStore((s) => s.tools);
  const selectedTool = useFactoryStore((s) => s.selectedTool);
  const setSelectedTool = useFactoryStore((s) => s.setSelectedTool);
  const selectedDirection = useFactoryStore((s) => s.selectedDirection);
  const rotateSelectedDirection = useFactoryStore((s) => s.rotateSelectedDirection);

  const networkTools = useNetworkStore((s) => s.tools);
  const selectedNodeType = useNetworkStore((s) => s.selectedNodeType);
  const setSelectedNodeType = useNetworkStore((s) => s.setSelectedNodeType);

  const audioReady = useAudioStore((s) => s.audioReady);

  const isFactory = activeLayer === 'factory';
  const tools = isFactory ? factoryTools : networkTools;
  const selected = isFactory ? selectedTool : selectedNodeType;
  const setSelected = isFactory ? setSelectedTool : setSelectedNodeType;

  // Global keydown listeners for toolbar actions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        if (isFactory) {
          rotateSelectedDirection();
          if (audioReady) soundEngine.play('uiClick');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFactory, rotateSelectedDirection, audioReady]);

  const handleToggleLayer = () => {
    if (audioReady) soundEngine.play('uiClick');
    toggleLayer();
  };

  const handleSelectTool = (id) => {
    if (audioReady && id !== selected) soundEngine.play('uiClick');
    setSelected(id);
  };

  const dirArrow = { 'N': '↑', 'E': '→', 'S': '↓', 'W': '←' };

  return (
    <div className="floating-toolbar-dock glass-pill">
      
      {/* ─── Layer Toggle Pill ─── */}
      <button className="toolbar-layer-toggle" onClick={handleToggleLayer}>
        <span className={`toggle-mode ${isFactory ? 'active factory' : ''}`}>FACTORY</span>
        <span style={{ margin: '0 4px', opacity: 0.3 }}>/</span>
        <span className={`toggle-mode ${!isFactory ? 'active network' : ''}`}>NETWORK</span>
      </button>

      <div className="toolbar-divider"></div>

      {/* ─── Tool List ─── */}
      <div className="tool-list">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`minimal-tool-btn ${selected === tool.id ? `active ${activeLayer}` : ''}`}
            onClick={() => handleSelectTool(tool.id)}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* ─── Rotation Indicator (Factory Only) ─── */}
      {isFactory && (
        <>
          <div className="toolbar-divider"></div>
          <div className="rotation-indicator" title="Press 'R' to rotate placement direction" style={{ padding: '0 12px', opacity: 0.7, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>DIR:</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{dirArrow[selectedDirection]}</span>
          </div>
        </>
      )}
    </div>
  );
}
