'use client';

import React from 'react';
import Link from 'next/link';
import { usePageMetadata } from '@/utils/seo';

export const dynamic = 'force-dynamic';

export default function Terms() {
  usePageMetadata({
    title: 'Terms & Conditions | WORLD NOW',
    description: 'Read the terms and conditions for using WORLD NOW, our publisher content, and the site’s legal guidelines.',
    url: `${typeof window !== 'undefined' ? window.location.origin : 'https://worldnow.news'}/terms`,
  });

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-[#b5150e] hover:text-[#8a0f09] font-semibold text-sm">← Back to Home</Link>
        </div>

        <article className="bg-white rounded-3xl shadow-sm border border-[#efe7db] p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#b5150e] font-bold">Legal terms</p>
          <h1 className="font-serif text-4xl font-bold text-[#0d0d0d] mt-4 mb-2">Terms & Conditions</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

          <div className="space-y-6 text-gray-800 leading-relaxed">
            <p>By accessing or using WORLD NOW, you agree to the following terms. These terms are designed to protect readers, advertisers, and the editorial team while maintaining a trustworthy publishing environment.</p>

            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">1. Use of the site</h2>
              <p className="text-sm">You may read, share, and reference our articles for personal, non-commercial use. Reproduction, scraping, or redistribution beyond reasonable personal use is not allowed without prior permission.</p>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">2. Intellectual property</h2>
              <p className="text-sm">All content, design, branding, and editorial material on WORLD NOW are owned or licensed by the publisher unless otherwise noted. Please credit the source when sharing excerpts.</p>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">3. User conduct</h2>
              <p className="text-sm">Do not post unlawful, abusive, or misleading content. We reserve the right to remove comments, block access, or report behavior that harms the site or its users.</p>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">4. Advertising and monetization</h2>
              <p className="text-sm">WORLD NOW may display advertisements and monetized content. We do not guarantee any specific revenue, placement, or performance. Ads are presented in a way that respects reader experience and editorial independence.</p>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">5. Limitation of liability</h2>
              <p className="text-sm">WORLD NOW is not liable for losses arising from site downtime, third-party links, ad display, or errors in information. We strive for accuracy but retain the right to update content as circumstances change.</p>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">6. Governing law</h2>
              <p className="text-sm">These terms are governed by the laws of Pakistan, and any legal dispute will be handled in the courts of Pakistan unless otherwise required by law.</p>
            </section>

            <p className="text-sm text-gray-600">If you have any questions, please <Link href="/contact" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">contact the newsroom</Link>.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
