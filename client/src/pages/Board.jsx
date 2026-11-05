// Board page (/projects/:projectId, the index child of ProjectLayout). Shows the project's tasks in four
// status columns (To Do, In Progress, Review, Done). The project comes from useProject(); tasks are fetched
// with the active filters (search, priority, assignee, label, due before), which live in the URL query string
// (see components/board/useBoardFilters.js) so Back, refresh and shared links keep them. The server returns at
// most 100 tasks per request, newest first. While a new filter request runs the previous tasks stay on screen:
// the full-page loader only shows for the very first load.
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { listTasks } from '../api/tasks.js';
import BoardToolbar from '../components/board/BoardToolbar.jsx';
import BoardDnd from '../components/board/dnd/BoardDnd.jsx';
import { hasActiveFilters } from '../components/board/filters.js';
import useBoardFilters from '../components/board/useBoardFilters.js';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import PageHeader from '../components/shell/PageHeader.jsx';
import TaskDrawer from '../components/task/TaskDrawer.jsx';
import TaskModal from '../components/TaskModal.jsx';
import useFetch from '../hooks/useFetch.js';
import useOptimisticStatus from '../hooks/useOptimisticStatus.js';
import useProject from '../hooks/useProject.js';

const LIMIT = 100;
const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const Board = () => {
  const { project, isOwner } = useProject();
  // What is open: null, { mode: 'create', status } (the create modal) or { taskId } (the task drawer)
  const [modal, setModal] = useState(null);

  const members = project.members.filter((member) => member.user);
  const { filters, searchText, setSearchText, labelText, setLabelText, updateParams, clearFilters } = useBoardFilters(
    members.map((member) => member.user._id)
  );
  const { search, priority, assignee, label, dueBefore } = filters;

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

  // Keep showing the last result while a new one loads (a filter change resets `data` to null in useFetch)
  const lastData = useRef(null);
  if (data) lastData.current = data;
  const shown = data || lastData.current;

  // Cards dragged to another column show there at once; the status is saved with PATCH /status
  const { tasks: boardTasks, move } = useOptimisticStatus({ projectId: project._id, data: shown, refetch });

  const hasFilters = hasActiveFilters(filters);
  const openCreate = (status) => setModal({ mode: 'create', status: typeof status === 'string' ? status : undefined });
  const openTask = (task) => setModal({ taskId: task._id });

  const renderBoard = () => {
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (!shown) return <Loader label="Loading tasks" />;

    if (shown.total === 0) {
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
          onAction={() => openCreate()}
        />
      );
    }

    return (
      <>
        {shown.total > shown.data.length && (
          <p className="mb-3 text-sm text-fg-secondary">
            Showing the newest {shown.data.length} of {shown.total} tasks. Use the filters to narrow them down.
          </p>
        )}
        <BoardDnd
          columns={COLUMNS}
          tasks={boardTasks}
          disabled={Boolean(modal)}
          onMove={move}
          columnProps={{ project, onOpenTask: openTask, onAddTask: openCreate, onCreated: refetch }}
        />
      </>
    );
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Projects', to: '/projects' },
          { label: project.name, to: `/projects/${project._id}` },
          { label: 'Board' },
        ]}
        title="Board"
        actions={
          <Button leftIcon={Plus} onClick={() => openCreate()}>
            Add task
          </Button>
        }
      />

      <BoardToolbar
        members={members}
        filters={filters}
        searchText={searchText}
        onSearchText={setSearchText}
        labelText={labelText}
        onLabelText={setLabelText}
        onChange={updateParams}
        onClear={clearFilters}
        onRefresh={refetch}
        refreshing={loading && Boolean(shown)}
      />

      {renderBoard()}

      {modal?.mode === 'create' && (
        <TaskModal modal={modal} project={project} onClose={() => setModal(null)} onChanged={refetch} />
      )}
      {modal?.taskId && (
        <TaskDrawer
          key={modal.taskId}
          taskId={modal.taskId}
          tasks={shown?.data || []}
          project={project}
          isOwner={isOwner}
          onClose={() => setModal(null)}
          onChanged={refetch}
        />
      )}
    </div>
  );
};

export default Board;
