// Pure helpers for the task form: validation, the request body and the server's errors. Kept apart from the component so
// they are easy to test.
import { messageOf } from './taskConstants.js';

export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 2000;

// validateTask(values) -> { title?, description? } (empty when fine)
export const validateTask = (values) => {
  const errors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'Title is required';
  else if (title.length > TITLE_MAX) errors.title = `Title must be at most ${TITLE_MAX} characters`;
  if (values.description.length > DESCRIPTION_MAX) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX} characters`;
  }
  return errors;
};

// The GitHub issue as the server expects it: only url, title and state (nothing else is ever sent)
const shapeIssue = ({ url, title, state }) => ({ url, ...(title && { title }), ...(state && { state }) });

// Errors of the form that the server can report under a field (a 400 from POST or PUT with an errors list)
export const FORM_FIELDS = ['title', 'description', 'priority', 'assignee', 'labels', 'dueDate', 'status', 'githubIssue'];

// readServerErrors(error) -> { fieldErrors, formError }: field errors go under their field, the rest become one message
export const readServerErrors = (error) => {
  const list = error.response?.data?.errors;
  if (!Array.isArray(list) || list.length === 0) return { fieldErrors: {}, formError: messageOf(error) };
  const fieldErrors = {};
  const other = [];
  list.forEach(({ field, message }) => {
    if (FORM_FIELDS.includes(field)) fieldErrors[field] = message;
    else other.push(message);
  });
  return { fieldErrors, formError: other.join(' ') };
};

// buildTaskBody({ task, values, labels, githubIssue }): the body to send. githubIssue is the issue linked in the form
// ({ url, title, state } or null). Create (no task) sends only what was filled in. Edit sends every editable field: the
// PUT replaces the task and clears whatever is missing, so a linked issue is sent again and a removed one is left out.
// If githubIssue is not passed at all, an edit sends the task's own issue back unchanged (the old behaviour).
export const buildTaskBody = ({ task, values, labels, githubIssue }) => {
  const title = values.title.trim();
  if (!task) {
    return {
      title,
      description: values.description,
      priority: values.priority,
      status: values.status,
      labels,
      ...(values.assignee && { assignee: values.assignee }),
      ...(values.dueDate && { dueDate: values.dueDate }),
      ...(githubIssue?.url && { githubIssue: shapeIssue(githubIssue) }),
    };
  }
  const body = {
    title,
    description: values.description,
    priority: values.priority,
    assignee: values.assignee || null,
    labels,
    dueDate: values.dueDate || null,
  };
  const issue = githubIssue === undefined ? task.githubIssue : githubIssue;
  if (issue?.url) body.githubIssue = shapeIssue(issue);
  return body;
};
