// PriorityBadge props: priority (low | medium | high), className. A Badge with the priority icon and its name
// (never colour alone), plus a tooltip. The icon takes the lozenge's text colour so it keeps the same contrast
// as the text (the brief's amber-500 icon alone would be under 3:1 on white).
import { ArrowDown, ArrowUp, Equal } from 'lucide-react';
import Badge from './Badge.jsx';

export const PRIORITY_BADGES = {
  low: { label: 'Low', icon: ArrowDown, variant: 'info' },
  medium: { label: 'Medium', icon: Equal, variant: 'warning' },
  high: { label: 'High', icon: ArrowUp, variant: 'danger' },
};

const PriorityBadge = ({ priority, className = '' }) => {
  const config = PRIORITY_BADGES[priority] || PRIORITY_BADGES.medium;
  return (
    <Badge variant={config.variant} icon={config.icon} className={className} title={`${config.label} priority`}>
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
