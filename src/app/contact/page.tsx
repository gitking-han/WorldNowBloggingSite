'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/utils/api';
import { usePageMetadata } from '@/utils/seo';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  usePageMetadata({
    title: 'Contact WORLD NOW | Get in Touch',
    description: 'Contact the WORLD NOW editorial team with tips, feedback, and inquiries. We value your input.',
    url: `${typeof window !== 'undefined' ? window.location.origin : SITE_URL}/contact`,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      await api.post('/messages', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact WORLD NOW | Get in Touch</title>
        <meta
          name="description"
          content="Contact the WORLD NOW editorial team with tips, feedback, and inquiries. We value your input."
        />
        <meta property="og:title" content="Contact WORLD NOW | Get in Touch" />
        <meta
          property="og:description"
          content="Contact the WORLD NOW editorial team with tips, feedback, and inquiries. We value your input."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.origin : SITE_URL}/contact`} />
        <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : SITE_URL}/browserlogo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact WORLD NOW | Get in Touch" />
        <meta
          name="twitter:description"
          content="Contact the WORLD NOW editorial team with tips, feedback, and inquiries. We value your input."
        />
        <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : SITE_URL}/browserlogo.png`} />
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : SITE_URL}/contact`} />
      </Head>

      <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-[#b5150e] hover:text-[#8a0f09] font-semibold text-sm">
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8">
          <section className="bg-white rounded-3xl shadow-sm border border-[#efe7db] p-8 md:p-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#b5150e] font-bold">Editorial & reader support</p>
            <h1 className="font-serif text-4xl font-bold text-[#0d0d0d] mt-4 mb-4">Contact the WORLD NOW newsroom</h1>
            <p className="text-gray-700 leading-relaxed mb-6">
              Share a tip, ask about our editorial standards, request a correction, or discuss partnership opportunities. Every message is reviewed by our editorial team and forwarded to the site owner for a direct response.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Fast response', 'We aim to reply within one business day for reader questions and editorial queries.'],
                ['Publisher-ready', 'The form is connected to the newsroom inbox and stored for internal review.'],
                ['Privacy aware', 'We use your contact details only to respond to your request and improve our service.'],
                ['Adsense friendly', 'Clear editorial contact details help build trust with readers and AdSense reviewers.'],
              ].map(([title, text]) => (
                <article key={title} className="rounded-2xl border border-[#efe7db] bg-[#fffdfa] p-4">
                  <h2 className="text-sm font-semibold text-[#0d0d0d] mb-1">{title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#0d0d0d] text-white p-5">
              <h2 className="text-sm uppercase tracking-[0.2em] text-[#f2d598]">What happens next</h2>
              <p className="text-sm text-gray-200 mt-2">Your submission is saved in our database and emailed directly to the site owner’s Gmail inbox for quick follow-up.</p>
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-[#efe7db] p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-[#0d0d0d] mb-2">Send us a message</h2>
            <p className="text-sm text-gray-600 mb-6">Use the form below for tips, corrections, partnerships, or site feedback.</p>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 text-sm">Your message has been sent to the WORLD NOW newsroom and owner Gmail inbox.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 text-sm">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-[#0d0d0d]">Name
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-2 w-full px-4 py-3 border border-[#d4cbb8] rounded-xl outline-none focus:border-[#b5150e] transition bg-white" placeholder="Your full name" />
                </label>
                <label className="block text-sm font-semibold text-[#0d0d0d]">Email
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-2 w-full px-4 py-3 border border-[#d4cbb8] rounded-xl outline-none focus:border-[#b5150e] transition bg-white" placeholder="your@email.com" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-[#0d0d0d]">Subject
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="mt-2 w-full px-4 py-3 border border-[#d4cbb8] rounded-xl outline-none focus:border-[#b5150e] transition bg-white" placeholder="Tell us what this is about" />
              </label>
              <label className="block text-sm font-semibold text-[#0d0d0d]">Message
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} className="mt-2 w-full px-4 py-3 border border-[#d4cbb8] rounded-xl outline-none focus:border-[#b5150e] transition bg-white resize-none" placeholder="Share your story tip, correction, or feedback here…" />
              </label>
              <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-[#b5150e] text-white font-semibold uppercase tracking-wider rounded-xl hover:bg-[#8a0f09] disabled:opacity-50 transition flex items-center justify-center gap-2">
                {loading ? 'Sending…' : <><Send className="w-4 h-4" />Send message</>}
              </button>
            </form>

            <div className="mt-8 border-t border-[#efe7db] pt-6 text-sm text-gray-700 space-y-3">
              <p><strong>Email:</strong> <a href="mailto:worldnow.blogs@gmail.com" className="text-[#b5150e] hover:text-[#8a0f09]">worldnow.blogs@gmail.com</a></p>
              <p><strong>Office:</strong> Iftikhar Town Jauharabad, District Khushab, Pakistan</p>
              <p><strong>Response window:</strong> usually within one working day for genuine reader or editorial inquiries.</p>
            </div>
          </section>
        </div>
      </div>
      </div>
    </>
  );
}
