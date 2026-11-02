// Small hand-authored SVG illustrations for empty states and the 403/404 pages. Each one is a named export that
// takes className, is drawn in flat lines with one cobalt fill (plus one small warm accent on two of them) over
// neutral greys, and is aria-hidden. They are passed to EmptyState through its `art` prop.
const Frame = ({ className = '', children }) => (
  <svg
    viewBox="0 0 160 112"
    width="160"
    height="112"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    {children}
  </svg>
);

const line = { className: 'stroke-fg-muted', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

// No projects yet: an empty board with a card waiting to be placed
export const NoProjectsArt = ({ className }) => (
  <Frame className={className}>
    <rect x="14" y="14" width="40" height="84" rx="6" {...line} />
    <rect x="60" y="14" width="40" height="84" rx="6" {...line} strokeDasharray="5 5" />
    <rect x="106" y="14" width="40" height="84" rx="6" {...line} />
    <rect x="20" y="22" width="28" height="14" rx="3" className="fill-surface-muted" />
    <g transform="rotate(-5 80 58)">
      <rect x="64" y="46" width="32" height="20" rx="4" className="fill-brand" />
      <rect x="69" y="52" width="16" height="3" rx="1.5" fill="white" />
    </g>
  </Frame>
);

// No search results: a magnifier over empty cards
export const NoResultsArt = ({ className }) => (
  <Frame className={className}>
    <rect x="18" y="18" width="70" height="22" rx="4" className="fill-surface-muted" />
    <rect x="18" y="48" width="70" height="22" rx="4" className="fill-surface-muted" />
    <circle cx="94" cy="62" r="22" className="stroke-brand" strokeWidth="3" />
    <path d="M110 78l18 18" className="stroke-brand" strokeWidth="3" strokeLinecap="round" />
    <path d="M86 62h16" {...line} />
  </Frame>
);

// No activity yet: a timeline line with empty marks
export const NoActivityArt = ({ className }) => (
  <Frame className={className}>
    <path d="M44 14v84" {...line} />
    <circle cx="44" cy="28" r="8" className="fill-surface stroke-fg-muted" strokeWidth="2" />
    <circle cx="44" cy="56" r="8" className="fill-surface stroke-fg-muted" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="44" cy="84" r="8" className="fill-brand" />
    <rect x="62" y="23" width="62" height="10" rx="3" className="fill-surface-muted" />
    <rect x="62" y="51" width="44" height="10" rx="3" className="fill-surface-muted" />
    <rect x="62" y="79" width="54" height="10" rx="3" className="fill-surface-muted" />
  </Frame>
);

// 404: a card that fell between two columns, with a warm flag
export const NotFoundArt = ({ className }) => (
  <Frame className={className}>
    <rect x="14" y="14" width="46" height="84" rx="6" {...line} />
    <rect x="100" y="14" width="46" height="84" rx="6" {...line} />
    <g transform="rotate(14 80 62)">
      <rect x="62" y="44" width="36" height="24" rx="4" className="fill-brand" />
      <rect x="68" y="51" width="18" height="3" rx="1.5" fill="white" />
      <path d="M90 44v-9l8 4.5z" className="fill-warning" />
    </g>
    <path d="M70 86h20" className="stroke-fg-muted" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6" />
  </Frame>
);

// 403: a column behind a closed lock
export const ForbiddenArt = ({ className }) => (
  <Frame className={className}>
    <rect x="30" y="14" width="46" height="84" rx="6" {...line} />
    <rect x="34" y="22" width="38" height="14" rx="3" className="fill-surface-muted" />
    <rect x="88" y="52" width="44" height="36" rx="6" className="fill-brand" />
    <path d="M97 52v-9a13 13 0 0126 0v9" className="stroke-brand" strokeWidth="3" strokeLinecap="round" />
    <circle cx="110" cy="68" r="4" fill="white" />
    <path d="M110 70v8" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </Frame>
);
