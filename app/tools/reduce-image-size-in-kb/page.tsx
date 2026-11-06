import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { KbCompressor } from '@/components/tool-ui/KbCompressor';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield, FileCheck, Bookmark } from 'lucide-react';
import { KbTargetPills } from '@/components/KbTargetPills';
import { WhatsAppShareButton } from '@/components/WhatsAppShareButton';

export const metadata: Metadata = {
  title: 'Reduce Image Size in KB - Image Resizer in KB & Size Decrease Online | SizeSnap',
  description:
    'Free online size reducer and image resizer in KB. Decrease image size to exact KB (10KB, 14KB, 20KB, 50KB, 100KB, 200KB) for SSC, UPSC, and government portals without losing quality. 100% private.',
  keywords: [
    'image resizer in kb',
    'image size decrease',
    'reduce image size in kb',
    'size reducer',
    'pic size decrease',
    'reduce images size',
    'photo resize kb',
    'photos resize in kb',
    'resize image by kb',
    'resize photo kb',
    'resize pic in kb',
    'image resolution decrease',
    'image size reducer',
    'photo size reducer',
    'photo compressor in kb',
    'size reducer in kb',
    'photo resizer in kb',
    'image compressor in kb',
    'reduce photo size in kb',
    'image size reducer in kb',
    'compress image to exact kb',
    'reduce image size to 20kb',
    'reduce image size to 50kb',
    'reduce image size to 100kb',
    'photo size reducer online free',
    'kb photo reducer',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/reduce-image-size-in-kb',
  },
  openGraph: {
    title: 'Reduce Image Size in KB - Image Resizer in KB & Size Decrease Online | SizeSnap',
    description:
      'Free online image resizer in KB and size reducer to decrease photos to exact 10KB, 20KB, 50KB, or 100KB with SizeSnap. Zero server uploads.',
    url: 'https://www.sizesnap.in/tools/reduce-image-size-in-kb',
    siteName: 'SizeSnap',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-10kb',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  '14kb-photo-size',
  'compress-image',
  'resize-image-pixel',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How do I reduce my photo size to exactly 20KB or 50KB for govt portals?',
    a: 'Simply select your photo, click the "20 KB" or "50 KB" preset button (or enter any custom number), and click "Reduce Image". SizeSnap uses smart client-side binary search algorithms to recalibrate compression and scale dimensions to match your target without manual guesswork.',
  },
  {
    q: 'Why do Indian exam portals (SSC, UPSC, IBPS, NTA) require 20KB to 50KB photos?',
    a: 'Government and university servers handle millions of applications simultaneously. Mandating 20KB–50KB constraints ensures fast form submissions, low server storage overhead, and quick identity verification during hall ticket generation.',
  },
  {
    q: 'Will reducing file size to 20KB make my photo completely blurry?',
    a: 'SizeSnap preserves facial features and clarity by intelligently balancing JPEG/WebP quantization tables and scaling dimensions just enough to fit within your specified KB limit while maintaining the original aspect ratio.',
  },
  {
    q: 'Can I reduce signature images to 10KB or 14KB?',
    a: 'Yes. For black & white or blue ink signatures on white paper, SizeSnap optimizes the background pixels and reduces file size to 10KB–20KB in milliseconds, fully compliant with SSC and UPSC rules.',
  },
];

