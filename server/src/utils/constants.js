// Shared enum values used by the Mongoose models (see docs/backend_schema.md section 2).
export const USER_ROLES = Object.freeze(['user', 'admin']);
export const PROJECT_ROLES = Object.freeze(['owner', 'member']);
export const PROJECT_STATUSES = Object.freeze(['active', 'archived']);
export const TASK_STATUSES = Object.freeze(['todo', 'in_progress', 'review', 'done']);
export const TASK_PRIORITIES = Object.freeze(['low', 'medium', 'high']);
export const ACTIVITY_ACTIONS = Object.freeze([
  'project.created',
  'project.updated',
  'member.added',
  'member.removed',
  'task.created',
  'task.updated',
  'task.status_changed',
  'task.deleted',
  'comment.added',
]);
