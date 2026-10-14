import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { CompressPdfTool } from '@/components/tool-ui/CompressPdfTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  HelpCircle,
  Lock,
  Zap,
  Shield,
  FileText,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress PDF to 140KB Online Free - Exact Size for Govt Exams | SizeSnap',
  description:
    'Compress PDF to 140KB online for free without quality loss. Perfect for SSC, UPSC, State PSC, Police recruitment, Aadhaar & marksheet uploads. 100% private, client-side, instant download.',
  keywords: [
    'compress pdf to 140kb',
    'reduce pdf to 140kb',
    'compress pdf under 150kb',
    'ssc pdf 140kb resizer',
    'upsc marksheet pdf 140kb',
    'compress pdf 140kb online free',
    'reduce pdf size to 140 kb',
    'aadhaar card pdf compress 140kb',
    'state psc certificate pdf 140kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-pdf-140kb',
  },
  openGraph: {
    title: 'Compress PDF to 140KB Online Free - Exact Size for Govt Exams | SizeSnap',
    description:
      'Compress PDF documents to exactly 140KB online for free. Ideal for Indian competitive exams (SSC, UPSC, Police, IBPS). 100% browser-side private.',
    url: 'https://www.sizesnap.in/tools/compress-pdf-140kb',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF to 140KB Online Free | SizeSnap',
    description:
      'Fast, free, and secure client-side PDF compressor targeting 140KB for government job applications.',
  },
};

const RELATED_SLUGS = [
  'compress-pdf',
  'merge-pdf',
  'image-to-pdf',
  'pdf-to-images',
  'split-pdf',
  'add-page-numbers-pdf',
];

const PRESET_SIZES = [
  { label: '10 KB', href: '/tools/compress-pdf?target=10', active: false },
  { label: '12 KB', href: '/tools/compress-pdf-12kb', active: false },
  { label: '50 KB', href: '/tools/compress-pdf?target=50', active: false },
  { label: '100 KB', href: '/tools/compress-pdf?target=100', active: false },
  { label: '140 KB', href: '/tools/compress-pdf-140kb', active: true },
  { label: '200 KB', href: '/tools/compress-pdf?target=200', active: false },
  { label: '300 KB', href: '/tools/compress-pdf?target=300', active: false },
  { label: '500 KB', href: '/tools/compress-pdf?target=500', active: false },
];

const FAQS = [
  {
    q: 'Why do Indian government exam portals mandate PDF files under 150KB or exactly 140KB?',
    a: 'Major recruitment portals such as SSC (Staff Selection Commission), UPSC, State PSCs (UPPSC, BPSC, RPSC, MPPSC), and Police Recruitment boards process tens of millions of candidate applications. Setting strict file size limits (like 100KB to 150KB, commonly 140KB) ensures rapid database indexing, eliminates portal server crashes during the final deadline hours, and guarantees fast hall ticket/admit card generation.',
  },
  {
    q: 'Will text and roll numbers on my marksheet remain readable at 140KB?',
    a: 'Yes, absolutely. SizeSnap utilizes an intelligent client-side vector-preservation compression engine. It downsamples redundant image metadata, compresses high-resolution background scans, and preserves critical font vectors and ink contrast so your name, roll number, subject marks, and university seal remain sharp and 100% legible for document verification (DV).',
  },
  {
    q: 'Can I compress multi-page PDF documents (e.g. all semester marksheets) to 140KB?',
    a: 'Yes. You can upload multi-page PDFs. The tool dynamically balances compression across all pages to meet the 140KB threshold. If your document has 5+ pages of heavy scans, consider our Merge PDF tool to select only mandatory pages or compress each semester individually.',
  },
  {
    q: 'Is my Aadhaar card or educational marksheet uploaded to any server?',
    a: 'Never. SizeSnap operates 100% inside your web browser using HTML5 WebAssembly and Canvas APIs. Your confidential certificates, government IDs, and documents never leave your phone or computer. There is zero risk of data leaks or privacy invasion.',
  },
  {
    q: 'What should I do if my original PDF is 5MB+ and cannot reach 140KB in one pass?',
    a: 'If your scanned PDF is exceptionally large (e.g., 5MB–10MB at 600 DPI), simply run the output through the compressor once more, or use our "Image to PDF" tool to re-scan at 150–200 DPI before converting. 200 DPI is the official sweet spot recommended by UPSC and SSC for document uploads.',
  },
];

