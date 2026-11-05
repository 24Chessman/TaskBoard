// Column props: id (the status: todo | in_progress | review | done), title, tasks (the cards to show), project,
// onOpenTask(task), onAddTask(status) (opens the create modal with this status chosen), onCreated() (after a quick
// add the board refetches). One board column: a header with the status icon, the name, a count and a small Plus
// button; the cards; and the quick add field at the bottom. The status is shown by icon and text, never by a
// coloured border. An empty column shows a dashed outline with "No tasks" instead of a tall empty block.
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useId } from 'react';
import IconButton from '../IconButton.jsx';
import { STATUS_LOZENGES } from '../StatusLozenge.jsx';
import DraggableCard from './dnd/DraggableCard.jsx';
import QuickAdd from './QuickAdd.jsx';

const Column = ({ id, title, tasks, project, onOpenTask, onAddTask, onCreated }) => {
  const headingId = useId();
  const StatusIcon = (STATUS_LOZENGES[id] || STATUS_LOZENGES.todo).icon;
  // The whole column is a drop zone; while a card is over it the column gets a cobalt tint and a ring
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={`flex min-h-[10rem] min-w-[280px] flex-1 flex-col gap-2 rounded-lg p-3 lg:min-w-0 ${isOver ? 'bg-brand-soft ring-2 ring-brand-ring' : 'bg-slate-100/70'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <StatusIcon size={16} aria-hidden="true" className="shrink-0 text-fg-secondary" />
          <h2 id={headingId} className="truncate text-sm font-semibold text-fg">
            {title}
          </h2>
          <span
            aria-label={`${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}
            className="rounded bg-surface px-1.5 text-xs font-medium tabular-nums text-fg-secondary"
          >
            {tasks.length}
          </span>
        </div>
        <IconButton icon={Plus} size="sm" label={`Add task to ${title}`} onClick={() => onAddTask(id)} />
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-md border border-dashed border-fg-muted/50 px-3 py-4 text-center text-sm text-fg-secondary">
          No tasks
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task._id}>
              <DraggableCard task={task} onOpen={onOpenTask} />
            </li>
          ))}
        </ul>
      )}

      <QuickAdd project={project} status={id} columnTitle={title} onCreated={onCreated} />
    </section>
  );
};

export default Column;
