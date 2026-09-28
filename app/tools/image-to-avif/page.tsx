import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { ImageToAvifConverter } from '@/components/tool-ui/ImageToAvifConverter';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Convert Image to AVIF - Convert JPG & PNG to AVIF Online Free | SizeSnap',
  description:
    'Convert JPG, PNG, and WebP images to modern AVIF format online for free. AVIF delivers up to 50% smaller sizes than WebP and 80% smaller than JPEG with superior color and HDR preservation. 100% private in browser.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/image-to-avif',
  },
  openGraph: {
    title: 'Convert Image to AVIF - Convert JPG & PNG to AVIF Online Free | SizeSnap',
    description:
      'Ultra-efficient AVIF image conversion online with quality control and bulk ZIP export.',
    url: 'https://sizesnap.in/tools/image-to-avif',
  },
};

const RELATED_SLUGS = [
  'image-to-webp',
  'jpg-to-png',
  'png-to-jpg',
  'compress-image',
  'reduce-image-size-in-kb',
  'bulk-image-resizer',
];

const FAQS = [
  {
    q: 'What makes AVIF superior to WebP and JPEG?',
    a: 'AVIF (AV1 Image File Format) is an open-source format developed by the Alliance for Open Media (AOMedia). It leverages the modern AV1 video codec to achieve up to 50% smaller file sizes than WebP and up to 80% smaller sizes than traditional JPEG, with support for 10-bit and 12-bit color depth, transparency, and HDR.',
  },
  {
    q: 'Which browsers support the AVIF image format?',
    a: 'AVIF decoding is natively supported in Google Chrome, Mozilla Firefox, Apple Safari (iOS 16+ & macOS Ventura+), Microsoft Edge, and Opera. For browser-side encoding via Canvas, modern Chromium browsers (Chrome 116+, Edge) offer full acceleration.',
  },
  {
    q: 'Can I convert multiple images to AVIF at the same time?',
    a: 'Yes. SizeSnap allows you to upload multiple JPG, PNG, or WebP photos, choose your target quality, convert all files in batch, and download them individually or as a single ZIP archive.',
  },
  {
    q: 'Are my photos uploaded to a cloud server?',
    a: 'No. All processing occurs locally within your browser sandbox. Your images are never transmitted or stored on remote servers.',
  },
];

export default function ImageToAvifPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Image to AVIF</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Convert Image to AVIF Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Convert photos into ultra-compact AVIF format. Experience cutting-edge compression that outperforms WebP and JPEG, convert multiple files in batch, and download as a ZIP file.
              </p>
            </div>

            <ImageToAvifConverter />

            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired Conversion Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/image-to-webp"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Image to WebP →
                </Link>
                <Link
                  href="/tools/compress-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress Image →
                </Link>
                <Link
                  href="/tools/bulk-image-resizer"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Bulk Image Resizer →
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
                  <span className="font-semibold block text-gray-800">AV1 Compression</span>
                  <span className="text-[11px] text-gray-500">Smallest image format available</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">ZIP Export</span>
                  <span className="text-[11px] text-gray-500">1-click bulk batch download</span>
                </div>
              </div>
            </div>

            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related Conversion Tools
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
