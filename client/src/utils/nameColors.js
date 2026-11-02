// Picks a soft colour for a name, the same colour every time (avatars and project avatars).
// Each entry is a soft background with dark text of the same hue (-100 background, -800 text), chosen so the
// initials stay readable. The class names are written out in full so Tailwind can see them.
const NAME_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-sky-100 text-sky-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
  'bg-cyan-100 text-cyan-800',
  'bg-teal-100 text-teal-800',
  'bg-orange-100 text-orange-800',
];

export const NAME_COLOR_CLASSES = NAME_COLORS;

// A small, stable string hash (djb2): the same name always gives the same number
const hashName = (name) => {
  let hash = 5381;
  for (const character of name) hash = ((hash << 5) + hash + character.charCodeAt(0)) >>> 0;
  return hash;
};

// "Ada Lovelace" -> one of the colour classes; an empty name gets the neutral colour
export const colorForName = (name) => {
  const clean = String(name ?? '').trim().toLowerCase();
  if (!clean) return 'bg-surface-muted text-fg-secondary';
  return NAME_COLORS[hashName(clean) % NAME_COLORS.length];
};
