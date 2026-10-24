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
  title: 'Compress PDF to 300KB Online Free - 300 KB PDF Resizer & Converter | SizeSnap',
  description:
    'Compress PDF to exact 300KB or under 300KB online for free without losing text clarity. Ideal for BPSC, RPSC, State PSC marksheets, and competitive exam document uploads. 100% client-side private.',
  keywords: [
    'compress pdf to 300kb',
    'pdf resize 300 kb',
    'compress pdf 300kb',
    '300kb pdf',
    '300 kb pdf',
    'pdf 300 kb',
    'pdf compressor to 300kb',
    'reduce pdf to 300kb',
    'compress pdf 300 kb online free',
    'pdf to 300kb converter',
    'reduce pdf size to 300 kb',
    'pdf under 300 kb',
    'bpsc pdf compressor 300kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-pdf-300kb',
  },
  openGraph: {
    title: 'Compress PDF to 300KB Online Free - 300 KB PDF Resizer & Converter | SizeSnap',
    description:
      'Compress PDF documents to exactly 300KB online for free. Ideal for Indian competitive exams (BPSC, RPSC, State PSC, Railway). 100% browser-side private.',
    url: 'https://www.sizesnap.in/tools/compress-pdf-300kb',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF to 300KB Online Free | SizeSnap',
    description:
      'Fast, free, and secure client-side PDF compressor targeting 300KB for government job applications.',
  },
};

const RELATED_SLUGS = [
  'compress-pdf-140kb',
  'compress-pdf-200kb',
  'compress-pdf-100kb',
  'compress-pdf-500kb',
  'merge-pdf',
  'image-to-pdf',
];

const PRESET_SIZES = [
  { label: '50 KB', href: '/tools/compress-pdf-50kb', active: false },
  { label: '100 KB', href: '/tools/compress-pdf-100kb', active: false },
  { label: '140 KB', href: '/tools/compress-pdf-140kb', active: false },
  { label: '200 KB', href: '/tools/compress-pdf-200kb', active: false },
  { label: '300 KB', href: '/tools/compress-pdf-300kb', active: true },
  { label: '500 KB', href: '/tools/compress-pdf-500kb', active: false },
  { label: '1 MB', href: '/tools/compress-pdf?target=1000', active: false },
];

const FAQS = [
  {
    q: 'Why do BPSC, RPSC, and state exam portals mandate PDF files under 300KB?',
    a: 'State recruitment commissions like BPSC (Bihar Public Service Commission), RPSC (Rajasthan PSC), and MPPSC require candidates to upload consolidated semester marksheets, caste certificates, and domicile proofs under 300KB. This limit prevents portal server crashes during high-traffic registration deadlines while giving candidates enough byte room to maintain clear document legibility.',
  },
  {
    q: 'Will my marksheet roll numbers and college seals stay sharp at 300KB?',
    a: 'Yes, 100%. At 300KB, SizeSnap gives your scanned documents substantial byte room. Our intelligent vector-preservation algorithm strips redundant image overhead and compresses white space while keeping font vectors, ink clarity, official signatures, and university stamps completely legible for Document Verification (DV).',
  },
  {
    q: 'Can I compress multi-page PDF certificates to under 300KB?',
    a: 'Yes. SizeSnap intelligently distributes compression across every page in your PDF document. Multi-page marksheets or 2-4 page degree certificates compress cleanly under the 300KB limit without truncating pages.',
  },
  {
    q: 'Are my confidential marksheets or Aadhaar proofs uploaded to external servers?',
    a: 'Never. SizeSnap operates 100% inside your web browser using HTML5 Canvas and WebAssembly. Your educational marksheets, caste certificates, and identity documents never leave your phone or computer. Zero data is stored on our servers.',
  },
  {
    q: 'What should I do if my PDF scan is over 10MB and does not reach 300KB in one pass?',
    a: 'If your file was scanned at a very high DPI (like 600 DPI), simply run the output through the compressor once more, or use our "Image to PDF" tool to convert your document images at 200 DPI before compressing. 200 DPI is the standard resolution recommended by UPSC and State PSC boards.',
  },
];

