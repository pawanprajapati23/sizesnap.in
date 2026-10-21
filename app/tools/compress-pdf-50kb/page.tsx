import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { CompressPdfTool } from '@/components/tool-ui/CompressPdfTool';
import {
  Lock,
  Zap,
  Shield,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress PDF to 50KB Online Free - 50 KB PDF Converter & Resizer | SizeSnap',
  description:
    'Compress PDF to exact 50KB or under 50KB online for free without losing text clarity. Ideal for strict state police, municipal, and government recruitment portal uploads. 100% client-side private.',
  keywords: [
    'compress pdf to 50kb',
    'pdf resize 50 kb',
    'compress pdf 50kb',
    '50kb pdf',
    '50 kb pdf',
    'pdf 50 kb',
    'pdf compressor to 50kb',
    'reduce pdf to 50kb',
    'compress pdf 50 kb online free',
    'pdf to 50kb converter',
    'reduce pdf size to 50 kb',
    'pdf under 50 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-pdf-50kb',
  },
  openGraph: {
    title: 'Compress PDF to 50KB Online Free - 50 KB PDF Converter & Resizer | SizeSnap',
    description:
      'Compress PDF documents to exactly 50KB online for free. Ideal for strict government job portals and state police recruitments. 100% browser-side private.',
    url: 'https://www.sizesnap.in/tools/compress-pdf-50kb',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF to 50KB Online Free | SizeSnap',
    description:
      'Fast, free, and secure client-side PDF compressor targeting 50KB for government job applications.',
  },
};

const RELATED_SLUGS = [
  'compress-pdf',
  'compress-pdf-100kb',
  'compress-pdf-140kb',
  'compress-pdf-200kb',
  'merge-pdf',
  'image-to-pdf',
];

const PRESET_SIZES = [
  { label: '50 KB', href: '/tools/compress-pdf-50kb', active: true },
  { label: '100 KB', href: '/tools/compress-pdf-100kb', active: false },
  { label: '140 KB', href: '/tools/compress-pdf-140kb', active: false },
  { label: '200 KB', href: '/tools/compress-pdf-200kb', active: false },
  { label: '300 KB', href: '/tools/compress-pdf?target=300', active: false },
  { label: '500 KB', href: '/tools/compress-pdf-500kb', active: false },
  { label: '1 MB', href: '/tools/compress-pdf?target=1000', active: false },
];

const FAQS = [
  {
    q: 'Why do certain government portals mandate PDF files under 50KB?',
    a: 'Certain legacy state recruitment boards, police vacancy portals, and municipal application systems have extremely strict storage caps (often 50KB maximum) to support low-bandwidth servers. Meeting this strict limit requires aggressive background compression while keeping text vectors intact.',
  },
  {
    q: 'How does SizeSnap make a PDF under 50KB without making it unreadable?',
    a: 'SizeSnap isolates text and black-and-white ink from background paper texture. It converts unnecessary color channels into clean, high-contrast monochrome data and rescales embedded scans so serial numbers and marks stay readable.',
  },
  {
    q: 'Can multi-page PDFs fit under 50KB?',
    a: 'Under 50KB is best suited for 1 to 2 page documents (e.g. single marksheet or caste certificate). For 3+ pages, fitting under 50KB may degrade readability; we recommend uploading only the primary required page or checking if your portal accepts 100KB.',
  },
  {
    q: 'Is my confidential certificate uploaded to any server?',
    a: 'Never. SizeSnap operates 100% inside your web browser. Your private certificates and identity proofs never leave your phone or computer.',
  },
];

export default function CompressPdf50kbPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/compress-pdf-50kb#webapp',
        name: 'SizeSnap 50KB PDF Compressor',
        url: 'https://www.sizesnap.in/tools/compress-pdf-50kb',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Compress PDF to exact 50KB target',
          '100% client-side privacy protection',
          'Monochrome vector text preservation',
          'Zero watermark and unlimited downloads',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.sizesnap.in/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'PDF Tools',
            item: 'https://www.sizesnap.in/pdf-tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Compress PDF to 50KB',
            item: 'https://www.sizesnap.in/tools/compress-pdf-50kb',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
      {
        '@type': 'HowTo',
        name: 'How to Compress PDF to 50KB Online Free',
        description:
          'Step-by-step instructions to compress your scanned certificate or marksheet PDF to under 50KB for strict state portals.',
        totalTime: 'PT10S',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload Scanned PDF',
            text: 'Select or drag & drop your marksheet or certificate PDF into the box.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Verify 50KB Target Size',
            text: 'SizeSnap is pre-configured with a 50KB target slider for strict portal compliance.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Click Compress PDF',
            text: 'Click Compress PDF. The compression runs entirely on-device without server uploads.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Download 50KB File',
            text: 'Download your optimized PDF immediately with clear text, ready for submission.',
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans selection:bg-[#414FA8]/20">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6 sm:space-y-8">
            {/* Header Hero */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#414FA8]/10 via-[#414FA8]/5 to-transparent rounded-bl-full -z-10 pointer-events-none" />

              {/* Breadcrumb */}
              <div className="mb-4 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <Link href="/" className="hover:text-[#414FA8] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/pdf-tools" className="hover:text-[#414FA8] transition-colors">PDF Tools</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Compress PDF to 50KB</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> Ultra-Low Size Preset (State Police &amp; Recruitment)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Compress PDF to 50KB Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Resize and compress your PDF documents to <strong>under 50KB</strong> with clear textual legibility. Specifically engineered for state police vacancies, municipal recruitment portals, and strict government application forms.
              </p>

              {/* Target Size Navigator */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Quick Target Sizes:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {PRESET_SIZES.map((preset) => (
                    <Link
                      key={preset.label}
                      href={preset.href}
                      className={`text-xs px-3 py-1.5 rounded-[4px] font-medium transition-all ${
                        preset.active
                          ? 'bg-[#414FA8] text-white shadow-xs font-semibold'
                          : 'bg-gray-100 hover:bg-[#EEF1FB] text-gray-700 hover:text-[#414FA8] border border-gray-200'
                      }`}
                    >
                      {preset.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Tool Area */}
            <div id="tool-area" className="scroll-mt-24">
              <CompressPdfTool initialTargetKB={50} />
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Local &amp; Private</span>
                  <span className="text-[11px] text-gray-500">Processed in browser, never uploaded</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Strict 50KB Target</span>
                  <span className="text-[11px] text-gray-500">Guaranteed portal acceptance</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Text Legibility Guarantee</span>
                  <span className="text-[11px] text-gray-500">High-contrast text preservation</span>
                </div>
              </div>
            </div>

            {/* Companion Tools */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#414FA8]" />
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Companion PDF Tools
                  </h2>
                </div>
                <Link
                  href="/pdf-tools"
                  className="text-xs font-semibold text-[#414FA8] hover:underline inline-flex items-center gap-1"
                >
                  All PDF Tools <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/tools/compress-pdf-100kb"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Compress PDF to 100KB
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Target under 100KB for scholarship applications.
                  </span>
                </Link>

                <Link
                  href="/tools/compress-pdf-140kb"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Compress PDF to 140KB
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Target under 140KB for state police &amp; PSC forms.
                  </span>
                </Link>

                <Link
                  href="/tools/compress-pdf-200kb"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Compress PDF to 200KB
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Ideal target for SSC and GATE applications.
                  </span>
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {FAQS.map((faq, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5 flex items-start gap-2">
                      <span className="text-[#414FA8] font-bold">Q.</span>
                      {faq.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
