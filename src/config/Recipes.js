// Recipes.js — Resource chains and recipe definitions
// Three production chains from the GAME PLAN, each with multi-step crafting.

// ─── Raw Materials ───
export const RAW_MATERIALS = [
  'ore',
  'energy_crystal',
  'bio_matter',
];

// ─── All Materials (raw + intermediate + final) ───
export const MATERIALS = {
  // Chain 1: Metals → Electronics → Quantum
  ore:             { name: 'Ore',             category: 'Raw',         color: '#8B7355' },
  refined_metal:   { name: 'Refined Metal',   category: 'Metals',      color: '#B0B0B0' },
  circuit_board:   { name: 'Circuit Board',   category: 'Electronics', color: '#4CAF50' },
  processor_chip:  { name: 'Processor Chip',  category: 'Electronics', color: '#2196F3' },
  quantum_core:    { name: 'Quantum Core',    category: 'Quantum',     color: '#9C27B0' },

  // Chain 2: Energy
  energy_crystal:  { name: 'Energy Crystal',  category: 'Raw',         color: '#FFD700' },
  plasma_cell:     { name: 'Plasma Cell',     category: 'Energy',      color: '#FF6F00' },
  power_module:    { name: 'Power Module',    category: 'Energy',      color: '#E65100' },

  // Chain 3: Bio-Tech
  bio_matter:      { name: 'Bio Matter',      category: 'Raw',         color: '#66BB6A' },
  synthetic_fiber: { name: 'Synthetic Fiber', category: 'Bio-Tech',    color: '#26A69A' },
  nano_weave:      { name: 'Nano Weave',      category: 'Bio-Tech',    color: '#00897B' },
};

// ─── Recipes ───
// Each recipe: inputs → output, with processing time in ticks.
// `machineType` is the machine category needed (for future machine specialization).
export const RECIPES = [
  // Chain 1: Metals → Electronics → Quantum
  {
    id: 'smelt_ore',
    inputs: ['ore'],
    output: 'refined_metal',
    processingTicks: 4,
    machineType: 'smelter',
  },
  {
    id: 'assemble_circuit',
    inputs: ['refined_metal'],
    output: 'circuit_board',
    processingTicks: 6,
    machineType: 'assembler',
  },
  {
    id: 'fabricate_chip',
    inputs: ['circuit_board', 'refined_metal'],
    output: 'processor_chip',
    processingTicks: 10,
    machineType: 'fabricator',
  },
  {
    id: 'synthesize_quantum',
    inputs: ['processor_chip', 'plasma_cell'],
    output: 'quantum_core',
    processingTicks: 16,
    machineType: 'quantum_forge',
  },

  // Chain 2: Energy
  {
    id: 'refine_crystal',
    inputs: ['energy_crystal'],
    output: 'plasma_cell',
    processingTicks: 5,
    machineType: 'refinery',
  },
  {
    id: 'build_power_module',
    inputs: ['plasma_cell', 'refined_metal'],
    output: 'power_module',
    processingTicks: 8,
    machineType: 'assembler',
  },

  // Chain 3: Bio-Tech
  {
    id: 'process_bio',
    inputs: ['bio_matter'],
    output: 'synthetic_fiber',
    processingTicks: 5,
    machineType: 'bio_processor',
  },
  {
    id: 'weave_nano',
    inputs: ['synthetic_fiber', 'synthetic_fiber'],
    output: 'nano_weave',
    processingTicks: 10,
    machineType: 'nano_loom',
  },
];

// Lookup helper: find recipes that produce a given material
export function getRecipesForOutput(materialId) {
  return RECIPES.filter((r) => r.output === materialId);
}

// Lookup helper: find recipe by id
export function getRecipeById(recipeId) {
  return RECIPES.find((r) => r.id === recipeId);
}
