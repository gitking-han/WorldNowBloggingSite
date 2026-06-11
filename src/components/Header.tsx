'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState(new Date());
  const [latestNews, setLatestNews] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadLatestNews = async () => {
      try {
        const response = await fetch("/api/blogs?status=published&limit=4");

        if (!response.ok) {
          throw new Error("Failed to load latest articles");
        }

        const data = await response.json();

        const titles = (Array.isArray(data) ? data : [])
          .map((article: any) => String(article?.title || "").trim())
          .filter(Boolean)
          .map((title) =>
            title.length > 72 ? `${title.slice(0, 69).trimEnd()}...` : title,
          );

        if (isMounted) {
          setLatestNews(titles.length > 0 ? titles : ["Latest articles are loading..."]);
        }
      } catch (error) {
        console.error("Failed to load latest header news:", error);

        if (isMounted) {
          setLatestNews(["Latest articles are loading..."]);
        }
      }
    };

    loadLatestNews();

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="w-full bg-white shadow-sm">

      {/* TOP TICKER BAR */}
      <div className="w-full bg-[#0d0d0d] text-white overflow-hidden border-b border-red-600">
        <div className="flex items-center h-10 px-4 md:px-8">

          {/* LEFT INFO */}
          <div className="flex items-center gap-3 whitespace-nowrap text-xs font-medium text-gray-300">
            <span>{formattedDate}</span>
            <span className="text-red-500">•</span>
            <span>{formattedTime}</span>
          </div>

          {/* MARQUEE NEWS */}
          <div className="ml-6 flex-1 overflow-hidden relative">
            <div className="whitespace-nowrap animate-marquee inline-block text-sm font-medium text-white">
              {latestNews.map((item, idx) => (
                <span key={idx} className="mr-12">
                  🔴 {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="w-full border-b border-[#d4cbb8] bg-white px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center text-center">

            <span className="font-serif text-4xl font-extrabold tracking-tighter text-[#0d0d0d] sm:text-5xl leading-none select-none">
              WORLD NOW
            </span>

            <div className="my-2 h-[3px] w-48 bg-gradient-to-r from-transparent via-[#b5150e] to-transparent" />

            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#555]">
              Your Trusted Source for Global News and Insights
            </span>

          </div>
        </div>
      </div>

      {/* ANIMATION STYLE */}
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 18s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>

    </header>
  );
}