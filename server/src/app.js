import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// 1. CORS middleware
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

// 2. Request logger (Morgan)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 3. Body parser
app.use(express.json());

// 4. Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskBoard API is healthy',
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// 6. Not found middleware (unmatched routes)
app.use(notFound);

// 7. Centralized error handling middleware (must be last)
app.use(errorHandler);

export default app;
