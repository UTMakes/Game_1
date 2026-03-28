// PacketsRenderer.jsx — Renders moving physical resources on the grid
import { useCallback } from 'react';
import useFactoryStore from '../../../store/factoryStore.js';
import { GRID } from '../../../config/GameConfig.js';
import { MATERIALS } from '../../../config/Recipes.js';

export default function PacketsRenderer() {
  const packets = useFactoryStore(s => s.packets);
  const jams = useFactoryStore(s => s.jams);
  const cellSize = GRID.CELL_SIZE;

  // Simple rendering of a packet as a small colored circle representing the resource
  const drawPacket = useCallback((g, packet, isJammed) => {
    g.clear();
    
    // Look up material data to get color, default to deep pink if missing
    const material = MATERIALS[packet.resourceType];
    const hexColorStr = material ? material.color.replace('#', '0x') : '0xFF00FF';
    const colorCode = parseInt(hexColorStr, 16);

    // Draw packet
    g.circle(0, 0, 8); // radius 8
    g.fill({ color: colorCode });
    g.stroke({ color: 0xFFFFFF, width: 1, alpha: 0.8 });

    // Draw jam indicator
    if (isJammed) {
      g.circle(0, 0, 12);
      g.stroke({ color: 0xFF0000, width: 2 });
      
      // Simple exclamation mark using lines
      g.moveTo(0, -16);
      g.lineTo(0, -6);
      g.stroke({ color: 0xFF0000, width: 3 });
      
      g.circle(0, -2, 1.5);
      g.fill({ color: 0xFF0000 });
    }
  }, []);

  return (
    <pixiContainer>
      {packets.map((pkt) => {
        // Find center of the grid cell
        const cx = pkt.x * cellSize + cellSize / 2;
        const cy = pkt.y * cellSize + cellSize / 2;
        
        // Find if this specific coordinate is jammed
        const isJammed = jams.some(j => j.x === pkt.x && j.y === pkt.y);

        return (
          <pixiGraphics 
            key={pkt.id}
            position={[cx, cy]}
            draw={(g) => drawPacket(g, pkt, isJammed)} 
          />
        );
      })}
    </pixiContainer>
  );
}
