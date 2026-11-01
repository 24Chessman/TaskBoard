// Column props: id (the status: todo | in_progress | review | done, picks the accent colour), title,
// tasks (the cards to show), onOpenTask(task), action (optional node shown under the header, e.g. an Add task button).
// One board column: header with the name and task count, the cards, and a muted hint when it is empty.
import { useId } from 'react';
import TaskCard from './TaskCard.jsx';

// Accent colours from ui_ux_brief.md section 2
const ACCENTS = {
  todo: 'border-t-slate-400',
  in_progress: 'border-t-indigo-500',
  review: 'border-t-amber-500',
  done: 'border-t-emerald-500',
};

const Column = ({ id, title, tasks, onOpenTask, action }) => {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`flex min-w-[280px] flex-1 flex-col gap-3 rounded-lg border border-t-4 border-slate-200 bg-slate-100 p-3 lg:min-w-0 ${ACCENTS[id]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id={headingId} className="text-base font-semibold text-slate-900">
          {title}
        </h2>
        <span className="text-sm text-slate-500" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </div>

      {action}

      {tasks.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">No tasks</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task._id}>
              <TaskCard task={task} onOpen={onOpenTask} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Column;
