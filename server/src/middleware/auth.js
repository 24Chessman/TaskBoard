// auth middleware: reads "Authorization: Bearer <token>", verifies the JWT, loads the user
// from the database and attaches it as req.user. Any failure responds 401.
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const auth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) throw new ApiError(401, 'Authentication required: no token provided');

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Invalid authorization header: expected "Bearer <token>"');
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
    throw new ApiError(401, message);
  }

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
});

export default auth;
