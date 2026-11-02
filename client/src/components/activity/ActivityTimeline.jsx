// ActivityTimeline props: groups (the result of groupByDay(entries): [{ key, label, items }]). Under each day
// heading a vertical timeline: a small round icon per action type (decorative), the actor's name in bold followed
// by the message, and the relative time on the right (the full date and time on hover). A missing actor (deleted
// user) shows as "Deleted user". All text is rendered as plain text.
import { ArrowRightLeft, FolderPlus, MessageSquare, Pencil, Plus, Trash2, UserMinus, UserPlus } from 'lucide-react';
import { formatDateTime, timeAgo } from '../../utils/dates.js';

const ACTION_ICONS = {
  'project.created': FolderPlus,
  'project.updated': Pencil,
  'member.added': UserPlus,
  'member.removed': UserMinus,
  'task.created': Plus,
  'task.updated': Pencil,
  'task.status_changed': ArrowRightLeft,
  'task.deleted': Trash2,
  'comment.added': MessageSquare,
};

const ActivityTimeline = ({ groups }) => (
  <div className="space-y-8">
    {groups.map((group) => (
      <section key={group.key} aria-labelledby={`day-${group.key}`}>
        <h2 id={`day-${group.key}`} className="mb-3 text-sm font-semibold text-fg">
          {group.label}
        </h2>
        <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-3 before:top-2 before:w-px before:bg-line">
          {group.items.map((entry) => {
            const Icon = ACTION_ICONS[entry.action] || Pencil;
            return (
              <li key={entry._id} className="relative flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-fg-secondary"
                >
                  <Icon size={12} />
                </span>
                <p className="min-w-0 flex-1 break-words pt-0.5 text-sm text-fg">
                  <strong className="font-semibold">{entry.actor ? entry.actor.name : 'Deleted user'}</strong>{' '}
                  {entry.message}
                </p>
                <time
                  dateTime={entry.createdAt}
                  title={formatDateTime(entry.createdAt)}
                  className="shrink-0 pt-0.5 text-xs text-fg-secondary"
                >
                  {timeAgo(entry.createdAt)}
                </time>
              </li>
            );
          })}
        </ol>
      </section>
    ))}
  </div>
);

export default ActivityTimeline;
