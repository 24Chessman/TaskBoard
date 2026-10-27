// Badge props: variant (neutral | primary | success | warning | danger, default neutral), children (text label).
// Intended mapping:
//   priority: low = neutral, medium = warning, high = danger
//   status:   todo = neutral, in_progress = primary, review = warning, done = success
const variants = {
  neutral: 'bg-slate-100 text-slate-700',
  primary: 'bg-indigo-50 text-indigo-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
};

const Badge = ({ variant = 'neutral', children }) => (
  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
    {children}
  </span>
);

export default Badge;
