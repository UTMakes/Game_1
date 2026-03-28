import { useEffect, useRef, useState } from 'react';
import { Application, extend } from '@pixi/react';
import { Container, Graphics } from 'pixi.js';
import { GRID } from '../config/GameConfig.js';

import GridRenderer from '../layers/factory/renderers/GridRenderer.jsx';
import TilesRenderer from '../layers/factory/renderers/TilesRenderer.jsx';
import PacketsRenderer from '../layers/factory/renderers/PacketsRenderer.jsx';

// Register pixi elements for React
extend({ Container, Graphics });

export default function FactoryFloor() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);

  // Resize canvas to fit available layout area while enforcing aspect ratio logic or just centering
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });

        // Calculate scale to fit the 12x8 grid inside the view
        const targetWidth = GRID.WIDTH * GRID.CELL_SIZE;
        const targetHeight = GRID.HEIGHT * GRID.CELL_SIZE;

        const scaleX = clientWidth / targetWidth;
        const scaleY = clientHeight / targetHeight;
        
        // Fit within view with padding (e.g. 0.95 multiplier)
        setScale(Math.min(scaleX, scaleY) * 0.95);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute offset to center the grid
  const offsetX = (dimensions.width - (GRID.WIDTH * GRID.CELL_SIZE * scale)) / 2;
  const offsetY = (dimensions.height - (GRID.HEIGHT * GRID.CELL_SIZE * scale)) / 2;

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      // Prevent standard browser context menu so we can use Right-Click to destroy
      onContextMenu={(e) => e.preventDefault()}
    >
      <Application 
        width={dimensions.width} 
        height={dimensions.height} 
        backgroundAlpha={0}
        antialias={true}
      >
        <pixiContainer x={offsetX} y={offsetY} scale={scale}>
          <GridRenderer width={GRID.WIDTH * GRID.CELL_SIZE} height={GRID.HEIGHT * GRID.CELL_SIZE} />
          <TilesRenderer />
          <PacketsRenderer />
        </pixiContainer>
      </Application>
    </div>
  );
}

