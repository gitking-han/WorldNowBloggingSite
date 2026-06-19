import React from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Disclaimer | WORLD NOW',
  description: 'Read our editorial and site disclaimer for content accuracy, advertising, and external links.',
  alternates: {
    canonical: `${SITE_URL}/disclaimer`,
  },
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-[#b5150e] hover:text-[#8a0f09] font-semibold text-sm">← Back to Home</Link>
        </div>

        <article className="bg-white rounded-3xl shadow-sm border border-[#efe7db] p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#b5150e] font-bold">Editorial disclosure</p>
          <h1 className="font-serif text-4xl font-bold text-[#0d0d0d] mt-4 mb-2">Disclaimer</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

          <div className="space-y-6 text-gray-800 leading-relaxed">
            <p>WORLD NOW publishes information for general awareness and public-interest reporting. While we make every reasonable effort to verify facts, we cannot guarantee that every article, image, statistic, or external link is error-free or current at all times.</p>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">Editorial accuracy</h2>
              <p className="text-sm">Our reports are based on available information, credible sources, and editorial review. Errors may occur, and updates are made when necessary.</p>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">Advertising and partnerships</h2>
              <p className="text-sm">Some content may be sponsored, monetized, or supported by third-party partners. Editorial decisions are kept separate from advertising arrangements to maintain independence.</p>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">External links</h2>
              <p className="text-sm">We link to external resources for context and convenience. We are not responsible for the reliability or legality of those third-party websites.</p>
            </section>
            <section className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-5">
              <h2 className="text-xl font-semibold text-[#0d0d0d] mb-2">Reader use</h2>
              <p className="text-sm">Readers should use the site as an information source and make independent decisions for business, legal, or personal matters. Please review our <Link href="/policy" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">Privacy Policy</Link> and <Link href="/terms" className="text-[#b5150e] hover:text-[#8a0f09] border-b border-[#b5150e]/30">Terms & Conditions</Link> for full guidance.</p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
