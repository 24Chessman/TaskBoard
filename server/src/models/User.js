// User model. Fields:
//   name     String, required, trimmed, 2 to 50 chars
//   email    String, required, unique, lowercase, trimmed, valid format
//   password String, required, min 6 chars, never selected by default and removed from toJSON
//   role     String, "user" or "admin", default "user"
// bcrypt hashing is added in M2.1 (a pre-save hook); validation runs before hashing.
import mongoose from 'mongoose';
import { USER_ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: { type: String, enum: USER_ROLES, default: 'user' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

export default mongoose.model('User', userSchema);
