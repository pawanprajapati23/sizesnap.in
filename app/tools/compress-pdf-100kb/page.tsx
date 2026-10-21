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
  title: 'Compress PDF to 100KB Online Free - 100 KB PDF Converter & Resizer | SizeSnap',
  description:
    'Compress PDF to exact 100KB or under 100KB online for free without losing text clarity. Ideal for National Scholarship Portal (NSP), college admissions, court portals, and job applications. 100% private in browser.',
  keywords: [
    'compress pdf to 100kb',
    'pdf resize 100 kb',
    'compress pdf 100kb',
    '100kb pdf',
    '100 kb pdf',
    'pdf 100 kb',
    'pdf compressor to 100kb',
    'reduce pdf to 100kb',
    'compress pdf 100 kb online free',
    'pdf to 100kb converter',
    'reduce pdf size to 100 kb',
    'pdf under 100 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-pdf-100kb',
  },
  openGraph: {
    title: 'Compress PDF to 100KB Online Free - 100 KB PDF Converter & Resizer | SizeSnap',
    description:
      'Compress PDF documents to exactly 100KB online for free. Ideal for National Scholarship Portal (NSP), college forms, and govt job portals. 100% browser-side private.',
    url: 'https://www.sizesnap.in/tools/compress-pdf-100kb',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF to 100KB Online Free | SizeSnap',
    description:
      'Fast, free, and secure client-side PDF compressor targeting 100KB for scholarship and government portals.',
  },
};

const RELATED_SLUGS = [
  'compress-pdf',
  'compress-pdf-140kb',
  'compress-pdf-200kb',
  'merge-pdf',
  'image-to-pdf',
  'pdf-to-images',
];

const PRESET_SIZES = [
  { label: '50 KB', href: '/tools/compress-pdf?target=50', active: false },
  { label: '100 KB', href: '/tools/compress-pdf-100kb', active: true },
  { label: '140 KB', href: '/tools/compress-pdf-140kb', active: false },
  { label: '200 KB', href: '/tools/compress-pdf-200kb', active: false },
  { label: '300 KB', href: '/tools/compress-pdf?target=300', active: false },
  { label: '500 KB', href: '/tools/compress-pdf-500kb', active: false },
  { label: '1 MB', href: '/tools/compress-pdf?target=1000', active: false },
];

const FAQS = [
  {
    q: 'Why do scholarship portals and colleges require PDFs under 100KB?',
    a: 'Portals like the National Scholarship Portal (NSP), state welfare departments, university admissions, and e-court systems mandate strict file sizes below 100KB. This ensures fast document previews for evaluating officers, prevents upload timeouts, and keeps portal database storage efficient.',
  },
  {
    q: 'Will my marksheet grades and signatures stay readable under 100KB?',
    a: 'Yes! SizeSnap uses intelligent client-side canvas vectorization. It compresses high-frequency color backgrounds while sharpening dark ink text and university seals, ensuring full legibility during official document verification (DV).',
  },
  {
    q: 'Can I compress multi-page PDF documents to 100KB?',
    a: 'Yes. SizeSnap dynamically distributes compression across pages to stay below 100KB. If your document has more than 3 pages of high-resolution color scans, we recommend converting color scans to grayscale or compressing each page individually.',
  },
  {
    q: 'Is my Aadhaar card or income certificate uploaded to any server?',
    a: 'Never. SizeSnap processes documents 100% locally inside your web browser. Your confidential Aadhaar numbers, bank account statements, and educational certificates never leave your phone or computer.',
  },
  {
    q: 'What should I do if a 5MB scanned certificate will not reach 100KB?',
    a: 'If your scan is exceptionally large (e.g., 5MB–10MB at 600 DPI), run the output through the compressor once more, or use our "Image to PDF" tool to convert your certificate at 150 DPI Grayscale. 150 DPI is the official sweet spot for 100KB certificate uploads.',
  },
];

