// Comment model. Fields:
//   task    ObjectId(Task), required
//   project ObjectId(Project), required (for access checks)
//   author  ObjectId(User), required (set by the server)
//   text    String, required, trimmed, 1 to 1000 chars
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      minlength: [1, 'Comment text is required'],
      maxlength: [1000, 'Comment must be at most 1000 characters'],
    },
  },
  { timestamps: true }
);

commentSchema.index({ task: 1, createdAt: 1 });

export default mongoose.model('Comment', commentSchema);
