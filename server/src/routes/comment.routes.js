// Comment routes, mounted at /api/projects/:projectId/tasks/:taskId/comments in app.js.
// mergeParams exposes :projectId and :taskId; auth then projectAccess run first, so every route needs project
// membership. Adding a comment is recorded in the activity feed by activityLogger (it preloads the task title).
import { Router } from 'express';
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from '../controllers/comment.controller.js';
import activityLogger from '../middleware/activityLogger.js';
import auth from '../middleware/auth.js';
import { projectAccess } from '../middleware/projectAccess.js';

const router = Router({ mergeParams: true });

router.use(auth, projectAccess);

router.post('/', activityLogger('comment.added', { preload: 'task' }), createComment);
router.get('/', listComments);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;
