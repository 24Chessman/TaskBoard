// Activity routes, mounted at /api/projects/:projectId/activity in app.js.
// Only GET exists: activity is append-only, so a POST, PUT, PATCH or DELETE to this path matches no route and
// ends in the normal 404. auth and projectAccess are attached to the GET itself (project members only).
import { Router } from 'express';
import { listActivity } from '../controllers/activity.controller.js';
import auth from '../middleware/auth.js';
import { projectAccess } from '../middleware/projectAccess.js';

const router = Router({ mergeParams: true });

router.get('/', auth, projectAccess, listActivity);

export default router;
