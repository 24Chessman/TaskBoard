// User controller: search users, get one, update a profile (self or admin), change role and delete (admin).
// Normal users only see _id, name and email; admins also see role and createdAt. The password is never returned
// (it is select:false and removed by User.toJSON). Updates use document save() so validation and hashing run.
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { USER_ROLES } from '../utils/constants.js';
import { escapeRegex, readObjectId, readPositiveInt, readQueryString } from '../utils/queryHelpers.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MIN_SEARCH_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 6;

const isAdmin = (req) => req.user.role === 'admin';
const visibleFields = (req) => (isAdmin(req) ? '_id name email role createdAt' : '_id name email');
const invalid = (field, message) => new ApiError(400, 'Validation Error', [{ field, message }]);

const readRequiredString = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) throw invalid(name, `${name} is required`);
  return value.trim();
};

const countAdmins = () => User.countDocuments({ role: 'admin' });

// GET /api/users?search=&page=&limit=
export const searchUsers = asyncHandler(async (req, res) => {
  const search = readQueryString(req.query.search, 'search');
  if (!isAdmin(req) && (!search || search.length < MIN_SEARCH_LENGTH)) {
    throw new ApiError(400, `Search must be at least ${MIN_SEARCH_LENGTH} characters`);
  }

  const page = readPositiveInt(req.query.page, 1);
  const limit = Math.min(readPositiveInt(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);

  const filter = {};
  if (search) {
    const pattern = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ name: pattern }, { email: pattern }];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(visibleFields(req))
      .sort({ name: 1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, data: users, page, limit, total });
});

// GET /api/users/:userId
export const getUser = asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.userId, 'userId');
  const user = await User.findById(userId).select(visibleFields(req));
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json({ success: true, data: user });
});

// PUT /api/users/:userId: the account owner or an admin. name and email are required, password is optional.
// A non-admin changing their own password must send the correct currentPassword. That check answers 400
// (not 401) because the client treats every 401 as an expired session and would log the user out.
export const updateUser = asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.userId, 'userId');
  const isSelf = String(req.user._id) === userId;
  if (!isSelf && !isAdmin(req)) throw new ApiError(403, 'You can only edit your own profile');

  const { name, email, password, currentPassword } = req.body;
  const cleanName = readRequiredString(name, 'name');
  const cleanEmail = readRequiredString(email, 'email').toLowerCase();
  if (password !== undefined && typeof password !== 'string') throw invalid('password', 'password must be a string');
  if (currentPassword !== undefined && typeof currentPassword !== 'string') {
    throw invalid('currentPassword', 'currentPassword must be a string');
  }
  if (password !== undefined && password.length < MIN_PASSWORD_LENGTH) {
    throw invalid('password', `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  if (password !== undefined && isSelf && !isAdmin(req)) {
    if (!currentPassword) throw invalid('currentPassword', 'Current password is required to change your password');
    if (!(await user.comparePassword(currentPassword))) {
      throw invalid('currentPassword', 'Current password is incorrect');
    }
  }

  if (await User.exists({ email: cleanEmail, _id: { $ne: user._id } })) {
    throw new ApiError(409, 'Email already registered');
  }

  user.name = cleanName;
  user.email = cleanEmail;
  if (password !== undefined) user.password = password;
  await user.save();

  res.status(200).json({ success: true, data: user });
});

// PATCH /api/users/:userId/role (admin only, enforced in the route): body { role }.
export const updateRole = asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.userId, 'userId');
  const { role } = req.body;
  if (!USER_ROLES.includes(role)) throw invalid('role', `role must be one of: ${USER_ROLES.join(', ')}`);

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.role === 'admin' && role !== 'admin' && (await countAdmins()) <= 1) {
    throw new ApiError(400, 'There must be at least one admin');
  }

  user.role = role;
  await user.save();
  res.status(200).json({ success: true, data: user });
});

// DELETE /api/users/:userId (admin only, enforced in the route).
// Refuses (409) if the user is the only owner of a project. Otherwise removes them from every project,
// unassigns their tasks and deletes them. Their comments and activity records stay.
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.userId, 'userId');
  if (String(req.user._id) === userId) throw new ApiError(400, 'You cannot delete your own account');

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin' && (await countAdmins()) <= 1) {
    throw new ApiError(400, 'The last admin cannot be deleted');
  }

  const projects = await Project.find({ 'members.user': user._id });
  const soleOwnerOf = projects.filter((project) => {
    const owners = project.members.filter((member) => member.role === 'owner');
    return owners.length === 1 && String(owners[0].user) === userId;
  });
  if (soleOwnerOf.length > 0) {
    const names = soleOwnerOf.map((project) => project.name).join(', ');
    throw new ApiError(409, `User is the only owner of: ${names}. Transfer or delete those projects first`);
  }

  for (const project of projects) {
    project.members = project.members.filter((member) => String(member.user) !== userId);
    await project.save();
  }
  await Task.updateMany({ assignee: user._id }, { assignee: null });
  await user.deleteOne();

  res.status(204).send();
});
