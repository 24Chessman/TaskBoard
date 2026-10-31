// User routes, mounted at /api/users in app.js. Every route needs a valid token (auth).
// Changing a role and deleting a user are admin only (requireRole).
import { Router } from 'express';
import {
  deleteUser,
  getUser,
  searchUsers,
  updateRole,
  updateUser,
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = Router();

router.use(auth);

router.get('/', searchUsers);
router.get('/:userId', getUser);
router.put('/:userId', updateUser);
router.patch('/:userId/role', requireRole('admin'), updateRole);
router.delete('/:userId', requireRole('admin'), deleteUser);

export default router;
