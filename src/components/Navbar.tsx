'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isRouteActive = (slug: string) => {
    if (slug === '') {
      return (pathname === '/' || pathname === '/home') && !searchParams.has('category') && !searchParams.has('region');
    }

    if (pathname.startsWith('/blog/')) {
      const categoryParam = searchParams.get('category');
      return categoryParam === slug;
    }

    return searchParams.get('category') === slug;
  };

  const regionItems = Array.isArray(regions) && regions.length > 0 ? regions : DEFAULT_REGIONS;

  return (
    <nav className="w-full bg-[#0d0d0d] border-b-4 border-[#b5150e] relative z-20 font-sans">
      <div className="md:hidden flex justify-between items-center px-4 py-3 border-b border-gray-800 text-white select-none">
        <span className="font-semibold text-xs tracking-wider uppercase text-gray-300">Sections Menu</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-[#111] hover:bg-[#b5150e] border-none focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className={`max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-stretch ${isOpen ? 'block' : 'hidden md:flex'}`}>
        <ul className="list-none flex flex-col md:flex-row md:flex-wrap items-stretch gap-0 w-full m-0 p-0">
          <li>
            <Link
              href="/home"
              className={`inline-flex items-center px-5 py-4 text-[12.5px] font-medium tracking-widest uppercase border-b md:border-b-0 md:border-r border-[#1a1a1a] transition ${
                isRouteActive('') ? 'bg-[#b5150e] text-white' : 'text-gray-300 hover:bg-[#b5150e] hover:text-white'
              }`}
            >
              Home
            </Link>
          </li>

          {Array.isArray(categories) && categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/?category=${cat.slug}`}
                className={`inline-flex items-center px-5 py-4 text-[12.5px] font-medium tracking-widest uppercase border-b md:border-b-0 md:border-r border-[#1a1a1a] transition ${
                  isRouteActive(cat.slug) ? 'bg-[#b5150e] text-white' : 'text-gray-300 hover:bg-[#b5150e] hover:text-white'
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}

          <li className="relative group border-b md:border-b-0 md:border-r border-[#1a1a1a]" onMouseLeave={() => setRegionsOpen(false)}>
            <button
              onClick={() => setRegionsOpen(!regionsOpen)}
              className="w-full inline-flex items-center gap-1.5 px-5 py-3 text-[12.5px] font-medium tracking-widest uppercase text-gray-300 bg-[#111] hover:bg-[#b5150e] hover:text-white transition"
            >
              <span>Regions</span>
              <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            <div className={`absolute left-0 mt-0 w-56 bg-[#111] border border-gray-800 rounded shadow-xl py-2 ${regionsOpen ? 'block' : 'hidden group-hover:block'}`}>
              <div className="grid grid-cols-1 gap-1">
                {regionItems.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/?region=${encodeURIComponent(region.slug)}`}
                    className={`block px-4 py-2 text-xs transition ${searchParams.get('region') === region.slug ? 'bg-[#b5150e] text-white' : 'text-gray-300 hover:bg-neutral-800 hover:text-white'}`}
                    onClick={() => setRegionsOpen(false)}
                  >
                    {region.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>

        </ul>
      </div>
    </nav>
  );
}
