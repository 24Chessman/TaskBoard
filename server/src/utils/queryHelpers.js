// Small validators for ids, query strings, numbers and dates. Every failure throws a 400 ApiError.
// (Same ideas as the private helpers in project.controller.js, kept separate so each module stays independent.)
import ApiError from './ApiError.js';

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export const isObjectId = (value) => typeof value === 'string' && OBJECT_ID_PATTERN.test(value);

export const readObjectId = (value, name) => {
  if (!isObjectId(value)) throw new ApiError(400, `Invalid ${name}`);
  return value;
};

export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Query values must be plain strings (blocks operator objects like ?search[$ne]=x). Empty means "not given".
export const readQueryString = (value, name) => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new ApiError(400, `Invalid ${name}`);
  return value.trim() || undefined;
};

// Invalid or non-positive numbers fall back to the default.
export const readPositiveInt = (value, fallback) => {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number >= 1 ? number : fallback;
};

export const readDate = (value, name) => {
  const date = new Date(value);
  if (typeof value !== 'string' || Number.isNaN(date.getTime())) throw new ApiError(400, `Invalid ${name}`);
  return date;
};