export default function CompressPdf300kbPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/compress-pdf-300kb#webapp',
        name: 'SizeSnap 300KB PDF Compressor',
        url: 'https://www.sizesnap.in/tools/compress-pdf-300kb',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Compress PDF to exact 300KB target',
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
            name: 'Compress PDF to 300KB',
            item: 'https://www.sizesnap.in/tools/compress-pdf-300kb',
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
        name: 'How to Compress PDF to 300KB Online Free',
        description:
          'Step-by-step instructions to compress your scanned certificate or marksheet PDF to under 300KB for government job portals.',
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
            name: 'Verify 300KB Target Size',
            text: 'SizeSnap is pre-configured with a 300KB target limit to comply with BPSC, RPSC, and competitive exam portals.',
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
            name: 'Download 300KB File',
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
                <span className="text-gray-900 font-medium">Compress PDF to 300KB</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> BPSC &amp; State PSC Standard
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Compress PDF to 300KB Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Resize and compress your PDF marksheets and certificates to <strong>strictly under 300KB</strong> without losing text readability. Built specifically for BPSC, RPSC, Railway, and state recruitment portals.
              </p>
            </div>

            {/* Quick KB Preset Switcher Pills */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2.5">
                Exact PDF Compression Sizes:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_SIZES.map((preset) => (
                  <Link
                    key={preset.label}
                    href={preset.href}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      preset.active
                        ? 'bg-[#414FA8] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-[#EEF1FB] hover:text-[#414FA8]'
                    }`}
                  >
                    {preset.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tool Interactive Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
              <CompressPdfTool initialTargetKB={300} />
            </div>

            {/* Features Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-[4px] border border-gray-200 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">100% Private</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Files never leave your phone or browser</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-emerald-50 text-emerald-700 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Zero Blur</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Vector ink &amp; roll numbers stay crystal clear</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-amber-50 text-amber-700 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Multi-Page Ready</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Compresses semester transcripts in one go</p>
                </div>
              </div>
            </div>

            {/* Deep SEO Article */}
            <article className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs prose prose-sm max-w-none text-gray-700 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                Why 300KB is the Standard PDF Size for State Govt Portals
              </h2>
              <p className="leading-relaxed text-sm">
                State recruitment portals such as <strong>BPSC (Bihar Public Service Commission)</strong>, <strong>RPSC (Rajasthan)</strong>, and various high court recruitment systems explicitly state in their official notification PDFs that all uploaded educational marksheets, caste certificates, and experience documents must be submitted in <strong>PDF format under 300KB</strong>.
              </p>
              <p className="leading-relaxed text-sm">
                When candidates scan their physical degrees or graduation marksheets using smartphones or multi-function scanners, the generated PDF often exceeds 2MB to 5MB. Uploading such large files triggers server rejection errors like <em>&quot;File size exceeds maximum allowable limit (300 KB)&quot;</em>. SizeSnap fixes this instantly by recalibrating internal image streams down to exactly 300KB without compromising typographic legibility.
              </p>

              <h3 className="text-lg font-bold text-gray-900 pt-2">
                Step-by-Step: How to Compress Scanned PDF to Under 300KB
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
                <li><strong>Select your PDF:</strong> Click Browse or drag &amp; drop your certificate into the upload box above.</li>
                <li><strong>Verify 300KB Preset:</strong> SizeSnap automatically configures the target slider to 300KB. You can fine-tune it if your portal requires 280KB or 290KB.</li>
                <li><strong>Process Client-Side:</strong> Click &quot;Compress PDF&quot;. The tool dynamically optimizes image matrices and strips excess metadata locally.</li>
                <li><strong>Download and Upload:</strong> Click &quot;Download PDF&quot; to save the compliant file directly to your device and submit it with confidence.</li>
              </ol>

              <div className="bg-[#F8F9FE] p-4 rounded border border-[#414FA8]/15 not-prose">
                <h4 className="text-sm font-bold text-[#414FA8] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#414FA8]" /> Official Portal Rejection Guarantee
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  SizeSnap output files adhere strictly to the PDF/A archival standards and JPEG quantization baselines accepted by CDAC, NIC (National Informatics Centre), and State PSC application servers.
                </p>
              </div>
            </article>

            {/* Related Tools Grid */}
            <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                Popular Document &amp; Exam Tools
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {RELATED_SLUGS.map((slug) => {
                  const tool = ALL_TOOLS.find((t) => t.slug === slug);
                  if (!tool) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/tools/${slug}`}
                      className="group p-3 rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:bg-[#EEF1FB]/30 transition-all flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-gray-800 group-hover:text-[#414FA8] line-clamp-1">
                        {tool.name}
                      </span>
                      <span className="text-[11px] text-gray-400 mt-2 flex items-center gap-1 group-hover:text-[#414FA8]">
                        Open Tool <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="w-5 h-5 text-[#414FA8]" />
                <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="py-3.5 first:pt-1 last:pb-1">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{faq.q}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
