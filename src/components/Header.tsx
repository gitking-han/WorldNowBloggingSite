"use client";

import React, { useState, useEffect } from "react";
import { Search, Mail, Newspaper, Fullscreen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeaderProps {
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

export default function Header({ onSearch, searchTerm = "" }: HeaderProps) {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [searchValue, setSearchValue] = useState(searchTerm);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const tickers = [
    {
      label: "Breaking",
      text: "PM chairs emergency economic summit in Islamabad",
    },
    {
      label: "Markets",
      text: "KSE-100 rises 340 points amid investor optimism",
    },
    { label: "Weather", text: "Monsoon forecast early for Sindh, says PMD" },
    {
      label: "Sports",
      text: "Pakistan cricket squad named for Asia Cup tournament",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tickers.length]);

  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(Boolean(localStorage.getItem("worldnow_admin_token")));
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* <div className="w-full bg-[#0d0d0d] text-[#ccc] py-2.5 px-4 md:px-8 border-b border-[#b5150e] text-[11px] select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 text-gray-400 tracking-wide">
            <span>Thursday, 21 May 2026 · Lahore 34°C · Karachi 34°C</span>
          </div>

          <div className="flex-1 max-w-lg overflow-hidden relative hidden md:block px-6">
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500">
              <span className="text-[11px] text-gray-300 truncate">
                <strong className="text-[#c9922a] uppercase tracking-wider text-[10px] mr-2">
                  {tickers[tickerIndex].label}
                </strong>
                {tickers[tickerIndex].text}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center uppercase tracking-wider font-semibold text-gray-400 text-[10px]">
            <Link href="/rss" className="hover:text-white transition">
              RSS
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
            <span className="text-gray-700">|</span>
            {isAdmin ? (
              <Link
                href="/admin/dashboard"
                className="text-[#c9922a] hover:text-white transition"
              >
                Admin Panel
              </Link>
            ) : (
              <Link href="/admin/login" className="hover:text-white transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div> */}

      <div className="w-full bg-white border-b border-[#d4cbb8] py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-6">
          <div className="flex justify-center lg:justify-start items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="logo"
                width={350}
                height={100}
                priority
                className="w-48 h-auto"
              />
            </Link>
          </div>

          <div className="flex flex-col items-center md:mr-18 text-center">
            <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#0d0d0d] tracking-tighter leading-none select-none">
              WORLD NOW
            </span>
            <div className="w-48 h-[3px] bg-gradient-to-r from-transparent via-[#b5150e] to-transparent my-2" />
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#555] font-semibold">
              Pakistan's Independent Voice
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 w-full">
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-[320px]"
            >
              <input
                type="text"
                placeholder="Search archives..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#faf8f4] border border-[#d4cbb8] rounded-full text-sm font-sans outline-none focus:border-[#b5150e] focus:bg-white transition"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
            </form>

         
          </div>
        </div>
      </div>
    </header>
  );
}
