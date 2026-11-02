// Logo props: showWordmark (default true: the mark plus the word "TaskBoard"), size (height of the mark in px,
// default 28; the wordmark scales with it), tone ("default" | "light", default "default": "light" is a white mark
// with indigo bars and a white wordmark, for use on the indigo brand panel), className (extra classes for the wrapper).
// The mark is a rounded square holding three bars of different heights, like kanban columns.
// With the wordmark the SVG is hidden from screen readers (the text is the name). Icon-only, the SVG has the name
// "TaskBoard" itself, so a link that wraps the Logo always has an accessible name. The Logo is not a link.
const tones = {
  default: { square: 'fill-brand', bars: 'fill-white', text: 'text-slate-900' },
  light: { square: 'fill-white', bars: 'fill-brand', text: 'text-white' },
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
        <rect width="32" height="32" rx="8" className={colors.square} />
        <rect x="7" y="8" width="4.5" height="16" rx="2" className={colors.bars} />
        <rect x="13.75" y="8" width="4.5" height="10" rx="2" className={colors.bars} />
        <rect x="20.5" y="8" width="4.5" height="13" rx="2" className={colors.bars} />
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
