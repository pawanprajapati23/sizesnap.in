import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PixelResizer } from '@/components/tool-ui/PixelResizer';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resize Image Pixel - Change Width & Height in Pixels Free | SizeSnap',
  description:
    'Free online pixel resizer tool. Change image width and height in pixels with aspect ratio lock, resolution presets (720p, 1080p, 4K), and high-quality canvas scaling.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/resize-image-pixel',
  },
  openGraph: {
    title: 'Resize Image Pixel - Change Width & Height in Pixels Free | SizeSnap',
    description:
      'Resize JPG, PNG, and WebP images to exact pixel dimensions directly in your browser without quality loss.',
    url: 'https://sizesnap.in/tools/resize-image-pixel',
  },
};

const RELATED_SLUGS = [
  'compress-image',
  'reduce-image-size-in-kb',
  'resize-in-centimeters',
  'resize-image-3-5cm-4-5cm',
  'crop-png',
  'change-aspect-ratio',
];

const FAQS = [
  {
    q: 'How do I resize an image to exact pixel dimensions?',
    a: 'Upload your photo, type your target width or height into the pixel boxes, and click "Resize Image". SizeSnap calculates proportional dimensions automatically when Aspect Ratio Lock is enabled, or allows freeform custom dimensions when unlocked.',
  },
  {
    q: 'Will resizing stretch or distort my image?',
    a: 'Not unless you intentionally unlock the aspect ratio. By default, Aspect Ratio Lock is turned ON so changing the width automatically recalculates the proportional height without stretching.',
  },
  {
    q: 'What is the difference between resizing and compressing?',
    a: 'Resizing changes the physical pixel grid (e.g. 1920×1080 to 1280×720). Compressing reduces the file storage footprint (e.g. 2MB to 300KB) while keeping the original pixel dimensions identical.',
  },
  {
    q: 'Can I enlarge a small photo to HD without blur?',
    a: 'Enlarging (upscaling) an image creates new pixels by interpolating existing data. While SizeSnap applies high-quality bicubic smoothing, enlarging a tiny image by 300% or more will naturally look softer than a native high-resolution photo.',
  },
  {
    q: 'Are transparent PNG backgrounds preserved after resizing?',
    a: 'Yes. If you select PNG or WebP output, transparent alpha channels are strictly preserved throughout the canvas resize pipeline.',
  },
];

export default function ResizeImagePixelPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Resize Image Pixel</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Resize Image Pixel Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Change width and height in pixels for JPG, PNG, and WebP images. Lock aspect ratio, select standard resolution presets, and export directly in your browser.
              </p>
            </div>

            {/* Interactive Pixel Resizer Engine */}
            <PixelResizer />

            {/* Quick Links to Sister Tools */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Looking for other sizing options?
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/compress-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress Image (Reduce MB/KB) →
                </Link>
                <Link
                  href="/tools/reduce-image-size-kb"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Reduce to Exact 20KB / 50KB →
                </Link>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Aspect Ratio Lock</span>
                  <span className="text-[11px] text-gray-500">Zero image stretching or distortion</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Resolution Presets</span>
                  <span className="text-[11px] text-gray-500">720p, 1080p &amp; custom sizing</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Client-Side</span>
                  <span className="text-[11px] text-gray-500">Private canvas pixel manipulation</span>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related Dimension &amp; Cropping Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="mt-4 text-center">
  <Link href="/#directory" className="text-sm text-[#414FA8] hover:underline">Explore all tools →</Link>
</div>
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

          {/* Desktop Right Sidebar */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
