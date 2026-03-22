// Toolbar.jsx — Tile/node picker, layer toggle
import useGameStore from '../store/gameStore';
import useFactoryStore from '../store/factoryStore';
import useNetworkStore from '../store/networkStore';

export default function Toolbar() {
  const activeLayer = useGameStore((s) => s.activeLayer);
  const toggleLayer = useGameStore((s) => s.toggleLayer);

  const factoryTools = useFactoryStore((s) => s.tools);
  const selectedTool = useFactoryStore((s) => s.selectedTool);
  const setSelectedTool = useFactoryStore((s) => s.setSelectedTool);

  const networkTools = useNetworkStore((s) => s.tools);
  const selectedNodeType = useNetworkStore((s) => s.selectedNodeType);
  const setSelectedNodeType = useNetworkStore((s) => s.setSelectedNodeType);

  const isFactory = activeLayer === 'factory';
  const tools = isFactory ? factoryTools : networkTools;
  const selected = isFactory ? selectedTool : selectedNodeType;
  const setSelected = isFactory ? setSelectedTool : setSelectedNodeType;

  return (
    <div className="toolbar" id="toolbar-bar">
      {/* Layer Toggle */}
      <button
        className={`layer-toggle-btn ${isFactory ? 'factory-active' : 'network-active'}`}
        onClick={toggleLayer}
        id="layer-toggle"
        title={`Switch to ${isFactory ? 'Network' : 'Factory'} layer`}
      >
        <div className="toggle-indicator">
          <div className={`toggle-dot ${isFactory ? '' : 'network'}`}></div>
        </div>
        <span>{isFactory ? 'FACTORY' : 'NETWORK'}</span>
      </button>

      <div className="toolbar-divider"></div>

      {/* Tool Buttons */}
      <div className="toolbar-section" id="tool-picker">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-btn ${selected === tool.id ? 'active' : ''} ${!isFactory ? 'network-tool' : ''}`}
            onClick={() => setSelected(tool.id)}
            id={`tool-${tool.id}`}
            title={tool.label}
          >
            <span className="tool-btn-icon">{tool.icon}</span>
            <span className="tool-btn-label">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
