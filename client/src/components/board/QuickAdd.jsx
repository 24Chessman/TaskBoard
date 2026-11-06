// QuickAdd props: project, status (the column's status), columnTitle (for the accessible names), onCreated()
// (the board refetches). A ghost "Add task" button at the bottom of a column that reveals a one-line field:
// Enter creates a task with just that title in this status (same title rules and server checks as the create
// form; an error shows under the field), the field is cleared and keeps focus so several tasks can be typed in a
// row, Esc closes it. Leaving the field empty and clicking away also closes it.
import errorMessage from '../../utils/errorMessage.js';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createTask } from '../../api/tasks.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../Button.jsx';
import Input from '../Input.jsx';

const TITLE_MAX = 120;

const QuickAdd = ({ project, status, columnTitle, onCreated }) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const rootRef = useRef(null);
  const focusButton = useRef(false);

  useEffect(() => {
    if (open) rootRef.current?.querySelector('input')?.focus();
    else if (focusButton.current) {
      rootRef.current?.querySelector('button')?.focus();
      focusButton.current = false;
    }
  }, [open]);

  const close = (returnFocus) => {
    focusButton.current = returnFocus;
    setOpen(false);
    setTitle('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const clean = title.trim();
    if (!clean) return setError('Title is required');
    if (clean.length > TITLE_MAX) return setError(`Title must be at most ${TITLE_MAX} characters`);

    setSaving(true);
    setError('');
    try {
      await createTask(project._id, { title: clean, status });
      showToast('Task created', 'success');
      setTitle('');
      onCreated();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
      rootRef.current?.querySelector('input')?.focus();
    }
  };

  return (
    <div ref={rootRef}>
      {open ? (
        <form
          onSubmit={handleSubmit}
          noValidate
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              close(true);
            }
          }}
        >
          <Input
            aria-label={`New task title in ${columnTitle}`}
            placeholder="Task title, then Enter"
            autoComplete="off"
            value={title}
            readOnly={saving}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => !title.trim() && !saving && close(false)}
            error={error}
          />
        </form>
      ) : (
        <Button variant="ghost" leftIcon={Plus} className="w-full justify-start" onClick={() => setOpen(true)}>
          Add task
        </Button>
      )}
    </div>
  );
};

export default QuickAdd;
