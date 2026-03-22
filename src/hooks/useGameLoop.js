// useGameLoop.js — React hook to manage the TickEngine worker
import { useEffect, useRef } from 'react';
import * as Comlink from 'comlink';

import useGameStore from '../store/gameStore.js';
import useFactoryStore, { engine as mainThreadEngine } from '../store/factoryStore.js';
import EventBus, { EVENTS } from '../bridge/EventBus.js';
import { TICK, MARKET } from '../config/GameConfig.js';

export function useGameLoop() {
  const workerRef = useRef(null);
  const engineProxyRef = useRef(null);
  const loopIdRef = useRef(null);
  const lastTickTimeRef = useRef(0);

  // Grab store vars safely via refs or subscribe so the hook doesn't re-execute on every frame
  useEffect(() => {
    // 1. Initialize Web Worker
    workerRef.current = new Worker(new URL('../layers/factory/TickEngine.worker.js', import.meta.url), { type: 'module' });
    engineProxyRef.current = Comlink.wrap(workerRef.current);

    // Initial sync of the grid
    const startWorker = async () => {
      await engineProxyRef.current.init(mainThreadEngine.exportState());
    };
    startWorker();

    return () => {
      // Cleanup worker on unmount
      if (loopIdRef.current) cancelAnimationFrame(loopIdRef.current);
      workerRef.current.terminate();
    };
  }, []);

  // Subscribe to changes in the main thread's grid so we can send updates to worker
  useEffect(() => {
    const unsub = useFactoryStore.subscribe(
      (state) => state.grid,
      (grid) => {
        if (engineProxyRef.current) {
          engineProxyRef.current.updateGrid(grid);
        }
      }
    );
    return unsub;
  }, []);

  // Main tick loop
  useEffect(() => {
    const tickLoop = async (timestamp) => {
      const state = useGameStore.getState();
      
      if (state.running) {
        // Calculate dynamic tick delay based on currently selected speed
        const currentTickDelay = TICK.RATE_MS / state.speed;

        if (timestamp - lastTickTimeRef.current >= currentTickDelay) {
          lastTickTimeRef.current = timestamp;

          if (engineProxyRef.current) {
            // Ask worker to process one tick
            const result = await engineProxyRef.current.tick();

            // 1. Update Factory Store (packets, jams, heat)
            useFactoryStore.getState().syncFromTick(result);
            
            // 2. Increment game tick
            const newTick = state.tick + 1;
            useGameStore.getState().setTick(newTick);
            
            // 3. Handle events emitted from worker
            if (result.events && result.events.length > 0) {
              result.events.forEach(evt => {
                EventBus.emit(evt.type, evt.payload);
              });
            }

            // 4. Market Fluctuation
            if (newTick % MARKET.FLUCTUATION_INTERVAL_TICKS === 0) {
              useGameStore.getState().fluctuateMarket();
              EventBus.emit(EVENTS.MARKET_FLUCTUATION, null);
            }
          }
        }
      }

      loopIdRef.current = requestAnimationFrame(tickLoop);
    };

    loopIdRef.current = requestAnimationFrame(tickLoop);
    return () => cancelAnimationFrame(loopIdRef.current);
  }, []); // Empty deps so it sets up once. Uses getState() internally to read fresh state.

}
