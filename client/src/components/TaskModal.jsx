// TaskModal props: modal ({ mode: 'create' } to add a task, or { taskId } to open one), tasks (the board's current
// task list: the modal shows the live copy of its task, so it updates after every refetch), project (with members
// populated), isOwner (project owner or admin), onClose(), onChanged() (the board refetches).
// One modal for the whole task life cycle, built on the shared Modal:
//   create  empty form
//   view    details, a status Select that saves at once, and Edit / Delete buttons the user is allowed to see
//   edit    the same form, filled in
// The server enforces the permissions too: edit is for the owner/admin, the creator and the assignee; delete is
// for the owner/admin and the creator; anyone in the project can create and change status.
// Note: PUT /tasks/:id REPLACES the editable fields, so the edit form always sends all of them.
import { useEffect, useState } from 'react';
import { createTask, deleteTask, setTaskStatus, updateTask } from '../api/tasks.js';
import { useToast } from '../context/ToastContext.jsx';
import useAuth from '../hooks/useAuth.js';
import { formatDate, isOverdue, localDateKey, toDateKey } from '../utils/dates.js';
import Avatar from './Avatar.jsx';
import Badge from './Badge.jsx';
import Button from './Button.jsx';
import CommentSection from './CommentSection.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import Input from './Input.jsx';
import Modal from './Modal.jsx';
import Select from './Select.jsx';
import Textarea from './Textarea.jsx';

const TITLE_MAX = 120;
const DESCRIPTION_MAX = 2000;
const LABELS_MAX = 5;
const LABEL_MAX_LENGTH = 20;
const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];
const PRIORITIES = {
  low: { variant: 'neutral', label: 'Low' },
  medium: { variant: 'warning', label: 'Medium' },
  high: { variant: 'danger', label: 'High' },
};
const FORM_FIELDS = ['title', 'description', 'priority', 'assignee', 'labels', 'dueDate', 'status'];

const messageOf = (error) =>
  error.response?.data?.errors?.[0]?.message ||
  error.response?.data?.message ||
  'Something went wrong. Please try again.';

const personName = (user, fallback) => (user ? user.name : fallback);

// ---------------------------------------------------------------- form (create and edit)

