// Admin seed script: npm run seed:admin
// Reads ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (from the environment or server/.env), connects to MONGO_URI
// and creates an admin user. If a user with that email already exists they are promoted to admin instead
// (their password is left unchanged). It only prints what it did, never the password.
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import User from '../models/User.js';

const MIN_PASSWORD_LENGTH = 6;

// Core logic, exported so it can be tested without a command line. Returns { action, email }.
export const seedAdmin = async ({ name, email, password }) => {
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!cleanName || !cleanEmail || !password) {
    throw new Error('ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must all be set');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    if (existing.role === 'admin') return { action: 'already an admin', email: cleanEmail };
    existing.role = 'admin';
    await existing.save();
    return { action: 'promoted to admin', email: cleanEmail };
  }

  await User.create({ name: cleanName, email: cleanEmail, password, role: 'admin' });
  return { action: 'created admin', email: cleanEmail };
};

const run = async () => {
  dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;

  try {
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined in environment variables');
    // Check the inputs before connecting so a bad setup fails fast.
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must all be set');
    }
    await mongoose.connect(MONGO_URI);
    const result = await seedAdmin({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    console.log(`${result.action}: ${result.email}`);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

// Run only when started from the command line, not when imported.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
