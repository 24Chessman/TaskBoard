// Pure helpers for the task form: validation and the request body. Kept apart from the component so they are easy to test.
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

// buildTaskBody({ task, values, labels }): the body to send.
// Create (no task) sends only what was filled in. Edit sends every editable field: the PUT replaces the task and
// clears whatever is missing, including the GitHub issue, so an existing one is sent back unchanged.
export const buildTaskBody = ({ task, values, labels }) => {
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
  if (task.githubIssue?.url) {
    const { url, title: issueTitle, state } = task.githubIssue;
    body.githubIssue = { url, ...(issueTitle && { title: issueTitle }), ...(state && { state }) };
  }
  return body;
};
