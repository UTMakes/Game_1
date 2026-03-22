// sounds.js — Procedural sound definitions for GRIDFLOW
// Each sound is synthesized in real-time using the Web Audio API.
// No external audio files needed.

/**
 * Helper: create a simple envelope (attack → sustain → release) on a gain node.
 */
function envelope(ctx, gainNode, { attack = 0.01, sustain = 0.1, release = 0.1, peak = 1 } = {}) {
  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(peak, now + attack);
  gainNode.gain.setValueAtTime(peak, now + attack + sustain);
  gainNode.gain.linearRampToValueAtTime(0, now + attack + sustain + release);
  return attack + sustain + release;
}

/**
 * Helper: create white noise buffer.
 */
function createNoiseBuffer(ctx, duration = 0.5) {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// ─── Sound Definitions ───────────────────────────────────────────

export const SOUND_DEFS = {

  // ── UI Sounds ──────────────────────────────────────────────

  /** Tiny noise pop for button clicks */
  uiClick: {
    category: 'ui',
    generate(ctx, destination) {
      const gain = ctx.createGain();
      gain.connect(destination);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 1800;
      osc.connect(gain);

      const dur = envelope(ctx, gain, { attack: 0.003, sustain: 0.02, release: 0.05, peak: 0.3 });
      osc.start();
      osc.stop(ctx.currentTime + dur);
    },
  },

  /** Rising two-note chime when credits are earned */
  creditEarn: {
    category: 'ui',
    generate(ctx, destination) {
      const gain = ctx.createGain();
      gain.connect(destination);

      const now = ctx.currentTime;

      // First note
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 880;
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0, now);
      g1.gain.linearRampToValueAtTime(0.25, now + 0.01);
      g1.gain.linearRampToValueAtTime(0, now + 0.15);
      osc1.connect(g1).connect(gain);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Second note (higher, slightly delayed)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 1320;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0, now + 0.08);
      g2.gain.linearRampToValueAtTime(0.2, now + 0.1);
      g2.gain.linearRampToValueAtTime(0, now + 0.3);
      osc2.connect(g2).connect(gain);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.3);
    },
  },

  // ── Factory Sounds ─────────────────────────────────────────

  /**
   * Conveyor hum — low-frequency loop, pitch scales with belt speed.
   * opts.speed: 0.5–2.0 (default 1.0)
   * Returns { stop(), setSpeed(s) }
   */
  conveyorHum: {
    category: 'factory',
    generate(ctx, destination, opts = {}) {
      const speed = opts.speed || 1.0;
      const baseFreq = 55; // Low A

      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      gain.connect(destination);

      // Primary oscillator
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = baseFreq * speed;

      // Low-pass filter to keep it a hum not a buzz
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 200;
      lp.Q.value = 1;

      osc.connect(lp).connect(gain);

      // Subtle second harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = baseFreq * speed * 2;
      const g2 = ctx.createGain();
      g2.gain.value = 0.05;
      osc2.connect(g2).connect(gain);

      // Fade in
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);

      osc.start();
      osc2.start();

      return {
        stop() {
          const t = ctx.currentTime;
          gain.gain.setTargetAtTime(0, t, 0.3);
          setTimeout(() => {
            try { osc.stop(); osc2.stop(); } catch { /* already stopped */ }
          }, 1500);
        },
        setSpeed(s) {
          osc.frequency.setTargetAtTime(baseFreq * s, ctx.currentTime, 0.1);
          osc2.frequency.setTargetAtTime(baseFreq * s * 2, ctx.currentTime, 0.1);
        },
      };
    },
  },

  /**
   * Machine processing click — changes character per tier.
   * opts.tier: 1 (basic), 2 (advanced), 3 (quantum)
   */
  machineClick: {
    category: 'factory',
    generate(ctx, destination, opts = {}) {
      const tier = opts.tier || 1;
      const gain = ctx.createGain();
      gain.connect(destination);

      if (tier === 1) {
        // ── Basic: mechanical clunk ──
        // Short noise burst through low-pass filter
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, 0.08);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 600;
        lp.Q.value = 5;
        noise.connect(lp).connect(gain);
        envelope(ctx, gain, { attack: 0.002, sustain: 0.02, release: 0.06, peak: 0.4 });
        noise.start();
      } else if (tier === 2) {
        // ── Advanced: electronic beep ──
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 1400;
        osc.connect(gain);
        const dur = envelope(ctx, gain, { attack: 0.005, sustain: 0.04, release: 0.08, peak: 0.3 });
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } else {
        // ── Quantum: deep synthesized tone with sweep ──
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
        osc.connect(gain);

        // Add subtle reverb-like tail with second detuned osc
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(223, now);
        osc2.frequency.exponentialRampToValueAtTime(112, now + 0.35);
        const g2 = ctx.createGain();
        g2.gain.value = 0.15;
        osc2.connect(g2).connect(gain);

        const dur = envelope(ctx, gain, { attack: 0.01, sustain: 0.1, release: 0.25, peak: 0.35 });
        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + dur + 0.1);
        osc2.stop(ctx.currentTime + dur + 0.15);
      }
    },
  },

  /**
   * Output delivery chime — satisfying harmonic, pitch varies with value.
   * opts.value: packet credit value (higher = higher pitch). Default 100.
   */
  outputChime: {
    category: 'factory',
    generate(ctx, destination, opts = {}) {
      const value = opts.value || 100;
      // Map value (20–800 range) to a pitch multiplier
      const pitchMult = 0.8 + Math.min(value, 800) / 800;
      const baseFreq = 660 * pitchMult;

      const gain = ctx.createGain();
      gain.connect(destination);

      const now = ctx.currentTime;

      // Fundamental
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = baseFreq;
      const g1 = ctx.createGain();
      g1.connect(gain);
      osc1.connect(g1);

      // Perfect fifth harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = baseFreq * 1.5;
      const g2 = ctx.createGain();
      g2.gain.value = 0.6;
      g2.connect(gain);
      osc2.connect(g2);

      // Envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    },
  },

  // ── Network Sounds ─────────────────────────────────────────

  /**
   * Network signal blip — short sawtooth with stereo pan.
   * opts.pan: -1 (left) to 1 (right), default 0
   */
  networkBlip: {
    category: 'network',
    generate(ctx, destination, opts = {}) {
      const pan = opts.pan || 0;

      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      gain.connect(panner).connect(destination);

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 2400;

      // High-pass to make it crisp
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1800;
      osc.connect(hp).connect(gain);

      const dur = envelope(ctx, gain, { attack: 0.003, sustain: 0.03, release: 0.06, peak: 0.2 });
      osc.start();
      osc.stop(ctx.currentTime + dur);
    },
  },

  /**
   * Alarm node trigger — tense pulsing low buzz.
   * Returns { stop() }
   */
  alarmBuzz: {
    category: 'network',
    generate(ctx, destination) {
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(destination);

      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 120;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 300;
      osc.connect(lp).connect(gain);

      // LFO for pulsing amplitude
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 4; // 4Hz pulse
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.15;
      lfo.connect(lfoGain).connect(gain.gain);

      // Fade in
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);

      osc.start();
      lfo.start();

      return {
        stop() {
          const t = ctx.currentTime;
          gain.gain.setTargetAtTime(0, t, 0.1);
          setTimeout(() => {
            try { osc.stop(); lfo.stop(); } catch { /* already stopped */ }
          }, 600);
        },
      };
    },
  },

  // ── Ambient ────────────────────────────────────────────────

  /**
   * Space station ambient drone — layered detuned sines + filtered noise.
   * Reacts to stress level: opts.stressLevel 0–1 (default 0, calm).
   * Returns { stop(), setStress(level) }
   */
  ambientDrone: {
    category: 'ambient',
    generate(ctx, destination, opts = {}) {
      const stress = opts.stressLevel || 0;

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0;
      masterGain.connect(destination);

      // Base drone: two detuned sine oscillators (deep pad)
      const drone1 = ctx.createOscillator();
      drone1.type = 'sine';
      drone1.frequency.value = 55;
      const g1 = ctx.createGain();
      g1.gain.value = 0.15;
      drone1.connect(g1).connect(masterGain);

      const drone2 = ctx.createOscillator();
      drone2.type = 'sine';
      drone2.frequency.value = 55.5; // Slight detune for warmth
      const g2 = ctx.createGain();
      g2.gain.value = 0.12;
      drone2.connect(g2).connect(masterGain);

      // Higher harmonic that increases with stress
      const drone3 = ctx.createOscillator();
      drone3.type = 'sawtooth';
      drone3.frequency.value = 110;
      const g3 = ctx.createGain();
      g3.gain.value = 0.02 + stress * 0.08;
      const lp3 = ctx.createBiquadFilter();
      lp3.type = 'lowpass';
      lp3.frequency.value = 200 + stress * 400;
      drone3.connect(lp3).connect(g3).connect(masterGain);

      // Filtered noise layer (air/hiss)
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 4);
      noise.loop = true;
      const noiseLp = ctx.createBiquadFilter();
      noiseLp.type = 'lowpass';
      noiseLp.frequency.value = 300 + stress * 600;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.03 + stress * 0.04;
      noise.connect(noiseLp).connect(noiseGain).connect(masterGain);

      // Slow fade in
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 2.0);

      drone1.start();
      drone2.start();
      drone3.start();
      noise.start();

      return {
        stop() {
          const t = ctx.currentTime;
          masterGain.gain.setTargetAtTime(0, t, 0.8);
          setTimeout(() => {
            try {
              drone1.stop(); drone2.stop(); drone3.stop(); noise.stop();
            } catch { /* already stopped */ }
          }, 4000);
        },
        setStress(level) {
          const s = Math.max(0, Math.min(1, level));
          g3.gain.setTargetAtTime(0.02 + s * 0.08, ctx.currentTime, 0.5);
          lp3.frequency.setTargetAtTime(200 + s * 400, ctx.currentTime, 0.5);
          noiseGain.gain.setTargetAtTime(0.03 + s * 0.04, ctx.currentTime, 0.5);
          noiseLp.frequency.setTargetAtTime(300 + s * 600, ctx.currentTime, 0.5);
        },
      };
    },
  },
};
