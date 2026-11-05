// GitHub routes, mounted at /api/github in app.js. Only GET /issue exists, and it needs a logged-in user.
import { Router } from 'express';
import { getIssue } from '../controllers/github.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/issue', auth, getIssue);

export default router;
