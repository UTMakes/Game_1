// TilesRenderer.jsx — Renders physical tile blocks onto the grid
import { useCallback } from 'react';
import useFactoryStore from '../../../store/factoryStore.js';
import { GRID } from '../../../config/GameConfig.js';

export default function TilesRenderer() {
  const grid = useFactoryStore(s => s.grid);
  const cellSize = GRID.CELL_SIZE;

  const drawTile = useCallback((g, tile, x, y) => {
    g.clear();
    if (!tile) return;

    const cx = x * cellSize + cellSize / 2;
    const cy = y * cellSize + cellSize / 2;
    const half = cellSize / 2;

    switch (tile.type) {
      case 'source':
        g.moveTo(cx, cy - half + 8);
        g.lineTo(cx + half - 8, cy);
        g.lineTo(cx, cy + half - 8);
        g.lineTo(cx - half + 8, cy);
        g.lineTo(cx, cy - half + 8);
        g.fill({ color: 0x999999 });
        break;

      case 'conveyor':
        // A generic arrow / path pointing N, E, S, W
        // We'll draw an arrow pointing UP (North) by default, then rotate the container
        g.rect(cx - 8, cy - half + 10, 16, cellSize - 20);
        g.fill({ color: 0xEF9F27, alpha: 0.5 });
        // Arrow head
        g.moveTo(cx - 12, cy - half + 20);
        g.lineTo(cx + 12, cy - half + 20);
        g.lineTo(cx, cy - half + 8);
        g.lineTo(cx - 12, cy - half + 20);
        g.fill({ color: 0xEF9F27 });
        break;

      case 'machine':
        g.rect(cx - half + 4, cy - half + 4, cellSize - 8, cellSize - 8);
        g.fill({ color: 0x444455 });
        g.stroke({ color: 0x666677, width: 2 });
        // Draw inner gear icon or similar motif (just a smaller square for now)
        g.rect(cx - 8, cy - 8, 16, 16);
        g.fill({ color: tile.props.processing ? 0xFF5500 : 0x222222 });
        break;

      case 'output':
        g.rect(cx - half + 8, cy - half + 8, cellSize - 16, cellSize - 16);
        g.fill({ color: 0x2196F3 });
        g.stroke({ color: 0xFFFFFF, width: 2 });
        break;

      case 'splitter':
        // Fork shape
        g.moveTo(cx, cy + half - 8);
        g.lineTo(cx, cy);
        g.lineTo(cx - half + 8, cy - half + 8);
        g.moveTo(cx, cy);
        g.lineTo(cx + half - 8, cy - half + 8);
        g.stroke({ color: 0xEF9F27, width: 4 });
        break;

      case 'merger':
        // Y shape upside down
        g.moveTo(cx - half + 8, cy + half - 8);
        g.lineTo(cx, cy);
        g.lineTo(cx + half - 8, cy + half - 8);
        g.moveTo(cx, cy);
        g.lineTo(cx, cy - half + 8);
        g.stroke({ color: 0xEF9F27, width: 4 });
        break;

      case 'heatsink':
        // Snowlfake or cooler grille
        for(let i=1; i<4; i++) {
          g.moveTo(cx - half + 8, cy - half + i*16);
          g.lineTo(cx + half - 8, cy - half + i*16);
          g.stroke({ color: 0x4DD0E1, width: 3 });
        }
        break;
      
      default:
        // fallback generic box
        g.rect(cx - half + 10, cy - half + 10, cellSize - 20, cellSize - 20);
        g.fill({ color: 0xFF00FF });
    }

    // Heat Overlay
    if (tile.props.heat && tile.props.heat > 0) {
      g.rect(cx - half + 2, cy - half + 2, cellSize - 4, cellSize - 4);
      g.fill({ color: 0xFF0000, alpha: Math.min(tile.props.heat / 100, 0.8) });
    }
  }, [cellSize]);

  const rotationMap = { 'N': 0, 'E': Math.PI / 2, 'S': Math.PI, 'W': -Math.PI / 2 };

  return (
    <pixiContainer>
      {grid.map((tile, i) => {
        if (!tile) return null;
        const x = tile.x; // stored cleanly on tile object by GridEngine
        const y = tile.y;
        
        // Base center point for rotation
        const cx = x * cellSize + cellSize / 2;
        const cy = y * cellSize + cellSize / 2;

        return (
          <pixiContainer 
            key={`${x}-${y}-${tile.type}`}
            position={[cx, cy]}
            rotation={rotationMap[tile.direction] || 0}
          >
            {/* Translate back by -cx, -cy so the drawTile coordinates perfectly overlay */}
            <pixiGraphics 
              position={[-cx, -cy]}
              draw={(g) => drawTile(g, tile, x, y)} 
            />
          </pixiContainer>
        );
      })}
    </pixiContainer>
  );
}
