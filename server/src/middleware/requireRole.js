// requireRole(...roles): returns middleware that responds 403 unless req.user.role is one of the roles.
// Must run after the auth middleware, e.g. router.get('/', auth, requireRole('admin'), handler).
import ApiError from '../utils/ApiError.js';

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }
  return next();
};

export default requireRole;
