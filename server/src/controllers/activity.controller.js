// Activity controller: the project's activity feed. Read only: activity is append-only and written by the
// activityLogger middleware, so there are no create, update or delete handlers.
// The project always comes from req.project (set by projectAccess), so only that project's records are returned.
// An entry whose actor account was deleted comes back with actor: null.
import Activity from '../models/Activity.js';
import asyncHandler from '../utils/asyncHandler.js';
import { readPositiveInt, readQueryString } from '../utils/queryHelpers.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// GET /api/projects/:projectId/activity?page=&limit= : any project member (an admin counts as owner), newest first
export const listActivity = asyncHandler(async (req, res) => {
  const page = readPositiveInt(readQueryString(req.query.page, 'page'), 1);
  const limit = Math.min(readPositiveInt(readQueryString(req.query.limit, 'limit'), DEFAULT_LIMIT), MAX_LIMIT);

  const filter = { project: req.project._id };
  const [entries, total] = await Promise.all([
    Activity.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('actor', 'name email'),
    Activity.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, data: entries, page, limit, total });
});