export default function CompressPdf140kbPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/compress-pdf-140kb#webapp',
        name: 'SizeSnap 140KB PDF Compressor',
        url: 'https://www.sizesnap.in/tools/compress-pdf-140kb',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Compress PDF to exact 140KB target',
          '100% client-side privacy protection',
          'Preserve marksheet text legibility',
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
            name: 'Compress PDF to 140KB',
            item: 'https://www.sizesnap.in/tools/compress-pdf-140kb',
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
                <span className="text-gray-900 font-medium">Compress PDF to 140KB</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> High Demand Govt Portal Preset
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Compress PDF to 140KB Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Instantly resize and shrink your PDF documents to <strong>under 140KB or 150KB</strong> with crisp text clarity. Optimized specifically for SSC, UPSC, State PSC, Police, and Bank recruitment document verification.
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
              <CompressPdfTool initialTargetKB={140} />
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Local & Private</span>
                  <span className="text-[11px] text-gray-500">Processed in browser, never uploaded</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Precise 140KB Output</span>
                  <span className="text-[11px] text-gray-500">Meets strict under-150KB portal checks</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Legible Text Guarantee</span>
                  <span className="text-[11px] text-gray-500">Marks & signatures remain clear</span>
                </div>
              </div>
            </div>

            {/* In-Depth Guide & Portal Specifications Table */}
            <article className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Official Indian Government Exam PDF Specifications
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  Uploading documents exceeding portal limits leads to immediate form rejection or submission timeouts. Here is the official specification matrix across major Indian recruitment examinations:
                </p>
              </div>

              {/* Specification Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-[4px]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F2F4FC] text-gray-800 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Recruitment Exam / Board</th>
                      <th className="p-3">Document Type</th>
                      <th className="p-3">Required File Format</th>
                      <th className="p-3">Prescribed Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">SSC (CGL, CHSL, GD, MTS)</td>
                      <td className="p-3">10th Marksheet & Caste Certificate</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-[#414FA8]">100 KB – 200 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">UPSC (CSE, NDA, CDS, OTR)</td>
                      <td className="p-3">Degree Certificate & Photo ID Proof</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-[#414FA8]">100 KB – 300 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">State PSCs (UPPSC, BPSC, RPSC)</td>
                      <td className="p-3">Domicile, Income & Academic Proof</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-emerald-700">Under 150 KB (140KB Optimal)</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">State Police Recruitment</td>
                      <td className="p-3">Aadhaar Card, 10th & 12th Certificate</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-[#414FA8]">50 KB – 150 KB</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 font-medium text-gray-900">NTA (NEET, JEE, CUET)</td>
                      <td className="p-3">Category Certificate & PwD Proof</td>
                      <td className="p-3">PDF</td>
                      <td className="p-3 font-semibold text-[#414FA8]">50 KB – 300 KB</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="pt-2">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How to Compress Scanned PDF Documents to Exactly 140KB
                </h3>
                <ol className="list-decimal pl-5 space-y-2.5 text-sm text-gray-600">
                  <li>
                    <strong>Select or Drag & Drop:</strong> Choose your scanned Aadhaar, PAN card, or marksheet PDF in the upload box above.
                  </li>
                  <li>
                    <strong>Automatic 140KB Target:</strong> SizeSnap has pre-configured the target slider to 140KB. You can fine-tune it if your portal mandates an exact boundary like 130KB or 145KB.
                  </li>
                  <li>
                    <strong>Execute Client-Side Compression:</strong> Click <span className="font-semibold text-gray-800">&quot;Compress PDF&quot;</span>. The algorithm rescales embedded scans without blurring text.
                  </li>
                  <li>
                    <strong>1-Click Instant Download:</strong> Your optimized PDF downloads immediately with real before & after file size verification.
                  </li>
                </ol>
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

            {/* Essential Companion Tools Grid */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#414FA8]" />
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Essential Companion Tools for Govt Portals
                  </h2>
                </div>
                <Link
                  href="/pdf-tools"
                  className="text-xs font-semibold text-[#414FA8] hover:underline inline-flex items-center gap-1"
                >
                  All PDF Tools <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Link
                  href="/tools/merge-pdf"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Merge Marksheet & Aadhaar
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Combine multiple certificate pages into a single neat PDF file.
                  </span>
                </Link>

                <Link
                  href="/exams/exam-application-kit"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    All-in-One Exam Kit
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Resize photo, signature, thumb impression & declaration in 1-click.
                  </span>
                </Link>

                <Link
                  href="/tools/image-to-pdf"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Images to PDF Converter
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Convert mobile photos of documents directly into high-clarity PDF.
                  </span>
                </Link>

                <Link
                  href="/tools/passport-photo-maker"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Passport Photo Maker
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Crop to official 3.5x4.5cm and adjust exact KB size for exams.
                  </span>
                </Link>

                <Link
                  href="/tools/generate-signature"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Online Signature Maker
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Draw digital signatures or make transparent PNG with black ink.
                  </span>
                </Link>

                <Link
                  href="/tools/reduce-image-size-in-kb"
                  className="p-3.5 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-all group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-[#414FA8] block mb-1">
                    Reduce Image Size in KB
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed block">
                    Shrink JPG/PNG images to exact 20KB, 50KB, or 100KB limits.
                  </span>
                </Link>
              </div>
            </div>

            {/* Related Tools Shelf */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related PDF Utilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* Comprehensive FAQ Section */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5">
                      {faq.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
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
