// TaskDetailsPane props: task (assignee and createdBy populated, either can be null), project, onChanged().
// The right-hand "Details" pane of the task drawer. The status Select saves at once (PATCH /status through
// setTaskStatus, the same call the board used before): a toast on success, an error toast and the old status
// back on failure. Everything else is read-only here; editing happens in the form (Edit button).
// The GitHub issue row shows the linked issue (state, title, link) and nothing when the task has none.
import { AlarmClock, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { setTaskStatus } from '../../api/tasks.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, isOverdue, localDateKey, toDateKey } from '../../utils/dates.js';
import Avatar from '../Avatar.jsx';
import Badge from '../Badge.jsx';
import GithubIssueRow from './GithubIssueRow.jsx';
import PriorityBadge from '../PriorityBadge.jsx';
import Select from '../Select.jsx';
import { messageOf, STATUSES } from './taskConstants.js';

const Row = ({ label, children }) => (
  <div className="py-3">
    <dt className="mb-1 text-xs text-fg-secondary">{label}</dt>
    <dd className="flex flex-wrap items-center gap-2 text-sm text-fg">{children}</dd>
  </div>
);

const Person = ({ user, emptyLabel }) => (
  <>
    <Avatar user={user} size="xs" emptyLabel={emptyLabel} />
    {user ? user.name : emptyLabel}
  </>
);

const TaskDetailsPane = ({ task, project, onChanged }) => {
  const { showToast } = useToast();
  const [pendingStatus, setPendingStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const overdue = isOverdue(task);

  // Once the board has refetched, the real status takes over from the one we are saving
  useEffect(() => setPendingStatus(null), [task.status]);

  const handleStatus = async (event) => {
    const next = event.target.value;
    setPendingStatus(next);
    setSaving(true);
    try {
      await setTaskStatus(project._id, task._id, next);
      showToast('Status updated', 'success');
      onChanged();
    } catch (error) {
      setPendingStatus(null); // keep the old status
      showToast(messageOf(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="task-details-title" className="rounded-lg bg-app px-4 py-2">
      <h3 id="task-details-title" className="py-2 text-sm font-semibold text-fg">
        Details
      </h3>
      <dl className="divide-y divide-line">
        <Row label="Status">
          <Select aria-label="Status" value={pendingStatus || task.status} onChange={handleStatus} disabled={saving} className="w-full">
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </Row>
        <Row label="Priority">
          <PriorityBadge priority={task.priority} />
        </Row>
        <Row label="Lead">
          <Person user={task.assignee} emptyLabel="No lead" />
        </Row>
        <Row label="Labels">
          {task.labels.length === 0 ? (
            <span className="text-fg-secondary">None</span>
          ) : (
            task.labels.map((label) => <Badge key={label}>{label}</Badge>)
          )}
        </Row>
        <Row label="Due date">
          {task.dueDate ? (
            <span className={`inline-flex items-center gap-1 ${overdue ? 'font-medium text-danger-fg' : ''}`}>
              {overdue ? <AlarmClock size={14} aria-hidden="true" /> : <Calendar size={14} aria-hidden="true" />}
              {overdue ? 'Overdue ' : ''}
              {formatDate(toDateKey(task.dueDate))}
            </span>
          ) : (
            <span className="text-fg-secondary">No due date</span>
          )}
        </Row>
        <Row label="Created by">
          <Person user={task.createdBy} emptyLabel="Deleted user" />
        </Row>
        <Row label="Created">{formatDate(localDateKey(new Date(task.createdAt)))}</Row>
        {task.githubIssue?.url && (
          <Row label="GitHub issue">
            <GithubIssueRow issue={task.githubIssue} />
          </Row>
        )}
      </dl>
    </section>
  );
};

export default TaskDetailsPane;
