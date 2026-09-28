import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { ImageToBase64Converter } from '@/components/tool-ui/ImageToBase64Converter';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image to Base64 - Convert Images to Base64 String Online Free | SizeSnap',
  description:
    'Convert JPG, PNG, WebP, SVG, and GIF images to Base64 online for free. Instant Data URI, Raw Base64 string, HTML <img> tag, and CSS background snippets. 100% private in browser.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/image-to-base64',
  },
  openGraph: {
    title: 'Image to Base64 - Convert Images to Base64 String Online Free | SizeSnap',
    description:
      'Convert photos into Base64 Data URIs, HTML image tags, and CSS snippets safely in your browser.',
    url: 'https://sizesnap.in/tools/image-to-base64',
  },
};

const RELATED_SLUGS = [
  'base64-to-image',
  'image-color-picker',
  'image-metadata-viewer',
  'jpg-to-png',
  'compress-image',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'What is Base64 image encoding?',
    a: 'Base64 image encoding converts binary image files into ASCII text characters. This allows images to be embedded directly inline inside HTML files, CSS stylesheets, JSON payloads, or email templates without requiring separate HTTP file requests.',
  },
  {
    q: 'Does Base64 encoding increase file size?',
    a: 'Yes. Base64 encoding typically increases binary file size by approximately 33% due to representing 3 bytes of binary data using 4 ASCII characters. It is best used for small icons, logos, and critical inline UI graphics.',
  },
  {
    q: 'What formats can I export with this tool?',
    a: 'You can export Data URIs (data:image/png;base64,...), Raw Base64 strings, complete HTML <img> tags, and CSS background-image: url(...) declarations with 1-click clipboard copy.',
  },
  {
    q: 'Are my confidential graphics or photos sent to an external server?',
    a: 'No. The entire encoding process occurs locally inside your web browser using the HTML5 FileReader API. Your images never leave your machine.',
  },
];

export default function ImageToBase64Page() {
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
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Image to Base64</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Image to Base64 Converter Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Convert JPG, PNG, WebP, SVG, and GIF images to Base64 strings. Get ready-to-use Data URIs, HTML tags, and CSS background snippets with 1-click clipboard copy.
              </p>
            </div>

            <ImageToBase64Converter />

            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/base64-to-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Base64 to Image →
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
                  <span className="font-semibold block text-gray-800">4 Code Formats</span>
                  <span className="text-[11px] text-gray-500">Data URI, Raw, HTML, CSS</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">1-Click Copy</span>
                  <span className="text-[11px] text-gray-500">Instant clipboard copy &amp; download</span>
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
