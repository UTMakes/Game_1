// LogicGates.js — AND/OR/NOT/XOR/LATCH gate logic
// Provides boolean logic gate evaluation for the control network layer.

// TODO: Implement logic gate evaluation functions
export const gates = {
  AND: (...inputs) => inputs.every(Boolean),
  OR: (...inputs) => inputs.some(Boolean),
  NOT: (input) => !input,
  XOR: (...inputs) => inputs.filter(Boolean).length === 1,
  LATCH: null, // TODO: Stateful latch implementation
};

export default gates;
