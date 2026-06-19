import React from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'About WORLD NOW | Our Mission & Values',
  description: 'Learn about WORLD NOW, Pakistan\'s independent news platform. Our mission is to deliver truth-driven journalism.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function About() {
  const pillars = [
    {
      icon: '📰',
      title: 'Accuracy First',
      text: 'Every fact is verified before it goes live. We correct errors promptly and transparently — no exceptions.',
    },
    {
      icon: '🌍',
      title: 'Global Perspective',
      text: 'From Karachi to New York, we cover stories that matter worldwide, told with local context you can use.',
    },
    {
      icon: '⚖️',
      title: 'Editorial Independence',
      text: 'No political party and no corporate sponsor pulling strings. Our journalism serves readers first.',
    },
    {
      icon: '💬',
      title: 'Reader Driven',
      text: 'Your feedback shapes our coverage. We track what matters most and make sure it is reported clearly.',
    },
  ];

  const team = [
    { initials: 'AR', name: 'Ahmad Raza', role: 'Editor-in-Chief' },
    { initials: 'SK', name: 'Sara Khan', role: 'Senior Reporter' },
    { initials: 'UA', name: 'Usman Ali', role: 'Tech & Science' },
    { initials: 'MQ', name: 'Maria Qureshi', role: 'World Affairs' },
  ];

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#0d0d0d]">
      

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 md:px-8 md:pt-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#b5150e]">About World Now</p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-black leading-tight text-[#0d0d0d] md:text-5xl lg:text-6xl">
          News that keeps you <span className="italic text-[#b5150e]">one step ahead</span>
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-gray-700 leading-8">
          World Now is an independent English-language news platform delivering fast, factual, and context-rich reporting built for readers who want the full picture, not just the headline.
        </p>
      </section>

      <section className="bg-[#0d0d0d] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
          <blockquote className="mx-auto max-w-4xl text-center font-serif text-2xl font-semibold leading-relaxed md:text-3xl">
            “We believe journalism’s job is to inform, not to alarm. Every story we publish earns its space.”
          </blockquote>
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.3em] text-gray-300">— The World Now Editorial Team</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-gray-500">
          What we stand for
          <span className="h-px flex-1 bg-[#e8e0d0]" />
        </p>
        <div className="grid gap-2 rounded-3xl border border-none bg-transparent shadow-sm md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="bg-white p-6 md:p-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#b5150e] text-lg text-white">{pillar.icon}</div>
              <h2 className="font-serif text-xl font-black text-[#0d0d0d]">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-700">{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 md:px-8">
        <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-gray-500">
          The team
          <span className="h-px flex-1 bg-[#e8e0d0]" />
        </p>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => (
            <article key={member.name} className="rounded-3xl border border-[#e8e0d0] bg-white p-6 text-center shadow-sm transition hover:border-[#b5150e] hover:-translate-y-0.5">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#efe7db] text-lg font-black text-[#b5150e]">{member.initials}</div>
              <h3 className="font-serif text-xl font-black text-[#0d0d0d]">{member.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-[#b5150e]">{member.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0d0d0d] text-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 md:grid-cols-2 xl:grid-cols-4 md:px-8">
          {[
            ['25+', 'Articles Published'],
            ['6+', 'Topics Covered'],
            ['2024', 'Year Founded'],
            ['100%', 'Independent'],
          ].map(([value, label]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="font-serif text-4xl font-black text-[#b5150e] md:text-5xl">{value}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-gray-300">{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 text-center md:px-8">
        <h2 className="font-serif text-3xl font-black text-[#0d0d0d] md:text-4xl">Stay informed, every day</h2>
        <p className="mt-4 text-base text-gray-700 leading-7">
          Join readers who start their morning with World Now. Real news, no noise, and a clear editorial voice every day.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/archive" className="rounded-full bg-[#b5150e] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8a0f09]">Read latest news</Link>
          <Link href="/contact" className="rounded-full border border-[#0d0d0d] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0d0d0d] transition hover:bg-[#0d0d0d] hover:text-white">Contact us</Link>
        </div>
      </section>

    </main>
  );
}
