import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PdfToImagesConverter } from '@/components/tool-ui/PdfToImagesConverter';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDF to Images Converter - Extract High-Quality JPG & PNG | SizeSnap',
  description:
    'Free online PDF to image converter. Convert PDF pages to JPG or PNG with selectable DPI (72, 150, 200, 300), page range selection, and bulk ZIP download. 100% private in browser.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/pdf-to-images',
  },
  openGraph: {
    title: 'PDF to Images Converter - Extract High-Quality JPG & PNG | SizeSnap',
    description:
      'Convert multi-page PDFs to crisp JPG or PNG images directly in your browser with selectable DPI and ZIP download.',
    url: 'https://sizesnap.in/tools/pdf-to-images',
  },
};

const RELATED_SLUGS = [
  'image-to-pdf',
  'compress-pdf',
  'split-pdf',
  'compress-image',
  'reduce-image-size-in-kb',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How do I convert a multi-page PDF into separate image files?',
    a: 'Upload your PDF document by dragging it into the box or browsing your files. Choose your preferred output format (JPG or PNG) and resolution (150 or 300 DPI), then click "Convert PDF Pages". You can download individual pages or get all pages bundled in a single ZIP file.',
  },
  {
    q: 'Can I extract only specific pages instead of converting the entire document?',
    a: 'Yes. Select "Select Specific Pages / Range" and enter comma-separated numbers or page ranges such as "1-3, 5, 8-10". SizeSnap will only render and convert the pages you choose.',
  },
  {
    q: 'What resolution / DPI should I select for my images?',
    a: 'For screen viewing, sharing via WhatsApp, or email attachments, 150 DPI provides the ideal balance of fast rendering and crisp readability. For high-resolution printing or archiving official documents, choose 300 DPI.',
  },
  {
    q: 'Are my confidential PDF documents safe from third-party servers?',
    a: 'Yes, completely. SizeSnap runs the entire PDF rendering pipeline locally in your browser using WebAssembly. Not a single byte of your document is ever uploaded to or stored on any server.',
  },
  {
    q: 'How do I download all extracted images together?',
    a: 'Once the conversion is complete, click the green "Download All as ZIP" button. SizeSnap packages all converted JPG or PNG files into a clean zip archive for instant download.',
  },
];

export default function PdfToImagesPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            PDF Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">PDF to Images</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                PDF to Images Converter Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Convert multi-page PDF documents into high-resolution JPG or PNG pictures. Select custom DPI, extract specific page ranges, and download all pages as a ZIP archive.
              </p>
            </div>

            {/* Interactive PDF to Images Converter Engine */}
            <PdfToImagesConverter />

            {/* Sister Tools Shortcut Links */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Related PDF &amp; Image Processing Utilities:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/image-to-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Image to PDF Converter →
                </Link>
                <Link
                  href="/tools/compress-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress PDF →
                </Link>
                <Link
                  href="/tools/compress-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress Image (Reduce MB) →
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
                  <span className="font-semibold block text-gray-800">100% Private</span>
                  <span className="text-[11px] text-gray-500">Rendered in local browser RAM</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Custom DPI Resolution</span>
                  <span className="text-[11px] text-gray-500">72, 150, 200 &amp; 300 DPI support</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Bulk ZIP Download</span>
                  <span className="text-[11px] text-gray-500">Extract all pages in one click</span>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related PDF &amp; Document Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* Frequently Asked Questions */}
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
  );
}
