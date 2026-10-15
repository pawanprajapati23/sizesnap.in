import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PassportPhotoMaker } from '@/components/tool-ui/PassportPhotoMaker';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';
import { FAQSchema, SoftwareAppSchema } from '@/components/SeoSchemas';
import AdsterraAd from '@/components/AdsterraAd';

export const metadata: Metadata = {
  title: 'Resize Image to 3.5cm x 4.5cm Online Free - 35x45mm Photo Maker | SizeSnap',
  description:
    'Resize image and photo to official 3.5 x 4.5 cm (35mm x 45mm) online for free. Compress to 20KB-50KB for SSC, UPSC, Indian Passport, and government exam forms.',
  keywords: [
    'resize image to 3.5cm x 4.5cm',
    'resize image 3.5cm 4.5cm',
    '3.5 x 4.5 cm photo converter',
    'photo resize 3.5 x 4.5 cm online',
    '35mm x 45mm photo resizer online',
    'passport photo size 3.5 x 4.5 cm in kb',
    'ssc photo 3.5 x 4.5 cm',
    'photo ko 3.5 x 4.5 cm me kaise convert kare',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/resize-image-3-5cm-4-5cm',
  },
  openGraph: {
    title: 'Resize Image to 3.5cm x 4.5cm Online Free - 35x45mm Photo Maker | SizeSnap',
    description:
      'Free online tool to resize photo to exact 3.5cm x 4.5cm (35mm x 45mm) dimensions and 20KB-50KB for Indian Passport, SSC, and UPSC forms.',
    url: 'https://www.sizesnap.in/tools/resize-image-3-5cm-4-5cm',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'passport-photo-maker',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'compress-image-between-20kb-to-50kb',
  'resize-image-pixel',
  'generate-signature',
];

const FAQS = [
  {
    q: 'How to resize an image to 3.5 cm x 4.5 cm online for free?',
    a: 'Upload your picture into SizeSnap. The preset is automatically locked to the official 3.5 × 4.5 cm passport ratio. Crop and center your face, adjust background if needed, and download your ready-to-upload photograph.',
  },
  {
    q: 'Photo ko 3.5cm x 4.5cm me kaise convert karein (फोटो को 3.5 x 4.5 सेमी कैसे बनाएं)?',
    a: 'SizeSnap par apni photo upload karein. 3.5 x 4.5 cm dimension pehle se set hai. Aap crop box adjust karke apna face 70%-80% frame me set karein aur "Download" par click karke turant save karein.',
  },
  {
    q: 'What is 3.5 cm x 4.5 cm in pixels at 300 DPI?',
    a: 'At 300 DPI (print resolution standard), 3.5 cm × 4.5 cm equals exactly 413 pixels (width) × 531 pixels (height). At 200 DPI, it equals 276 × 354 pixels.',
  },
  {
    q: 'Which exams require 3.5cm x 4.5cm photo dimensions?',
    a: 'Almost all Indian government exams mandate 3.5cm × 4.5cm: SSC (CGL, CHSL, MTS, GD Constable), UPSC CSE & OTR, Railway RRB, CTET, State PSCs, and Indian Passport Seva Kendra.',
  },
  {
    q: 'Is my photo private and secure?',
    a: '100% private. All cropping, resizing, and rendering occur locally inside your web browser. Your photo is never uploaded to any remote server.',
  },
];

export default function ResizeImage35cm45cmPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <>
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="SizeSnap 3.5cm x 4.5cm Photo Resizer"
        description="Free online tool to resize images to exact 3.5cm x 4.5cm (35mm x 45mm) dimensions and 20KB-50KB for Indian Passport, SSC, and UPSC forms."
        url="https://www.sizesnap.in/tools/resize-image-3-5cm-4-5cm"
      />

      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/image-tools" className="hover:text-[#414FA8] font-medium transition-colors">
              Image Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-800 font-semibold">Resize 3.5cm x 4.5cm</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">

              {/* Header Box */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/40 rounded">
                    35 mm × 45 mm Standard
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                    Govt Exam Verified
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  Resize Image to 3.5cm x 4.5cm Online Free
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  Crop and resize photos to the official 3.5 × 4.5 cm (35 × 45 mm) specification for SSC, UPSC, Indian Passport, and state exam portals. Add Name &amp; Date of photo (DOP) and export with single click.
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <Lock className="h-3 w-3" /> 100% Client-Side Private
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    <Zap className="h-3 w-3" /> 300 DPI Print Quality
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded">
                    <Shield className="h-3 w-3" /> Zero Watermark
                  </div>
                </div>
              </div>

              {/* Tool Engine */}
              <PassportPhotoMaker />

              {/* In-content Ad */}
              <div className="overflow-hidden rounded-[4px] border border-gray-100 bg-white p-2 shadow-xs flex justify-center">
                <AdsterraAd dataKey="3bd154ece61c60859c2b8242ae85b927" width={728} height={90} className="w-full hidden md:flex" />
                <AdsterraAd dataKey="f509bd7d24a58ce7a176067713ca61df" width={320} height={50} className="w-full md:hidden flex" />
              </div>

              {/* Educational Article Section */}
              <article className="bg-white p-5 sm:p-7 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 text-xs sm:text-sm leading-relaxed space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Understanding the 3.5cm x 4.5cm Passport Photograph Standard
                </h2>
                <p>
                  The <strong>3.5 cm × 4.5 cm (35 mm × 45 mm)</strong> ratio is the universal standard for identity
                  photographs across the Republic of India. From Indian Passport renewal at Passport Seva Kendras (PSK)
                  to competitive recruitment examinations conducted by central and state boards, candidate photos
                  must adhere strictly to this rectangular proportion.
                </p>

                <h3 className="text-sm font-bold text-gray-900 pt-2">
                  Official Portal Requirements for 3.5 × 4.5 cm Photos:
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Face Coverage:</strong> Face must occupy between 70% and 80% of the photograph.</li>
                  <li><strong>Background:</strong> Pure white or light plain background without patterns or shadows.</li>
                  <li><strong>Pose:</strong> Frontal facing, head centered, neutral expression, both ears visible.</li>
                  <li><strong>Accessories:</strong> Caps, dark glasses, or scarves obscuring facial features are prohibited.</li>
                </ul>
              </article>

              {/* FAQs Section */}
              <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-base sm:text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-gray-100">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">{faq.q}</h3>
                      <p className="text-xs text-gray-600 leading-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Tools */}
              <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-sm font-bold text-gray-800 mb-3">Related Image & Exam Tools</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedTools.map((t) => (
                    <ToolButton key={t.id} tool={t} />
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
    </>
  );
}
