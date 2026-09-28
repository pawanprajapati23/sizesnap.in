import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { BulkImageResizer } from '@/components/tool-ui/BulkImageResizer';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bulk Image Resizer - Resize Multiple Images Online Free | SizeSnap',
  description:
    'Resize hundreds of JPG, PNG, and WebP images simultaneously. Custom dimensions, aspect ratio lock, percentage scaling, bounding box limits, and 1-click ZIP download. 100% private in browser.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/bulk-image-resizer',
  },
  openGraph: {
    title: 'Bulk Image Resizer - Resize Multiple Images Online Free | SizeSnap',
    description:
      'Batch resize multiple photos in pixels or percentage with aspect ratio protection and instant ZIP export.',
    url: 'https://sizesnap.in/tools/bulk-image-resizer',
  },
};

const RELATED_SLUGS = [
  'resize-image-pixel',
  'reduce-image-size-in-kb',
  'compress-image',
  'jpg-to-png',
  'png-to-jpg',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'Can I resize multiple images that have different aspect ratios?',
    a: 'Yes. You can use the "Max Bounds" mode (e.g. 1920×1080) or "By Percentage" mode (e.g. 50%). Each image scales down proportionally according to its individual aspect ratio without any stretching or deformation.',
  },
  {
    q: 'How does Aspect Ratio Lock work with exact pixel dimensions?',
    a: 'When Aspect Ratio Lock is enabled in Exact Dimensions mode, setting your desired Width will automatically calculate the matching Height for each individual photo so proportions remain intact.',
  },
  {
    q: 'Can I change the format of my images during bulk resize?',
    a: 'Yes. You can preserve the original format or convert the entire batch into JPG, PNG, or WebP with configurable compression quality.',
  },
  {
    q: 'Is there a limit on how many images I can resize?',
    a: 'Because SizeSnap performs all processing directly inside your browser memory with zero upload delays, you can process dozens of photos smoothly on modern mobile phones, laptops, and PCs.',
  },
];

export default function BulkImageResizerPage() {
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
          <span className="text-gray-800 font-semibold">Bulk Image Resizer</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Bulk Image Resizer Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Resize dozens of JPG, PNG, and WebP images simultaneously in your browser. Scale by percentage, exact width and height with aspect ratio lock, or bounding box, then download as a single ZIP.
              </p>
            </div>

            <BulkImageResizer />

            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/resize-image-pixel"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Resize Image in Pixels →
                </Link>
                <Link
                  href="/tools/reduce-image-size-in-kb"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Reduce Image Size in KB →
                </Link>
                <Link
                  href="/tools/compress-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress Image →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Aspect Ratio Lock</span>
                  <span className="text-[11px] text-gray-500">Zero image stretching</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Batch Processing</span>
                  <span className="text-[11px] text-gray-500">Resize all files together</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">ZIP Download</span>
                  <span className="text-[11px] text-gray-500">1-click full bundle download</span>
                </div>
              </div>
            </div>

            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related Resizing Tools
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
