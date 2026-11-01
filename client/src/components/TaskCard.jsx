// TaskCard props: task (with assignee populated, possibly null), onOpen(task) called when the card is clicked.
// The whole card is one button so it works with a keyboard. Its children are spans, because a button may only
// contain inline content. Shows the title, a priority badge (always with a text label), label chips, the due
// date (red with the word "Overdue" when it has passed and the task is not done) and the assignee's avatar.
import { formatDate, isOverdue, toDateKey } from '../utils/dates.js';
import Avatar from './Avatar.jsx';
import Badge from './Badge.jsx';

const PRIORITIES = {
  low: { variant: 'neutral', label: 'Low' },
  medium: { variant: 'warning', label: 'Medium' },
  high: { variant: 'danger', label: 'High' },
};

const TaskCard = ({ task, onOpen }) => {
  const priority = PRIORITIES[task.priority] || PRIORITIES.medium;
  const overdue = isOverdue(task);

  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="block w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition-colors hover:border-indigo-300 hover:bg-slate-50 active:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="block break-words text-sm font-medium text-slate-900">{task.title}</span>

      <span className="mt-2 flex flex-wrap items-center gap-1">
        <Badge variant={priority.variant}>{priority.label}</Badge>
        {task.labels.map((label) => (
          <Badge key={label} variant="primary">
            {label}
          </Badge>
        ))}
      </span>

      <span className="mt-3 flex items-center justify-between gap-2">
        {task.dueDate ? (
          <span className={`text-xs ${overdue ? 'font-medium text-red-600' : 'text-slate-500'}`}>
            {overdue ? 'Overdue ' : 'Due '}
            {formatDate(toDateKey(task.dueDate))}
          </span>
        ) : (
          <span />
        )}
        <Avatar user={task.assignee} emptyLabel="Unassigned" />
      </span>
    </button>
  );
};

export default TaskCard;
