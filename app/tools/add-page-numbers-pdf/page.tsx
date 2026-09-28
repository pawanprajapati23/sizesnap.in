import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { AddPageNumbersTool } from '@/components/tool-ui/AddPageNumbersTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Add Page Numbers to PDF - Insert Page Numbers Online Free | SizeSnap',
  description:
    'Add page numbers to PDF documents online for free. Custom positions (bottom center, top right), page number formatting ("Page 1 of N"), starting number, and cover page skipping. 100% private.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/add-page-numbers-pdf',
  },
  openGraph: {
    title: 'Add Page Numbers to PDF - Insert Page Numbers Online Free | SizeSnap',
    description:
      'Insert clean header or footer page numbers into your PDF documents in seconds without server uploads.',
    url: 'https://sizesnap.in/tools/add-page-numbers-pdf',
  },
};

const RELATED_SLUGS = [
  'add-watermark-pdf',
  'merge-pdf',
  'split-pdf',
  'rotate-pdf',
  'compress-pdf',
  'extract-pdf-pages',
];

const FAQS = [
  {
    q: 'Can I omit page numbering from the first cover page?',
    a: 'Yes. Simply check the "Do not number the first page (Cover / Title Page)" option. SizeSnap starts numbering from page 2 while still allowing you to choose whether the numbering starts at 1 or 2.',
  },
  {
    q: 'Which page number format styles are supported?',
    a: 'You can choose between "Page 1 of 10", "1 of 10", "Page 1", "- 1 -", or a simple numeral "1".',
  },
  {
    q: 'Where can the page numbers be placed on the page?',
    a: 'You can place numbers at any of 6 positions: Bottom Center, Bottom Right, Bottom Left, Top Center, Top Right, or Top Left, with configurable margin offsets.',
  },
  {
    q: 'Does numbering a PDF damage existing content or text sharpness?',
    a: 'No. Page numbers are drawn as a new transparent vector text overlay over the existing PDF content. The existing text, vectors, and layout remain completely untouched and sharp.',
  },
];

export default function AddPageNumbersPdfPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            PDF Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Add Page Numbers</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Add Page Numbers to PDF Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Insert clean page numbers into your PDF documents. Select position, format, font size, and choose whether to skip the cover page.
              </p>
            </div>

            <AddPageNumbersTool />

            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired PDF Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/add-watermark-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Add Watermark to PDF →
                </Link>
                <Link
                  href="/tools/merge-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Merge PDF →
                </Link>
                <Link
                  href="/tools/rotate-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Rotate PDF →
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
                  <span className="font-semibold block text-gray-800">6 Placements</span>
                  <span className="text-[11px] text-gray-500">Header or footer alignment</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Cover Page Skip</span>
                  <span className="text-[11px] text-gray-500">Exclude title page from numbering</span>
                </div>
              </div>
            </div>

            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related PDF Tools
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
