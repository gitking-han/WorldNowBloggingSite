"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Loader2, HelpCircle, Globe } from "lucide-react";
import api from "@/utils/api";
import { usePageMetadata } from "@/utils/seo";
import { Blog, Category } from "@/types";
import ArticleCard from "@/components/ArticleCard";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function HomePageContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const regionFilter = searchParams.get("region") || "";
  const searchFilter = searchParams.get("search") || "";

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://worldnow.news";
  usePageMetadata({
    title: "WORLD NOW | Pakistan and World News",
    description:
      "Read the latest independent news and analysis from Pakistan and around the world. WORLD NOW publishes trusted stories on politics, economy, technology, and culture.",
    url: `${appUrl}/`,
    type: "website",

    image: "/browserlogo.png",
  });

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const params: any = { status: "published" };
        if (categoryFilter) params.category = categoryFilter;
        if (regionFilter) params.region = regionFilter;
        if (searchFilter) params.search = searchFilter;

        const res = await api.get("/blogs", { params });
        const blogsData = Array.isArray(res.data) ? res.data : [];
        setBlogs(blogsData);
      } catch (err) {
        console.error("Failed fetching blogs list: ", err);
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
  const gridArticles = latestArticles.slice(5);

  const handleClearFilters = () => {
    window.location.href = "/";
  };

  return (
    <div className="w-full bg-[#faf8f4] text-[#0d0d0d] font-sans pb-16">
      {(categoryFilter || regionFilter || searchFilter) && (
        <div className="w-full bg-white border-b border-[#d4cbb8] py-4 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-widest text-[#b5150e]">
              Filtered Archive{" "}
              {categoryFilter && `· Category: ${categoryFilter}`}
              {regionFilter && `· Region: ${regionFilter}`}
              {searchFilter && `· Query: "${searchFilter}"`}
            </span>
            <button
              onClick={handleClearFilters}
              className="text-xs text-gray-500 hover:text-black transition"
            >
              Clear All Filters ×
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="max-w-7xl mx-auto py-24 flex flex-col justify-center items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#b5150e] animate-spin" />
          <span className="font-serif text-sm italic text-gray-600">
            Retrieving broadsheet wires from Lahore...
          </span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <HelpCircle className="w-12 h-12 text-[#b5150e] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold mb-2">
            No Articles Found
          </h2>
          <p className="text-xs text-gray-600 mb-6">
            Our correspondents have not published articles matching these
            parameters yet.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 bg-[#b5150e] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8a0f09] transition rounded"
          >
            View All News Stories
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-[#d4cbb8]">
            {featuredBlog && (
              <div className="lg:col-span-2 border-r-0 lg:border-r border-[#d4cbb8] lg:pr-8 flex flex-col justify-between">
                <div>
                  <span className="font-sans text-[10px] font-bold text-[#b5150e] uppercase tracking-[0.2em] mb-3 block">
                    {Array.isArray(featuredBlog.categories)
                      ? featuredBlog.categories
                          .filter((c) => c !== "asia")
                          .join(", ") || featuredBlog.category
                      : featuredBlog.category}{" "}
                    · Broadsheet Focus
                  </span>
                  <div className="block group">
                    <div className="aspect-[16/9] w-full overflow-hidden rounded relative mb-4 bg-gray-200">
                      <img
                        src={featuredBlog.featuredImage}
                        alt={featuredBlog.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <a href={`/blog/${featuredBlog.slug}`} className="group">
                      <h2 className="font-serif text-3xl sm:text-4xl font-extrabold leading-tight text-[#0d0d0d] mb-3 group-hover:text-[#b5150e] transition">
                        {featuredBlog.title}
                      </h2>
                    </a>
                  </div>
                  <p className="font-serif text-gray-700 text-sm leading-relaxed mb-4 font-light">
                    {featuredBlog.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-4 py-3 border-t border-[#e8e0d0] text-xs font-sans text-gray-500">
                  <strong className="text-gray-900">
                    By {featuredBlog.author}
                  </strong>
                  <span>·</span>
                  <span>
                    {new Date(featuredBlog.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </span>
                  <span>·</span>
                  <span className="text-[#b5150e] uppercase text-[10px] font-bold tracking-wider">
                    {Array.isArray(featuredBlog.categories)
                      ? featuredBlog.categories[0]
                      : featuredBlog.category}
                  </span>
                </div>
              </div>
            )}

            <div className="lg:col-span-1 flex flex-col gap-6">
              <h3 className="font-serif text-[11px] font-extrabold text-[#555] uppercase tracking-[0.22em] border-b border-[#d4cbb8] pb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#b5150e]" />
                <span>Immediate Wire Reports</span>
              </h3>
              <div className="flex flex-col gap-4 divide-y divide-[#e8e0d0]">
                {sideArticles.map((art, index) => (
                  <div
                    key={art._id}
                    className={`pt-4 ${index === 0 ? "pt-0" : ""}`}
                  >
                    <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-[9px] uppercase tracking-wider text-[#b5150e] font-sans font-bold mb-1.5">
                      {Array.isArray(art.categories)
                        ? art.categories
                            .filter((c) => c !== "asia")
                            .join(", ") || art.category
                        : art.category}
                    </span>
                    <a href={`/blog/${art.slug}`} className="block group">
                      <h4 className="font-serif font-bold text-[15px] leading-snug group-hover:text-[#b5150e] text-[#0d0d0d] mb-1.5 transition-colors">
                        {art.title}
                      </h4>
                    </a>
                    <p className="text-[11px] text-gray-500 font-serif leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full my-12 bg-white border border-[#e8e0d0] p-4 text-center select-none rounded">
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-sans block mb-2">
              Advertisement
            </span>
            <div className="w-full min-h-[90px] flex items-center justify-center bg-[#faf8f4] border border-dashed border-gray-200">
              <span className="text-xs italic text-gray-400">
                Section hero ad placeholder
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <ArticleCard key={article._id} blog={article} />
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-[#e8e0d0] bg-white p-6 text-sm text-gray-700 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#0d0d0d]">
              Editorial note
            </h3>
            <p className="mt-3 max-w-3xl text-gray-600">
              Browse the latest reports, local desks, and analysis from WORLD
              NOW — all the live newsroom content is now available in the public
              feed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-500">
          Loading newsroom feed…
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
