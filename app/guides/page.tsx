import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Guides & Tutorials - SizeSnap',
  description: 'Learn how to compress images, resize photos, and edit PDFs with SizeSnap guides.',
  alternates: {
    canonical: 'https://sizesnap.in/guides',
  },
};

export default function GuidesHubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">SizeSnap Guides</h1>
        <p className="text-gray-600 mb-8">
          Learn how to perform common image and PDF tasks using our free tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/guides/how-to-compress-image" className="block bg-white p-6 rounded border border-gray-200 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-[#414FA8] mb-2">How to Compress an Image Without Losing Quality</h2>
            <p className="text-gray-600 text-sm">
              Discover the best settings and formats to compress images for the web, email, or government forms while maintaining clarity.
            </p>
          </Link>
          {/* Future guides can be added here */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
