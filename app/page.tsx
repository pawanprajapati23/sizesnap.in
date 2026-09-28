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
      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
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

      {/* SEO & AdSense Rich Content Section */}
      <section className="w-full bg-white border-t border-gray-200 mt-6 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose SizeSnap 2.0?</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Welcome to SizeSnap, India's most trusted suite of free online utilities for students, professionals, and general web users. 
            Whether you are applying for SSC, UPSC, NEET, or local government exams, getting your photos and signatures to the exact requested size (like 20KB or 50KB) is crucial. 
            Unlike other platforms, SizeSnap operates 100% locally in your browser. This means your sensitive documents, government IDs, and biometric signatures are never uploaded to any cloud server, guaranteeing absolute privacy and security.
          </p>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions (FAQ)</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Is SizeSnap really free to use?</h4>
              <p className="text-gray-600 text-sm mt-1">Yes! SizeSnap is completely free. There are no hidden charges, no premium subscriptions, and no annoying watermarks added to your exported files.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Are my files uploaded to a server?</h4>
              <p className="text-gray-600 text-sm mt-1">No. All image compression, resizing, and PDF manipulations happen directly within your device's browser using advanced HTML5 and WebAssembly technologies.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Can I compress images for government exams?</h4>
              <p className="text-gray-600 text-sm mt-1">Absolutely. We offer dedicated presets and exact KB targeting to help you meet the strict file size limits (e.g., 10KB - 50KB) mandated by various Indian examination portals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compact footer */}
      <Footer />
    </div>
  );
}
