// Project controller: create, list, get, update, archive, delete and member management.
// Access checks are done by projectAccess / requireProjectOwner before these run (req.project is loaded).
// Member changes use document save() so the Project model validators (no duplicates, one owner) run.
import Activity from '../models/Activity.js';
import Comment from '../models/Comment.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { PROJECT_STATUSES } from '../utils/constants.js';

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MEMBER_FIELDS = 'name email';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Query values must be plain strings (blocks operator objects like ?search[$ne]=x)
const readQueryString = (value, name) => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new ApiError(400, `Invalid ${name}`);
  return value.trim();
};

const readPositiveInt = (value, fallback) => {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number >= 1 ? number : fallback;
};

const readObjectId = (value, name) => {
  if (typeof value !== 'string' || !OBJECT_ID_PATTERN.test(value)) throw new ApiError(400, `Invalid ${name}`);
  return value;
};

const countOwners = (project) => project.members.filter((member) => member.role === 'owner').length;

// POST /api/projects: only name and description are read; the creator becomes the owner.
export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    members: [{ user: req.user._id, role: 'owner' }],
  });
  await project.populate('members.user', MEMBER_FIELDS);
  res.status(201).json({ success: true, data: project });
});

// GET /api/projects?search=&status=&page=&limit= : the caller's projects (an admin sees all).
export const listProjects = asyncHandler(async (req, res) => {
  const search = readQueryString(req.query.search, 'search');
  const status = readQueryString(req.query.status, 'status');
  if (status && !PROJECT_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid status: use ${PROJECT_STATUSES.join(' or ')}`);
  }

  const page = readPositiveInt(req.query.page, 1);
  const limit = Math.min(readPositiveInt(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);

  const filter = {};
  if (req.user.role !== 'admin') filter['members.user'] = req.user._id;
  if (status) filter.status = status;
  if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('members.user', MEMBER_FIELDS),
    Project.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, data: projects, page, limit, total });
});

// GET /api/projects/:projectId
export const getProject = asyncHandler(async (req, res) => {
  await req.project.populate('members.user', MEMBER_FIELDS);
  res.status(200).json({ success: true, data: req.project });
});

// PUT /api/projects/:projectId: only name and description can change here.
export const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (name !== undefined) req.project.name = name;
  if (description !== undefined) req.project.description = description;
  await req.project.save();
  await req.project.populate('members.user', MEMBER_FIELDS);
  res.status(200).json({ success: true, data: req.project });
});

// PATCH /api/projects/:projectId/status: archive or reactivate.
export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!PROJECT_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid status: use ${PROJECT_STATUSES.join(' or ')}`);
  }
  req.project.status = status;
  await req.project.save();
  await req.project.populate('members.user', MEMBER_FIELDS);
  res.status(200).json({ success: true, data: req.project });
});

// DELETE /api/projects/:projectId: removes the project's comments, tasks and activity first (cascade).
export const deleteProject = asyncHandler(async (req, res) => {
  const project = req.project._id;
  await Comment.deleteMany({ project });
  await Task.deleteMany({ project });
  await Activity.deleteMany({ project });
  await req.project.deleteOne();
  res.status(204).send();
});

// POST /api/projects/:projectId/members: body { userId }. New members always get the "member" role.
export const addMember = asyncHandler(async (req, res) => {
  const userId = readObjectId(req.body.userId, 'userId');

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (req.project.members.some((member) => String(member.user) === userId)) {
    throw new ApiError(409, 'User is already a member of this project');
  }

  req.project.members.push({ user: user._id, role: 'member' });
  await req.project.save();
  await req.project.populate('members.user', MEMBER_FIELDS);
  res.status(201).json({ success: true, data: req.project });
});

// DELETE /api/projects/:projectId/members/:userId: the last owner cannot be removed.
// The removed user's tasks in this project are unassigned.
export const removeMember = asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.userId, 'userId');

  const member = req.project.members.find((entry) => String(entry.user) === userId);
  if (!member) throw new ApiError(404, 'User is not a member of this project');
  if (member.role === 'owner' && countOwners(req.project) === 1) {
    throw new ApiError(400, 'A project must have at least one owner');
  }

  req.project.members = req.project.members.filter((entry) => String(entry.user) !== userId);
  await req.project.save();
  await Task.updateMany({ project: req.project._id, assignee: userId }, { assignee: null });
  res.status(204).send();
});
