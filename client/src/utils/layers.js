// A tiny stack of the overlays that are open right now (modals, drawers, dropdown menus).
// Each overlay registers itself while open. Pressing Esc must close ONLY the top one, so every overlay asks
// isTopLayer(id) before reacting to Esc.
const stack = [];

// Adds a layer on top; returns a function that removes it
export const registerLayer = (id) => {
  stack.push(id);
  return () => {
    const index = stack.lastIndexOf(id);
    if (index !== -1) stack.splice(index, 1);
  };
};

export const isTopLayer = (id) => stack.length > 0 && stack[stack.length - 1] === id;

// Number of open layers (used by tests)
export const layerCount = () => stack.length;
