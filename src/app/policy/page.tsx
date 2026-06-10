'use client';

import React from 'react';
import Link from 'next/link';
import { usePageMetadata } from '@/utils/seo';

export const dynamic = 'force-dynamic';

export default function Policy() {
  usePageMetadata({
    title: 'Privacy Policy | WORLD NOW',
    description: 'WORLD NOW Privacy Policy - How we handle your data and respect your privacy.',
    url: `${typeof window !== 'undefined' ? window.location.origin : 'https://worldnow.news'}/policy`,
  });

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-[#b5150e] hover:text-[#8a0f09] font-semibold text-sm">← Back to Home</Link>
        </div>

        <article className="bg-white rounded-3xl shadow-sm border border-[#efe7db] p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#b5150e] font-bold">Publisher policy</p>
          <h1 className="font-serif text-4xl font-bold text-[#0d0d0d] mt-4 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

          <div className="space-y-6 text-gray-800 leading-relaxed">
            <p>WORLD NOW (“we”, “our”, “us”) operates this website and related services. This Privacy Policy explains how we collect, use, store, and share information when you read articles, subscribe to RSS, contact the newsroom, or interact with advertisements.</p>
            <p>We respect reader privacy and use information only to improve the site, deliver content, manage contacts, and maintain editorial and platform security.</p>

            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">1. Information we collect</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Contact details you share in the form, including name, email, and message text.</li>
                <li>Technical data such as IP address, browser type, device and pages viewed for site analytics and security.</li>
                <li>Cookies and similar technologies to remember preferences and support the advertising and publishing ecosystem.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">2. How we use your data</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>To respond to reader questions, feedback, or newsroom inquiries.</li>
                <li>To maintain the site, monitor performance, improve article recommendations, and protect against abuse.</li>
                <li>To support legitimate advertising and analytics tools used by publishers, including Google AdSense where applicable.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">3. Cookies and advertising</h2>
              <p className="text-sm">We may use cookies, analytics, and ad-related technologies to understand traffic, optimize the reading experience, and support publisher monetization. You can usually manage or disable cookies in your browser settings.</p>
            </section>

            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">4. Data retention and your rights</h2>
              <p className="text-sm">We retain contact messages and support records for operational, legal, and editorial reasons. If you want your information corrected or removed, please contact the editorial team and we will review the request in line with applicable law.</p>
            </section>

            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">5. Third-party links</h2>
              <p className="text-sm">Our website may contain links to external publishers, social platforms, or ad partners. We are not responsible for the privacy practices of those third-party services.</p>
            </section>

            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">6. Contact us</h2>
              <p className="text-sm">For privacy questions, correction requests, or legal concerns, email <a href="mailto:editor@worldnow.news" className="text-[#b5150e] hover:text-[#8a0f09]">editor@worldnow.news</a> or use our <Link href="/contact" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">contact page</Link>.</p>
            </section>

            <p className="text-sm text-gray-600">Please also review our <Link href="/terms" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">Terms & Conditions</Link> and <Link href="/disclaimer" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">Disclaimer</Link> for additional publisher guidance.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
