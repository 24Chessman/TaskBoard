// Card props: children, className (extra Tailwind classes).
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
    {children}
  </div>
);

export default Card;
