// StatusLozenge props: status (todo | in_progress | review | done), className. A Badge with the status icon and
// its name, so status is never shown by colour alone. Icons: docs/design.md section 6.
import { CheckCircle2, Circle, CircleDot, Eye } from 'lucide-react';
import Badge from './Badge.jsx';

export const STATUS_LOZENGES = {
  todo: { label: 'To Do', icon: Circle, variant: 'neutral' },
  in_progress: { label: 'In Progress', icon: CircleDot, variant: 'primary' },
  review: { label: 'Review', icon: Eye, variant: 'warning' },
  done: { label: 'Done', icon: CheckCircle2, variant: 'success' },
};

const StatusLozenge = ({ status, className = '' }) => {
  const config = STATUS_LOZENGES[status] || STATUS_LOZENGES.todo;
  return (
    <Badge variant={config.variant} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  );
};

export default StatusLozenge;
