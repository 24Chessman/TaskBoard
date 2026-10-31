// Project access middleware. Both read the id from req.params.projectId, so any router mounted under
// /api/projects/:projectId/... (tasks, comments, activity) can reuse them after the auth middleware.
//   projectAccess:       loads the project, works out the caller's role and sets req.project and req.projectRole.
//                        A global admin counts as owner on every project. A non-member gets 403.
//   requireProjectOwner: 403 unless req.projectRole is "owner". Use it after projectAccess.
import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export const projectAccess = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  if (!OBJECT_ID_PATTERN.test(projectId)) throw new ApiError(400, 'Invalid projectId');

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');

  const membership = project.members.find((member) => String(member.user) === String(req.user._id));
  const role = req.user.role === 'admin' ? 'owner' : membership?.role;
  if (!role) throw new ApiError(403, 'You are not a member of this project');

  req.project = project;
  req.projectRole = role;
  next();
});

export const requireProjectOwner = (req, res, next) => {
  if (req.projectRole !== 'owner') {
    return next(new ApiError(403, 'Only the project owner can do this'));
  }
  return next();
};
