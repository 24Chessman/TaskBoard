// Comment controller: add, list, edit and delete the comments of one task.
// The project always comes from req.project (set by projectAccess) and the author from req.user, never from the
// body. A task is only found inside the project from the URL, and a comment only inside that task (otherwise 404).
// A comment whose author account was deleted comes back with author: null; nothing here reads the author object.
import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { readObjectId, readPositiveInt, readQueryString } from '../utils/queryHelpers.js';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const TEXT_MAX = 1000;
const AUTHOR_FIELDS = 'name email';

const loadTask = async (req) => {
  const taskId = readObjectId(req.params.taskId, 'taskId');
  const task = await Task.findOne({ _id: taskId, project: req.project._id }).select('_id');
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};

const loadComment = async (req, task) => {
  const commentId = readObjectId(req.params.commentId, 'commentId');
  const comment = await Comment.findOne({ _id: commentId, task: task._id, project: req.project._id });
  if (!comment) throw new ApiError(404, 'Comment not found');
  return comment;
};

// text must be a string with 1 to 1000 characters once trimmed
const readText = (value) => {
  const invalid = (message) => new ApiError(400, 'Validation Error', [{ field: 'text', message }]);
  if (typeof value !== 'string') throw invalid('Comment text is required');
  const text = value.trim();
  if (!text) throw invalid('Comment text is required');
  if (text.length > TEXT_MAX) throw invalid(`Comment must be at most ${TEXT_MAX} characters`);
  return text;
};

const isAuthor = (req, comment) => String(comment.author) === String(req.user._id);

// POST /api/projects/:projectId/tasks/:taskId/comments: any project member
export const createComment = asyncHandler(async (req, res) => {
  const task = await loadTask(req);
  const text = readText(req.body.text);

  const comment = await Comment.create({ task: task._id, project: req.project._id, author: req.user._id, text });
  await comment.populate('author', AUTHOR_FIELDS);
  res.status(201).json({ success: true, data: comment });
});

// GET /api/projects/:projectId/tasks/:taskId/comments?page=&limit= : any project member, oldest first
export const listComments = asyncHandler(async (req, res) => {
  const task = await loadTask(req);
  const page = readPositiveInt(readQueryString(req.query.page, 'page'), 1);
  const limit = Math.min(readPositiveInt(readQueryString(req.query.limit, 'limit'), DEFAULT_LIMIT), MAX_LIMIT);

  const filter = { task: task._id, project: req.project._id };
  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: 1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS),
    Comment.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, data: comments, page, limit, total });
});

// PUT /api/projects/:projectId/tasks/:taskId/comments/:commentId: only the author (not the owner, not an admin)
export const updateComment = asyncHandler(async (req, res) => {
  const task = await loadTask(req);
  const comment = await loadComment(req, task);
  if (!isAuthor(req, comment)) throw new ApiError(403, 'Only the author can edit this comment');

  comment.text = readText(req.body.text);
  await comment.save();
  await comment.populate('author', AUTHOR_FIELDS);
  res.status(200).json({ success: true, data: comment });
});

// DELETE /api/projects/:projectId/tasks/:taskId/comments/:commentId: the author, the project owner or an admin
export const deleteComment = asyncHandler(async (req, res) => {
  const task = await loadTask(req);
  const comment = await loadComment(req, task);
  if (!isAuthor(req, comment) && req.projectRole !== 'owner') {
    throw new ApiError(403, 'Only the author or the project owner can delete this comment');
  }

  await comment.deleteOne();
  res.status(204).send();
});
