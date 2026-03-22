// audioStore.js — Zustand store for audio settings (volume, mute, categories)
import { create } from 'zustand';
import soundEngine from '../audio/SoundEngine.js';

const useAudioStore = create((set, get) => ({
  masterVolume: 0.5,
  muted: false,
  audioReady: false,    // true once AudioContext is initialized
  audioControlsOpen: false,

  categoryVolumes: {
    ui: 0.8,
    factory: 0.7,
    network: 0.7,
    ambient: 0.4,
  },

  /**
   * Initialize the SoundEngine (must be called from a user gesture).
   */
  initAudio: () => {
    soundEngine.init();
    set({ audioReady: true });
  },

  setMasterVolume: (v) => {
    soundEngine.setMasterVolume(v);
    set({ masterVolume: v });
  },

  toggleMute: () => {
    const muted = !get().muted;
    soundEngine.setMuted(muted);
    set({ muted });
  },

  setCategoryVolume: (category, v) => {
    soundEngine.setCategoryVolume(category, v);
    set((state) => ({
      categoryVolumes: { ...state.categoryVolumes, [category]: v },
    }));
  },

  toggleAudioControls: () => set((state) => ({
    audioControlsOpen: !state.audioControlsOpen,
  })),

  setAudioControlsOpen: (open) => set({ audioControlsOpen: open }),
}));

export default useAudioStore;
