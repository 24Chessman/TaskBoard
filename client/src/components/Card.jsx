// Card props: children, className (extra Tailwind classes), hoverable (raises the shadow on hover; use it for
// cards that are links or buttons), plus any native div props. A white panel with a thin 1px border and
// rounded-lg corners. Do not put a Card inside another Card.
const Card = ({ children, className = '', hoverable = false, ...rest }) => (
  <div
    className={`rounded-lg border border-line bg-surface p-4 shadow-sm ${hoverable ? 'transition-shadow hover:shadow-md' : ''} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
