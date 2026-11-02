// TaskCard props: task (with assignee populated, possibly null), onOpen(task) called when the card is activated.
// The whole card is ONE button with a single descriptive accessible name (title, priority, status, due date,
// assignee, labels), so a keyboard or screen reader user gets everything in one stop. Its children are spans (a
// button may only contain inline content) and nothing inside is interactive.
// Layout: title (two lines at most), then priority, up to two label chips and "+n", then the due date (with a
// Calendar icon, or a red AlarmClock and the word Overdue when it has passed and the task is not done) and the
// assignee's avatar at the far right. No shadow at rest: the border darkens on hover.
import { AlarmClock, Calendar } from 'lucide-react';
import { formatDate, isOverdue, toDateKey } from '../../utils/dates.js';
import Avatar from '../Avatar.jsx';
import Badge from '../Badge.jsx';
import PriorityBadge, { PRIORITY_BADGES } from '../PriorityBadge.jsx';
import { STATUS_LOZENGES } from '../StatusLozenge.jsx';

const MAX_LABELS = 2;

export const describeTask = (task) => {
  const overdue = isOverdue(task);
  const parts = [
    task.title,
    `Priority ${(PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium).label}`,
    `Status ${(STATUS_LOZENGES[task.status] || STATUS_LOZENGES.todo).label}`,
    task.dueDate ? `${overdue ? 'Overdue, was due' : 'Due'} ${formatDate(toDateKey(task.dueDate))}` : 'No due date',
    task.assignee ? `Assigned to ${task.assignee.name}` : 'Unassigned',
  ];
  if (task.labels.length > 0) parts.push(`Labels ${task.labels.join(', ')}`);
  return parts.join('. ');
};

const TaskCard = ({ task, onOpen }) => {
  const overdue = isOverdue(task);
  const shownLabels = task.labels.slice(0, MAX_LABELS);
  const hiddenLabels = task.labels.length - shownLabels.length;

  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      aria-label={describeTask(task)}
      className="block w-full rounded-lg border border-line bg-surface p-3 text-left transition-colors hover:border-fg-muted active:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
    >
      <span className="line-clamp-2 break-words text-sm font-medium text-fg">{task.title}</span>

      <span className="mt-2 flex flex-wrap items-center gap-1">
        <PriorityBadge priority={task.priority} />
        {shownLabels.map((label) => (
          <Badge key={label}>{label}</Badge>
        ))}
        {hiddenLabels > 0 && <Badge title={task.labels.slice(MAX_LABELS).join(', ')}>+{hiddenLabels}</Badge>}
        {/* Without a due date the avatar joins the first row, so the card stays short */}
        {!task.dueDate && <Avatar user={task.assignee} size="xs" emptyLabel="Unassigned" className="ml-auto" />}
      </span>

      {task.dueDate && (
        <span className="mt-2 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 text-xs ${overdue ? 'font-medium text-danger-fg' : 'text-fg-secondary'}`}>
            {overdue ? <AlarmClock size={12} aria-hidden="true" /> : <Calendar size={12} aria-hidden="true" />}
            {overdue ? 'Overdue ' : ''}
            {formatDate(toDateKey(task.dueDate))}
          </span>
          <Avatar user={task.assignee} size="xs" emptyLabel="Unassigned" />
        </span>
      )}
    </button>
  );
};

export default TaskCard;
