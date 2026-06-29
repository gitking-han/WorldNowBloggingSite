"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { Region } from "@/types";
import { usePageMetadata } from "@/utils/seo";
import { SITE_URL } from "@/lib/site";

export default function RegionsPage() {
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
  const [regions, setRegions] = useState<Region[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRegions = async () => {
    try {
      const response = await api.get("/regions");
      setRegions(Array.isArray(response.data) ? response.data : []);
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
    loadRegions();
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        await api.put(`/regions/${editingId}`, form);
        setMessage("Region updated.");
      } else {
        await api.post("/regions", form);
        setMessage("Region added.");
      }
      setForm({ name: "", slug: "", description: "" });
      setEditingId("");
      await loadRegions();
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Unable to save region.");
    }
  };

  const handleEdit = (region: Region) => {
    setEditingId(region._id);
    setForm({
      name: region.name,
      slug: region.slug,
      description: region.description || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this region?")) return;

    try {
      await api.delete(`/regions/${id}`);
      setMessage("Region deleted.");
      await loadRegions();
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Unable to delete region.");
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#0d0d0d] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">
                Regions
              </p>
              <h1 className="mt-3 font-serif text-3xl font-black">
                Manage region tags and local desks
              </h1>
            </div>
            <Link
              href="/admin/dashboard"
              className="rounded-full border border-[#d4cbb8] bg-[#faf8f4] px-4 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:border-[#b5150e] hover:text-[#b5150e]"
            >
              Back to dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl space-y-4"
          >
            <h2 className="font-serif text-xl font-black">
              {editingId ? "Edit region" : "Add region"}
            </h2>
            <label className="block text-sm font-semibold text-gray-700">
              Name
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                    slug:
                      current.slug ||
                      event.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, ""),
                  }))
                }
                className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-gray-700">
              Slug
              <input
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: event.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  }))
                }
                className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-gray-700">
              Description
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={3}
                className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-[#b5150e] focus:bg-white"
              />
            </label>
            {message ? (
              <p className="rounded-xl border border-[#efe7db] bg-[#faf8f4] px-4 py-3 text-sm text-gray-700">
                {message}
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-full bg-[#b5150e] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#8a0f09]"
            >
              {editingId ? "Save changes" : "Add region"}
            </button>
          </form>

          <section className="rounded-3xl border border-[#d4cbb8] bg-white p-6 shadow-xl">
            {loading ? (
              <p className="text-sm text-gray-600">Loading regions…</p>
            ) : (
              <div className="space-y-4">
                {regions.map((region) => (
                  <article
                    key={region._id}
                    className="rounded-2xl border border-[#efe7db] bg-[#faf8f4] p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">
                          {region.slug}
                        </p>
                        <h3 className="mt-2 font-serif text-xl font-black text-[#0d0d0d]">
                          {region.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {region.description ||
                            "Regional desk used in story publishing."}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(region)}
                          className="rounded-full border border-[#d4cbb8] bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:border-[#b5150e] hover:text-[#b5150e]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(region._id)}
                          className="rounded-full bg-[#0d0d0d] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-[#b5150e]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
