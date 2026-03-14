// TickEngine.worker.js — Web Worker entry point (workers directory)
// Re-exports from layers/factory for clean import paths.
// Usage: new Worker(new URL('./workers/TickEngine.worker.js', import.meta.url))

export { default } from '../layers/factory/TickEngine.worker.js';
