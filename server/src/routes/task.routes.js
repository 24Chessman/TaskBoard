// Task routes, mounted at /api/projects/:projectId/tasks in app.js.
// mergeParams exposes :projectId; auth then projectAccess run first, so every route needs project membership.
import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateStatus,
  updateTask,
} from '../controllers/task.controller.js';
import auth from '../middleware/auth.js';
import { projectAccess } from '../middleware/projectAccess.js';

const router = Router({ mergeParams: true });

router.use(auth, projectAccess);

router.post('/', createTask);
router.get('/', listTasks);
router.get('/:taskId', getTask);
router.put('/:taskId', updateTask);
router.patch('/:taskId/status', updateStatus);
router.delete('/:taskId', deleteTask);

export default router;
