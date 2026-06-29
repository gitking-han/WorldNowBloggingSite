'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Globe, Loader2, TrendingUp } from 'lucide-react';
import api from '@/utils/api';
import { usePageMetadata } from '@/utils/seo';
import { Blog } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { SITE_URL } from '@/lib/site';

export default function HomeLandingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : SITE_URL;

  usePageMetadata({
    title: 'World Now | Global & Regional News',
    description:
      'Read the latest independent news, analysis, and updates from Pakistan and around the world.',
    url: `${appUrl}/home`,
    type: 'website',
    image: '/browserlogo.png',
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/blogs', { params: { status: 'published', limit: '18' } });
        setBlogs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const featuredBlog = blogs.find((blog) => blog.isFeatured) || blogs[0];
  const recentArticles = blogs.slice(0, 9);
  const mostViewedArticles = useMemo(
    () =>
      [...blogs]
        .sort((left, right) => (Number(right.views) || 0) - (Number(left.views) || 0))
        .slice(0, 6),
    [blogs],
  );

  return (
    <>
      <Head>
        <title>World Now | Global & Regional News</title>
        <meta
          name="description"
          content="Read the latest independent news, analysis, and updates from Pakistan and around the world."
        />
        <meta property="og:title" content="World Now | Global & Regional News" />
        <meta
          property="og:description"
          content="Read the latest independent news, analysis, and updates from Pakistan and around the world."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${appUrl}/home`} />
        <meta property="og:image" content={`${appUrl}/browserlogo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="World Now | Global & Regional News" />
        <meta
          name="twitter:description"
          content="Read the latest independent news, analysis, and updates from Pakistan and around the world."
        />
        <meta name="twitter:image" content={`${appUrl}/browserlogo.png`} />
        <link rel="canonical" href={`${appUrl}/home`} />
      </Head>

      <main className="min-h-screen bg-[#faf8f4] text-[#0d0d0d]">
      <section className="border-b border-[#e8e0d0] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#b5150e]">
              WORLD NOW · Independent newsroom
            </p>
            <h1 className="max-w-xl font-serif text-4xl font-black leading-tight text-[#0d0d0d] md:text-5xl lg:text-6xl">
              A cleaner homepage for fast, trusted updates from Pakistan and the world.
            </h1>
            <p className="max-w-2xl text-base text-gray-700 md:text-lg">
              Follow the latest politics, business, culture, and regional reports in one structured page designed for readers and publisher tools.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-[#b5150e] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8a0f09]"
              >
                Browse latest stories
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-[#d4cbb8] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0d0d0d] transition hover:border-[#b5150e] hover:text-[#b5150e]"
              >
                Learn about us
              </Link>
            </div>

            <div className="grid gap-3 border-t border-[#e8e0d0] pt-5 text-sm text-gray-700 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e8e0d0] bg-[#fffdfa] p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">Coverage</p>
                <p className="mt-2 text-xl font-black text-[#0d0d0d]">Pakistan + world</p>
              </div>
              <div className="rounded-2xl border border-[#e8e0d0] bg-[#fffdfa] p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">Editor focus</p>
                <p className="mt-2 text-xl font-black text-[#0d0d0d]">Verified reports</p>
              </div>
              <div className="rounded-2xl border border-[#e8e0d0] bg-[#fffdfa] p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">Reader value</p>
                <p className="mt-2 text-xl font-black text-[#0d0d0d]">Clean navigation</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e8e0d0] bg-white p-5 shadow-sm">
            {featuredBlog ? (
              <>
                <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                  <span>Featured story</span>
                  <span>Home page spotlight</span>
                </div>
                <Link href={`/blog/${featuredBlog.slug}`} className="group block overflow-hidden rounded-2xl border border-[#e8e0d0] bg-[#f8f4ee]">
                  <img
                    src={featuredBlog.featuredImage}
                    alt={featuredBlog.title}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="mt-4 space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                    {Array.isArray(featuredBlog.categories)
                      ? featuredBlog.categories.join(', ')
                      : featuredBlog.category}
                  </p>
                  <Link href={`/blog/${featuredBlog.slug}`} className="block text-2xl font-black font-serif leading-tight text-[#0d0d0d] transition hover:text-[#b5150e]">
                    {featuredBlog.title}
                  </Link>
                  <p className="text-sm text-gray-700">{featuredBlog.excerpt}</p>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d4cbb8] bg-[#faf8f4] p-6 text-sm text-gray-600">
                No featured story is available right now.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-bold">Recent articles</p>
            <h2 className="mt-2 font-serif text-2xl font-black text-[#0d0d0d] md:text-3xl">Latest reports from the newsroom</h2>
          </div>
          <Link href="/" className="text-xs uppercase tracking-[0.25em] text-[#b5150e] hover:text-[#8a0f09] font-semibold">
            View all updates →
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-[#e8e0d0] bg-white shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[#b5150e]" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentArticles.map((article) => (
              <ArticleCard key={article._id} blog={article} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
      

        <article className="rounded-3xl border border-[#e8e0d0] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-bold">Most viewed</p>
              <h3 className="mt-2 font-serif text-2xl font-black text-[#0d0d0d]">Popular stories this week</h3>
            </div>
            <TrendingUp className="h-4 w-4 text-[#b5150e]" />
          </div>

          <div className="space-y-4">
            {mostViewedArticles.length > 0 ? (
              mostViewedArticles.map((article, index) => (
                <Link
                  key={article._id}
                  href={`/blog/${article.slug}`}
                  className="group flex gap-4 rounded-2xl border border-[#e8e0d0] bg-[#fffdfa] p-4 transition hover:border-[#b5150e]/40 hover:bg-white"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0d0d0d] text-xs font-black text-white">0{index + 1}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#b5150e] font-semibold">
                      {Array.isArray(article.categories)
                        ? article.categories.join(', ')
                        : article.category}
                    </p>
                    <h4 className="mt-1 font-serif text-lg font-black leading-tight text-[#0d0d0d] group-hover:text-[#b5150e] transition">
                      {article.title}
                    </h4>
                    <p className="mt-2 text-xs text-gray-500">{Number(article.views) || 0} views</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d4cbb8] bg-[#faf8f4] p-5 text-sm text-gray-600">
                Popular article data will appear here as readers engage with the site.
              </div>
            )}
          </div>
        </article>
      </section>
      </main>
    </>
  );
}
