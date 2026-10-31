// Task model. Fields:
//   project     ObjectId(Project), required
//   title       String, required, trimmed, 1 to 120 chars
//   description String, optional, max 2000 chars
//   status      "todo" | "in_progress" | "review" | "done", default "todo"
//   priority    "low" | "medium" | "high", default "medium"
//   assignee    ObjectId(User), optional
//   createdBy   ObjectId(User), required (set by the server)
//   labels      [String], max 5, each 1 to 20 chars, trimmed and lowercase
//   dueDate     Date, optional
//   githubIssue { url, title, state }, all optional strings (filled from the GitHub lookup)
// "assignee must be a project member" is checked in the controller in M3.3, not here.
import mongoose from 'mongoose';
import { TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants.js';

const objectId = mongoose.Schema.Types.ObjectId;

const labelsAreValid = (labels) =>
  labels.length <= 5 && labels.every((label) => label.length >= 1 && label.length <= 20);

const taskSchema = new mongoose.Schema(
  {
    project: { type: objectId, ref: 'Project', required: true },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title is required'],
      maxlength: [120, 'Title must be at most 120 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description must be at most 2000 characters'],
    },
    status: { type: String, enum: TASK_STATUSES, default: 'todo' },
    priority: { type: String, enum: TASK_PRIORITIES, default: 'medium' },
    assignee: { type: objectId, ref: 'User' },
    createdBy: { type: objectId, ref: 'User', required: true },
    labels: {
      type: [{ type: String, trim: true, lowercase: true }],
      validate: {
        validator: labelsAreValid,
        message: 'Labels: at most 5, each 1 to 20 characters',
      },
    },
    dueDate: { type: Date },
    githubIssue: {
      url: String,
      title: String,
      state: String,
    },
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, dueDate: 1 });

export default mongoose.model('Task', taskSchema);
