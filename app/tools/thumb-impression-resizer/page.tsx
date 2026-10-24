import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { ThumbImpressionResizerTool } from '@/components/tool-ui/ThumbImpressionResizerTool';
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
  HelpCircle,
  Fingerprint,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thumb Impression Resizer Online Free (Exact 240x240 px, 20KB-50KB) | SizeSnap',
  description:
    'Resize Left Thumb Impression (LTI) to exact 240x240 pixels (20KB–50KB) online for free. Compliant with IBPS PO, Clerk, SBI, RRB Railway, and Sarkari exam portals. Auto-whitens paper & sharpens ink.',
  keywords: [
    'thumb impression resizer',
    'left thumb impression size for ibps',
    'thumb impression resize online',
    'thumb impression 20kb to 50kb',
    'ibps thumb impression resizer',
    'sbi po thumb impression size',
    'thumb impression size in pixels',
    'rrb thumb impression size',
    'online thumb resizer',
    'thumb print size reducer in kb',
    'left thumb impression 240x240',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/thumb-impression-resizer',
  },
  openGraph: {
    title: 'Thumb Impression Resizer Online Free (Exact 240x240 px, 20KB-50KB) | SizeSnap',
    description:
      'Resize and format Left Thumb Impression for IBPS, SBI, Railway RRB, and State exams. 100% private, client-side browser processing.',
    url: 'https://www.sizesnap.in/tools/thumb-impression-resizer',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thumb Impression Resizer Online Free | SizeSnap',
    description:
      'Quickly resize thumb impression to exact 240x240 pixels and 20KB to 50KB for government job portals.',
  },
};

const RELATED_SLUGS = [
  'pan-card-photo-resizer',
  'passport-photo-maker',
  '14kb-photo-size',
  'reduce-image-size-in-kb',
  'compress-image-to-20kb',
  'photo-and-signature-joiner',
];

const FAQS = [
  {
    q: 'What is the official size of Left Thumb Impression for IBPS and SBI banking exams?',
    a: 'According to official IBPS and SBI recruitment guidelines: Dimensions must be 240 × 240 pixels (roughly 3.0 cm × 3.0 cm at 200 DPI), file size must be strictly between 20 KB and 50 KB, and the format must be JPG or JPEG.',
  },
  {
    q: 'Which thumb impression is required: Left or Right?',
    a: 'All major recruitment bodies (IBPS, SBI, SSC, RRB) mandate the LEFT THUMB IMPRESSION for both male and female candidates. If a candidate does not have a left thumb, they may use their right thumb and explicitly declare it during registration.',
  },
  {
    q: 'Which ink should I use for thumb impression on paper?',
    a: 'Use a BLUE or BLACK ink stamp pad on clean, plain white unruled paper. Press your thumb gently without sliding to avoid smudging the ridge lines. Never use fountain pen ink or markers.',
  },
  {
    q: 'Why does the portal reject my thumb impression photo?',
    a: 'The most common reasons for automated portal rejection are: (1) File size exceeds 50 KB or is below 20 KB, (2) Dimensions are not square (must be 240x240 px), (3) Yellow or shadowed paper background, and (4) Uploading PNG or WebP files instead of standard JPG.',
  },
  {
    q: 'Is my biometric thumb impression safe on SizeSnap?',
    a: 'Yes, 100% safe. SizeSnap processes your image entirely inside your local browser using client-side HTML5 Canvas. Your fingerprint image is never sent to our servers or saved anywhere online.',
  },
];

