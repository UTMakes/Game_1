// TickEngine.worker.js — Web Worker: packet movement, heat, jam detection
// Runs the factory simulation tick loop off the main thread via Comlink.
// Handles resource packet movement along conveyors, heat accumulation,
// and jam/failure detection.

import { expose } from 'comlink';

const tickEngine = {
  // TODO: Implement tick loop, packet movement, heat, jam detection
  tick() {},
};

expose(tickEngine);
