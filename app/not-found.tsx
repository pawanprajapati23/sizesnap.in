import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ALL_TOOLS } from '@/data/tools';
import { Search, Home, ArrowRight, Zap } from 'lucide-react';

const TOP_TOOLS = [
  { name: 'Compress Image', slug: 'compress-image', desc: 'Reduce file size quickly' },
  { name: 'Reduce Image in KB', slug: 'reduce-image-size-in-kb', desc: 'Target 20KB, 50KB, 100KB' },
  { name: 'Passport Photo Maker', slug: 'passport-photo-maker', desc: 'Crop & fit official photo sizes' },
  { name: 'Resize Image Pixel', slug: 'resize-image-pixel', desc: 'Change width and height dimensions' },
  { name: 'JPG to PNG', slug: 'jpg-to-png', desc: 'Convert image formats' },
  { name: 'Image to PDF', slug: 'image-to-pdf', desc: 'Convert photos to PDF documents' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-6 sm:p-10 rounded-[4px] border border-gray-200 shadow-xs w-full space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#EEF1FB] text-[#414FA8] mb-2">
            <Zap className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#414FA8] tracking-widest uppercase bg-[#EEF1FB] px-3 py-1 rounded-full border border-[#9AA3C8]/40">
              HTTP 404 • Page Moved
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333]">
              Looking for a SizeSnap Tool?
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              The page you are looking for might have moved to our new upgraded system. All SizeSnap tools are active and faster than ever!
            </p>
          </div>

          {/* Quick Popular Tools Grid */}
          <div className="pt-2 text-left space-y-3">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block border-b border-gray-100 pb-2">
              Popular SizeSnap Tools:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {TOP_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="p-3 rounded border border-gray-200 bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#EEF1FB] transition-colors group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-gray-900 group-hover:text-[#414FA8]">
                      {tool.name}
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-[#414FA8] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-[11px] text-gray-500">{tool.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 border-t border-gray-100">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Go to All 80+ Tools</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
