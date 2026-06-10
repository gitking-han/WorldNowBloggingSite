export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export interface Region {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categories?: string[];
  category?: string;
  region?: string;
  location?: string;
  tags: string[];
  featuredImage: string;
  author: string;
  readingTime: string;
  views: number;
  status: 'draft' | 'published';
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  blogSlug: string;
  blogTitle?: string;
  name: string;
  email?: string;
  content: string;
  status?: 'pending' | 'approved' | 'spam';
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  defaultOgImage: string;
  robotsTxt: string;
  sitemapUrl: string;
}
