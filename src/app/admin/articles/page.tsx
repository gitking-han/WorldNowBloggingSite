"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { Blog } from "@/types";
import { SITE_URL } from "@/lib/site";
import { usePageMetadata } from "@/utils/seo";
export default function ArticlesPage() {
  const appUrl =
    typeof window !== "undefined" ? window.location.origin : SITE_URL;

  usePageMetadata({
    title: "World Now | Global & Regional News",
    description:
      "Browse the latest independent news and analysis from Pakistan and around the world.",
    url: `${appUrl}/archive`,
    type: "website",
    image: "/browserlogo.png",
  });

  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadArticles = async () => {
    try {
      const response = await api.get("/blogs");
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("worldnow_admin_token")
        : null;
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    loadArticles();
  }, [router]);

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Delete this article?")) return;
    await api.delete(`/blogs/${slug}`);
    await loadArticles();
  };

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#0d0d0d] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">
                Article Library
              </p>
              <h1 className="mt-3 font-serif text-3xl font-black">
                Edit, review, and remove articles
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                This page connects directly to the live /api/blogs route used by
                the public site.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/dashboard"
                className="rounded-full border border-[#d4cbb8] bg-[#faf8f4] px-4 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:border-[#b5150e] hover:text-[#b5150e]"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/publish"
                className="rounded-full bg-[#b5150e] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-[#8a0f09]"
              >
                New article
              </Link>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="rounded-3xl border border-[#d4cbb8] bg-white p-8 text-sm text-gray-600 shadow-xl">
            Loading the news library…
          </section>
        ) : (
          <section className="grid gap-6">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">
                      {blog.status} · {blog.category || "General"}
                    </p>
                    <h2 className="font-serif text-2xl font-black text-[#0d0d0d]">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-gray-600">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-500">
                      <span>{blog.region || blog.location || "Global"}</span>
                      <span>·</span>
                      <span>{blog.views} views</span>
                      <span>·</span>
                      <span>{blog.readingTime || "4 min read"}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/publish?slug=${blog.slug}`}
                      className="rounded-full border border-[#d4cbb8] bg-[#faf8f4] px-4 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:border-[#b5150e] hover:text-[#b5150e]"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog.slug)}
                      className="rounded-full bg-[#0d0d0d] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-[#b5150e]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
