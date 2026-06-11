"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Globe, Loader2, TrendingUp } from "lucide-react";
import api from "@/utils/api";
import { usePageMetadata } from "@/utils/seo";
import { Blog } from "@/types";
import ArticleCard from "@/components/ArticleCard";

export default function HomeLandingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://worldnow.news";

  usePageMetadata({
    title: "WORLD NOW | Pakistan and World News",
    description:
      "Read the latest independent news, analysis, and updates from Pakistan and around the world.",
    url: `${appUrl}/`,
    type: "website",
    image: "/browserlogo.png",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/blogs", {
          params: { status: "published", limit: "18" },
        });
        setBlogs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to load homepage data:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const featuredBlog = blogs.find((blog) => blog.isFeatured) || blogs[0];
  const latestBlog = useMemo(
    () =>
      [...blogs].sort(
        (left, right) =>
          new Date(right.createdAt || 0).getTime() -
          new Date(left.createdAt || 0).getTime(),
      )[0] || null,
    [blogs],
  );
  const recentArticles = blogs.slice(0, 9);
  const mostViewedArticles = useMemo(
    () =>
      [...blogs]
        .sort(
          (left, right) =>
            (Number(right.views) || 0) - (Number(left.views) || 0),
        )
        .slice(0, 6),
    [blogs],
  );

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#0d0d0d]">
      <section className="border-b border-[#e8e0d0] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:py-14">
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#b5150e]">
                WORLD NOW · Independent Global Newsroom
              </p>

              <h1 className="max-w-2xl font-serif text-1xl font-black leading-tight text-[#0d0d0d] md:text-2xl lg:text-6xl">
                Independent reporting on the stories shaping the
                world.
              </h1>

              <p className="max-w-3xl text-base text-gray-700 md:text-lg">
                Breaking news, verified updates, and in-depth analysis across
                politics, business, technology, culture, and global affairs.
              </p>

             

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/archive"
                  className="rounded-full bg-[#b5150e] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8a0f09]"
                >
                  Browse headlines
                </Link>

                <Link
                  href="/about"
                  className="rounded-full border border-[#d4cbb8] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0d0d0d] transition hover:border-[#b5150e] hover:text-[#b5150e]"
                >
                  About World Now
                </Link>
              </div>

              <p className="text-sm text-gray-500">
                Independent editorial team · Fact-checked reporting · Global
                coverage updated daily
              </p>

              <div className="grid gap-3 border-t border-[#e8e0d0] pt-5 text-sm text-gray-700 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e8e0d0] bg-[#fffdfa] p-4 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                    Coverage
                  </p>
                  <p className="mt-2 text-xl font-black text-[#0d0d0d]">
                    Global + Pakistan
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e8e0d0] bg-[#fffdfa] p-4 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                    Standards
                  </p>
                  <p className="mt-2 text-xl font-black text-[#0d0d0d]">
                    Verified reporting
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e8e0d0] bg-[#fffdfa] p-4 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                    Updates
                  </p>
                  <p className="mt-2 text-xl font-black text-[#0d0d0d]">
                    24/7 coverage
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-3xl border border-[#e8e0d0] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                <span>Most recent</span>
                <span>Freshly added</span>
              </div>

              {latestBlog ? (
                <>
                  <Link
                    href={`/blog/${latestBlog.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-[#e8e0d0] bg-[#f8f4ee]"
                  >
                    <img
                      src={latestBlog.featuredImage}
                      alt={latestBlog.title}
                      className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="mt-10 space-y-3">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                      {Array.isArray(latestBlog.categories)
                        ? latestBlog.categories.join(", ")
                        : latestBlog.category}
                    </p>

                    <Link
                      href={`/blog/${latestBlog.slug}`}
                      className="mt-4 block font-serif text-2xl font-black leading-tight text-[#0d0d0d] transition hover:text-[#b5150e]"
                    >
                      {latestBlog.title}
                    </Link>

                    <p className="text-sm text-gray-700 mt-2">{latestBlog.excerpt}</p>

                    <div className="flex items-center justify-between border-t border-[#e8e0d0] pt-3 text-[10px] uppercase tracking-[0.25em] text-gray-500">
                      <span>By {latestBlog.author}</span>
                      <span>
                        {new Date(latestBlog.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d4cbb8] bg-[#faf8f4] p-6 text-sm text-gray-600">
                  No recent article is available yet.
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-bold">
              Recent articles
            </p>
            <h2 className="mt-2 font-serif text-2xl font-black text-[#0d0d0d] md:text-3xl">
              Latest reports from the newsroom
            </h2>
          </div>
          <Link
            href="/archive"
            className="text-xs uppercase tracking-[0.25em] text-[#b5150e] hover:text-[#8a0f09] font-semibold"
          >
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

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 md:px-8">
        <article className="rounded-3xl border border-[#e8e0d0] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-bold">
                Most viewed
              </p>
              <h3 className="mt-2 font-serif text-2xl font-black text-[#0d0d0d]">
                Popular stories this week
              </h3>
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
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0d0d0d] text-xs font-black text-white">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#b5150e] font-semibold">
                      {Array.isArray(article.categories)
                        ? article.categories.join(", ")
                        : article.category}
                    </p>
                    <h4 className="mt-1 font-serif text-lg font-black leading-tight text-[#0d0d0d] group-hover:text-[#b5150e] transition">
                      {article.title}
                    </h4>
                    <p className="mt-2 text-xs text-gray-500">
                      {Number(article.views) || 0} views
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d4cbb8] bg-[#faf8f4] p-5 text-sm text-gray-600">
                Popular article data will appear here as readers engage with the
                site.
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
