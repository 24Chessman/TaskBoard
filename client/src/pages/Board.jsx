// Board page (/projects/:projectId, the index child of ProjectLayout). Shows the project's tasks in four
// status columns (To Do, In Progress, Review, Done). The project comes from useProject(); tasks are fetched
// with the active filters (search, priority, assignee, label, due before), which live in the URL query string
// so Back and shared links keep them. The server returns at most 100 tasks per request, newest first.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listTasks } from '../api/tasks.js';
import Button from '../components/Button.jsx';
import Column from '../components/Column.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Select from '../components/Select.jsx';
import useDebounce from '../hooks/useDebounce.js';
import useFetch from '../hooks/useFetch.js';
import useProject from '../hooks/useProject.js';

const LIMIT = 100;
const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];
const PRIORITIES = ['low', 'medium', 'high'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const Board = () => {
  const { project } = useProject();
  const [searchParams, setSearchParams] = useSearchParams();
  // Which task modal is open: null, { mode: 'create' } or { taskId }
  const [modal, setModal] = useState(null);

  const members = project.members.filter((member) => member.user);

  // Read the filters from the URL, ignoring values that cannot be valid
  const search = searchParams.get('search') || '';
  const label = searchParams.get('label') || '';
  const priorityParam = searchParams.get('priority');
  const priority = PRIORITIES.includes(priorityParam) ? priorityParam : '';
  const assigneeParam = searchParams.get('assignee');
  const assignee = members.some((member) => member.user._id === assigneeParam) ? assigneeParam : '';
  const dueParam = searchParams.get('dueBefore');
  const dueBefore = DATE_PATTERN.test(dueParam || '') ? dueParam : '';

  // Text boxes keep what the user typed; the URL (and so the request) follows after a short pause.
  const [searchText, setSearchText] = useState(search);
  const [labelText, setLabelText] = useState(label);
  const debouncedSearch = useDebounce(searchText);
  const debouncedLabel = useDebounce(labelText);

  const updateParams = (changes, replace = false) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
        return next;
      },
      { replace }
    );
  };

  useEffect(() => {
    if (debouncedSearch.trim() !== search) updateParams({ search: debouncedSearch.trim() }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    const clean = debouncedLabel.trim().toLowerCase();
    if (clean !== label) updateParams({ label: clean }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLabel]);

  const { data, loading, error, refetch } = useFetch(
    () =>
      listTasks(project._id, {
        search: search || undefined,
        priority: priority || undefined,
        assignee: assignee || undefined,
        label: label || undefined,
        dueBefore: dueBefore || undefined,
        limit: LIMIT,
      }),
    [project._id, search, priority, assignee, label, dueBefore]
  );

  const hasFilters = Boolean(search || priority || assignee || label || dueBefore);
  const clearFilters = () => {
    setSearchText('');
    setLabelText('');
    setSearchParams({});
  };

  const openCreate = () => setModal({ mode: 'create' });
  const openTask = (task) => setModal({ taskId: task._id });
  // The task modal (create, view, edit, delete) is mounted here by the next commit, using `modal` and `refetch`.

  const renderBoard = () => {
    if (loading && !data) return <Loader label="Loading tasks" />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    if (data.total === 0) {
      return hasFilters ? (
        <EmptyState
          title="No tasks match your filters"
          message="Try different filters, or clear them to see every task."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      ) : (
        <EmptyState
          title="No tasks yet"
          message="Add the first task to start planning this project."
          actionLabel="Add task"
          onAction={openCreate}
        />
      );
    }

    const byStatus = Object.fromEntries(COLUMNS.map((column) => [column.id, []]));
    data.data.forEach((task) => byStatus[task.status]?.push(task));

    return (
      <>
        {data.total > data.data.length && (
          <p className="text-sm text-slate-500">
            Showing the newest {data.data.length} of {data.total} tasks. Use the filters to narrow them down.
          </p>
        )}
        <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={byStatus[column.id]}
              onOpenTask={openTask}
              action={
                column.id === 'todo' ? (
                  <Button variant="secondary" className="w-full" onClick={openCreate}>
                    Add task
                  </Button>
                ) : undefined
              }
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="sr-only">Board</h2>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" onClick={clearFilters} disabled={!hasFilters}>
          Clear filters
        </Button>
        <Button onClick={openCreate}>Add task</Button>
      </div>

      <form
        role="search"
        aria-label="Filter tasks"
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        <Input
          label="Search"
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Title or description"
        />
        <Select label="Priority" value={priority} onChange={(event) => updateParams({ priority: event.target.value })}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Select label="Assignee" value={assignee} onChange={(event) => updateParams({ assignee: event.target.value })}>
          <option value="">Everyone</option>
          {members.map((member) => (
            <option key={member.user._id} value={member.user._id}>
              {member.user.name}
            </option>
          ))}
        </Select>
        <Input
          label="Label"
          value={labelText}
          onChange={(event) => setLabelText(event.target.value)}
          placeholder="e.g. bug"
        />
        <Input
          label="Due before"
          type="date"
          value={dueBefore}
          onChange={(event) => updateParams({ dueBefore: event.target.value })}
        />
      </form>

      {renderBoard()}
    </div>
  );
};

export default Board;
