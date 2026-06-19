import React from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'RSS Feeds | WORLD NOW',
  description: 'Subscribe to WORLD NOW RSS feeds for automated updates on news, categories, and latest articles.',
  alternates: {
    canonical: `${SITE_URL}/rss`,
  },
};

export default function RSS() {
  const feedUrl = SITE_URL;

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-[#b5150e] hover:text-[#8a0f09] font-semibold text-sm">← Back to Home</Link>
        </div>

        <article className="bg-white rounded-3xl shadow-sm border border-[#efe7db] p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#b5150e] font-bold">RSS & syndication</p>
          <h1 className="font-serif text-4xl font-bold text-[#0d0d0d] mt-4 mb-4">RSS News Feeds</h1>
          <p className="text-gray-700 leading-relaxed mb-6">RSS keeps your newsroom easily discoverable by readers, search engines, and content aggregators. It is a simple, transparent feed format used by publishers to distribute updates quickly and consistently.</p>

          <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-3">Why RSS matters</h2>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                <li>Improves content discovery across readers, apps, and newsletters.</li>
                <li>Helps search engines and aggregators index fresh updates from your site.</li>
                <li>Supports a stable, publisher-grade structure that AdSense reviewers value.</li>
              </ul>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-3">How to use the feeds</h2>
              <p className="text-sm text-gray-700 leading-relaxed">Copy any of the links below into Feedly, Inoreader, Apple News, or any RSS reader. New articles will appear automatically whenever the site publishes fresh content.</p>
            </section>
          </div>

          <div className="mt-8 bg-[#faf8f4] border border-[#d4cbb8] rounded-2xl p-6 space-y-4 font-sans">
            <div>
              <h3 className="font-semibold text-[#0d0d0d] mb-2">All Articles</h3>
              <code className="text-xs bg-white p-3 border border-gray-300 rounded-xl block break-all text-[#b5150e]">{feedUrl}/api/rss</code>
            </div>
            <div>
              <h3 className="font-semibold text-[#0d0d0d] mb-2">Politics Feed</h3>
              <code className="text-xs bg-white p-3 border border-gray-300 rounded-xl block break-all text-[#b5150e]">{feedUrl}/api/rss?category=politics</code>
            </div>
            <div>
              <h3 className="font-semibold text-[#0d0d0d] mb-2">Economy Feed</h3>
              <code className="text-xs bg-white p-3 border border-gray-300 rounded-xl block break-all text-[#b5150e]">{feedUrl}/api/rss?category=economy</code>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-3">Recommended readers</h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li><a href="https://feedly.com" className="text-[#b5150e] hover:text-[#8a0f09]" target="_blank" rel="noopener noreferrer">Feedly</a> — popular RSS reader for desktop and mobile.</li>
                <li><a href="https://www.inoreader.com" className="text-[#b5150e] hover:text-[#8a0f09]" target="_blank" rel="noopener noreferrer">Inoreader</a> — powerful feed subscription and organization.</li>
                <li><a href="https://news.google.com" className="text-[#b5150e] hover:text-[#8a0f09]" target="_blank" rel="noopener noreferrer">Google News</a> — valuable for discovering fresh publisher content.</li>
              </ul>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-3">Purpose for AdSense</h2>
              <p className="text-sm text-gray-700 leading-relaxed">RSS and sitemap files indicate that your site is an active, structured publisher. They help reviewers understand your content architecture, update cadence, and navigation quality, which is part of the trust signal AdSense looks for.</p>
            </section>
          </div>

          <p className="mt-8 text-sm text-gray-600">Need help? <Link href="/contact" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">Contact us</Link> for feed or publisher support.</p>
        </article>
      </div>
    </div>
  );
}
