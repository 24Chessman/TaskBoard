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

// ---- Timestamps (comments): moments, unlike the calendar dates above, are shown in the user's local time zone.
const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const relativeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const RELATIVE_DAYS_LIMIT = 30;

// "2030-06-01T14:05:00.000Z" -> "Jun 1, 2030, 4:05 PM" (browser locale and time zone)
export const formatDateTime = (iso) => dateTimeFormat.format(new Date(iso));

// "just now", "5 minutes ago", "3 hours ago", "2 days ago", and the plain date after 30 days.
// A time slightly in the future (a clock that is a little off) also reads "just now". now is a parameter for tests.
export const timeAgo = (iso, now = Date.now()) => {
  const elapsed = now - new Date(iso).getTime();
  if (elapsed < MINUTE) return 'just now';
  if (elapsed < HOUR) return relativeFormat.format(-Math.floor(elapsed / MINUTE), 'minute');
  if (elapsed < DAY) return relativeFormat.format(-Math.floor(elapsed / HOUR), 'hour');
  if (elapsed < RELATIVE_DAYS_LIMIT * DAY) return relativeFormat.format(-Math.floor(elapsed / DAY), 'day');
  return formatDateTime(iso);
};

// True when a comment was changed more than a minute after it was written (so it shows "(edited)")
export const wasEdited = (comment) => new Date(comment.updatedAt) - new Date(comment.createdAt) > MINUTE;

// ---- Day grouping (activity feed): entries are grouped by the viewer's local calendar day.
// The local calendar day of a timestamp as "YYYY-MM-DD"
export const dayKey = (iso) => localDateKey(new Date(iso));

// "Today", "Yesterday", or a readable date such as "Jun 1, 2030". now is a parameter for tests.
export const dayLabel = (iso, now = new Date()) => {
  const key = dayKey(iso);
  if (key === localDateKey(now)) return 'Today';
  if (key === localDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))) return 'Yesterday';
  return formatDate(key);
};

// Splits a newest-first list into [{ key, label, items }], one group per day, keeping the order
export const groupByDay = (entries, now = new Date()) => {
  const groups = [];
  entries.forEach((entry) => {
    const key = dayKey(entry.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(entry);
    else groups.push({ key, label: dayLabel(entry.createdAt, now), items: [entry] });
  });
  return groups;
};
