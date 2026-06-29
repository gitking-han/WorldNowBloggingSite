"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { SITE_URL } from "@/lib/site";
import { usePageMetadata } from "@/utils/seo";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("editor");

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

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("worldnow_admin_token")
        : null;
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const savedUser = localStorage.getItem("worldnow_admin_user");
    if (savedUser) {
      setUsername(savedUser);
    }

    async function loadData() {
      try {
        const [blogsResponse, categoriesResponse, regionsResponse] =
          await Promise.all([
            api.get("/blogs", { params: { status: "published" } }),
            api.get("/categories"),
            api.get("/regions"),
          ]);

        setBlogs(Array.isArray(blogsResponse.data) ? blogsResponse.data : []);
        setCategories(
          Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [],
        );
        setRegions(
          Array.isArray(regionsResponse.data) ? regionsResponse.data : [],
        );
      } catch (error) {
        console.error("Unable to load admin dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const featuredCount = useMemo(
    () => blogs.filter((blog) => blog.isFeatured).length,
    [blogs],
  );
  const totalViews = useMemo(
    () => blogs.reduce((sum, blog) => sum + (Number(blog.views) || 0), 0),
    [blogs],
  );
  const avgReadingTime = useMemo(() => {
    const total = blogs.reduce(
      (sum, blog) => sum + Number(blog.readingTime?.match(/\d+/)?.[0] || 0),
      0,
    );
    return blogs.length ? Math.round(total / blogs.length) : 0;
  }, [blogs]);
  const weeklyViews = Math.max(1, Math.round(totalViews / 4));
  const dailyViews = Math.max(1, Math.round(totalViews / 30));
  const monthlyViews = totalViews;

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#0d0d0d] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-[#d4cbb8] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">
                Admin Dashboard
              </p>
              <h1 className="mt-3 font-serif text-3xl font-black md:text-4xl">
                Welcome back, {username}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-gray-600">
                The newsroom dashboard is wired to the live public routes and
                uses the same data source as the front page.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-[#d4cbb8] bg-[#faf8f4] px-4 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:border-[#b5150e] hover:text-[#b5150e]"
              >
                View site
              </Link>
              <Link
                href="/admin/publish"
                className="rounded-full bg-[#b5150e] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-[#8a0f09]"
              >
                Publish article
              </Link>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("worldnow_admin_token");
                  router.push("/admin/login");
                }}
                className="rounded-full bg-[#0d0d0d] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-[#b5150e]"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "/admin/publish",
            "/admin/articles",
            "/admin/categories",
            "/admin/regions",
          ].map((href, index) => (
            <Link
              key={href}
              href={href}
              className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl hover:border-[#b5150e] transition"
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                {
                  ["Publish story", "Article library", "Categories", "Regions"][
                    index
                  ]
                }
              </p>
              <h2 className="mt-3 font-serif text-xl font-black">
                {
                  [
                    "Create new content",
                    "Edit and remove stories",
                    "Manage categories",
                    "Manage regions",
                  ][index]
                }
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Open the full management page to handle your newsroom workflow.
              </p>
            </Link>
          ))}
        </section>

        {loading ? (
          <section className="rounded-3xl border border-[#d4cbb8] bg-white p-8 text-sm text-gray-600 shadow-xl">
            Loading newsroom metrics…
          </section>
        ) : (
          <>
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                  Reads
                </p>
                <p className="mt-4 text-4xl font-black text-[#0d0d0d]">
                  {totalViews}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Total article reads available in the current feed.
                </p>
              </article>
              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                  Clicks
                </p>
                <p className="mt-4 text-4xl font-black text-[#0d0d0d]">
                  {featuredCount + blogs.length}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Featured and published stories currently live.
                </p>
              </article>
              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                  Avg read time
                </p>
                <p className="mt-4 text-4xl font-black text-[#0d0d0d]">
                  {avgReadingTime} min
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Average article length from your live stories.
                </p>
              </article>
              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                  Weekly / Daily / Monthly
                </p>
                <p className="mt-4 text-xl font-black text-[#0d0d0d]">
                  {weeklyViews} / {dailyViews} / {monthlyViews}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Estimated view flow based on the current story set.
                </p>
              </article>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                  Live Stories
                </p>
                <p className="mt-4 text-4xl font-black text-[#0d0d0d]">
                  {blogs.length}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Published articles available from the front-end feed.
                </p>
              </article>
              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                  Categories
                </p>
                <p className="mt-4 text-4xl font-black text-[#0d0d0d]">
                  {categories.length}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Navigation sections used by the public layout.
                </p>
              </article>
              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e]">
                  Regions
                </p>
                <p className="mt-4 text-4xl font-black text-[#0d0d0d]">
                  {regions.length}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Region desks and local coverage tags.
                </p>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-black">
                    Recent public content
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    API /blogs
                  </span>
                </div>
                <ul className="mt-5 space-y-3 text-sm text-gray-700">
                  {blogs.slice(0, 6).map((blog) => (
                    <li
                      key={blog._id || blog.slug}
                      className="rounded-2xl border border-[#efe7db] bg-[#faf8f4] p-4"
                    >
                      <p className="font-semibold text-[#0d0d0d]">
                        {blog.title}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#b5150e]">
                        {blog.category ||
                          (Array.isArray(blog.categories)
                            ? blog.categories.join(", ")
                            : "General")}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-black">
                    Regional desks
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    API /regions
                  </span>
                </div>
                <ul className="mt-5 space-y-3 text-sm text-gray-700">
                  {regions.length
                    ? regions.map((region) => (
                        <li
                          key={region.slug || region.name}
                          className="rounded-2xl border border-[#efe7db] bg-[#faf8f4] p-4"
                        >
                          <p className="font-semibold text-[#0d0d0d]">
                            {region.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {region.description ||
                              "Regional desk used for public front-end navigation."}
                          </p>
                        </li>
                      ))
                    : categories.map((category) => (
                        <li
                          key={category.slug || category.name}
                          className="rounded-2xl border border-[#efe7db] bg-[#faf8f4] p-4"
                        >
                          <p className="font-semibold text-[#0d0d0d]">
                            {category.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {category.description ||
                              "Editorial category used in the front page navigation."}
                          </p>
                        </li>
                      ))}
                </ul>
              </article>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
