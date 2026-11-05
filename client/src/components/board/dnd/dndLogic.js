// Pure helpers for dragging cards between board columns (no React, no dnd-kit), so they are easy to test.
// columns is the board's list [{ id, title }] in display order. overrides is a plain map { taskId: status } of
// moves that were made on screen but not yet confirmed by fresh data from the server.

// neighbourColumn(columns, currentId, direction): the id of the column left (-1) or right (+1) of currentId, or
// null at either end or when currentId is not a column.
export const neighbourColumn = (columns, currentId, direction) => {
  const index = columns.findIndex((column) => column.id === currentId);
  if (index === -1) return null;
  return columns[index + direction]?.id ?? null;
};

export const columnTitle = (columns, id) => columns.find((column) => column.id === id)?.title ?? '';

// isMove(columns, task, overId): true only when overId is a known column other than the task's own.
export const isMove = (columns, task, overId) =>
  Boolean(task) && columns.some((column) => column.id === overId) && task.status !== overId;

// withOverride(overrides, taskId, status) / withoutOverride(overrides, taskId): new maps, the input is never changed.
export const withOverride = (overrides, taskId, status) => ({ ...overrides, [taskId]: status });
export const withoutOverride = (overrides, taskId) => {
  const { [taskId]: _removed, ...rest } = overrides;
  return rest;
};

// applyOverrides(tasks, overrides): the tasks with their on-screen status; tasks without an override are untouched.
export const applyOverrides = (tasks, overrides) =>
  tasks.map((task) => (overrides[task._id] && overrides[task._id] !== task.status ? { ...task, status: overrides[task._id] } : task));

// groupByStatus(columns, tasks): { [columnId]: tasks[] } with every column present; unknown statuses are ignored.
export const groupByStatus = (columns, tasks) => {
  const groups = Object.fromEntries(columns.map((column) => [column.id, []]));
  tasks.forEach((task) => groups[task.status]?.push(task));
  return groups;
};

// countsByStatus(columns, tasks): { [columnId]: number }, used to check that counts follow the moves.
export const countsByStatus = (columns, tasks) =>
  Object.fromEntries(Object.entries(groupByStatus(columns, tasks)).map(([id, list]) => [id, list.length]));
