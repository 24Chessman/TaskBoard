// Auth controller: register, login and me. Responses use { success, data } (errors go to errorHandler).
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

// Required string fields; rejecting non-strings also blocks NoSQL operator objects like { "$gt": "" }.
const missingFields = (body, fields) =>
  fields
    .filter((field) => typeof body[field] !== 'string' || !body[field].trim())
    .map((field) => ({ field, message: `${field} is required` }));

const sendAuth = (res, status, user) =>
  res.status(status).json({ success: true, data: { token: generateToken(user._id), user } });

// POST /api/auth/register: only name, email and password are read, so a role can never be supplied.
export const register = asyncHandler(async (req, res) => {
  const errors = missingFields(req.body, ['name', 'email', 'password']);
  if (errors.length) throw new ApiError(400, 'Validation Error', errors);

  const { name, email, password } = req.body;
  if (await User.exists({ email: email.trim().toLowerCase() })) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({ name, email, password });
  sendAuth(res, 201, user);
});

// POST /api/auth/login: the same message for a wrong email or password, so neither is revealed.
export const login = asyncHandler(async (req, res) => {
  const errors = missingFields(req.body, ['email', 'password']);
  if (errors.length) throw new ApiError(400, 'Validation Error', errors);

  const user = await User.findOne({ email: req.body.email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  sendAuth(res, 200, user);
});

// GET /api/auth/me: req.user is set by the auth middleware.
export const me = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
