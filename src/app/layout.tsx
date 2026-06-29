import type { Metadata } from 'next';
import React from 'react';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'World Now | Global & Regional News',
    template: '%s | WORLD NOW',
  },
  description:
    'Read the latest independent news, analysis, and updates from Pakistan and around the world.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'World Now',
    title: 'World Now | Global & Regional News',
    description:
      'Read the latest independent news, analysis, and updates from Pakistan and around the world.',
    url: SITE_URL,
    images: [
      {
        url: '/browserlogo.png',
        width: 1200,
        height: 630,
        alt: 'WORLD NOW',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Now | Global & Regional News',
    description:
      'Read the latest independent news, analysis, and updates from Pakistan and around the world.',
    images: ['/browserlogo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
