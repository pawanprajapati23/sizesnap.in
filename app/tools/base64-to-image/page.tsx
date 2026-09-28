import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { Base64ToImageConverter } from '@/components/tool-ui/Base64ToImageConverter';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Base64 to Image - Decode Base64 String to JPG & PNG Online Free | SizeSnap',
  description:
    'Decode Base64 strings and Data URIs into downloadable image files (PNG, JPG, WebP, SVG) online for free. Auto-detect format, preview dimensions, and save with custom filename. 100% private in browser.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/base64-to-image',
  },
  openGraph: {
    title: 'Base64 to Image - Decode Base64 String to JPG & PNG Online Free | SizeSnap',
    description:
      'Convert Base64 strings to downloadable PNG and JPEG images safely in your browser.',
    url: 'https://sizesnap.in/tools/base64-to-image',
  },
};

const RELATED_SLUGS = [
  'image-to-base64',
  'image-color-picker',
  'image-metadata-viewer',
  'jpg-to-png',
  'png-to-jpg',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I decode a Base64 string into an image file?',
    a: 'Simply paste your Base64 text string or Data URI (e.g. data:image/png;base64,...) into the text box. SizeSnap instantly decodes the byte stream, detects the image format, renders an interactive preview, and lets you download the file with one click.',
  },
  {
    q: 'Can I decode raw Base64 strings without the data:image prefix?',
    a: 'Yes. SizeSnap intelligently inspects the magic byte headers of the raw string (such as /9j/ for JPEG, iVBOR for PNG, and R0lGOD for GIF) to reconstruct the correct image type automatically.',
  },
  {
    q: 'Which image formats are supported for decoding?',
    a: 'SizeSnap supports PNG, JPEG/JPG, WebP, SVG, and GIF Base64 strings.',
  },
  {
    q: 'Is any of my Base64 data uploaded to a server?',
    a: 'No. The entire decoding process takes place client-side within your browser sandbox. Your data remains strictly on your device.',
  },
];

export default function Base64ToImagePage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Base64 to Image</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Base64 to Image Decoder Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Paste any Base64 string or Data URI to instantly decode and view your image. Inspect dimensions, file size, and download as PNG, JPG, or WebP.
              </p>
            </div>

            <Base64ToImageConverter />

            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/image-to-base64"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Image to Base64 →
                </Link>
                <Link
                  href="/tools/image-color-picker"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Image Color Picker →
                </Link>
                <Link
                  href="/tools/image-metadata-viewer"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Image Metadata Viewer →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Private</span>
                  <span className="text-[11px] text-gray-500">Processed locally in browser</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Auto Format Detect</span>
                  <span className="text-[11px] text-gray-500">Identifies PNG, JPG, WebP, SVG</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Direct Download</span>
                  <span className="text-[11px] text-gray-500">Save image with custom name</span>
                </div>
              </div>
            </div>

            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related Developer Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <HelpCircle className="h-4 w-4 text-[#414FA8]" />
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3.5">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                      {faq.q}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