export default function ReduceImageSizeKbPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/reduce-image-size-in-kb#webapp',
        name: 'SizeSnap Reduce Image Size in KB Online',
        url: 'https://www.sizesnap.in/tools/reduce-image-size-in-kb',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Free client-side tool to reduce image size to exact KB (10KB, 20KB, 50KB, 100KB, 200KB) for government and job portal submissions.',
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
        name: 'How to Reduce Image Size in KB Online',
        description:
          'Step-by-step instructions to compress and reduce photo or signature size to exact KB without quality loss.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload Photo or Signature',
            text: 'Upload or drag and drop your JPG or PNG image into the box.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Select or Type Target KB',
            text: 'Choose an exact target like 10KB, 20KB, 50KB, or 100KB.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Compress and Download',
            text: 'Click Reduce Image and download the optimized file instantly.',
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Reduce Image Size in KB</span>
        </nav>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Reduce Image Size in KB Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Reduce image file size to exact target KB (10KB, 20KB, 50KB, 100KB, 200KB) for job applications, passports, and exam portals without server uploads.
              </p>
            </div>

            {/* Quick KB Presets Navigation Pills Silo */}
            <KbTargetPills type="image" activeSlug="reduce-image-size-in-kb" />

            {/* Interactive Target KB Engine */}
            <React.Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading SizeSnap Compressor...</div>}>
              <KbCompressor />
            </React.Suspense>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Client-Side</span>
                  <span className="text-[11px] text-gray-500">Private &amp; secure in your browser</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Target Size Presets</span>
                  <span className="text-[11px] text-gray-500">20KB, 50KB, 100KB or custom</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Official Exam Ready</span>
                  <span className="text-[11px] text-gray-500">Perfect for SSC, UPSC &amp; PAN</span>
                </div>
              </div>
            </div>

            {/* Sister Tools Quick Links */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Need general compression or pixel dimensions?
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/compress-image-to-10kb"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress to 10KB (Signature) →
                </Link>
                <Link
                  href="/tools/compress-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress Image (Quality &amp; Format) →
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
                  Related Size &amp; Exam Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* Featured Snippet Table: Official Exam Size Guidelines */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#414FA8]" />
                Official Government Exam Photo &amp; Signature Size Chart (2026)
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                Quick reference guide for file size (KB) and dimensions required across major Indian recruitment portals.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-gray-200 rounded">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Exam / Portal</th>
                      <th className="p-3">Photo Size (KB)</th>
                      <th className="p-3">Photo Dimensions</th>
                      <th className="p-3">Signature Size (KB)</th>
                      <th className="p-3">Signature Dimensions</th>
                      <th className="p-3">Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-600">
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900">SSC (CGL, CHSL, GD, MTS)</td>
                      <td className="p-3 font-semibold text-emerald-700">20 KB – 50 KB</td>
                      <td className="p-3">3.5 × 4.5 cm</td>
                      <td className="p-3 font-semibold text-emerald-700">10 KB – 20 KB (Strict)</td>
                      <td className="p-3">4.0 × 2.0 cm</td>
                      <td className="p-3">JPEG / JPG</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900">UPSC (Civil Services, NDA, CDS)</td>
                      <td className="p-3 font-semibold text-emerald-700">20 KB – 300 KB</td>
                      <td className="p-3">350 × 350 px min</td>
                      <td className="p-3 font-semibold text-emerald-700">20 KB – 300 KB</td>
                      <td className="p-3">350 × 350 px min</td>
                      <td className="p-3">JPG</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-amber-700">PAN Card (UTIITSL)</td>
                      <td className="p-3 font-semibold text-amber-700">&lt; 30 KB (Strict)</td>
                      <td className="p-3">213 × 213 px (300 DPI)</td>
                      <td className="p-3 font-semibold text-amber-700">&lt; 60 KB</td>
                      <td className="p-3">400 × 200 px (600 DPI)</td>
                      <td className="p-3">JPEG</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-blue-700">PAN Card (NSDL / Protean)</td>
                      <td className="p-3 font-semibold text-blue-700">&lt; 50 KB</td>
                      <td className="p-3">3.5 × 2.5 cm (200 DPI)</td>
                      <td className="p-3 font-semibold text-blue-700">&lt; 20 KB (Strict)</td>
                      <td className="p-3">2 × 4.5 cm (200 DPI)</td>
                      <td className="p-3">JPEG</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900">State Police (UP, Delhi, Bihar)</td>
                      <td className="p-3 font-semibold text-emerald-700">20 KB – 50 KB</td>
                      <td className="p-3">35 × 45 mm</td>
                      <td className="p-3 font-semibold text-emerald-700">10 KB – 20 KB</td>
                      <td className="p-3">40 × 20 mm</td>
                      <td className="p-3">JPG</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900">NTA (NEET / JEE Main)</td>
                      <td className="p-3 font-semibold text-emerald-700">10 KB – 200 KB</td>
                      <td className="p-3">Passport &amp; Postcard (4×6 in)</td>
                      <td className="p-3 font-semibold text-emerald-700">4 KB – 30 KB</td>
                      <td className="p-3">3.5 × 1.5 cm</td>
                      <td className="p-3">JPG</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-500">
                  Tip: Use the pills above to resize your photo to exact KB in 1 click.
                </span>
                <WhatsAppShareButton
                  title="Govt Exam Photo & Signature Size Chart (SizeSnap)"
                  url="https://www.sizesnap.in/tools/reduce-image-size-in-kb"
                />
              </div>
            </div>

            {/* Comprehensive SEO Article Section */}
            <article className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs text-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                How to Reduce Image Size in KB Online (20KB, 50KB, 100KB)
              </h2>
              <p className="text-sm mb-5 leading-relaxed">
                Applying for government jobs (SSC, UPSC, IBPS, NTA), university admissions, or creating a PAN card online often comes with a strict photo size limit. Usually, you are asked to upload a photo and signature under <strong>20KB</strong>, <strong>50KB</strong>, or <strong>100KB</strong>. SizeSnap&apos;s KB Reducer tool is specifically designed to hit these exact target file sizes without making your images blurry or unreadable. 
              </p>
              
              <h3 className="text-base font-bold text-gray-800 mb-3">Step-by-Step Guide to Compress Image to Specific KB:</h3>
              <ol className="list-decimal pl-5 mb-6 space-y-2 text-sm">
                <li><strong>Upload Photo or Signature:</strong> Click to browse and select the JPG or PNG file from your phone or PC.</li>
                <li><strong>Enter Target Size (KB):</strong> Use our quick presets like <strong>20 KB</strong>, <strong>50 KB</strong>, or type any custom number you need.</li>
                <li><strong>Let the Algorithm Work:</strong> Click &quot;Reduce Image&quot;. Our smart compression engine uses a binary search algorithm to instantly find the perfect balance between quality and file size.</li>
                <li><strong>Download Ready File:</strong> Check the new size in the preview. Click download and upload it straight to your exam portal.</li>
              </ol>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                Why Choose SizeSnap Over Other Compressors?
              </h2>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-sm">
                <li><strong>No Guesswork:</strong> Most tools ask you to adjust &quot;quality&quot; percentages, which forces you to download and check the file size repeatedly. We let you enter the exact KB, and we do the math.</li>
                <li><strong>100% Private &amp; Secure:</strong> Your identity documents, passport photos, and signatures never leave your browser. We don&apos;t use external servers, making this the safest way to resize sensitive documents.</li>
                <li><strong>Maintains Aspect Ratio:</strong> We ensure your face isn&apos;t stretched or squeezed. It remains perfectly proportioned for official applications.</li>
              </ul>
              
              <p className="text-sm leading-relaxed">
                If your original image is massive (like a 5MB smartphone photo) and you try to compress it to 20KB, the algorithm may have to shrink the physical dimensions (width/height) slightly to achieve the target size while avoiding pixelation. For best results, crop out unnecessary background space before reducing the KB.
              </p>
            </article>

            {/* FAQ Section */}
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