export default function CompressPdf100kbPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/compress-pdf-100kb#webapp',
        name: 'SizeSnap 100KB PDF Compressor',
        url: 'https://www.sizesnap.in/tools/compress-pdf-100kb',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Compress PDF to exact 100KB target',
          '100% client-side privacy protection',
          'Preserve certificate text clarity',
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
            name: 'Compress PDF to 100KB',
            item: 'https://www.sizesnap.in/tools/compress-pdf-100kb',
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
        name: 'How to Compress PDF to 100KB Online Free',
        description:
          'Step-by-step instructions to compress your scanned certificate or marksheet PDF to under 100KB for scholarship and college portals.',
        totalTime: 'PT10S',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload Scanned PDF',
            text: 'Select or drag & drop your marksheet, certificate, or document PDF into the upload box.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Verify 100KB Target Size',
            text: 'SizeSnap is pre-configured with a 100KB target slider for instant portal compliance.',
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
            name: 'Download 100KB File',
            text: 'Download your optimized PDF immediately with clear marks, ready for upload.',
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
                <span className="text-gray-900 font-medium">Compress PDF to 100KB</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> High Demand Portal Preset (NSP, College, Forms)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Compress PDF to 100KB Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Resize and shrink your PDF documents to <strong>under 100KB</strong> without blurring certificate text. Specially calibrated for the National Scholarship Portal (NSP), university admissions, and online job verification.
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
              <CompressPdfTool initialTargetKB={100} />
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
                  <span className="font-semibold block text-gray-800">Exact 100KB Target</span>
                  <span className="text-[11px] text-gray-500">Passes strict under-100KB portals</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Sharp Text Guarantee</span>
                  <span className="text-[11px] text-gray-500">Names &amp; marks stay clear</span>
                </div>
              </div>
            </div>

            {/* Specification Guide */}
            <article className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Official 100KB PDF Requirements Across Portals
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  Many online forms enforce a strict <strong>100KB limit</strong> for single-page documents. Here are the most common platforms requiring PDFs under 100KB:
                </p>
              </div>

              {/* Specification Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-[4px]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F2F4FC] text-gray-800 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Portal / Application</th>
                      <th className="p-3">Document Type</th>
                      <th className="p-3">Prescribed File Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">National Scholarship Portal (NSP)</td>
                      <td className="p-3">Income Certificate &amp; Fee Receipts</td>
                      <td className="p-3 font-semibold text-[#414FA8]">Max 100 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">State University Admissions</td>
                      <td className="p-3">Transfer &amp; Migration Certificates</td>
                      <td className="p-3 font-semibold text-emerald-700">Under 100 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">High Court &amp; District Court e-Filing</td>
                      <td className="p-3">Affidavits &amp; Identity Proofs</td>
                      <td className="p-3 font-semibold text-[#414FA8]">Below 100 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">Bar Council / Nursing Council Portals</td>
                      <td className="p-3">Enrollment &amp; Registration Certificates</td>
                      <td className="p-3 font-semibold text-[#414FA8]">Strictly 50 KB – 100 KB</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Related Guides Banner */}
              <div className="bg-[#EEF1FB] p-4 sm:p-5 rounded-[4px] border border-[#414FA8]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#414FA8] uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" /> Full Examination Guide
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">
                    How to Compress PDF to 100KB – 140KB for Government Portals
                  </h4>
                  <p className="text-xs text-gray-600">
                    Read our complete walkthrough on passing official document verification on SSC, UPSC, and state recruitment portals.
                  </p>
                </div>
                <Link
                  href="/blog/how-to-compress-pdf-to-100kb-140kb-for-govt-portals"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-[#414FA8] text-white text-xs font-semibold rounded-[4px] hover:bg-[#343F89] transition-colors shadow-xs"
                >
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
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
                  href="/tools/compress-pdf-140kb"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Compress PDF to 140KB
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Ideal target for state police and recruitment portals.
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
                    Ideal for SSC CGL, CHSL, and GATE applications.
                  </span>
                </Link>

                <Link
                  href="/tools/merge-pdf"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Merge Marksheet &amp; Aadhaar
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Combine multiple certificate pages into a single neat PDF file.
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
