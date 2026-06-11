'use client';

import React, { useState } from 'react';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

interface NavbarProps {
  categories: Array<{ name: string; slug: string }>;
  regions: Array<{ name: string; slug: string }>;
}

const DEFAULT_REGIONS = [
  { name: 'Europe', slug: 'europe' },
  { name: 'America', slug: 'america' },
  { name: 'Asia', slug: 'asia' },
  { name: 'Middle East', slug: 'middle-east' },
  { name: 'Africa', slug: 'africa' },
  { name: 'Oceania', slug: 'oceania' },
  { name: 'Global', slug: 'global' },
];

export default function Navbar({ categories, regions }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isRouteActive = (slug: string) => {
    if (slug === '') {
      return (
        (pathname === '/' || pathname === '/home') &&
        !searchParams.has('category') &&
        !searchParams.has('region')
      );
    }

    return searchParams.get('category') === slug;
  };

  const regionItems =
    Array.isArray(regions) && regions.length > 0
      ? regions
      : DEFAULT_REGIONS;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#12203f] bg-gradient-to-r from-[#020817] via-[#03112f] to-[#071426] shadow-lg">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        {/* MAIN ROW */}
        <div className="flex h-[92px] items-center gap-6">

          {/* LOGO */}
          <div className="hidden lg:flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-4">
              <img
                src="/footer-logo.png"
                alt="World Now"
                className="h-auto w-20 object-contain"
              />
            </Link>
          </div>

          {/* CENTER MENU */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-10">

              <Link
                href="/"
                className={`relative py-2 text-[13px] font-semibold uppercase tracking-wider transition ${
                  isRouteActive('')
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
                {isRouteActive('') && (
                  <span className="absolute -bottom-3 left-0 h-[2px] w-full bg-[#e11d2f]" />
                )}
              </Link>

              {categories?.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/archive?category=${cat.slug}`}
                  className={`relative py-2 text-[13px] font-semibold uppercase tracking-wider transition ${
                    isRouteActive(cat.slug)
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {cat.name}
                  {isRouteActive(cat.slug) && (
                    <span className="absolute -bottom-3 left-0 h-[2px] w-full bg-[#e11d2f]" />
                  )}
                </Link>
              ))}

              {/* REGIONS */}
              <div
                className="relative"
                onMouseEnter={() => setRegionsOpen(true)}
                onMouseLeave={() => setRegionsOpen(false)}
              >
                <button className="bg-transparent border-none flex items-center gap-1 py-2 text-[13px] font-semibold uppercase tracking-wider text-gray-300 hover:text-white">
                  Regions
                  <ChevronDown className="h-4 w-4" />
                </button>

                <div
                  className={`absolute left-0 top-full mt-4 w-60 rounded-xl border border-white/10 bg-[#09152b] p-2 shadow-2xl ${
                    regionsOpen ? 'block' : 'hidden'
                  }`}
                >
                  {regionItems.map((region) => (
                    <Link
                      key={region.slug}
                      href={`/archive?region=${encodeURIComponent(region.slug)}`}
                      className={`block rounded-lg px-4 py-3 text-sm transition ${
                        searchParams.get('region') === region.slug
                          ? 'bg-[#e11d2f] text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {region.name}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SEARCH (NOW IN FLOW, NOT ABSOLUTE) */}
          <div className="hidden lg:flex items-center ml-auto">
            <div className="flex items-center gap-3 transition-all duration-300">

              {searchOpen ? (
                <>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-72 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e11d2f]"
                  />

                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="bg-transparent border-none text-gray-300 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="bg-transparent border-none flex h-14 w-14 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#e11d2f] hover:bg-white/5"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

            </div>
          </div>

          <div className="flex w-full items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-1">
              <img
                src="/footer-logo.png"
                alt="World Now"
                className="h-auto w-20 object-contain"
              />

            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-transparent border-none flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="border-t border-white/10 py-4 lg:hidden">
            <div className="flex flex-col gap-1">

              <Link
                href="/"
                className="rounded-lg px-4 py-3 text-sm font-medium text-white hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              {categories?.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/archive?category=${cat.slug}`}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Regions
                </p>

                {regionItems.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/archive?region=${encodeURIComponent(
                      region.slug
                    )}`}
                    className="block rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {region.name}
                  </Link>
                ))}
              </div>

              <div className="mt-4 px-4">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}