import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  return (
    <footer className="w-full bg-gradient-to-r from-[#020817] via-[#03112f] to-[#071426] text-white py-16 px-6 md:px-8 border-t-8 border-[#b5150e]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-neutral-800 pb-12 mb-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-serif text-3xl font-extrabold text-white"
            >
              <Image
                src="/footer-logo.png"
                alt="logo"
                width={350}
                height={100}
                priority
                className="w-48 h-auto"
              />
            </Link>
            {/* <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9922a] font-semibold -mt-2">
              Pakistan's Independent Voice
            </span> */}
            <p className="text-xs text-gray-500 leading-relaxed italic font-serif">
              "Your Trusted Source for Global News and Insights"
            </p>
          </div>

          <div>
            <h4 className="text-[10px] uppercase text-white font-bold mb-4 pb-2 border-b border-neutral-800">
              Policy Standards
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link
                  href="/policy"
                  className="text-gray-500 hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-500 hover:text-white transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-gray-500 hover:text-white transition"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.localStorage.removeItem("worldnow_cookie_consent");
                    window.location.reload();
                  }}
                  className="p-0 text-gray-500 bg-transparent border-none hover:text-white transition"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase text-white font-bold mb-4 pb-2 border-b border-neutral-800">
              Company
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 hover:text-white transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => toggleMenu("categories")}
                  className="text-gray-500 bg-transparent border-none p-0 hover:text-white transition w-full text-left"
                >
                  Categories
                </button>

                {openMenu === "categories" && (
                  <div className="mt-2 ml-2 flex flex-col gap-1 text-gray-500">
                   
                    <Link
                      href="/?category=technology"
                      className="hover:text-white"
                    >
                      Technology
                    </Link>
                    <Link
                      href="/?category=economy"
                      className="hover:text-white"
                    >
                      Economy
                    </Link>
                    <Link
                      href="/?category=sports"
                      className="hover:text-white"
                    >
                      Sports
                    </Link>
                    <Link
                      href="/?category=science"
                      className="hover:text-white"
                    >
                      Science
                    </Link>
                    <Link
                      href="/?category=world"
                      className="hover:text-white"
                    >
                      World
                    </Link>
                    <Link
                      href="/?category=culture"
                      className="hover:text-white"
                    >
                      Culture
                    </Link>
                  </div>
                )}
              </li>

              {/* Regions */}
              <li>
                <button
                  onClick={() => toggleMenu("regions")}
                  className="text-gray-500 bg-transparent border-none p-0 hover:text-white transition w-full text-left"
                >
                  Regions
                </button>

                {openMenu === "regions" && (
                  <div className="mt-2 ml-2 flex flex-col gap-1 text-gray-500">
                    <Link href="/?region=europe" className="hover:text-white">
                      Europe
                    </Link>
                    <Link href="/?region=asia" className="hover:text-white">
                      Asia
                    </Link>
                    <Link
                      href="/?region=america"
                      className="hover:text-white"
                    >
                      America
                    </Link>
                    <Link href="/?region=asia" className="hover:text-white">
                      Asia
                    </Link>
                    <Link href="/?region=middle-east" className="hover:text-white">
                      Middle East
                    </Link>
                    <Link href="/?region=africa" className="hover:text-white">
                      Africa
                    </Link>
                    <Link href="/?region=oceania" className="hover:text-white">
                      Oceania
                    </Link>
                    <Link href="/?region=global" className="hover:text-white">
                      Global
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase text-white font-bold mb-4 pb-2 border-b border-neutral-800">
              Offices & Contact
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-1">
              WORLD NOW Media Group Inc.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Iftikhar Town Jauharabad, District Khushab, Pakistan
            </p>
            <p className="text-xs text-gray-500 font-bold">
              worldnow.blogs@gmail.com
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-600">
          <span>
            © 2026 WORLD NOW. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition uppercase"
            >
              twitter
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition uppercase"
            >
              facebook
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition uppercase text-sky-500 font-bold"
            >
              linkedin
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition uppercase text-red-600 font-bold"
            >
              youtube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
