import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import checkProductionEnv from './config/checkEnv.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env (fallback to default .env lookup)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// In production refuse to start with a missing or weak configuration (messages name the variable, never its value)
if (process.env.NODE_ENV === 'production') {
  const problems = checkProductionEnv(process.env);
  if (problems.length > 0) {
    problems.forEach((problem) => console.error(`❌ ${problem}. Set it in the host environment (see server/.env.example).`));
    process.exit(1);
  }
}

// Fail fast: tokens cannot be signed or verified without a secret
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined. Set it in server/.env (see .env.example).');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TaskBoard Server running on port ${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default server;
