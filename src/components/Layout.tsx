'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import api from '../utils/api';
import { Category, Region } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    async function loadNavigationData() {
      try {
        const [categoriesResponse, regionsResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/regions'),
        ]);

        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
        setRegions(Array.isArray(regionsResponse.data) ? regionsResponse.data : []);
      } catch (err) {
        console.error('Failed to load navigation data for layout', err);
      }
    }

    loadNavigationData();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f4] flex flex-col justify-between font-sans">
      <div>
        <Header />
        <Suspense fallback={null}>
          <Navbar categories={categories} regions={regions} />
        </Suspense>
        <main className="w-full flex-grow">{children}</main>
      </div>
      <CookieConsent />
      <Footer />
    </div>
  );
}
