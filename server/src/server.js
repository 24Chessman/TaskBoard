import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env (fallback to default .env lookup)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Fail fast: tokens cannot be signed or verified without a secret
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined. Set it in server/.env (see .env.example).');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`🚀 TaskBoard Server running on port ${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default server;
