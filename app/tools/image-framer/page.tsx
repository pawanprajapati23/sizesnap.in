import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageFramerTool } from '@/components/ImageFramerTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Add Borders & Round Corners to Image | SizeSnap',
  description: 'Easily add white borders, custom colored borders, round corners, or change aspect ratio of your images online for free.',
};

export default function ImageFramerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'B').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Image Framer</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Image Borders &amp; Corners
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Add borders, round corners, and frame your photos beautifully.
          </p>

          <ImageFramerTool />
        </div>

        {relatedTools.length > 0 && (
          <div className="bg-white p-5 rounded-[4px] border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
              Related Editing Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {relatedTools.map((relTool) => (
                <ToolButton key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
