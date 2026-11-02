// Badge props: variant (neutral | primary | success | warning | danger | info, default neutral),
// icon (a lucide icon component, optional, drawn at 12px), className, children (the text label).
// The lozenge style from docs/design.md: soft background, dark text of the same hue, thin inset ring.
// The text always says what it means; colour is never the only signal. Intended mapping:
//   priority: low = info, medium = warning, high = danger (see PriorityBadge)
//   status:   todo = neutral, in_progress = primary, review = warning, done = success (see StatusLozenge)
const variants = {
  neutral: 'bg-neutral-soft text-neutral-fg ring-fg-muted/25',
  primary: 'bg-brand-soft text-brand-fg ring-brand/20',
  success: 'bg-success-soft text-success-fg ring-success/25',
  warning: 'bg-warning-soft text-warning-fg ring-warning-strong/30',
  danger: 'bg-danger-soft text-danger-fg ring-danger/20',
  info: 'bg-info-soft text-info-fg ring-info/25',
};

const Badge = ({ variant = 'neutral', icon: Icon, className = '', children, ...rest }) => (
  <span
    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant] || variants.neutral} ${className}`}
    {...rest}
  >
    {Icon && <Icon size={12} aria-hidden="true" className="shrink-0" />}
    {children}
  </span>
);

export default Badge;
