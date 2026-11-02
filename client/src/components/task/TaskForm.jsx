// TaskForm props: project (with members populated), task (omit to create; pass one to edit it), defaultStatus
// (create only: the status the new task starts in, default "todo"), onSaved(), onCancel(), onDirtyChange(bool)
// (optional: called with true while there is unsaved input). One form for create (inside TaskModal) and edit (inside
// TaskDrawer). Validates on submit and shows server errors under the matching field.
// Note: PUT /tasks/:id REPLACES the editable fields, so the edit form always sends all of them (and the existing
// GitHub issue unchanged); create sends only what was filled in.
import { useEffect, useRef, useState } from 'react';
import { createTask, updateTask } from '../../api/tasks.js';
import { useToast } from '../../context/ToastContext.jsx';
import { toDateKey } from '../../utils/dates.js';
import Button from '../Button.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import Input from '../Input.jsx';
import Select from '../Select.jsx';
import Textarea from '../Textarea.jsx';
import { buildTaskBody, DESCRIPTION_MAX, validateTask } from './taskBody.js';
import { messageOf, STATUSES } from './taskConstants.js';

const LABELS_MAX = 5;
const LABEL_MAX_LENGTH = 20;
const FORM_FIELDS = ['title', 'description', 'priority', 'assignee', 'labels', 'dueDate', 'status'];

const TaskForm = ({ project, task, defaultStatus, onSaved, onCancel, onDirtyChange }) => {
  const { showToast } = useToast();
  const members = project.members.filter((member) => member.user);

  const [values, setValues] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    assignee: task?.assignee?._id || '',
    dueDate: toDateKey(task?.dueDate),
    status: defaultStatus || 'todo',
  });
  const [labels, setLabels] = useState(task?.labels || []);
  const [labelInput, setLabelInput] = useState('');
  const [labelError, setLabelError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Tell the parent whether there is anything unsaved (so closing the drawer can ask before discarding it)
  const initial = useRef(JSON.stringify([values, labels]));
  useEffect(() => {
    onDirtyChange?.(JSON.stringify([values, labels]) !== initial.current || Boolean(labelInput.trim()));
  }, [values, labels, labelInput, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);

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

    const errors = validateTask(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || pendingLabelError) return;

    const body = buildTaskBody({ task, values, labels: finalLabels });

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
        <p className={`mt-1 text-right font-mono text-xs ${values.description.length > DESCRIPTION_MAX ? 'text-danger' : 'text-fg-secondary'}`}>
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
        <p className="text-xs text-fg-secondary">
          Press Enter or comma to add. Up to {LABELS_MAX} labels, {LABEL_MAX_LENGTH} characters each.
        </p>
        {labels.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {labels.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1 rounded bg-brand-soft py-0.5 pl-2.5 pr-1 text-xs font-medium text-brand-fg"
              >
                {label}
                <button
                  type="button"
                  aria-label={`Remove label ${label}`}
                  onClick={() => setLabels((current) => current.filter((item) => item !== label))}
                  className="rounded px-1.5 hover:bg-brand/10 active:bg-brand/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring disabled:cursor-not-allowed disabled:opacity-50"
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

export default TaskForm;
