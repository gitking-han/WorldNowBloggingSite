"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/api";
import { renderMarkdown } from "@/utils/markdown";
import { Blog, Category, Region } from "@/types";
import { SITE_URL } from "@/lib/site";
import { usePageMetadata } from '@/utils/seo';

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "WORLD NOW Desk",
  region: "",
  category: "",
  categories: [] as string[],
  tags: "",
  featuredImage: "",
  status: "published" as "draft" | "published",
  seoTitle: "",
  metaDescription: "",
  isFeatured: false,
};

function PublishArticlePageContent() {
  const appUrl =
    typeof window !== "undefined" ? window.location.origin : SITE_URL;

  usePageMetadata({
    title: "WORLD NOW | Pakistan and World News",
    description:
      "Browse the latest independent news and analysis from Pakistan and around the world.",
    url: `${appUrl}/archive`,
    type: "website",
    image: "/browserlogo.png",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("slug") || "";

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("worldnow_admin_token")
        : null;
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    async function loadData() {
      try {
        const [catRes, regionRes] = await Promise.all([
          api.get("/categories"),
          api.get("/regions"),
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setRegions(Array.isArray(regionRes.data) ? regionRes.data : []);

        if (editSlug) {
          const articleRes = await api.get(`/blogs/${editSlug}`);
          const article = articleRes.data as Blog;
          setForm({
            title: article.title || "",
            excerpt: article.excerpt || "",
            content: article.content || "",
            author: article.author || "WORLD NOW Desk",
            region: article.region || article.location || "",
            category: article.category || article.categories?.[0] || "",
            categories: article.categories || [],
            tags: (article.tags || []).join(", "),
            featuredImage: article.featuredImage || "",
            status: article.status || "published",
            seoTitle: article.seoTitle || "",
            metaDescription: article.metaDescription || "",
            isFeatured: Boolean(article.isFeatured),
          });
        }
      } catch (error) {
        console.error("Unable to load data for publish page", error);
      }
    }

    loadData();
  }, [editSlug, router]);

  const previewText = useMemo(() => {
    return form.content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, [form.content]);

  const previewHtml = useMemo(
    () => renderMarkdown(form.content || ""),
    [form.content],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        categories: form.categories.length
          ? form.categories
          : [form.category].filter(Boolean),
        region: form.region || form.category,
        location: form.region || form.category,
        excerpt: form.excerpt || previewText.slice(0, 160),
        seoTitle: form.seoTitle || `${form.title} | WORLD NOW`,
        metaDescription:
          form.metaDescription || form.excerpt || previewText.slice(0, 160),
      };

      if (editSlug) {
        await api.put(`/blogs/${editSlug}`, payload);
        setMessage("Article updated successfully.");
      } else {
        await api.post("/blogs", payload);
        setMessage("Article published successfully.");
      }

      setTimeout(() => router.push("/admin/articles"), 400);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Unable to save article.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setForm((current) => ({ ...current, featuredImage: data.url }));
      setMessage("Image uploaded to Cloudinary.");
    } catch (error: any) {
      setMessage(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const toggleCategory = (slug: string) => {
    setForm((current) => {
      const categories = current.categories.includes(slug)
        ? current.categories.filter((item) => item !== slug)
        : [...current.categories, slug];
      return {
        ...current,
        categories,
        category: categories[0] || current.category,
      };
    });
  };

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#0d0d0d] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">
                Article Publishing
              </p>
              <h1 className="mt-3 font-serif text-3xl font-black">
                Create or update newsroom stories
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Upload to Cloudinary, assign categories and regions, and preview
                the final article instantly.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/dashboard"
                className="rounded-full border border-[#d4cbb8] bg-[#faf8f4] px-4 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:border-[#b5150e] hover:text-[#b5150e]"
              >
                Back to dashboard
              </Link>
              <Link
                href="/admin/articles"
                className="rounded-full bg-[#0d0d0d] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-[#b5150e]"
              >
                Manage articles
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-semibold text-gray-700">
                Title
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                      seoTitle: event.target.value
                        ? `${event.target.value} | WORLD NOW`
                        : "",
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                  required
                />
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Author
                <input
                  value={form.author}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      author: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                  required
                />
              </label>
            </div>

            <label className="block text-sm font-semibold text-gray-700">
              Excerpt / Description
              <textarea
                value={form.excerpt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    excerpt: event.target.value,
                    metaDescription: event.target.value,
                  }))
                }
                rows={3}
                className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Article Content
              <textarea
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                rows={10}
                className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                required
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-semibold text-gray-700">
                Region
                <select
                  value={form.region}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      region: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                >
                  <option value="">Select region</option>
                  {regions.map((region) => (
                    <option key={region._id} value={region.slug}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Primary Category
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                      categories: current.categories.includes(
                        event.target.value,
                      )
                        ? current.categories
                        : [event.target.value, ...current.categories].filter(
                            Boolean,
                          ),
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-2xl border border-[#efe7db] bg-[#faf8f4] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#b5150e] font-semibold">
                Multiple categories
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category._id}
                    onClick={() => toggleCategory(category.slug)}
                    className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.25em] transition ${form.categories.includes(category.slug) ? "border-[#b5150e] bg-[#b5150e] text-white" : "border-[#d4cbb8] bg-white text-gray-700 hover:border-[#b5150e] hover:text-[#b5150e]"}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm font-semibold text-gray-700">
              Tags
              <input
                value={form.tags}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    tags: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                placeholder="politics, pakistan, economy"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-semibold text-gray-700">
                Featured image URL
                <input
                  value={form.featuredImage}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      featuredImage: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                  placeholder="Paste a URL or upload below"
                />
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Upload image to Cloudinary
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="mt-1 block w-full rounded-xl border border-dashed border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#b5150e] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-semibold text-gray-700">
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as "draft" | "published",
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isFeatured: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-[#d4cbb8] text-[#b5150e] focus:ring-[#b5150e]"
                />
                Highlight on homepage
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-semibold text-gray-700">
                SEO Title
                <input
                  value={form.seoTitle}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      seoTitle: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                />
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Meta description
                <input
                  value={form.metaDescription}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      metaDescription: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                />
              </label>
            </div>

            {message ? (
              <p className="rounded-xl border border-[#efe7db] bg-[#faf8f4] px-4 py-3 text-sm text-gray-700">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full rounded-full bg-[#b5150e] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#8a0f09] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Saving…"
                : editSlug
                  ? "Update article"
                  : "Publish article"}
            </button>
          </form>

          <aside className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
            <h2 className="font-serif text-2xl font-black">Live preview</h2>
            <p className="mt-2 text-sm text-gray-600">
              This preview mirrors the public blog card and detail view.
            </p>
            <article className="mt-6 overflow-hidden rounded-3xl border border-[#efe7db] bg-[#faf8f4]">
              {form.featuredImage ? (
                <img
                  src={form.featuredImage}
                  alt={form.title || "Preview"}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="h-52 w-full bg-gradient-to-br from-[#f5efe6] to-[#efe7db]" />
              )}
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">
                  {form.category || "General"} · {form.region || "Global"}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-black text-[#0d0d0d]">
                  {form.title || "Article title will appear here"}
                </h3>
                <p className="mt-3 text-sm text-gray-700">
                  {form.excerpt || "The article summary will appear here."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(form.tags
                    ? form.tags
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : ["news"]
                  ).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gray-600 border border-[#d4cbb8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  className="mt-4 rounded-2xl border border-[#efe7db] bg-white p-4 text-sm text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      previewHtml ||
                      '<p class="text-gray-500">Rich article content will preview here as you type.</p>',
                  }}
                />
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default function PublishArticlePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center text-sm text-gray-600">
          Loading publish tools…
        </main>
      }
    >
      <PublishArticlePageContent />
    </Suspense>
  );
}
