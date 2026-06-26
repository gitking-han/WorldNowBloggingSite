'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { usePageMetadata } from '@/utils/seo';
import { SITE_URL } from "@/lib/site";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const token = response.data?.token;
      const loggedInUser = response.data?.user?.username || username;

      if (!token) {
        throw new Error('Login response did not contain a token.');
      }

      localStorage.setItem('worldnow_admin_token', token);
      localStorage.setItem('worldnow_admin_user', loggedInUser);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#0d0d0d] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-[#d4cbb8] bg-white shadow-xl p-8 md:p-10">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5150e] font-semibold">Admin Access</p>
        <h1 className="mt-4 text-3xl font-serif font-black">Sign in to the WORLD NOW dashboard</h1>
        <p className="mt-3 text-sm text-gray-600">Use your editorial credentials to manage the newsroom dashboard and review live content.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none transition focus:border-[#b5150e] focus:bg-white"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d4cbb8] bg-[#faf8f4] px-4 py-3 text-sm outline-none transition focus:border-[#b5150e] focus:bg-white"
              required
            />
          </label>

          {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#b5150e] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8a0f09] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-gray-500 uppercase tracking-[0.25em]">
          <Link href="/" className="hover:text-[#b5150e]">Back to home</Link>
          <span>Secure session</span>
        </div>
      </div>
    </main>
  );
}
