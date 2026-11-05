import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import activityRoutes from './routes/activity.routes.js';
import authRoutes from './routes/auth.routes.js';
import commentRoutes from './routes/comment.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import githubRoutes from './routes/github.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import corsPolicy from './middleware/corsPolicy.js';
import notFound from './middleware/notFound.js';
import securityHeaders from './middleware/securityHeaders.js';
import serveClient from './middleware/serveClient.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.disable('x-powered-by');
// In production the app sits behind the host's proxy: trust its X-Forwarded-* headers (one hop)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

// 0. Security headers
app.use(securityHeaders);

// 1. CORS middleware (see middleware/corsPolicy.js)
app.use(corsPolicy);

// 2. Request logger (Morgan)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 3. Body parser
app.use(express.json());

// 4. Health check route (public): is the process up and is the database connected
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: Math.round(process.uptime()),
    },
  });
});

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks/:taskId/comments', commentRoutes);
app.use('/api/projects/:projectId/activity', activityRoutes);
app.use('/api/projects/:projectId/dashboard', dashboardRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/github', githubRoutes);

// 5b. Production only: the built React app and its deep-link fallback
serveClient(app);

// 6. Not found middleware (unmatched routes)
app.use(notFound);

// 7. Centralized error handling middleware (must be last)
app.use(errorHandler);

export default app;
