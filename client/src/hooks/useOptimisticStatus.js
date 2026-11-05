// useOptimisticStatus({ projectId, data, refetch }): lets the board show a status change at once and confirm it later.
//   data     the list body from listTasks ({ data: tasks[], ... }) or null
//   refetch  reloads that list quietly (useFetch keeps the old data on screen meanwhile)
// Returns { tasks, move(task, status) }. tasks is data.data with the pending moves applied. move() puts the task in
// the new column immediately, calls PATCH /status (setTaskStatus), then refetches. If the request fails the card goes
// back and an error toast shows the server's message. The pending moves are a small map { taskId: status }; an entry
// is dropped when fresh data arrives (unless its request is still running) or when its request fails. A task whose
// move is still running cannot be moved again.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { setTaskStatus } from '../api/tasks.js';
import { applyOverrides, withOverride, withoutOverride } from '../components/board/dnd/dndLogic.js';
import { useToast } from '../context/ToastContext.jsx';

const useOptimisticStatus = ({ projectId, data, refetch }) => {
  const { showToast } = useToast();
  const [overrides, setOverrides] = useState({});
  const running = useRef(new Set());

  // Fresh data from the server is the truth again for every task whose request has finished
  useEffect(() => {
    setOverrides((current) => {
      const kept = Object.keys(current).filter((id) => running.current.has(id));
      return kept.length === Object.keys(current).length
        ? current
        : Object.fromEntries(kept.map((id) => [id, current[id]]));
    });
  }, [data]);

  const tasks = useMemo(() => applyOverrides(data?.data || [], overrides), [data, overrides]);

  const move = useCallback(
    async (task, status) => {
      if (running.current.has(task._id) || task.status === status) return;
      running.current.add(task._id);
      setOverrides((current) => withOverride(current, task._id, status));
      try {
        await setTaskStatus(projectId, task._id, status);
        running.current.delete(task._id);
        refetch();
      } catch (error) {
        running.current.delete(task._id);
        setOverrides((current) => withoutOverride(current, task._id));
        showToast(error.response?.data?.message || 'Could not move the task', 'error');
      }
    },
    [projectId, refetch, showToast]
  );

  return { tasks, move };
};

export default useOptimisticStatus;
