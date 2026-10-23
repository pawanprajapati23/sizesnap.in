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
  title: 'Compress PDF to 500KB Online Free - 500 KB PDF Converter & Resizer | SizeSnap',
  description:
    'Compress PDF to exact 500KB or under 500KB online for free without losing document quality. Ideal for multi-page transcripts, project reports, and EPFO portal uploads. 100% client-side private.',
  keywords: [
    'compress pdf to 500kb',
    'pdf resize 500 kb',
    'compress pdf 500kb',
    '500kb pdf',
    '500 kb pdf',
    'pdf 500 kb',
    'pdf compressor to 500kb',
    'reduce pdf to 500kb',
    'compress pdf 500 kb online free',
    'pdf to 500kb converter',
    'reduce pdf size to 500 kb',
    'pdf under 500 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-pdf-500kb',
  },
  openGraph: {
    title: 'Compress PDF to 500KB Online Free - 500 KB PDF Converter & Resizer | SizeSnap',
    description:
      'Compress PDF documents to exactly 500KB online for free. Ideal for multi-page transcripts, official certificates, and EPFO uploads. 100% browser-side private.',
    url: 'https://www.sizesnap.in/tools/compress-pdf-500kb',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF to 500KB Online Free | SizeSnap',
    description:
      'Fast, free, and secure client-side PDF compressor targeting 500KB for government and corporate submissions.',
  },
};

const RELATED_SLUGS = [
  'compress-pdf',
  'compress-pdf-200kb',
  'compress-pdf-140kb',
  'merge-pdf',
  'image-to-pdf',
  'pdf-to-images',
];

const PRESET_SIZES = [
  { label: '50 KB', href: '/tools/compress-pdf-50kb', active: false },
  { label: '100 KB', href: '/tools/compress-pdf-100kb', active: false },
  { label: '140 KB', href: '/tools/compress-pdf-140kb', active: false },
  { label: '200 KB', href: '/tools/compress-pdf-200kb', active: false },
  { label: '300 KB', href: '/tools/compress-pdf?target=300', active: false },
  { label: '500 KB', href: '/tools/compress-pdf-500kb', active: true },
  { label: '1 MB', href: '/tools/compress-pdf?target=1000', active: false },
];

const FAQS = [
  {
    q: 'When do I need to compress a PDF to 500KB?',
    a: 'A 500KB ceiling is the standard upload limit for multi-page document submissions, such as combined semester grade sheets, EPFO claims, passport police clearance certificates (PCC), property papers, and company tender filings. It strikes the perfect balance between high graphical resolution and fast web upload.',
  },
  {
    q: 'Can I compress 5 to 10 page scanned documents to under 500KB?',
    a: 'Yes! SizeSnap is designed to handle multi-page PDFs. It balances downsampling across all pages so that tables, charts, stamps, and small fonts remain sharp while compressing the overall document below 500KB.',
  },
  {
    q: 'Will color graphs and signatures look faded at 500KB?',
    a: 'No. At 500KB, SizeSnap can preserve rich color reproduction and high-contrast text. Our smart compression retains vector curves and downsamples only redundant background data.',
  },
  {
    q: 'Is my confidential financial or academic PDF uploaded to any server?',
    a: 'Never. SizeSnap processes documents 100% locally inside your web browser. Your private salary slips, bank statements, and degree transcripts never touch an external server.',
  },
  {
    q: 'What should I do if my PDF starts at 50MB and cannot reach 500KB?',
    a: 'For massive 50MB+ scans, run the output through the tool a second time, or use our "PDF to Images" and "Image to PDF" workflow at 150 DPI to instantly strip out heavy raster bloat.',
  },
];

export default function CompressPdf500kbPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/compress-pdf-500kb#webapp',
        name: 'SizeSnap 500KB PDF Compressor',
        url: 'https://www.sizesnap.in/tools/compress-pdf-500kb',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Compress multi-page PDF to exact 500KB target',
          '100% client-side privacy protection',
          'Preserve chart, table, and stamp clarity',
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
            name: 'Compress PDF to 500KB',
            item: 'https://www.sizesnap.in/tools/compress-pdf-500kb',
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
        name: 'How to Compress PDF to 500KB Online Free',
        description:
          'Step-by-step instructions to compress your multi-page transcript or document PDF to under 500KB.',
        totalTime: 'PT10S',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload PDF Document',
            text: 'Select or drag & drop your multi-page marksheet, transcript, or legal PDF into the box.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Verify 500KB Target Size',
            text: 'SizeSnap is pre-configured with a 500KB target slider for instant compliance.',
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
            name: 'Download 500KB File',
            text: 'Download your optimized PDF immediately with clear charts and readable text.',
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
                <span className="text-gray-900 font-medium">Compress PDF to 500KB</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> Multi-Page Document Preset (Transcripts &amp; EPFO)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Compress PDF to 500KB Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Resize and compress multi-page PDF files to <strong>under 500KB</strong> with sharp visual clarity. Specially optimized for academic transcripts, official certificates, EPFO claims, and tender submissions.
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
              <CompressPdfTool initialTargetKB={500} />
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
                  <span className="font-semibold block text-gray-800">Exact 500KB Target</span>
                  <span className="text-[11px] text-gray-500">Meets official multi-page limits</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Crisp Multi-Page Output</span>
                  <span className="text-[11px] text-gray-500">Charts &amp; tables stay readable</span>
                </div>
              </div>
            </div>

            {/* Specification Guide */}
            <article className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Common Portals Requiring PDFs Under 500KB
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  When uploading complex multi-page files or detailed color certificates, 500KB is the industry standard limit:
                </p>
              </div>

              {/* Specification Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-[4px]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F2F4FC] text-gray-800 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Portal / Organization</th>
                      <th className="p-3">Document Type</th>
                      <th className="p-3">Required File Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">EPFO (UAN Member Portal)</td>
                      <td className="p-3">Joint Declaration, Form 19/10C, Cheque Copy</td>
                      <td className="p-3 font-semibold text-[#414FA8]">Max 500 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">Passport Seva (Police Verification)</td>
                      <td className="p-3">Address Proof, Rent Agreement, Utility Bills</td>
                      <td className="p-3 font-semibold text-emerald-700">Below 500 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">Foreign University Admissions</td>
                      <td className="p-3">Consolidated Semester Transcripts</td>
                      <td className="p-3 font-semibold text-[#414FA8]">Under 500 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">Govt e-Tendering (GeM / State Portals)</td>
                      <td className="p-3">Financial Audit &amp; Technical Compliance</td>
                      <td className="p-3 font-semibold text-[#414FA8]">Max 500 KB per doc</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

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
                  href="/tools/compress-pdf-200kb"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Compress PDF to 200KB
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Ideal target for SSC, GATE, and banking portals.
                  </span>
                </Link>

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
                  href="/tools/merge-pdf"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Merge Multiple PDFs
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Combine semester marksheets into a single file.
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
