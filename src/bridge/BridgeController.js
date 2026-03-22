// BridgeController.js — Links factory tile state ↔ network node signals
// The bridge between both layers: translates factory events into network
// signals and network commands into factory actions.

import EventBus, { EVENTS } from './EventBus.js';
import useGameStore from '../store/gameStore.js';

export class BridgeController {
  constructor() {
    this.setupListeners();
  }

  setupListeners() {
    EventBus.on(EVENTS.PACKET_SOLD, this.handlePacketSold.bind(this));
    EventBus.on(EVENTS.JAM_DETECTED, this.handleJamDetected.bind(this));
  }

  handlePacketSold(payload) {
    // payload: { resourceType, amount }
    // Add credits to the player's bank
    useGameStore.getState().addCredits(payload.amount);
    // Optionally log this if it's a rare/valuable item
    if (payload.amount > 100) {
      useGameStore.getState().logEvent(`Sold ${payload.resourceType} for ${payload.amount}cr`);
    }
  }

  handleJamDetected(payload) {
    // payload: { x, y }
    useGameStore.getState().logEvent(`Jam detected at (${payload.x}, ${payload.y})`);
    
    // TODO: Relay this jam event to any Alarm Nodes attached to this tile in the network layer
  }
  
  // Call this when cleaning up the app to prevent memory leaks
  destroy() {
    EventBus.off(EVENTS.PACKET_SOLD, this.handlePacketSold);
    EventBus.off(EVENTS.JAM_DETECTED, this.handleJamDetected);
  }
}

// Singleton instance ready to use
export default new BridgeController();
