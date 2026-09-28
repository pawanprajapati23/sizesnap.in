import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { RotatePdfTool } from '@/components/tool-ui/RotatePdfTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rotate PDF - Rotate PDF Pages Permanently Online Free | SizeSnap',
  description:
    'Rotate PDF documents or individual pages online for free. Rotate 90°, 180°, or 270° clockwise or counter-clockwise. Permanently fix orientation in your browser. 100% private.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/rotate-pdf',
  },
  openGraph: {
    title: 'Rotate PDF - Rotate PDF Pages Permanently Online Free | SizeSnap',
    description:
      'Rotate specific pages or entire PDF files by 90 or 180 degrees permanently without uploading files to a server.',
    url: 'https://sizesnap.in/tools/rotate-pdf',
  },
};

const RELATED_SLUGS = [
  'delete-pdf-pages',
  'extract-pdf-pages',
  'merge-pdf',
  'split-pdf',
  'compress-pdf',
  'add-page-numbers-pdf',
];

const FAQS = [
  {
    q: 'Can I rotate only specific pages in a PDF instead of the whole file?',
    a: 'Yes. SizeSnap displays a visual card for every page in your PDF. You can rotate individual pages 90 degrees clockwise or counter-clockwise, or select a group of pages to rotate together.',
  },
  {
    q: 'Does rotating a PDF reduce text clarity or document quality?',
    a: 'No. SizeSnap modifies the rotation metadata of each PDF page vector stream directly using pdf-lib. No rasterization occurs, ensuring your vector fonts and images remain 100% crisp.',
  },
  {
    q: 'Is the page rotation saved permanently?',
    a: 'Yes. When you download the resulting PDF, the orientation metadata is embedded permanently so that it opens with the correct orientation in any viewer (Adobe Acrobat, Chrome, Preview, etc.).',
  },
  {
    q: 'Are my uploaded documents sent to an external server?',
    a: 'Never. All PDF processing takes place entirely inside your web browser. No documents are uploaded or stored externally.',
  },
];

export default function RotatePdfPage() {
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
          <span className="text-gray-800 font-semibold">Rotate PDF</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Rotate PDF Pages Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Permanently rotate PDF pages by 90°, 180°, or 270°. Select individual pages or rotate all pages at once with instant visual preview and download.
              </p>
            </div>

            <RotatePdfTool />

            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired PDF Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/delete-pdf-pages"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Delete PDF Pages →
                </Link>
                <Link
                  href="/tools/extract-pdf-pages"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Extract PDF Pages →
                </Link>
                <Link
                  href="/tools/merge-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Merge PDF →
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
                  <span className="text-[11px] text-gray-500">Local in-browser rotation</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Individual or Bulk</span>
                  <span className="text-[11px] text-gray-500">Rotate single or all pages</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Lossless Vector</span>
                  <span className="text-[11px] text-gray-500">Preserves fonts &amp; sharp quality</span>
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
