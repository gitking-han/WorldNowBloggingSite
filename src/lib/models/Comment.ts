import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  blogSlug: { type: String, required: true, index: true },
  blogTitle: { type: String, default: '' },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, default: '' },
  content: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'approved', 'spam'], default: 'approved' },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
