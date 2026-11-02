// Logo props: showWordmark (default true: the mark plus the word "TaskBoard"), size (height of the mark in px,
// default 28; the wordmark scales with it), className (extra classes for the wrapper).
// The mark is an indigo rounded square holding three white bars of different heights, like kanban columns.
// With the wordmark the SVG is hidden from screen readers (the text is the name). Icon-only, the SVG has the name
// "TaskBoard" itself, so a link that wraps the Logo always has an accessible name. The Logo is not a link.
const Logo = ({ showWordmark = true, size = 28, className = '' }) => (
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
      <rect width="32" height="32" rx="8" className="fill-indigo-600" />
      <rect x="7" y="8" width="4.5" height="16" rx="2" className="fill-white" />
      <rect x="13.75" y="8" width="4.5" height="10" rx="2" className="fill-white" />
      <rect x="20.5" y="8" width="4.5" height="13" rx="2" className="fill-white" />
    </svg>
    {showWordmark && (
      <span className="font-semibold leading-none text-slate-900" style={{ fontSize: Math.round(size * 0.64) }}>
        TaskBoard
      </span>
    )}
  </span>
);

export default Logo;