export default function ThumbImpressionResizerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/thumb-impression-resizer#webapp',
        name: 'SizeSnap Thumb Impression Resizer',
        url: 'https://www.sizesnap.in/tools/thumb-impression-resizer',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Exact 240x240 px Left Thumb Impression resizing',
          'Strict 20KB to 50KB IBPS / SBI bank compression',
          'Automatic paper background whitening & ink sharpening',
          '100% client-side privacy protection',
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
            name: 'Exam Tools',
            item: 'https://www.sizesnap.in/exam-tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Thumb Impression Resizer',
            item: 'https://www.sizesnap.in/tools/thumb-impression-resizer',
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
        name: 'How to Resize Thumb Impression to 240x240 px and 20KB-50KB Online',
        description:
          'Step-by-step instructions to crop and resize your Left Thumb Impression for IBPS, SBI, and government job applications.',
        totalTime: 'PT15S',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Take Photo of Thumbprint',
            text: 'Put your left thumb on a blue or black stamp pad and press onto a clean sheet of white paper. Take a clear photo with your phone.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Upload to SizeSnap',
            text: 'Upload or drag & drop the photo into the Thumb Impression Resizer.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Select Exam Preset',
            text: 'Select your target exam (IBPS Bank, Railway RRB, or State PSC). SizeSnap sets the exact 240x240 px and 20KB-50KB limits.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Download Compliant JPG',
            text: 'Preview the ridge lines and click Download. Your file is ready to upload straight to the official registration portal.',
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
            {/* Header Box */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#414FA8]/10 via-[#414FA8]/5 to-transparent rounded-bl-full -z-10 pointer-events-none" />

              {/* Breadcrumb */}
              <div className="mb-4 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <Link href="/" className="hover:text-[#414FA8] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/exam-tools" className="hover:text-[#414FA8] transition-colors">Exam Tools</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Thumb Impression Resizer</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> IBPS &amp; Bank Exam Standard
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Fingerprint className="w-3.5 h-3.5" /> 240 × 240 px (20KB–50KB)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Thumb Impression Resizer Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Resize and compress your <strong>Left Thumb Impression (LTI)</strong> to exact <strong>240 × 240 pixels</strong> and <strong>20KB to 50KB</strong> for IBPS PO, Clerk, SBI, Railway RRB, and state recruitment portals. Clean paper background and sharpen ink lines in seconds.
              </p>
            </div>

            {/* Interactive Tool Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
              <ThumbImpressionResizerTool />
            </div>

            {/* Features Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-[4px] border border-gray-200 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Biometric Privacy</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Fingerprint runs locally; never saved to servers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-emerald-50 text-emerald-700 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Ink Ridge Sharpener</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Cleans camera shadows &amp; darkens stamp lines</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-amber-50 text-amber-700 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Bank &amp; RRB Ready</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Exact 240x240 px @ 20-50KB guaranteed</p>
                </div>
              </div>
            </div>

            {/* In-Depth Guidance Article */}
            <article className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs prose prose-sm max-w-none text-gray-700 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                Official Guidelines for Left Thumb Impression (LTI) Upload
              </h2>
              <p className="leading-relaxed text-sm">
                Every year, over 10 million aspirants apply for banking exams conducted by the <strong>Institute of Banking Personnel Selection (IBPS)</strong> and the <strong>State Bank of India (SBI)</strong>. In addition to a passport photo and signature, banking portals mandatorily require a clear <strong>Left Thumb Impression (LTI)</strong> to verify candidate identity and prevent impersonation during online computer-based tests (CBT).
              </p>

              <h3 className="text-lg font-bold text-gray-900 pt-2">
                Official Examination Specifications Table
              </h3>
              <div className="overflow-x-auto not-prose">
                <table className="w-full text-left text-xs border border-gray-200 rounded">
                  <thead className="bg-[#EEF1FB] text-[#414FA8] font-bold">
                    <tr>
                      <th className="p-2.5 border-b border-gray-200">Exam Body</th>
                      <th className="p-2.5 border-b border-gray-200">Dimensions</th>
                      <th className="p-2.5 border-b border-gray-200">File Size (KB)</th>
                      <th className="p-2.5 border-b border-gray-200">Ink Color</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    <tr>
                      <td className="p-2.5 font-semibold">IBPS PO / Clerk / SO</td>
                      <td className="p-2.5">240 × 240 pixels (3 × 3 cm)</td>
                      <td className="p-2.5 font-bold text-emerald-700">20 KB – 50 KB</td>
                      <td className="p-2.5">Blue or Black</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">SBI PO / Clerk</td>
                      <td className="p-2.5">240 × 240 pixels (3 × 3 cm)</td>
                      <td className="p-2.5 font-bold text-emerald-700">20 KB – 50 KB</td>
                      <td className="p-2.5">Blue or Black</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Railway RRB (ALP, NTPC)</td>
                      <td className="p-2.5">240 × 240 pixels</td>
                      <td className="p-2.5 font-bold text-amber-700">30 KB – 49 KB</td>
                      <td className="p-2.5">Blue or Black</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">State Police &amp; PSC</td>
                      <td className="p-2.5">3.0 × 3.0 cm square</td>
                      <td className="p-2.5 font-bold text-emerald-700">20 KB – 50 KB</td>
                      <td className="p-2.5">Blue or Black</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-gray-900 pt-2">
                4 Tips to Avoid Thumb Impression Rejection
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
                <li><strong>Do Not Over-Ink:</strong> Gently tap your thumb onto the stamp pad. If there is excess ink, press it once on a scrap paper before stamping on your final submission sheet to prevent smudged lines.</li>
                <li><strong>Use Plain White Paper:</strong> Do not use ruled or lined notebook paper. Lines intersecting with your fingerprint ridges trigger automatic software validation errors.</li>
                <li><strong>Ensure Adequate Lighting:</strong> When snapping a phone photo, avoid shadows from your hand or mobile device. Our built-in &quot;Clean Paper &amp; Sharpen Ink&quot; tool automatically strips minor shadows.</li>
                <li><strong>Verify Exact Size:</strong> Confirm that the downloaded file weight is above 20KB and below 50KB. SizeSnap automatically enforces this range.</li>
              </ol>

              <div className="bg-[#F8F9FE] p-4 rounded border border-[#414FA8]/15 not-prose">
                <h4 className="text-sm font-bold text-[#414FA8] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#414FA8]" /> Complete Bank Application Toolkit
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Need to format all 4 documents for your banking registration? Check out our dedicated{' '}
                  <Link href="/exams/ibps-bank-photo-signature-resizer" className="text-[#414FA8] font-bold underline">
                    IBPS &amp; SBI 4-in-1 Bank Exam Resizer
                  </Link>{' '}
                  for Passport Photo, Signature, Thumb Impression, and Handwritten Declaration.
                </p>
              </div>
            </article>

            {/* Related Tools */}
            <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                Related Exam &amp; Document Resizers
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

            {/* FAQ Section */}
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
