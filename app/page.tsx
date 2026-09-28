import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { HeroQuickDropzone } from '@/components/HeroQuickDropzone';
import { ToolDirectory } from '@/components/ToolDirectory';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Full-width blue navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Main content: ~70% width on desktop, 100% on mobile */}
          <div className="w-full lg:col-span-8 xl:col-span-9">
            {/* Interactive Hero Quick Dropzone */}
            <HeroQuickDropzone />

            <ToolDirectory />
          
            {/* Popular Tools Section */}
            <section className="my-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Popular Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/tools/compress-image" className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
                  Compress Image
                </Link>
                <Link href="/tools/compress-pdf" className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
                  Compress PDF
                </Link>
                <Link href="/tools/resize-image-pixel" className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
                  Resize Image (Pixel)
                </Link>
              </div>
            </section>
          </div>

          {/* Right sidebar: ~30% width on desktop, hidden on mobile */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* Compact footer */}
      <Footer />
    </div>
  );
}
