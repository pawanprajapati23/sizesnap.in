import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PhotoAndSignatureJoinerTool } from '@/components/tool-ui/PhotoAndSignatureJoinerTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Lock,
  Zap,
  ShieldCheck,
  FileCheck,
  Layers,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Photo and Signature Joiner - Merge Photo & Signature Online Free | SizeSnap',
  description:
    'Merge photo and signature into a single file online for free. Tailored for MP Vyapam (PEB), UPSSSC, Rajasthan High Court, Bihar SSC & govt exams. Custom split ratio, Name & DOP banner, under 50 KB compression.',
  keywords: [
    'photo and signature joiner',
    'merge photo and signature',
    'combine photo and signature online',
    'join photo and signature in single file',
    'mp vyapam photo and signature joiner',
    'upsssc photo signature joiner',
    'photo signature joiner under 50kb',
    'photo and signature merge tool free',
    'rajasthan high court photo signature merge',
    'bihar ssc photo signature joiner',
    'photo aur signature ek sath kaise kare',
    'photo signature attacher',
    'photo and signature combine for peb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/photo-and-signature-joiner',
  },
  openGraph: {
    title: 'Photo and Signature Joiner - Merge Photo & Signature Online Free | SizeSnap',
    description:
      'Combine photo and signature vertically into a single image under 50 KB for MP Vyapam, UPSSSC, and competitive exams. 100% client-side privacy.',
    url: 'https://www.sizesnap.in/tools/photo-and-signature-joiner',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo and Signature Joiner - Merge Photo & Signature Online Free | SizeSnap',
    description:
      'Merge photo and signature in a single slip under 50 KB for govt application forms. Free, instant, zero uploads.',
  },
};

const RELATED_SLUGS = [
  'add-name-and-date-on-photo',
  'passport-photo-maker',
  'white-background-passport-photo',
  'compress-image-between-20kb-to-50kb',
  'compress-image-to-50kb',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'Why do MP Vyapam (MPPEB) and other recruitment portals require photo and signature in a single file?',
    a: 'Portals like MP Vyapam (ESB/PEB), UPSSSC, Rajasthan High Court, and Bihar SSC use automated optical verification systems and standardized admit card layouts. By requiring a single vertical image containing the applicant’s photo on top and signature at the bottom, the portal guarantees alignment on the hall ticket and reduces server upload transactions.',
  },
  {
    q: 'How does the tool ensure the combined image is strictly under 50 KB?',
    a: 'SizeSnap uses an intelligent client-side binary search compression algorithm. After joining your photo and signature onto the canvas, it tests multiple JPEG encoding iterations to pinpoint the exact quality level that produces maximum sharpness while staying strictly below your selected target (e.g., 50 KB or 30 KB).',
  },
  {
    q: 'Can I add my candidate name and Date of Photo (DOP) on the joined slip?',
    a: 'Yes. Simply toggle the "Candidate Name & Date of Photo (DOP)" option in the tool. Enter your full name and the date your photograph was taken. The tool renders a crisp, high-contrast white banner with bold black lettering directly at the bottom of the photo section, meeting official exam guidelines.',
  },
  {
    q: 'What are the recommended dimensions for photo and signature slips?',
    a: 'The default preset is Standard Govt Exam (350 × 500 px), which satisfies MP Vyapam, UPSSSC, and most state recruitment portals. We also provide High Resolution (400 × 600 px), Compact Slip (300 × 450 px), and Square Format (500 × 500 px) for different recruitment notifications.',
  },
  {
    q: 'Are my private photos and signatures uploaded to SizeSnap servers?',
    a: 'No. SizeSnap executes all image joining, rendering, text overlays, and compression 100% locally in your web browser using HTML5 Canvas and JavaScript. Neither your photograph nor your signature is ever sent across the network or stored on any server.',
  },
  {
    q: 'Can I use this photo and signature joiner on Android or iPhone?',
    a: 'Yes. SizeSnap is fully responsive and optimized for mobile touchscreens. You can pick photos directly from your phone gallery or take a fresh selfie, upload your signature photo, adjust sliders, and download the merged slip directly to your Downloads folder.',
  },
  {
    q: 'What should I do if my signature appears too small or blurry?',
    a: 'For best results, crop your signature closely before uploading so there is minimal excess white margin around your ink strokes. You can also adjust the Photo / Signature ratio slider from 75% down to 65% or 70% to give your signature more vertical height.',
  },
];

export default function PhotoAndSignatureJoinerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLdWebapp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SizeSnap Photo and Signature Joiner',
    url: 'https://www.sizesnap.in/tools/photo-and-signature-joiner',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All (Mobile Android, iOS, Windows, macOS, Linux)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Merge photo and signature vertically into a single file under 50 KB for MP Vyapam, UPSSSC, and competitive exams. 100% client-side privacy.',
    featureList: [
      'Dual file uploader for candidate photo and signature',
      'Configurable split ratio (60% to 85% photo height)',
      'Candidate Name and Date of Photo (DOP) banner generator',
      'Under 50 KB, 30 KB, 70 KB, 100 KB automatic binary search compression',
      '100% private in-browser HTML5 canvas processing',
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.sizesnap.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Image Tools',
        item: 'https://www.sizesnap.in/#directory',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Photo and Signature Joiner',
        item: 'https://www.sizesnap.in/tools/photo-and-signature-joiner',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebapp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <Navbar />

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-1.5 text-xs text-gray-500 mb-4"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link
            href="/#directory"
            className="hover:text-[#414FA8] font-medium transition-colors"
          >
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">
            Photo and Signature Joiner
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Hero Card */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Govt Exam Ready (MPPEB, UPSSSC, Rajasthan High Court, Bihar SSC)
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Photo and Signature Joiner Online Free
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Merge your passport photo and handwritten signature into a single vertical slip under 50 KB (or custom target). Add candidate name and date of photo (DOP) banner with 1 click. Zero server upload, completely private.
              </p>
            </div>

            {/* Interactive Tool Component */}
            <PhotoAndSignatureJoinerTool />

            {/* Paired Exam Tools */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired Govt Exam Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/add-name-and-date-on-photo"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Name & Date on Photo →
                </Link>
                <Link
                  href="/tools/passport-photo-maker"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Passport Photo Maker →
                </Link>
                <Link
                  href="/tools/compress-image-to-50kb"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress to 50KB →
                </Link>
                <Link
                  href="/exams/ssc-photo-signature-resizer"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  SSC Photo & Sig Resizer →
                </Link>
              </div>
            </div>

            {/* Value Proposition Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Client-Side</span>
                  <span className="text-[11px] text-gray-500">Zero file upload to server</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Strictly Under 50 KB</span>
                  <span className="text-[11px] text-gray-500">Binary search JPEG optimizer</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Exam Portal Verified</span>
                  <span className="text-[11px] text-gray-500">MPPEB, UPSSSC, BSSC formats</span>
                </div>
              </div>
            </div>

            {/* In-depth Informational & SEO Guide Section */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-5 text-gray-700">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <BookOpen className="h-5 w-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Complete Guide: Merging Photo and Signature for Govt Exams
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-gray-600">
                <p>
                  Several Indian central and state recruitment recruitment boards—most notably{' '}
                  <strong className="text-gray-800">MP Vyapam (MP ESB / PEB)</strong>,{' '}
                  <strong className="text-gray-800">UPSSSC</strong>,{' '}
                  <strong className="text-gray-800">Rajasthan High Court</strong>, and{' '}
                  <strong className="text-gray-800">Bihar SSC (BSSC)</strong>—reject candidate application forms if the photograph and signature are uploaded as two separate image files. Instead, their registration guidelines mandate a combined template: a single JPG file where the photograph sits on top and the signature appears directly below it on a white background, strictly under 50 KB.
                </p>

                <div className="bg-[#F8FAFC] p-4 rounded border border-gray-200 space-y-2">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#414FA8]" />
                    Official Specifications by Recruitment Authority
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-700 font-semibold bg-gray-100/70">
                          <th className="py-2 px-3">Exam Board</th>
                          <th className="py-2 px-3">Layout Style</th>
                          <th className="py-2 px-3">File Size Limit</th>
                          <th className="py-2 px-3">Additional Rules</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-2 px-3 font-medium text-gray-800">MP Vyapam (ESB / PEB)</td>
                          <td className="py-2 px-3">Photo Top + Signature Bottom</td>
                          <td className="py-2 px-3 text-emerald-700 font-medium">Under 50 KB (or 200 KB)</td>
                          <td className="py-2 px-3">Name & Date of Photo (DOP) mandatory on photo</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium text-gray-800">UPSSSC (PET / Lekhpal)</td>
                          <td className="py-2 px-3">Photo Top + Full Hindi/English Name & Signature</td>
                          <td className="py-2 px-3 text-emerald-700 font-medium">Under 50 KB</td>
                          <td className="py-2 px-3">Signature below photo in running handwriting</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium text-gray-800">Rajasthan High Court</td>
                          <td className="py-2 px-3">Vertical Joined Slip</td>
                          <td className="py-2 px-3 text-emerald-700 font-medium">Under 50 KB</td>
                          <td className="py-2 px-3">Black ink signature on clean white paper</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium text-gray-800">Bihar SSC (BSSC)</td>
                          <td className="py-2 px-3">Combined Photo & Signature Slip</td>
                          <td className="py-2 px-3 text-emerald-700 font-medium">Under 50 KB</td>
                          <td className="py-2 px-3">Clear lighting without caps or tinted sunglasses</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm pt-2">
                  How to Join Your Photo & Signature in 4 Simple Steps:
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li>
                    <strong className="text-gray-800">Upload Both Files:</strong> Select your passport-size photo for the top section and your clear signature crop for the bottom.
                  </li>
                  <li>
                    <strong className="text-gray-800">Customize Ratio & Banner:</strong> Use the 75% photo / 25% signature ratio (standard) or adjust the slider. If required by your exam notification, tick &quot;Include Candidate Name & Date of Photo (DOP)&quot; and type your details.
                  </li>
                  <li>
                    <strong className="text-gray-800">Select File Size Constraint:</strong> Click on &quot;Under 50 KB&quot; (or 30 KB, 70 KB, 100 KB depending on your portal).
                  </li>
                  <li>
                    <strong className="text-gray-800">Download Ready File:</strong> Click &quot;Download Joined Slip&quot; to save the JPEG directly to your phone or computer.
                  </li>
                </ol>
              </div>
            </div>

            {/* Related Tools Section */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#414FA8]" />
                  Related Govt Exam & Image Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Section */}
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
