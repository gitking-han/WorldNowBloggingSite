import React from 'react';
import Link from 'next/link';
import { Blog } from '@/types';

interface ArticleCardProps {
  blog: Blog;
  key?: any;
}

export default function ArticleCard({ blog }: ArticleCardProps) {
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80';

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const currentTarget = event.currentTarget;

    if (currentTarget.src !== FALLBACK_IMAGE) {
      currentTarget.onerror = null;
      currentTarget.src = FALLBACK_IMAGE;
    }
  };

  return (
    <div className="group flex flex-col h-full cursor-pointer bg-white border border-[#e8e0d0] hover:border-[#b5150e]/30 pointer-events-auto shadow-sm hover:shadow-md transition-all duration-300 p-4 rounded-md">
      <Link href={`/blog/${blog.slug}`} className="flex flex-col h-full justify-between">
        <div>
          <div className="w-full aspect-[3/2] overflow-hidden rounded mb-3 relative bg-[#e8e0d0]">
            <img
              src={blog.featuredImage || FALLBACK_IMAGE}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={handleImageError}
            />
            <div className="absolute bottom-3 left-3 flex flex-col gap-1">
              <span className="bg-[#0d0d0d]/80 text-white font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 rounded block">
                {Array.isArray(blog.categories)
                  ? blog.categories.filter(c => c !== 'asia').join(', ') || blog.category
                  : blog.category}
              </span>
              {blog.location && (
                <span className="bg-[#b5150e]/80 text-white font-sans text-[8px] uppercase tracking-widest px-2 py-0.5 rounded block">
                  📍 {blog.location}
                </span>
              )}
            </div>
          </div>

          <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-[#b5150e] mb-1 block">
            {(Array.isArray(blog.categories) && blog.categories.length > 0)
              ? blog.categories.join(', ')
              : blog.category}
          </span>

          <h3 className="font-serif font-bold text-lg leading-tight text-[#0d0d0d] group-hover:text-[#b5150e] mb-2 transition-colors duration-200">
            {blog.title}
          </h3>

          <p className="font-serif font-light text-xs text-gray-600 line-clamp-3 mb-4">
            {blog.excerpt}
          </p>
        </div>

        <div className="flex justify-between items-center text-[10px] tracking-wide text-gray-400 font-sans pt-3 border-t border-gray-100 mt-auto">
          <span>By {blog.author}</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
      </Link>
    </div>
  );
}
