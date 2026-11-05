// CORS policy. Development: the Vite client origin (CLIENT_ORIGIN, default http://localhost:5173), as before.
// Production: the app is served from the same origin as the API, so cross-origin requests are only allowed from
// the origins listed in the optional CLIENT_ORIGIN (comma separated); with none set, no CORS headers are added.
// The variable is read on each request so a value loaded from server/.env after the imports is still seen.
import cors from 'cors';

const allowedOrigins = () => {
  const fallback = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173';
  return (process.env.CLIENT_ORIGIN || fallback)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const corsPolicy = (req, res, next) => {
  const origins = allowedOrigins();
  if (origins.length === 0) return next();
  return cors({ origin: origins.length === 1 ? origins[0] : origins, credentials: true })(req, res, next);
};

export default corsPolicy;
