// SoundEngine.js — Singleton audio manager using Web Audio API
// All GRIDFLOW sounds are procedurally synthesized (no external files).
// Handles AudioContext lifecycle, master/category gains, and sound playback.

import { SOUND_DEFS } from './sounds.js';

class SoundEngine {
  constructor() {
    this.ctx = null;          // AudioContext — created on first user gesture
    this.masterGain = null;   // Master volume node
    this.categoryGains = {};  // { ui, factory, network, ambient } gain nodes
    this.activeLoops = {};    // Currently playing looping sounds
    this.initialized = false;
    this._masterVolume = 0.5;
    this._muted = false;
    this._categoryVolumes = {
      ui: 0.8,
      factory: 0.7,
      network: 0.7,
      ambient: 0.4,
    };
  }

  // ─── Lifecycle ───────────────────────────────────────────────

  /**
   * Initialize the AudioContext. Must be called from a user gesture (click/tap)
   * to comply with browser autoplay policies.
   */
  init() {
    if (this.initialized) return;

    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();

      // Master gain → destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._muted ? 0 : this._masterVolume;
      this.masterGain.connect(this.ctx.destination);

      // Category gain nodes → master
      const categories = ['ui', 'factory', 'network', 'ambient'];
      categories.forEach((cat) => {
        const gain = this.ctx.createGain();
        gain.gain.value = this._categoryVolumes[cat];
        gain.connect(this.masterGain);
        this.categoryGains[cat] = gain;
      });

      this.initialized = true;
    } catch (err) {
      console.warn('[SoundEngine] Web Audio API not supported:', err);
    }
  }

  /** Resume a suspended AudioContext (browsers suspend until user gesture). */
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ─── Volume Controls ────────────────────────────────────────

  setMasterVolume(v) {
    this._masterVolume = Math.max(0, Math.min(1, v));
    if (this.masterGain && !this._muted) {
      this.masterGain.gain.setTargetAtTime(this._masterVolume, this.ctx.currentTime, 0.02);
    }
  }

  setMuted(muted) {
    this._muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        muted ? 0 : this._masterVolume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  setCategoryVolume(category, v) {
    this._categoryVolumes[category] = Math.max(0, Math.min(1, v));
    const node = this.categoryGains[category];
    if (node) {
      node.gain.setTargetAtTime(this._categoryVolumes[category], this.ctx.currentTime, 0.02);
    }
  }

  // ─── Play Sounds ────────────────────────────────────────────

  /**
   * Play a one-shot or looping sound by name.
   * @param {string} name - Key from SOUND_DEFS (e.g. 'conveyorHum', 'machineClick')
   * @param {object} opts - Extra parameters passed to the sound generator
   *   Common opts: { tier, value, pan, speed, stressLevel }
   * @returns {object|null} Control handle for loops: { stop() }
   */
  play(name, opts = {}) {
    if (!this.initialized || !this.ctx) return null;

    // Resume if suspended
    this.resume();

    const def = SOUND_DEFS[name];
    if (!def) {
      console.warn(`[SoundEngine] Unknown sound: "${name}"`);
      return null;
    }

    const categoryGain = this.categoryGains[def.category] || this.masterGain;
    const result = def.generate(this.ctx, categoryGain, opts);
    return result || null;
  }

  /**
   * Start a named loop. If already running, does nothing.
   * @returns stop function
   */
  startLoop(name, opts = {}) {
    if (this.activeLoops[name]) return this.activeLoops[name];

    const handle = this.play(name, opts);
    if (handle && handle.stop) {
      this.activeLoops[name] = handle;
    }
    return handle;
  }

  /**
   * Stop a named loop gracefully.
   */
  stopLoop(name) {
    const loop = this.activeLoops[name];
    if (loop && loop.stop) {
      loop.stop();
    }
    delete this.activeLoops[name];
  }

  /**
   * Stop all active loops.
   */
  stopAllLoops() {
    Object.keys(this.activeLoops).forEach((name) => this.stopLoop(name));
  }
}

// Singleton export
const soundEngine = new SoundEngine();
export default soundEngine;
