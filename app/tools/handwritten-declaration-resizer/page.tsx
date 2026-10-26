import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { HandwrittenDeclarationTool } from '@/components/tool-ui/HandwrittenDeclarationTool';
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
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Handwritten Declaration Resizer Online Free (Exact 800x400 px, 50KB-100KB) | SizeSnap',
  description:
    'Resize and compress handwritten declaration to exact 800x400 pixels (50KB–100KB) for IBPS PO, Clerk, SBI, and RRB banking exams. Auto paper whitening, black ink enhancement & 100% private.',
  keywords: [
    'handwritten declaration resizer',
    'ibps declaration size in kb',
    'sbi declaration 800x400',
    'handwritten declaration 50kb to 100kb',
    'ibps po handwritten declaration size',
    'sbi clerk handwritten declaration size',
    'handwritten declaration 800x400 resize',
    'bank declaration resizer online',
    'handwritten declaration size reducer',
    'ibps rrb handwritten declaration 50 to 100 kb',
    'sbi po handwritten declaration 800x400',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/handwritten-declaration-resizer',
  },
  openGraph: {
    title: 'Handwritten Declaration Resizer Online Free (Exact 800x400 px, 50KB-100KB) | SizeSnap',
    description:
      'Format and resize handwritten declarations for IBPS, SBI, and RRB banking portals. 100% private client-side browser processing.',
    url: 'https://www.sizesnap.in/tools/handwritten-declaration-resizer',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handwritten Declaration Resizer Online Free | SizeSnap',
    description:
      'Resize bank handwritten declaration to exact 800x400 pixels and 50KB to 100KB for IBPS and SBI portal uploads.',
  },
};

const RELATED_SLUGS = [
  'thumb-impression-resizer',
  '14kb-photo-size',
  'passport-photo-maker',
  'reduce-image-size-in-kb',
  'pan-card-photo-resizer',
  'photo-and-signature-joiner',
];

const FAQS = [
  {
    q: 'What is the official size of Handwritten Declaration for IBPS and SBI exams?',
    a: 'According to official IBPS and SBI recruitment notifications: The dimensions must be exactly 800 × 400 pixels (aspect ratio 2:1, approximately 10 cm × 5 cm at 200 DPI), file size must be strictly between 50 KB and 100 KB, and the format must be JPG or JPEG.',
  },
  {
    q: 'What is the official text to write for IBPS / SBI Handwritten Declaration?',
    a: 'The text must be written in English on clean white paper: "I, _______ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required."',
  },
  {
    q: 'Can I write the handwritten declaration in CAPITAL LETTERS?',
    a: 'NO! IBPS and SBI guidelines strictly specify that handwritten declarations written entirely in CAPITAL LETTERS will be considered INVALID and your candidature may be rejected. It must be written in natural running handwriting.',
  },
  {
    q: 'Which ink pen should be used for the declaration?',
    a: 'You must use a BLACK INK pen (ballpoint or gel pen) on clean white unruled paper. Do not use blue, red, or green pens.',
  },
  {
    q: 'Why does the IBPS portal reject declaration uploads?',
    a: 'Common reasons include: (1) File size is above 100 KB or below 50 KB, (2) Resolution is not 800x400 px (2:1 ratio), (3) Dim phone lighting causing dark grey paper shadows, and (4) Uploading PNG or PDF files instead of JPG/JPEG.',
  },
  {
    q: 'Is my handwritten document safe on SizeSnap?',
    a: 'Absolutely. SizeSnap operates 100% inside your local web browser using client-side HTML5 Canvas. Your handwritten declaration never leaves your device and is never uploaded to any server or cloud database.',
  },
];

export default function HandwrittenDeclarationResizerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/handwritten-declaration-resizer#webapp',
        name: 'SizeSnap Handwritten Declaration Resizer',
        url: 'https://www.sizesnap.in/tools/handwritten-declaration-resizer',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Exact 800x400 px (2:1 aspect ratio) bank declaration resizing',
          'Strict 50KB to 100KB IBPS / SBI compression',
          'Automatic paper shadow clearing & ink enhancement',
          'One-click official declaration text copy button',
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
            item: 'https://www.sizesnap.in/exams',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Handwritten Declaration Resizer',
            item: 'https://www.sizesnap.in/tools/handwritten-declaration-resizer',
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
        name: 'How to Resize Handwritten Declaration to 800x400 px (50KB–100KB) Online',
        description:
          'Step-by-step guide to format and compress your bank handwritten declaration photo for IBPS and SBI application portals.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Write Declaration & Take Photo',
            text: 'Write the official text in black ink on white paper using running handwriting. Take a clear photo with your mobile camera.',
            position: 1,
          },
          {
            '@type': 'HowToStep',
            name: 'Upload to SizeSnap Resizer',
            text: 'Upload your photo. The tool automatically applies the required 2:1 aspect ratio (800 × 400 pixels).',
            position: 2,
          },
          {
            '@type': 'HowToStep',
            name: 'Clean Shadows & Adjust Fit',
            text: 'Keep "Whiten Paper & Darken Ink" checked to eliminate phone shadows. Use Pan & Zoom sliders to center the text perfectly.',
            position: 3,
          },
          {
            '@type': 'HowToStep',
            name: 'Download Compliant JPG',
            text: 'Click Download. Your file is generated strictly between 50KB and 100KB, 100% ready for upload to IBPS / SBI portals.',
            position: 4,
          },
        ],
      },
    ],
  };

  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

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
                <Link href="/exams" className="hover:text-[#414FA8] transition-colors">Exam Tools</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Handwritten Declaration Resizer</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> IBPS &amp; SBI Bank Standard (800 × 400 px)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Zap className="w-3.5 h-3.5" /> Strict 50KB–100KB Range
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Handwritten Declaration Resizer Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Crop, enhance, and resize your handwritten declaration photo to <strong>exact 800 × 400 pixels</strong> and <strong>50 KB to 100 KB</strong>. Clears phone camera shadows and sharpens black ink strokes for 100% automated acceptance on IBPS PO, Clerk, RRB, and SBI recruitment portals.
              </p>
            </div>

            {/* Quick 4 Bank Documents Navigation Bar */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2.5">
                The 4 Required IBPS / SBI Banking Documents:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Link
                  href="/tools/passport-photo-maker"
                  className="p-2.5 rounded bg-gray-50 hover:bg-[#EEF1FB] hover:border-[#414FA8] border border-gray-200 text-center transition-all group"
                >
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#414FA8] block">1. Passport Photo</span>
                  <span className="text-[10px] text-gray-500">200×230 px • 20–50 KB</span>
                </Link>
                <Link
                  href="/tools/14kb-photo-size"
                  className="p-2.5 rounded bg-gray-50 hover:bg-[#EEF1FB] hover:border-[#414FA8] border border-gray-200 text-center transition-all group"
                >
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#414FA8] block">2. Signature</span>
                  <span className="text-[10px] text-gray-500">140×60 px • 10–20 KB</span>
                </Link>
                <Link
                  href="/tools/thumb-impression-resizer"
                  className="p-2.5 rounded bg-gray-50 hover:bg-[#EEF1FB] hover:border-[#414FA8] border border-gray-200 text-center transition-all group"
                >
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#414FA8] block">3. Left Thumb</span>
                  <span className="text-[10px] text-gray-500">240×240 px • 20–50 KB</span>
                </Link>
                <div
                  className="p-2.5 rounded bg-[#414FA8] text-white text-center shadow-xs"
                >
                  <span className="text-xs font-bold block">4. Declaration</span>
                  <span className="text-[10px] text-white/80">800×400 px • 50–100 KB</span>
                </div>
              </div>
            </div>

            {/* Interactive Tool Card */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <HandwrittenDeclarationTool />
            </div>

            {/* Comprehensive SEO Informational Guide */}
            <article className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs space-y-6 text-gray-700 leading-relaxed text-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                Complete Guide: IBPS &amp; SBI Handwritten Declaration Specifications
              </h2>

              <p>
                When submitting applications for <strong>IBPS PO, IBPS Clerk, IBPS RRB Officer &amp; Assistant, and SBI PO &amp; Clerk</strong>, candidates are required to upload four mandatory scanned files: their photograph, signature, left thumb impression, and a <strong>handwritten declaration</strong>.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-gray-200">
                  <thead className="bg-[#F8F9FE] text-gray-900 font-bold">
                    <tr>
                      <th className="p-3 border border-gray-200">Parameter</th>
                      <th className="p-3 border border-gray-200">Official IBPS / SBI Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-3 font-semibold text-gray-900 border border-gray-200">Pixel Dimensions</td>
                      <td className="p-3 border border-gray-200 text-[#414FA8] font-bold">800 × 400 pixels (Width × Height)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900 border border-gray-200">Aspect Ratio</td>
                      <td className="p-3 border border-gray-200">2:1 (Landscape)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900 border border-gray-200">File Size Range</td>
                      <td className="p-3 border border-gray-200 text-emerald-700 font-bold">50 KB to 100 KB strictly</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900 border border-gray-200">File Format</td>
                      <td className="p-3 border border-gray-200">JPG or JPEG only</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900 border border-gray-200">Ink Color</td>
                      <td className="p-3 border border-gray-200 font-medium">BLACK INK ONLY (Ballpoint or Gel)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900 border border-gray-200">Paper Type</td>
                      <td className="p-3 border border-gray-200">Plain White Unruled A4 Paper</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-900 border border-gray-200">Handwriting Style</td>
                      <td className="p-3 border border-gray-200 text-red-600 font-semibold">Candidate&apos;s own running hand (NO CAPITAL LETTERS)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-6 mb-2">
                Top Reasons Why Bank Portals Reject Handwritten Declarations
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>Writing in All CAPITAL Letters:</strong> Official notification explicitly disqualifies forms where the declaration text is written in block capital letters. Always write in natural, cursive, or running handwriting.
                </li>
                <li>
                  <strong>Phone Camera Shadows:</strong> Photos taken under dim home lights create grey, yellowish, or shadowy backgrounds. SizeSnap&apos;s automatic <em>Paper Whitening</em> engine converts these murky backgrounds into clean 255-pure white.
                </li>
                <li>
                  <strong>File Size Exceeding 100 KB:</strong> Phone camera photos are typically 2 MB to 5 MB. Attempting to upload files over 100 KB results in an instant <em>&quot;File size exceeds permissible limit&quot;</em> error.
                </li>
                <li>
                  <strong>Incorrect Aspect Ratio:</strong> Uploading square images (1:1) will stretch or compress your handwriting unnaturally on the portal, making it illegible. The target is strictly 2:1 (800x400 px).
                </li>
              </ul>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-6 mb-2">
                Official Declaration Text (Copy and Write by Hand)
              </h3>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-800 leading-relaxed">
                &quot;I, _______ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.&quot;
              </div>
              <p className="text-xs text-gray-500">
                Replace <em>&quot;_______ (Name of the candidate)&quot;</em> with your own full legal name as mentioned in your 10th / Matriculation Certificate.
              </p>
            </article>

            {/* FAQs */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#414FA8]" />
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="text-sm font-bold text-gray-800 mb-1.5">{faq.q}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tools */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Related Sarkari Exam &amp; Image Resizers
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedTools.map((t) => (
                  <Link
                    key={t.slug}
                    href={t.route || `/tools/${t.slug}`}
                    className="p-3 rounded border border-gray-200 hover:border-[#414FA8] hover:bg-[#EEF1FB]/30 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="font-bold text-xs text-gray-800 group-hover:text-[#414FA8] transition-colors line-clamp-1">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                        {t.shortDescription}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#414FA8] inline-flex items-center gap-1 mt-2">
                      Open Tool <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:col-span-4 xl:col-span-3 space-y-6">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
