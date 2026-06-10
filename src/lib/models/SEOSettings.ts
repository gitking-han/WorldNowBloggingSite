import mongoose from 'mongoose';

const SEOSettingsSchema = new mongoose.Schema({
  siteTitle: { type: String, required: true },
  siteDescription: { type: String, required: true },
  defaultOgImage: String,
  robotsTxt: String,
  sitemapUrl: String
}, { timestamps: true });

export default mongoose.models.SEO || mongoose.model('SEO', SEOSettingsSchema);
