// EventBus.js — Shared event system between both layers
// Lightweight pub/sub event bus for cross-layer communication.

export const EVENTS = {
  TICK: 'TICK',
  PACKET_SOLD: 'PACKET_SOLD',
  JAM_DETECTED: 'JAM_DETECTED',
  JAM_CLEARED: 'JAM_CLEARED',
  MACHINE_OVERHEAT: 'MACHINE_OVERHEAT',
  MARKET_FLUCTUATION: 'MARKET_FLUCTUATION'
};

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const cbs = this.listeners.get(event);
    if (cbs) {
      this.listeners.set(event, cbs.filter((cb) => cb !== callback));
    }
  }

  once(event, callback) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    this.on(event, wrapper);
  }

  emit(event, data) {
    const cbs = this.listeners.get(event);
    if (cbs) {
      // Create a copy of the array so off() during emit doesn't skip listeners
      [...cbs].forEach((cb) => cb(data));
    }
  }
}

export default new EventBus();
