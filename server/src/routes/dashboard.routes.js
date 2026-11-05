// Dashboard route, mounted at /api/projects/:projectId/dashboard in app.js.
// Only GET exists. auth and projectAccess are attached to it (project members only; an admin counts as owner).
import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import auth from '../middleware/auth.js';
import { projectAccess } from '../middleware/projectAccess.js';

const router = Router({ mergeParams: true });

router.get('/', auth, projectAccess, getDashboard);

export default router;
