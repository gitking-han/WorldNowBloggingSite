'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Head from 'next/head';
import { Loader2, HelpCircle, Globe } from 'lucide-react';
import api from '@/utils/api';
import { usePageMetadata } from '@/utils/seo';
import { Blog } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { useSearchParams } from 'next/navigation';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

function ArchivePageContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const regionFilter = searchParams.get('region') || '';
  const searchFilter = searchParams.get('search') || '';

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : SITE_URL;

  usePageMetadata({
    title: 'World Now | Global & Regional News',
    description:
      'Browse the latest independent news and analysis from Pakistan and around the world.',
    url: `${appUrl}/archive`,
    type: 'website',
    image: '/browserlogo.png',
  });

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const params: Record<string, string> = {
          status: 'published',
          limit: '24',
        };
        if (categoryFilter) params.category = categoryFilter;
        if (regionFilter) params.region = regionFilter;
        if (searchFilter) params.search = searchFilter;

        const res = await api.get('/blogs', { params });
        const blogsData = Array.isArray(res.data) ? res.data : [];
        setBlogs(blogsData);
      } catch (err) {
        console.error('Failed fetching blogs list: ', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [categoryFilter, regionFilter, searchFilter]);

  const featuredBlog = blogs.find((b) => b.isFeatured) || blogs[0];
  const latestArticles = blogs.filter((b) => b._id !== featuredBlog?._id);
  const sideArticles = latestArticles.slice(0, 5);
  const gridArticles = latestArticles.slice(0, 14);

  const handleClearFilters = () => {
    window.location.href = '/archive';
  };

  return (
    <>
      <Head>
        <title>Archive | WORLD NOW</title>
        <meta
          name="description"
          content="Browse the latest independent news and analysis from Pakistan and around the world."
        />
        <meta property="og:title" content="Archive | WORLD NOW" />
        <meta
          property="og:description"
          content="Browse the latest independent news and analysis from Pakistan and around the world."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${appUrl}/archive`} />
        <meta property="og:image" content={`${appUrl}/browserlogo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Archive | WORLD NOW" />
        <meta
          name="twitter:description"
          content="Browse the latest independent news and analysis from Pakistan and around the world."
        />
        <meta name="twitter:image" content={`${appUrl}/browserlogo.png`} />
        <link rel="canonical" href={`${appUrl}/archive`} />
      </Head>

      <div className="w-full bg-[#faf8f4] text-[#0d0d0d] font-sans pb-16">
      {(categoryFilter || regionFilter || searchFilter) && (
        <div className="w-full border-b border-[#d4cbb8] bg-white px-8 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b5150e]">
              Filtered Archive{' '}
              {categoryFilter && `· Category: ${categoryFilter}`}
              {regionFilter && `· Region: ${regionFilter}`}
              {searchFilter && `· Query: "${searchFilter}"`}
            </span>
            <button
              onClick={handleClearFilters}
              className="text-xs text-gray-500 transition hover:text-black"
            >
              Clear All Filters ×
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 py-24">
          <Loader2 className="h-10 w-10 animate-spin text-[#b5150e]" />
          <span className="font-serif text-sm italic text-gray-600">
            Retrieving broadsheet wires from Lahore...
          </span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <HelpCircle className="mx-auto mb-4 h-12 w-12 text-[#b5150e]" />
          <h2 className="mb-2 font-serif text-2xl font-bold">No Articles Found</h2>
          <p className="mb-6 text-xs text-gray-600">
            Our correspondents have not published articles matching these parameters yet.
          </p>
          <button
            onClick={handleClearFilters}
            className="rounded bg-[#b5150e] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#8a0f09]"
          >
            View All News Stories
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <div className="grid grid-cols-1 gap-8 border-b border-[#d4cbb8] pb-12 lg:grid-cols-3">
            {featuredBlog && (
              <div className="flex flex-col justify-between border-r-0 lg:col-span-2 lg:border-r lg:pr-8">
                <div>
                  <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#b5150e]">
                    {Array.isArray(featuredBlog.categories)
                      ? featuredBlog.categories
                          .filter((c: string) => c !== 'asia')
                          .join(', ') || featuredBlog.category
                      : featuredBlog.category}{' '}
                    · Broadsheet Focus
                  </span>

                  <a href={`/blog/${featuredBlog.slug}`} className="group block">
                    <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded bg-gray-200">
                      <img
                        src={featuredBlog.featuredImage}
                        alt={featuredBlog.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h2 className="mb-3 font-serif text-3xl font-extrabold leading-tight text-[#0d0d0d] transition group-hover:text-[#b5150e] sm:text-4xl">
                      {featuredBlog.title}
                    </h2>
                  </a>

                  <p className="mb-4 font-serif text-sm font-light leading-relaxed text-gray-700">
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-[#e8e0d0] py-3 text-xs font-sans text-gray-500">
                  <strong className="text-gray-900">By {featuredBlog.author}</strong>
                  <span>·</span>
                  <span>
                    {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>·</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b5150e]">
                    {Array.isArray(featuredBlog.categories)
                      ? featuredBlog.categories[0]
                      : featuredBlog.category}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6 lg:col-span-1">
              <h3 className="flex items-center gap-1.5 border-b border-[#d4cbb8] pb-2 font-serif text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#555]">
                <Globe className="h-3.5 w-3.5 text-[#b5150e]" />
                <span>Immediate Wire Reports</span>
              </h3>
              <div className="flex flex-col gap-0">
                {sideArticles.map((art: Blog, index: number) => (
                  <a
                    key={art._id}
                    href={`/blog/${art.slug}`}
                    className={`block rounded px-1 pt-4 transition-colors hover:bg-[#faf8f4] ${index === 0 ? 'border-t-0 pt-0' : 'border-t border-[#e8e0d0]'}`}
                  >
                    <span className="mb-1.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider text-[#b5150e]">
                      {Array.isArray(art.categories)
                        ? art.categories
                            .filter((c: string) => c !== 'asia')
                            .join(', ') || art.category
                        : art.category}
                    </span>
                    <h4 className="mb-1.5 font-serif text-[15px] font-bold leading-snug text-[#0d0d0d] transition-colors group-hover:text-[#b5150e]">
                      {art.title}
                    </h4>
                    <p className="mb-3 text-[11px] font-serif leading-relaxed text-gray-500 line-clamp-2">
                      {art.excerpt}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="my-12 w-full rounded border border-[#e8e0d0] bg-white p-4 text-center select-none">
            <span className="mb-2 block text-[9px] font-sans uppercase tracking-widest text-gray-400">Advertisement</span>
            <div className="flex min-h-[90px] w-full items-center justify-center border border-dashed border-gray-200 bg-[#faf8f4]">
              <span className="text-xs italic text-gray-400">Section hero ad placeholder</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {gridArticles.map((article: Blog) => (
              <ArticleCard key={article._id} blog={article} />
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-[#e8e0d0] bg-white p-6 text-sm text-gray-700 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#0d0d0d]">Editorial note</h3>
            <p className="mt-3 max-w-3xl text-gray-600">
              Browse the latest reports, local desks, and analysis from WORLD NOW — all the live newsroom content is now available in the public feed.
            </p>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default function ArchivePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
          Loading newsroom feed…
        </div>
      }
    >
      <ArchivePageContent />
    </Suspense>
  );
}
