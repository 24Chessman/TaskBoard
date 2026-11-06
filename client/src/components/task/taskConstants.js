// Shared by the task form, the drawer and the details pane.
import errorMessage from '../../utils/errorMessage.js';
export const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

// One readable message from an API error (the first field error, else the message, else a generic one)
export const messageOf = (error) => errorMessage(error);
