// serveClient(app): in production, serves the built React app (client/dist) from the same origin as the API.
// Call it after the /api routes and before the not-found and error handlers. Nothing happens in development
// (Vite serves the client there). Hashed files in /assets/ are cached for a year; index.html is never cached.
// Any GET/HEAD for a page-like path (not /api, no file extension) returns index.html so deep links such as
// /projects work; a missing file such as /assets/nope.js gets a plain 404, never index.html.
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../client/dist');
const INDEX = path.join(DIST, 'index.html');
const API_PATH = /^\/api(\/|$)/;

const serveClient = (app) => {
  if (process.env.NODE_ENV !== 'production') return;

  if (!fs.existsSync(INDEX)) {
    console.warn('⚠️  client/dist/index.html not found: serving the API only. Build the client first (npm run build).');
    return;
  }

  app.use(
    express.static(DIST, {
      index: false,
      setHeaders: (res, filePath) => {
        const file = filePath.split(path.sep).join('/');
        if (file.includes('/assets/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        else if (file.endsWith('/index.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    })
  );

  app.use((req, res, next) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || API_PATH.test(req.path)) return next();
    if (path.extname(req.path)) return res.status(404).type('text/plain').send('Not found');
    if (!req.accepts('html')) return next();
    res.setHeader('Cache-Control', 'no-cache');
    return res.sendFile(INDEX);
  });
};

export default serveClient;
