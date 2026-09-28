import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { SplitPdfTool } from '@/components/tool-ui/SplitPdfTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Split PDF - Separate PDF Pages Online Free | SizeSnap',
  description:
    'Split PDF documents online into individual pages or custom page ranges (e.g. 1-3, 5). Extract specific pages, save each page as a separate PDF, and download as a single ZIP archive. 100% private.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/split-pdf',
  },
  openGraph: {
    title: 'Split PDF - Separate PDF Pages Online Free | SizeSnap',
    description:
      'Extract page ranges or separate all PDF pages into individual documents safely in your browser.',
    url: 'https://sizesnap.in/tools/split-pdf',
  },
};

const RELATED_SLUGS = [
  'merge-pdf',
  'compress-pdf',
  'pdf-to-images',
  'image-to-pdf',
  'reduce-image-size-in-kb',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I extract specific pages from a PDF?',
    a: 'Upload your PDF document, select the "By Range" tab, and enter the desired pages (for example "1-3, 5"). SizeSnap extracts only those pages into a new compact PDF document.',
  },
  {
    q: 'Can I split every page into a separate PDF file?',
    a: 'Yes. Switch to "All Pages to ZIP" mode. SizeSnap will extract every single page into an individual file (e.g. page-1.pdf, page-2.pdf) and package them neatly inside a single downloadable ZIP file.',
  },
  {
    q: 'Will the extracted pages lose formatting or text clarity?',
    a: 'No. SizeSnap extracts PDF page objects directly at the vector and font stream level. Fonts, hyperlinks, text sharpness, and vectors remain 100% lossless.',
  },
  {
    q: 'Are my confidential documents uploaded to a remote server?',
    a: 'No. All splitting and extraction operations run client-side in your web browser. Your confidential agreements, statements, and IDs never leave your computer or phone.',
  },
];

export default function SplitPdfPage() {
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
          <span className="text-gray-800 font-semibold">Split PDF</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Split PDF Pages Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Extract custom page ranges or split each page into a separate document. Use the visual selector or enter ranges, and download your extracted PDF or ZIP archive immediately.
              </p>
            </div>

            <SplitPdfTool />

            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired PDF Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/merge-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Merge PDF →
                </Link>
                <Link
                  href="/tools/compress-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress PDF →
                </Link>
                <Link
                  href="/tools/pdf-to-images"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  PDF to Images →
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
                  <span className="font-semibold block text-gray-800">Lossless Extraction</span>
                  <span className="text-[11px] text-gray-500">Zero reduction in vector quality</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Range &amp; Visual</span>
                  <span className="text-[11px] text-gray-500">Fast interactive selection</span>
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
