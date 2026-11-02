// MoveCardArt props: className. A hand-authored SVG for the closing section: a task card on its way from one
// column into the Done column. Flat line plus one cobalt fill, neutral greys, and one small warm accent (the
// flag on the card). Decorative only: aria-hidden, no text, no external files.
const MoveCardArt = ({ className = '' }) => (
  <svg viewBox="0 0 360 220" fill="none" aria-hidden="true" focusable="false" className={className}>
    <rect x="12" y="16" width="100" height="188" rx="8" className="stroke-fg-muted" strokeWidth="2" />
    <rect x="130" y="16" width="100" height="188" rx="8" className="stroke-fg-muted" strokeWidth="2" strokeDasharray="6 6" />
    <rect x="248" y="16" width="100" height="188" rx="8" className="stroke-fg-muted" strokeWidth="2" />
    <rect x="24" y="30" width="76" height="34" rx="6" className="fill-surface-muted" />
    <rect x="24" y="74" width="76" height="34" rx="6" className="fill-surface-muted" />
    <rect x="260" y="30" width="76" height="34" rx="6" className="fill-surface-muted" />
    <path d="M272 47l6 6 12-12" className="stroke-fg-muted" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M100 122c24-4 44-4 66 0" className="stroke-brand" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 7" />
    <g transform="rotate(-4 200 128)">
      <rect x="150" y="104" width="100" height="48" rx="8" className="fill-brand" />
      <rect x="162" y="118" width="48" height="6" rx="3" fill="white" />
      <rect x="162" y="132" width="30" height="6" rx="3" fill="white" fillOpacity="0.6" />
      <path d="M232 112v14l8-5z" className="fill-warning" />
    </g>
  </svg>
);

export default MoveCardArt;
