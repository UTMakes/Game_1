// SignalEngine.worker.js — Web Worker entry point (workers directory)
// Re-exports from layers/network for clean import paths.
// Usage: new Worker(new URL('./workers/SignalEngine.worker.js', import.meta.url))

export { default } from '../layers/network/SignalEngine.worker.js';
