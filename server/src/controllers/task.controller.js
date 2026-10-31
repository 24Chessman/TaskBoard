// Task controller: create, list (filters, search, sort, pagination), get, full update, status change, delete.
// The project always comes from req.project (set by projectAccess), never from the body, and a task is only
// found if it belongs to that project. Request bodies are whitelisted field by field.
import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants.js';
import {
  escapeRegex,
  readDate,
  readObjectId,
  readPositiveInt,
  readQueryString,
} from '../utils/queryHelpers.js';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const USER_FIELDS = 'name email';
const POPULATE = [
  { path: 'assignee', select: USER_FIELDS },
  { path: 'createdBy', select: USER_FIELDS },
];

// $sort stage for each allowed ?sort= value. noDue (1 when there is no dueDate) keeps undated tasks last;
// priorityRank orders high, medium, low. _id is the final tie-breaker so pages are stable.
const SORTS = {
  dueDate: { noDue: 1, dueDate: 1, _id: 1 },
  '-dueDate': { noDue: 1, dueDate: -1, _id: 1 },
  priority: { priorityRank: 1, createdAt: -1, _id: 1 },
  createdAt: { createdAt: 1, _id: 1 },
  '-createdAt': { createdAt: -1, _id: 1 },
};

const invalid = (field, message) => new ApiError(400, 'Validation Error', [{ field, message }]);

const readEnum = (value, allowed, name) => {
  if (!allowed.includes(value)) throw invalid(name, `${name} must be one of: ${allowed.join(', ')}`);
  return value;
};

const readOptionalString = (value, name) => {
  if (typeof value !== 'string') throw invalid(name, `${name} must be a string`);
  return value;
};

const isMember = (project, userId) => project.members.some((member) => String(member.user) === String(userId));

// Validates the fields shared by create and PUT and returns only the ones that were sent.
const readTaskFields = (body, project) => {
  const { title, description, priority, assignee, labels, dueDate, githubIssue } = body;
  if (typeof title !== 'string' || !title.trim()) throw invalid('title', 'Title is required');

  const fields = { title };
  if (description !== undefined) fields.description = readOptionalString(description, 'description');
  if (priority !== undefined) fields.priority = readEnum(priority, TASK_PRIORITIES, 'priority');

  if (assignee !== undefined && assignee !== null) {
    readObjectId(assignee, 'assignee');
    if (!isMember(project, assignee)) throw invalid('assignee', 'Assignee must be a member of the project');
    fields.assignee = assignee;
  }

  if (labels !== undefined) {
    if (!Array.isArray(labels) || !labels.every((label) => typeof label === 'string')) {
      throw invalid('labels', 'labels must be an array of strings');
    }
    fields.labels = labels;
  }

  if (dueDate !== undefined && dueDate !== null) fields.dueDate = readDate(dueDate, 'dueDate');

  if (githubIssue !== undefined) {
    const issue = githubIssue;
    if (!issue || typeof issue !== 'object' || Array.isArray(issue)) {
      throw invalid('githubIssue', 'githubIssue must be an object');
    }
    const { url, title: issueTitle, state } = issue;
    if (typeof url !== 'string' || !url.startsWith('https://github.com/')) {
      throw invalid('githubIssue.url', 'githubIssue.url must start with https://github.com/');
    }
    fields.githubIssue = { url };
    if (issueTitle !== undefined) fields.githubIssue.title = readOptionalString(issueTitle, 'githubIssue.title');
    if (state !== undefined) fields.githubIssue.state = readOptionalString(state, 'githubIssue.state');
  }

  return fields;
};

// Finds the task named in the URL, but only inside the project from the URL (otherwise 404).
const loadTask = async (req) => {
  const taskId = readObjectId(req.params.taskId, 'taskId');
  const task = await Task.findOne({ _id: taskId, project: req.project._id });
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};

const isOwner = (req) => req.projectRole === 'owner'; // an admin counts as owner
const isCreator = (req, task) => String(task.createdBy) === String(req.user._id);
const isAssignee = (req, task) => Boolean(task.assignee) && String(task.assignee) === String(req.user._id);

// POST /api/projects/:projectId/tasks
export const createTask = asyncHandler(async (req, res) => {
  const fields = readTaskFields(req.body, req.project);
  if (req.body.status !== undefined) fields.status = readEnum(req.body.status, TASK_STATUSES, 'status');

  const task = await Task.create({ ...fields, project: req.project._id, createdBy: req.user._id });
  await task.populate(POPULATE);
  res.status(201).json({ success: true, data: task });
});

