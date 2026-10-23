import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { CompressPdfTool } from '@/components/tool-ui/CompressPdfTool';
import { ALL_TOOLS } from '@/data/tools';
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
  title: 'Compress PDF to 200KB Online Free - 200 KB PDF Resizer & Converter | SizeSnap',
  description:
    'Compress PDF to exact 200KB or under 200KB online for free without losing text clarity. Ideal for SSC marksheets, GATE, State PSC, and competitive exam document uploads. 100% client-side private.',
  keywords: [
    'compress pdf to 200kb',
    'pdf resize 200 kb',
    'compress pdf 200kb',
    '200kb pdf',
    '200 kb pdf',
    'pdf 200 kb',
    'pdf compressor to 200kb',
    'reduce pdf to 200kb',
    'compress pdf 200 kb online free',
    'pdf to 200kb converter',
    'reduce pdf size to 200 kb',
    'pdf under 200 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-pdf-200kb',
  },
  openGraph: {
    title: 'Compress PDF to 200KB Online Free - 200 KB PDF Resizer & Converter | SizeSnap',
    description:
      'Compress PDF documents to exactly 200KB online for free. Ideal for Indian competitive exams (SSC, GATE, UPSC, State PSC). 100% browser-side private.',
    url: 'https://www.sizesnap.in/tools/compress-pdf-200kb',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF to 200KB Online Free | SizeSnap',
    description:
      'Fast, free, and secure client-side PDF compressor targeting 200KB for government job applications.',
  },
};

const RELATED_SLUGS = [
  'compress-pdf',
  'compress-pdf-140kb',
  'merge-pdf',
  'image-to-pdf',
  'pdf-to-images',
  'split-pdf',
];

const PRESET_SIZES = [
  { label: '50 KB', href: '/tools/compress-pdf-50kb', active: false },
  { label: '100 KB', href: '/tools/compress-pdf-100kb', active: false },
  { label: '140 KB', href: '/tools/compress-pdf-140kb', active: false },
  { label: '200 KB', href: '/tools/compress-pdf-200kb', active: true },
  { label: '300 KB', href: '/tools/compress-pdf?target=300', active: false },
  { label: '500 KB', href: '/tools/compress-pdf-500kb', active: false },
  { label: '1 MB', href: '/tools/compress-pdf?target=1000', active: false },
];

const FAQS = [
  {
    q: 'Why do SSC and recruitment portals mandate PDF files under 200KB?',
    a: 'Portals such as SSC (Staff Selection Commission), GATE, IBPS, and state recruitment boards require educational marksheets, caste certificates, and experience documents to be strictly between 100KB and 200KB. This standard keeps server databases responsive, speeds up admit card generation, and eliminates timeout errors during peak deadline hours.',
  },
  {
    q: 'Will my roll number and marks remain legible after compressing to 200KB?',
    a: 'Yes, absolutely. SizeSnap utilizes an intelligent vector-preservation compression engine. It downsamples background noise and unneeded metadata while preserving font vectors and ink contrast. Your certificate seals, signatures, marks, and serial numbers remain crisp and 100% legible for official document verification (DV).',
  },
  {
    q: 'Can I compress multi-page PDF documents to under 200KB?',
    a: 'Yes. SizeSnap dynamically distributes compression across all pages to meet the 200KB target. If your document has more than 5 heavy scanned pages, we recommend using our Merge PDF tool to select mandatory pages or compressing individual semester marksheets.',
  },
  {
    q: 'Is my Aadhaar card or educational marksheet uploaded to any server?',
    a: 'Never. SizeSnap runs 100% inside your web browser using HTML5 Canvas and WebAssembly. Your confidential identity proofs, marksheets, and legal documents never leave your phone or computer. There is zero risk of data exposure.',
  },
  {
    q: 'What should I do if my PDF is over 10MB and does not reach 200KB in one go?',
    a: 'If your file was scanned at 600 DPI (producing a 10MB+ file), simply run the output through the compressor once more, or use our "Image to PDF" tool to convert your scans at 150–200 DPI. 200 DPI is the official recommendation of UPSC and SSC for document scans.',
  },
];

export default function CompressPdf200kbPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/compress-pdf-200kb#webapp',
        name: 'SizeSnap 200KB PDF Compressor',
        url: 'https://www.sizesnap.in/tools/compress-pdf-200kb',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Compress PDF to exact 200KB target',
          '100% client-side privacy protection',
          'Preserve marksheet text and seal clarity',
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
            name: 'Compress PDF to 200KB',
            item: 'https://www.sizesnap.in/tools/compress-pdf-200kb',
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
        name: 'How to Compress PDF to 200KB Online Free',
        description:
          'Step-by-step instructions to compress your scanned certificate or marksheet PDF to under 200KB for government job portals.',
        totalTime: 'PT10S',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload Scanned PDF',
            text: 'Select or drag & drop your marksheet, certificate, or document PDF into the upload area.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Verify 200KB Target Size',
            text: 'SizeSnap is pre-configured with a 200KB target limit to comply with SSC and competitive exam portals.',
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
            name: 'Download 200KB File',
            text: 'Download your optimized PDF immediately with clear text, ready for online application upload.',
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
                <span className="text-gray-900 font-medium">Compress PDF to 200KB</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> High Demand Portal Preset (SSC, GATE, PSC)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Compress PDF to 200KB Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Resize and compress your PDF certificates and marksheets to <strong>under 200KB</strong> without losing sharpness. Specifically optimized for SSC, GATE, State PSC, and university online document verification.
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
              <CompressPdfTool initialTargetKB={200} />
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
                  <span className="font-semibold block text-gray-800">Exact 200KB Target</span>
                  <span className="text-[11px] text-gray-500">Guaranteed portal compliance</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Legible Text Guarantee</span>
                  <span className="text-[11px] text-gray-500">Roll numbers &amp; marks stay crisp</span>
                </div>
              </div>
            </div>

            {/* Specification Guide */}
            <article className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Why Indian Exam Portals Require PDFs Under 200KB
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  Major recruitment portals such as SSC (CGL, CHSL, MTS, GD), GATE, State PSCs (UPPSC, BPSC, RPSC, MPPSC), and Banking exams process millions of candidates simultaneously. Strict limits like <strong>100KB to 200KB</strong> ensure fast server uploads and prevent portal crashes on deadline day.
                </p>
              </div>

              {/* Specification Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-[4px]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F2F4FC] text-gray-800 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Recruitment Exam / Board</th>
                      <th className="p-3">Document Type</th>
                      <th className="p-3">Required Format</th>
                      <th className="p-3">Prescribed Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">SSC (CGL, CHSL, GD, MTS)</td>
                      <td className="p-3">10th Marksheet, Certificate &amp; Domicile</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-[#414FA8]">100 KB – 200 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">GATE / IIT Admissions</td>
                      <td className="p-3">Degree Certificate &amp; Category Proof</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-[#414FA8]">Max 200 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">State PSCs (BPSC, UPPSC, RPSC)</td>
                      <td className="p-3">Graduation Marksheets &amp; Caste Proof</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-emerald-700">Under 200 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">IBPS / SBI Banking Portals</td>
                      <td className="p-3">Educational Certificates &amp; ID Proof</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-[#414FA8]">100 KB – 200 KB</td>
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
                    How to Compress PDF to 100KB – 200KB for Government Portals
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
                    Target under 140KB for strict state police and PSC portals.
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

                <Link
                  href="/tools/image-to-pdf"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Image to PDF Converter
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Convert JPG or PNG certificate scans to PDF at 200 DPI.
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
