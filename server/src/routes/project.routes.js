// Project routes, mounted at /api/projects in app.js. Every route needs a valid token (auth).
// activityLogger records project and member changes in the activity feed (deleting a project is not logged).
// projectAccess checks membership; requireProjectOwner limits a route to the project owner (or an admin).
import { Router } from 'express';
import {
  addMember,
  createProject,
  deleteProject,
  getProject,
  listProjects,
  removeMember,
  updateProject,
  updateStatus,
} from '../controllers/project.controller.js';
import activityLogger from '../middleware/activityLogger.js';
import auth from '../middleware/auth.js';
import { projectAccess, requireProjectOwner } from '../middleware/projectAccess.js';

const router = Router();

router.use(auth);

router.post('/', activityLogger('project.created'), createProject);
router.get('/', listProjects);
router.get('/:projectId', projectAccess, getProject);
router.put('/:projectId', projectAccess, requireProjectOwner, activityLogger('project.updated'), updateProject);
router.patch(
  '/:projectId/status',
  projectAccess,
  requireProjectOwner,
  activityLogger('project.updated', { statusChange: true }),
  updateStatus
);
router.delete('/:projectId', projectAccess, requireProjectOwner, deleteProject);
router.post(
  '/:projectId/members',
  projectAccess,
  requireProjectOwner,
  activityLogger('member.added', { preload: 'user' }),
  addMember
);
router.delete(
  '/:projectId/members/:userId',
  projectAccess,
  requireProjectOwner,
  activityLogger('member.removed', { preload: 'user' }),
  removeMember
);

export default router;
