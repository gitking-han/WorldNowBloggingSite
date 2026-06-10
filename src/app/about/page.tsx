'use client';

import React from 'react';
import Link from 'next/link';
import { usePageMetadata } from '@/utils/seo';

export const dynamic = 'force-dynamic';

export default function About() {
  usePageMetadata({
    title: 'About WORLD NOW | Our Mission & Values',
    description: 'Learn about WORLD NOW, Pakistan\'s independent news platform. Our mission is to deliver truth-driven journalism.',
    url: `${typeof window !== 'undefined' ? window.location.origin : 'https://worldnow.news'}/about`,
  });

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-[#b5150e] hover:text-[#8a0f09] font-semibold text-sm">← Back to Home</Link>
        </div>

        <article className="bg-white rounded-3xl shadow-sm border border-[#efe7db] p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#b5150e] font-bold">About our newsroom</p>
          <h1 className="font-serif text-4xl font-bold text-[#0d0d0d] mt-4 mb-4">About WORLD NOW</h1>
          <p className="text-gray-700 leading-relaxed mb-8">
            WORLD NOW is an independent Pakistani news publisher focused on accurate reporting, public-interest analysis, and transparent editorial standards. Our goal is to help readers understand what happened, why it matters, and how it affects daily life.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              ['Our mission', 'To deliver trustworthy, accessible journalism on politics, economy, technology, culture, and international affairs while keeping the editorial process transparent.'],
              ['Editorial standards', 'Every article is reviewed for accuracy, fairness, and clarity before publication, with corrections handled quickly when needed.'],
              ['Reader trust', 'We publish clear author credits, maintain a privacy policy, and provide direct contact paths so readers can reach the editorial team.'],
              ['Adsense & publisher readiness', 'A professional site structure, clean navigation, well-defined legal pages, RSS feeds, and a clear contact flow support trust and compliance readiness.'],
            ].map(([title, text]) => (
              <section key={title} className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
                <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">{title}</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-[#0d0d0d] text-white p-6">
            <h2 className="text-xl font-semibold mb-2">Why this matters</h2>
            <p className="text-sm text-gray-200 leading-relaxed">A credible newsroom should be easy to understand, easy to contact, and easy to trust. These standards improve reader confidence, which is why we have strengthened our legal pages, publishing policy, and contact workflow for a cleaner publishing experience.</p>
          </div>

          <p className="mt-8 text-sm text-gray-600">Questions or suggestions? <Link href="/contact" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">Contact us</Link> or review our <Link href="/policy" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">Privacy Policy</Link>.</p>
        </article>
      </div>
    </div>
  );
}
