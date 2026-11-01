// Readable messages for the activity feed, one pure function per action in ACTIVITY_ACTIONS.
// Each takes an object like { name, title, status } and returns a short sentence WITHOUT the actor's name
// (the feed shows who did it separately), e.g. "moved 'Login page' to Review".
// Names and titles are cut to 80 characters and a message never goes over 200.
const NAME_LIMIT = 80;
const MESSAGE_LIMIT = 200;

export const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

// One line, at most `limit` characters (the last one is "…" when the text was cut)
export const clip = (text, limit = NAME_LIMIT) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return 'Untitled';
  return clean.length > limit ? `${clean.slice(0, limit - 1)}…` : clean;
};

const finish = (message) => message.slice(0, MESSAGE_LIMIT);

const projectUpdated = ({ status }) => {
  if (status === 'archived') return 'archived the project';
  if (status === 'active') return 'reactivated the project';
  return 'updated the project details';
};

export const activityMessages = {
  'project.created': ({ name }) => finish(`created the project '${clip(name)}'`),
  'project.updated': (details = {}) => finish(projectUpdated(details)),
  'member.added': ({ name }) => finish(`added ${clip(name)} to the project`),
  'member.removed': ({ name }) => finish(`removed ${clip(name)} from the project`),
  'task.created': ({ title }) => finish(`created task '${clip(title)}'`),
  'task.updated': ({ title }) => finish(`updated task '${clip(title)}'`),
  'task.status_changed': ({ title, status }) =>
    finish(`moved '${clip(title)}' to ${STATUS_LABELS[status] || clip(status)}`),
  'task.deleted': ({ title }) => finish(`deleted task '${clip(title)}'`),
  'comment.added': ({ title }) => finish(`commented on '${clip(title)}'`),
};
