// Dashboard controller: aggregated numbers for one project (docs/backend_schema.md 3.5).
// Everything is computed by one MongoDB aggregation ($match on the project, then $facet), so no task is loaded into
// memory. The project always comes from req.project (set by projectAccess); the query string is never read.
// "Today" is the start of the current day in UTC: a user in another time zone can see a task become overdue a few
// hours early or late. A deleted assignee shows as a perMember row with userId null and the name "Deleted user".
// No email address is ever returned.
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';
import { TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants.js';

const DAY = 24 * 60 * 60 * 1000;
const DUE_SOON_DAYS = 7;
const TOP_LABELS = 8;
const CREATED_DAYS = 14;
const NOT_DONE = { status: { $ne: 'done' } };

const count = [{ $count: 'n' }];
const groupBy = (field) => [{ $group: { _id: `$${field}`, n: { $sum: 1 } } }];
const n = (rows) => rows[0]?.n ?? 0;
const countsByKey = (rows, keys) => Object.fromEntries(keys.map((key) => [key, rows.find((row) => row._id === key)?.n ?? 0]));

// GET /api/projects/:projectId/dashboard : any project member (an admin counts as owner)
export const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dueSoonEnd = new Date(today.getTime() + (DUE_SOON_DAYS + 1) * DAY);
  const firstDay = new Date(today.getTime() - (CREATED_DAYS - 1) * DAY);

  const [facets] = await Task.aggregate([
    { $match: { project: req.project._id } },
    {
      $facet: {
        total: count,
        byStatus: groupBy('status'),
        byPriority: groupBy('priority'),
        overdue: [{ $match: { ...NOT_DONE, dueDate: { $lt: today } } }, ...count],
        dueSoon: [{ $match: { ...NOT_DONE, dueDate: { $gte: today, $lt: dueSoonEnd } } }, ...count],
        unassigned: [{ $match: { ...NOT_DONE, assignee: null } }, ...count],
        perMember: [
          { $match: { assignee: { $ne: null } } },
          { $group: { _id: '$assignee', total: { $sum: 1 }, done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } } } },
          { $lookup: { from: 'users', localField: '_id', foreignField: '_id', pipeline: [{ $project: { name: 1 } }], as: 'user' } },
        ],
        topLabels: [
          { $unwind: '$labels' },
          { $group: { _id: '$labels', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
          { $limit: TOP_LABELS },
        ],
        createdPerDay: [
          { $match: { createdAt: { $gte: firstDay } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } }, count: { $sum: 1 } } },
        ],
      },
    },
  ]);

  // One row per member who has tasks; every deleted account is merged into a single "Deleted user" row
  const members = new Map();
  facets.perMember.forEach((row) => {
    const user = row.user[0];
    const key = user ? String(user._id) : 'deleted';
    const entry = members.get(key) || { userId: user ? user._id : null, name: user ? user.name : 'Deleted user', total: 0, done: 0 };
    entry.total += row.total;
    entry.done += row.done;
    members.set(key, entry);
  });
  const perMember = [...members.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  // The last 14 days, oldest first, with zeros for days without new tasks
  const perDay = new Map(facets.createdPerDay.map((row) => [row._id, row.count]));
  const createdPerDay = Array.from({ length: CREATED_DAYS }, (_, index) => {
    const date = new Date(firstDay.getTime() + index * DAY).toISOString().slice(0, 10);
    return { date, count: perDay.get(date) ?? 0 };
  });

  res.status(200).json({
    success: true,
    data: {
      total: n(facets.total),
      byStatus: countsByKey(facets.byStatus, TASK_STATUSES),
      byPriority: countsByKey(facets.byPriority, TASK_PRIORITIES),
      overdue: n(facets.overdue),
      dueSoon: n(facets.dueSoon),
      unassigned: n(facets.unassigned),
      perMember,
      topLabels: facets.topLabels.map((row) => ({ label: row._id, count: row.count })),
      createdPerDay,
    },
  });
});
