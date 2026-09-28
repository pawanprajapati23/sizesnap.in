import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { KbCompressor } from '@/components/tool-ui/KbCompressor';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reduce Image Size in KB Online (20KB, 50KB, 100KB) | SizeSnap',
  description:
    'Free tool to reduce image file size to exact target KB (20KB, 50KB, 100KB, 200KB) for SSC, UPSC, PAN cards, and exam portals without server uploads.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/reduce-image-size-kb',
  },
  openGraph: {
    title: 'Reduce Image Size in KB Online (20KB, 50KB, 100KB) | SizeSnap',
    description:
      'Compress photos and signatures to exact 20KB, 50KB, or 100KB online for free with SizeSnap.',
    url: 'https://sizesnap.in/tools/reduce-image-size-kb',
  },
};

const RELATED_SLUGS = [
  'compress-image',
  'resize-image-pixel',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'resize-signature',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How do I reduce my photo size to exactly 20KB or 50KB for govt portals?',
    a: 'Simply select your photo, click the "20 KB" or "50 KB" preset button (or enter any custom number), and click "Reduce Image". SizeSnap uses smart client-side binary search algorithms to recalibrate compression and scale dimensions to match your target without manual guesswork.',
  },
  {
    q: 'Why do Indian exam portals (SSC, UPSC, IBPS, NTA) require 20KB to 50KB photos?',
    a: 'Government and university servers handle millions of applications simultaneously. Mandating 20KB–50KB constraints ensures fast form submissions, low server storage overhead, and quick identity verification during hall ticket generation.',
  },
  {
    q: 'Will reducing file size to 20KB make my photo completely blurry?',
    a: 'SizeSnap preserves facial features and clarity by intelligently balancing JPEG/WebP quantization tables and scaling dimensions just enough to fit within your specified KB limit while maintaining the original aspect ratio.',
  },
  {
    q: 'Can I reduce signature images to 10KB or 20KB?',
    a: 'Yes. For black & white or blue ink signatures on white paper, SizeSnap optimizes the background pixels and reduces file size to 10KB–20KB in milliseconds.',
  },
];

export default function ReduceImageSizeKbPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Reduce Image Size in KB</span>
        </nav>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Reduce Image Size in KB Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Reduce image file size to exact target KB (20KB, 50KB, 100KB, 200KB) for job applications, passports, and exam portals without server uploads.
              </p>
            </div>

            {/* Interactive Target KB Engine */}
            <React.Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading SizeSnap Compressor...</div>}>
              <KbCompressor />
            </React.Suspense>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Client-Side</span>
                  <span className="text-[11px] text-gray-500">Private &amp; secure in your browser</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Target Size Presets</span>
                  <span className="text-[11px] text-gray-500">20KB, 50KB, 100KB or custom</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Official Exam Ready</span>
                  <span className="text-[11px] text-gray-500">Perfect for SSC, UPSC &amp; PAN</span>
                </div>
              </div>
            </div>

            {/* Sister Tools Quick Links */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Need general compression or pixel dimensions?
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/compress-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress Image (Quality &amp; Format) →
                </Link>
                <Link
                  href="/tools/resize-image-pixel"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Resize Image Pixel (Width &amp; Height) →
                </Link>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related Size &amp; Exam Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
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
