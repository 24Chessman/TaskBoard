// Logo props: showWordmark (default true: the mark plus the word "TaskBoard"), size (height of the mark in px,
// default 28; the wordmark scales with it), tone ("default" | "light", default "default": "light" is a white mark
// with cobalt column outlines and a white wordmark, for use on the cobalt brand panel), className (extra classes for the wrapper).
// The mark (docs/design.md section 4): a cobalt square with two thin white column outlines and one small solid card
// straddling the gap between them, a task moving to the next column.
// With the wordmark the SVG is hidden from screen readers (the text is the name). Icon-only, the SVG has the name
// "TaskBoard" itself, so a link that wraps the Logo always has an accessible name. The Logo is not a link.
const tones = {
  default: { square: 'fill-brand', ink: 'stroke-white', card: 'fill-white', text: 'text-fg' },
  light: { square: 'fill-white', ink: 'stroke-brand', card: 'fill-brand', text: 'text-white' },
};

const Logo = ({ showWordmark = true, size = 28, tone = 'default', className = '' }) => {
  const colors = tones[tone] || tones.default;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        focusable="false"
        role={showWordmark ? undefined : 'img'}
        aria-label={showWordmark ? undefined : 'TaskBoard'}
        aria-hidden={showWordmark ? 'true' : undefined}
      >
        <rect width="32" height="32" rx="6" className={colors.square} />
        <rect x="6.5" y="7.5" width="8" height="17" rx="1.5" fill="none" strokeWidth="2" className={colors.ink} />
        <rect x="17.5" y="7.5" width="8" height="17" rx="1.5" fill="none" strokeWidth="2" className={colors.ink} />
        <rect x="10.5" y="14" width="11" height="7" rx="1.5" className={colors.card} />
      </svg>
      {showWordmark && (
        <span className={`font-semibold leading-none ${colors.text}`} style={{ fontSize: Math.round(size * 0.64) }}>
          TaskBoard
        </span>
      )}
    </span>
  );
};

export default Logo;
