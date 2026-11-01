// Calendar-date helpers. A due date is a day, not a moment: the API stores "YYYY-MM-DD" as midnight UTC, so we
// work with the first 10 characters (the "date key") and never convert time zones. That keeps a task due on
// 2030-06-01 on 2030-06-01 for every user, and overdue only after that calendar day has passed.
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

const pad = (number) => String(number).padStart(2, '0');

// "2030-06-01T00:00:00.000Z" -> "2030-06-01" ('' when there is no date)
export const toDateKey = (iso) => (iso ? String(iso).slice(0, 10) : '');

// The local calendar date of a Date (default: now) as "YYYY-MM-DD"
export const localDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// "2030-06-01" -> "Jun 1, 2030" (locale of the browser)
export const formatDate = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return dateFormat.format(new Date(year, month - 1, day));
};

// True when the task has a due date before today and is not done
export const isOverdue = (task, today = localDateKey()) =>
  Boolean(task.dueDate) && task.status !== 'done' && toDateKey(task.dueDate) < today;