const TaskForm = ({ project, task, onSaved, onCancel }) => {
  const { showToast } = useToast();
  const members = project.members.filter((member) => member.user);

  const [values, setValues] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    assignee: task?.assignee?._id || '',
    dueDate: toDateKey(task?.dueDate),
    status: 'todo',
  });
  const [labels, setLabels] = useState(task?.labels || []);
  const [labelInput, setLabelInput] = useState('');
  const [labelError, setLabelError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  // Adds the labels in text (several can be separated by commas); returns { next, error }
  const addLabels = (text) => {
    const next = [...labels];
    let error = '';
    for (const part of text.split(',')) {
      const label = part.trim().toLowerCase();
      if (!label || next.includes(label)) continue;
      if (label.length > LABEL_MAX_LENGTH) {
        error = `Each label must be 1 to ${LABEL_MAX_LENGTH} characters`;
        continue;
      }
      if (next.length >= LABELS_MAX) {
        error = `A task can have at most ${LABELS_MAX} labels`;
        break;
      }
      next.push(label);
    }
    setLabels(next);
    setLabelInput(error ? text : '');
    setLabelError(error);
    return { next, error };
  };

  const handleLabelKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault(); // Enter must not submit the form
      addLabels(labelInput);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    // A label typed but not confirmed with Enter still counts
    const { next: finalLabels, error: pendingLabelError } = labelInput.trim() ? addLabels(labelInput) : { next: labels, error: '' };

    const errors = {};
    const title = values.title.trim();
    if (!title) errors.title = 'Title is required';
    else if (title.length > TITLE_MAX) errors.title = `Title must be at most ${TITLE_MAX} characters`;
    if (values.description.length > DESCRIPTION_MAX) {
      errors.description = `Description must be at most ${DESCRIPTION_MAX} characters`;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || pendingLabelError) return;

    // Create sends only what was filled in. Edit sends every editable field: the PUT clears whatever is missing,
    // including the GitHub issue, so an existing one is sent back unchanged.
    let body;
    if (task) {
      body = {
        title,
        description: values.description,
        priority: values.priority,
        assignee: values.assignee || null,
        labels: finalLabels,
        dueDate: values.dueDate || null,
      };
      if (task.githubIssue?.url) {
        const { url, title: issueTitle, state } = task.githubIssue;
        body.githubIssue = { url, ...(issueTitle && { title: issueTitle }), ...(state && { state }) };
      }
    } else {
      body = {
        title,
        description: values.description,
        priority: values.priority,
        status: values.status,
        labels: finalLabels,
        ...(values.assignee && { assignee: values.assignee }),
        ...(values.dueDate && { dueDate: values.dueDate }),
      };
    }

    setSaving(true);
    try {
      if (task) await updateTask(project._id, task._id, body);
      else await createTask(project._id, body);
      showToast(task ? 'Task updated' : 'Task created', 'success');
      onSaved();
    } catch (error) {
      const list = error.response?.data?.errors;
      if (Array.isArray(list) && list.length > 0) {
        const mapped = {};
        const other = [];
        list.forEach(({ field, message }) => {
          if (FORM_FIELDS.includes(field)) mapped[field] = message;
          else other.push(message);
        });
        setFieldErrors(mapped);
        setFormError(other.join(' '));
      } else {
        setFormError(messageOf(error));
      }
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <ErrorMessage message={formError} />}

      <Input label="Title" name="title" autoComplete="off" value={values.title} onChange={handleChange} error={fieldErrors.title} />

      <div>
        <Textarea
          label="Description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          error={fieldErrors.description}
        />
        <p className={`mt-1 text-right text-xs ${values.description.length > DESCRIPTION_MAX ? 'text-red-600' : 'text-slate-500'}`}>
          {values.description.length}/{DESCRIPTION_MAX}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Priority" name="priority" value={values.priority} onChange={handleChange} error={fieldErrors.priority}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Select label="Assignee" name="assignee" value={values.assignee} onChange={handleChange} error={fieldErrors.assignee}>
          <option value="">Unassigned</option>
          {members.map((member) => (
            <option key={member.user._id} value={member.user._id}>
              {member.user.name}
            </option>
          ))}
        </Select>
        <Input label="Due date" name="dueDate" type="date" value={values.dueDate} onChange={handleChange} error={fieldErrors.dueDate} />
        {!task && (
          <Select label="Status" name="status" value={values.status} onChange={handleChange} error={fieldErrors.status}>
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Input
          label="Labels"
          value={labelInput}
          onChange={(event) => setLabelInput(event.target.value)}
          onKeyDown={handleLabelKeyDown}
          onBlur={() => labelInput.trim() && addLabels(labelInput)}
          error={labelError || fieldErrors.labels}
          autoComplete="off"
        />
        <p className="text-xs text-slate-500">
          Press Enter or comma to add. Up to {LABELS_MAX} labels, {LABEL_MAX_LENGTH} characters each.
        </p>
        {labels.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {labels.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 py-0.5 pl-2.5 pr-1 text-xs font-medium text-indigo-700"
              >
                {label}
                <button
                  type="button"
                  aria-label={`Remove label ${label}`}
                  onClick={() => setLabels((current) => current.filter((item) => item !== label))}
                  className="rounded-full px-1.5 hover:bg-indigo-100 active:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {task ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
};

// ---------------------------------------------------------------- details (view)

const TaskDetails = ({ task, project, canEdit, canDelete, onEdit, onDelete, onClose, onChanged }) => {
  const { showToast } = useToast();
  const [pendingStatus, setPendingStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const priority = PRIORITIES[task.priority] || PRIORITIES.medium;
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
    <div className="space-y-5">
      <Select label="Status" value={pendingStatus || task.status} onChange={handleStatus} disabled={saving}>
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </Select>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">Priority</dt>
          <dd className="mt-1">
            <Badge variant={priority.variant}>{priority.label}</Badge>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Due date</dt>
          <dd className={`mt-1 ${overdue ? 'font-medium text-red-600' : 'text-slate-900'}`}>
            {task.dueDate ? `${overdue ? 'Overdue ' : ''}${formatDate(toDateKey(task.dueDate))}` : 'No due date'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Assignee</dt>
          <dd className="mt-1 flex items-center gap-2 text-slate-900">
            <Avatar user={task.assignee} emptyLabel="Unassigned" />
            {personName(task.assignee, 'Unassigned')}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Created by</dt>
          <dd className="mt-1 flex items-center gap-2 text-slate-900">
            <Avatar user={task.createdBy} />
            {personName(task.createdBy, 'Deleted user')}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Created</dt>
          <dd className="mt-1 text-slate-900">{formatDate(localDateKey(new Date(task.createdAt)))}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Labels</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {task.labels.length === 0 ? (
              <span className="text-slate-500">None</span>
            ) : (
              task.labels.map((label) => (
                <Badge key={label} variant="primary">
                  {label}
                </Badge>
              ))
            )}
          </dd>
        </div>
      </dl>

      <div>
        <h3 className="text-xs text-slate-500">Description</h3>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-900">
          {task.description || 'No description'}
        </p>
      </div>

      {task.githubIssue?.url && (
        <div>
          <h3 className="text-xs text-slate-500">GitHub issue</h3>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <a
              href={task.githubIssue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all rounded font-medium text-indigo-600 hover:text-indigo-700 active:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {task.githubIssue.title || task.githubIssue.url}
            </a>
            {task.githubIssue.state && (
              <Badge variant={task.githubIssue.state === 'open' ? 'success' : 'neutral'}>{task.githubIssue.state}</Badge>
            )}
          </p>
        </div>
      )}

      <CommentSection projectId={project._id} taskId={task._id} />

      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
        {canDelete && (
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        )}
        {canEdit && (
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the modal

const TaskModal = ({ modal, tasks, project, isOwner, onClose, onChanged }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isCreate = modal.mode === 'create';
  const task = isCreate ? null : tasks.find((item) => item._id === modal.taskId);

  // The task can vanish after a refetch (for example it was deleted by someone else): close then
  useEffect(() => {
    if (!isCreate && !task) onClose();
  }, [isCreate, task, onClose]);

  if (!isCreate && !task) return null;

  const isCreator = Boolean(task?.createdBy) && task.createdBy._id === user._id;
  const isAssignee = Boolean(task?.assignee) && task.assignee._id === user._id;
  const canEdit = isOwner || isCreator || isAssignee;
  const canDelete = isOwner || isCreator;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(project._id, task._id);
      showToast('Task deleted', 'success');
      onChanged();
      onClose();
    } catch (error) {
      showToast(messageOf(error), 'error');
      setConfirmOpen(false);
      setDeleting(false);
    }
  };

  const title = isCreate ? 'New task' : editing ? 'Edit task' : task.title;

  return (
    <>
      {/* The task modal steps aside while the confirm dialog is open, so Esc only closes one layer */}
      <Modal isOpen={!confirmOpen} onClose={onClose} title={title}>
        {isCreate || editing ? (
          <TaskForm
            project={project}
            task={task}
            onCancel={isCreate ? onClose : () => setEditing(false)}
            onSaved={() => {
              onChanged();
              if (isCreate) onClose();
              else setEditing(false);
            }}
          />
        ) : (
          <TaskDetails
            task={task}
            project={project}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={() => setEditing(true)}
            onDelete={() => setConfirmOpen(true)}
            onClose={onClose}
            onChanged={onChanged}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete task?"
        message={task ? `"${task.title}" and its comments will be permanently deleted.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </>
  );
};

export default TaskModal;
