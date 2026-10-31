// Project model. Fields:
//   name        String, required, trimmed, 3 to 80 chars
//   description String, optional, max 500 chars
//   status      String, "active" or "archived", default "active"
//   members     [{ user: ObjectId(User), role: "owner" | "member" }]
//               a user appears at most once and at least one member is an owner
import mongoose from 'mongoose';
import { PROJECT_ROLES, PROJECT_STATUSES } from '../utils/constants.js';

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: PROJECT_ROLES, required: true },
  },
  { _id: false }
);

const hasNoDuplicateUsers = (members) =>
  new Set(members.map((member) => String(member.user))).size === members.length;

const hasOwner = (members) => members.some((member) => member.role === 'owner');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Project name must be at least 3 characters'],
      maxlength: [80, 'Project name must be at most 80 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    status: { type: String, enum: PROJECT_STATUSES, default: 'active' },
    members: {
      type: [memberSchema],
      validate: [
        { validator: hasNoDuplicateUsers, message: 'A user can only be a member once' },
        { validator: hasOwner, message: 'A project must have at least one owner' },
      ],
    },
  },
  { timestamps: true }
);

projectSchema.index({ 'members.user': 1 });

export default mongoose.model('Project', projectSchema);
