// GridRenderer.jsx — Renders the static base grid and captures clicks
import { useCallback } from 'react';
import { GRID } from '../../../config/GameConfig.js';
import useFactoryStore from '../../../store/factoryStore.js';

export default function GridRenderer({ width, height }) {
  const cellSize = GRID.CELL_SIZE;
  const placeTile = useFactoryStore(s => s.placeTile);
  const selectedTool = useFactoryStore(s => s.selectedTool);
  const removeTile = useFactoryStore(s => s.removeTile);

  const drawGrid = useCallback((g) => {
    g.clear();
    
    // Draw background color (faint)
    g.rect(0, 0, width, height);
    g.fill({ color: 0x0A0A0F, alpha: 0.8 });

    // Draw grid lines
    const numCols = GRID.WIDTH;
    const numRows = GRID.HEIGHT;

    for (let x = 0; x <= numCols; x++) {
      g.moveTo(x * cellSize, 0);
      g.lineTo(x * cellSize, numRows * cellSize);
      g.stroke({ color: 0x222233, width: 1 });
    }

    for (let y = 0; y <= numRows; y++) {
      g.moveTo(0, y * cellSize);
      g.lineTo(numCols * cellSize, y * cellSize);
      g.stroke({ color: 0x222233, width: 1 });
    }
    
    // Make the entire grid interactive
    g.eventMode = 'static';
    g.cursor = 'pointer';
  }, [width, height, cellSize]);

  const handlePointerDown = (e) => {
    const localPos = e.data.getLocalPosition(e.currentTarget);
    const gridX = Math.floor(localPos.x / cellSize);
    const gridY = Math.floor(localPos.y / cellSize);

    if (gridX < 0 || gridX >= GRID.WIDTH || gridY < 0 || gridY >= GRID.HEIGHT) return;

    // Right click (button 2) removes, left click places
    if (e.data.button === 2) {
      removeTile(gridX, gridY);
    } else {
      const dir = useFactoryStore.getState().selectedDirection;
      placeTile(gridX, gridY, selectedTool, dir);
    }
  };

  return (
    <pixiGraphics 
      draw={drawGrid} 
      pointerdown={handlePointerDown}
      // Prevent browser context menu on right click so we can use it to delete tiles
      rightclick={(e) => {
        // We handle logic in pointerdown, so just prevent default here if needed
      }}
    />
  );
}
