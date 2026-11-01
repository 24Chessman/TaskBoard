// Task routes, mounted at /api/projects/:projectId/tasks in app.js.
// mergeParams exposes :projectId; auth then projectAccess run first, so every route needs project membership.
// activityLogger records task changes in the activity feed.
import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateStatus,
  updateTask,
} from '../controllers/task.controller.js';
import activityLogger from '../middleware/activityLogger.js';
import auth from '../middleware/auth.js';
import { projectAccess } from '../middleware/projectAccess.js';

const router = Router({ mergeParams: true });

router.use(auth, projectAccess);

router.post('/', activityLogger('task.created'), createTask);
router.get('/', listTasks);
router.get('/:taskId', getTask);
router.put('/:taskId', activityLogger('task.updated'), updateTask);
router.patch('/:taskId/status', activityLogger('task.status_changed'), updateStatus);
router.delete('/:taskId', activityLogger('task.deleted', { preload: 'task' }), deleteTask);

export default router;