// GET /api/projects/:projectId/tasks?status=&priority=&assignee=&label=&dueBefore=&search=&sort=&page=&limit=
export const listTasks = asyncHandler(async (req, res) => {
  const { query } = req;
  const status = readQueryString(query.status, 'status');
  const priority = readQueryString(query.priority, 'priority');
  const assignee = readQueryString(query.assignee, 'assignee');
  const label = readQueryString(query.label, 'label');
  const dueBefore = readQueryString(query.dueBefore, 'dueBefore');
  const search = readQueryString(query.search, 'search');
  const sortKey = readQueryString(query.sort, 'sort') || '-createdAt';

  if (status) readEnum(status, TASK_STATUSES, 'status');
  if (priority) readEnum(priority, TASK_PRIORITIES, 'priority');
  if (!SORTS[sortKey]) throw invalid('sort', `sort must be one of: ${Object.keys(SORTS).join(', ')}`);

  const filter = { project: req.project._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee) filter.assignee = new mongoose.Types.ObjectId(readObjectId(assignee, 'assignee'));
  if (label) filter.labels = label.toLowerCase();
  if (dueBefore) filter.dueDate = { $lt: readDate(dueBefore, 'dueBefore') };
  if (search) {
    const pattern = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  const page = readPositiveInt(query.page, 1);
  const limit = Math.min(readPositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT);

  // An aggregation (not find().sort()) because priority order and "no dueDate last" need computed sort keys.
  const [tasks, total] = await Promise.all([
    Task.aggregate([
      { $match: filter },
      {
        $addFields: {
          noDue: { $cond: [{ $ifNull: ['$dueDate', false] }, 0, 1] },
          priorityRank: {
            $switch: {
              branches: [
                { case: { $eq: ['$priority', 'high'] }, then: 0 },
                { case: { $eq: ['$priority', 'medium'] }, then: 1 },
              ],
              default: 2,
            },
          },
        },
      },
      { $sort: SORTS[sortKey] },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { noDue: 0, priorityRank: 0 } },
    ]),
    Task.countDocuments(filter),
  ]);

  await Task.populate(tasks, POPULATE);
  res.status(200).json({ success: true, data: tasks, page, limit, total });
});

// GET /api/projects/:projectId/tasks/:taskId
export const getTask = asyncHandler(async (req, res) => {
  const task = await loadTask(req);
  await task.populate(POPULATE);
  res.status(200).json({ success: true, data: task });
});

// PUT /api/projects/:projectId/tasks/:taskId: owner (or admin), creator or assignee.
// A full replace of the editable fields: anything omitted is cleared. status, project and createdBy never change.
export const updateTask = asyncHandler(async (req, res) => {
  const task = await loadTask(req);
  if (!isOwner(req) && !isCreator(req, task) && !isAssignee(req, task)) {
    throw new ApiError(403, 'Only the project owner, the task creator or the assignee can edit this task');
  }

  const fields = readTaskFields(req.body, req.project);
  task.title = fields.title;
  task.description = fields.description ?? '';
  task.priority = fields.priority ?? 'medium';
  task.assignee = fields.assignee ?? null;
  task.labels = fields.labels ?? [];
  task.dueDate = fields.dueDate ?? null;
  task.githubIssue = fields.githubIssue; // undefined removes it
  await task.save();

  await task.populate(POPULATE);
  res.status(200).json({ success: true, data: task });
});

// PATCH /api/projects/:projectId/tasks/:taskId/status: any project member.
export const updateStatus = asyncHandler(async (req, res) => {
  const task = await loadTask(req);
  task.status = readEnum(req.body.status, TASK_STATUSES, 'status');
  await task.save();

  await task.populate(POPULATE);
  res.status(200).json({ success: true, data: task });
});

// DELETE /api/projects/:projectId/tasks/:taskId: owner (or admin) or the creator. Its comments go too.
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await loadTask(req);
  if (!isOwner(req) && !isCreator(req, task)) {
    throw new ApiError(403, 'Only the project owner or the task creator can delete this task');
  }

  await Comment.deleteMany({ task: task._id });
  await task.deleteOne();
  res.status(204).send();
});
