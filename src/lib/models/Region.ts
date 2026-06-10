import mongoose from 'mongoose';

const RegionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
}, { timestamps: true });

export default mongoose.models.Region || mongoose.model('Region', RegionSchema);
