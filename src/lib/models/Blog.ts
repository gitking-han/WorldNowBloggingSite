import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  categories: [{ type: String }],
  category: { type: String },
  region: { type: String },
  location: { type: String },
  tags: [String],
  featuredImage: String,
  author: String,
  readingTime: String,
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  seoTitle: String,
  metaDescription: String,
  ogImage: String,
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
