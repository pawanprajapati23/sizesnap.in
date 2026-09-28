import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { FaviconGeneratorTool } from '@/components/tool-ui/FaviconGeneratorTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Favicon Generator - Generate ICO, PNG & Apple Touch Icons Free | SizeSnap',
  description:
    'Generate cross-browser favicon.ico (16x16, 32x32, 48x48), Apple Touch Icon (180x180), Android Chrome icons (192, 512), and site.webmanifest online for free. Download complete favicon package ZIP. 100% private.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/favicon-generator',
  },
  openGraph: {
    title: 'Favicon Generator - Generate ICO, PNG & Apple Touch Icons Free | SizeSnap',
    description:
      'Generate cross-browser favicon.ico, Apple Touch Icons, and web app manifest packages in seconds.',
    url: 'https://sizesnap.in/tools/favicon-generator',
  },
};

const RELATED_SLUGS = [
  'image-to-base64',
  'image-color-picker',
  'crop-image',
  'resize-image-pixel',
  'jpg-to-png',
  'png-to-jpg',
];

const FAQS = [
  {
    q: 'What files are included in the generated favicon package?',
    a: 'The package contains multi-resolution favicon.ico (containing 16x16, 32x32, and 48x48 icons inside a single Windows ICO binary container), high-resolution PNGs (16x16, 32x32, 48x48), apple-touch-icon.png (180x180), android-chrome-192x192.png, android-chrome-512x512.png, and a valid site.webmanifest file.',
  },
  {
    q: 'How do I install the generated favicons on my website?',
    a: 'Extract the downloaded ZIP package into your website public root directory (e.g. /public in Next.js, or your web root). Then copy the generated HTML snippet and paste it into your HTML <head> section.',
  },
  {
    q: 'What image format should I upload for the best favicon result?',
    a: 'A square PNG or SVG with a transparent background of at least 512x512 pixels produces the sharpest, highest-quality icons across all display sizes.',
  },
  {
    q: 'Are my brand logos uploaded to any server?',
    a: 'No. All image scaling and ICO binary container construction happens locally within your browser using JavaScript and Canvas. Your brand assets never leave your computer.',
  },
];

export default function FaviconGeneratorPage() {
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
          <span className="text-gray-800 font-semibold">Favicon Generator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Favicon Generator Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Generate production-ready cross-browser favicons in all required formats. Download multi-size favicon.ico, Apple Touch Icons, PWA icons, and copy HTML tags.
              </p>
            </div>

            <FaviconGeneratorTool />

            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/image-color-picker"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Image Color Picker →
                </Link>
                <Link
                  href="/tools/crop-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Crop Image →
                </Link>
                <Link
                  href="/tools/image-to-base64"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Image to Base64 →
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
                  <span className="font-semibold block text-gray-800">Full Suite</span>
                  <span className="text-[11px] text-gray-500">ICO, Apple Touch, PWA Manifest</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">ZIP Export</span>
                  <span className="text-[11px] text-gray-500">1-click complete package</span>
                </div>
              </div>
            </div>

            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related Web Tools
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
