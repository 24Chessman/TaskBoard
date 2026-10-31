// Activity model. Fields:
//   project ObjectId(Project), required
//   task    ObjectId(Task), optional
//   actor   ObjectId(User), required
//   action  String, one of ACTIVITY_ACTIONS, required
//   message String, required, trimmed, readable summary (for example "moved 'Login page' to Review")
// Activity is append-only: no update or delete endpoints will exist.
import mongoose from 'mongoose';
import { ACTIVITY_ACTIONS } from '../utils/constants.js';

const activitySchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ACTIVITY_ACTIONS, required: true },
    message: { type: String, required: [true, 'Message is required'], trim: true },
  },
  { timestamps: true }
);

activitySchema.index({ project: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
