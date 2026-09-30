import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToolDirectory } from '@/components/ToolDirectory';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Image & PDF Tools | SizeSnap Free Online Utilities',
  description:
    'Browse our complete collection of free, client-side tools for compressing, resizing, and converting images and PDFs. 100% secure with no file uploads.',
  alternates: {
    canonical: 'https://sizesnap.in/tools',
  },
};

export default function ToolsDirectoryPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sizesnap.in/' },
      { '@type': 'ListItem', position: 2, name: 'All Tools', item: 'https://sizesnap.in/tools' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 max-w-7xl mx-auto" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-800 font-semibold">All Tools</span>
          </nav>

          <div className="max-w-7xl mx-auto text-center mb-8">
             <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] tracking-tight mb-2">
                SizeSnap Tools Directory
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                Explore our full suite of free, privacy-first web utilities. Compress, resize, convert, and edit your images and PDFs entirely inside your browser. No server uploads.
              </p>
          </div>

          <ToolDirectory />

        </main>

        <Footer />
      </div>
    </>
  );
}
