import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { ImageCompressor } from '@/components/tool-ui/ImageCompressor';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ArrowLeft, HelpCircle, Shield, Zap, Lock, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress Image Online - Reduce File Size Free | SizeSnap',
  description:
    'Free online tool to compress JPG, PNG, and WebP images client-side without quality loss or uploading to any server. Fast, private, and unlimited.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image',
  },
  openGraph: {
    title: 'Compress Image Online - Reduce File Size Free | SizeSnap',
    description:
      'Compress JPG, PNG, and WebP images directly in your browser without watermarks or upload limits.',
    url: 'https://sizesnap.in/tools/compress-image',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'compress-image-to-100kb',
  'resize-image-pixel',
  'jpg-to-webp',
];

const FAQS = [
  {
    q: 'How does SizeSnap compress images?',
    a: 'SizeSnap uses your browser’s native HTML5 Canvas and WebAssembly graphics pipeline. It dynamically recalibrates image quantisation and color matrices without transferring a single byte of your photo across the internet.',
  },
  {
    q: 'Are my photos uploaded or stored on any server?',
    a: 'No. All processing happens 100% locally in your device’s memory (RAM). When you close the browser tab or hit Reset, the memory is cleared instantly.',
  },
  {
    q: 'Which image format yields the highest compression ratio?',
    a: 'WebP usually provides the best balance of ultra-small file size and pristine visual fidelity, outperforming traditional JPEG by 25–35% while supporting full transparent backgrounds.',
  },
  {
    q: 'Can I compress transparent PNG images?',
    a: 'Yes. PNG is inherently lossless. If you export as PNG, Canvas removes redundant metadata. If you select WebP, you can compress transparent images dramatically without losing transparent pixels.',
  },
  {
    q: 'Why did my file size not decrease much?',
    a: 'If your image was already heavily compressed by your camera or another utility, further compression without reducing resolution may yield diminishing returns. You can adjust the quality slider to 40–50% or convert to WebP.',
  },
];

export default function CompressImagePage() {
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

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
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
          <span className="text-gray-800 font-semibold">Compress Image</span>
        </nav>

        {/* 2-Column Layout consistent with homepage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Main Tool Content Area */}
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Compress Image Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Reduce file size for JPG, JPEG, PNG, and WebP images directly in your browser. Fast, private, and no watermarks added.
              </p>
            </div>

            {/* Interactive Image Compressor Engine */}
            <ImageCompressor />

            {/* Privacy & Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Client-Side</span>
                  <span className="text-[11px] text-gray-500">Zero files sent to cloud servers</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Instant Processing</span>
                  <span className="text-[11px] text-gray-500">Accelerated by hardware canvas</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">No Quality Loss</span>
                  <span className="text-[11px] text-gray-500">Customizable compression slider</span>
                </div>
              </div>
            </div>

            {/* Quick Links to Sister Tools */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Need specific target sizes or dimensions?
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/reduce-image-size-kb"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Reduce Image to Exact 20KB / 50KB / 100KB →
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
                  Related Compression &amp; Resizing Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* Frequently Asked Questions */}
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
