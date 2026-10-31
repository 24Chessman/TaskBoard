// Project routes, mounted at /api/projects in app.js. Every route needs a valid token (auth).
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
import auth from '../middleware/auth.js';
import { projectAccess, requireProjectOwner } from '../middleware/projectAccess.js';

const router = Router();

router.use(auth);

router.post('/', createProject);
router.get('/', listProjects);
router.get('/:projectId', projectAccess, getProject);
router.put('/:projectId', projectAccess, requireProjectOwner, updateProject);
router.patch('/:projectId/status', projectAccess, requireProjectOwner, updateStatus);
router.delete('/:projectId', projectAccess, requireProjectOwner, deleteProject);
router.post('/:projectId/members', projectAccess, requireProjectOwner, addMember);
router.delete('/:projectId/members/:userId', projectAccess, requireProjectOwner, removeMember);

export default router;
