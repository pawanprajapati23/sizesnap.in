import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { ImageUpscalerTool } from '@/components/ImageUpscalerTool';
import { ALL_TOOLS } from '@/data/tools';
import {
  ChevronRight,
  Printer,
  Shield,
  Zap,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { FAQSchema, SoftwareAppSchema, HowToSchema } from '@/components/SeoSchemas';

export const metadata: Metadata = {
  title: '200 DPI Converter Online Free - Change Image to 200 DPI (UPSC / SSC) | SizeSnap',
  description:
    'Free online 200 DPI converter. Change image resolution and DPI metadata to exact 200 DPI for UPSC, SSC, state PSC, and government exam document uploads. 100% client-side private.',
  keywords: [
    '200 dpi converter',
    'dpi200',
    '200 dpi',
    '200 dpi image converter',
    'change image to 200 dpi',
    'convert image to 200 dpi online',
    '200 dpi photo resizer',
    'upsc 200 dpi scan',
    'ssc 200 dpi converter',
    'how to make 200 dpi image',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/200-dpi-converter',
  },
  openGraph: {
    title: '200 DPI Converter Online Free - Change Image to 200 DPI | SizeSnap',
    description:
      'Convert image to exact 200 DPI online for UPSC, SSC, and government portals. Zero file upload, 100% private & instant.',
    url: 'https://www.sizesnap.in/tools/200-dpi-converter',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '200 DPI Converter Online Free | SizeSnap',
    description:
      'Fast, free client-side tool to change photo resolution to 200 DPI for UPSC and SSC applications.',
  },
};

const RELATED_SLUGS = [
  'image-upscaler',
  'passport-photo-maker',
  'pan-card-photo-resizer',
  'reduce-image-size-in-kb',
  'resize-image-pixel',
  'image-to-pdf',
];

const FAQS = [
  {
    q: 'Why do UPSC and SSC exam notifications mandate 200 DPI for scanned documents?',
    a: 'Official recruitment portals like UPSC (Union Public Service Commission) and SSC specify scanning at 200 DPI because it delivers the optimal balance between razor-sharp ink legibility and a manageable file size (under 200KB or 50KB). Scanning at 72 DPI produces blurry text, while 600 DPI creates massive files that fail upload limits.',
  },
  {
    q: 'How does SizeSnap change image DPI to 200 without degrading quality?',
    a: 'SizeSnap rewrites the standard JFIF APP0 binary header of your JPEG file, embedding the exact 200 DPI horizontal and vertical density values. The pixel matrix and colors are untouched unless you optionally choose 2x or 4x high-resolution upscaling.',
  },
  {
    q: 'Can I verify the 200 DPI metadata after downloading?',
    a: 'Yes. On Windows, right-click your downloaded image, select "Properties" → "Details" tab, and verify horizontal and vertical resolution show 200 dpi. On macOS, open the file in Preview and press Cmd+I ("Image Inspector"). You can also use SizeSnap\'s "Image Metadata Viewer" tool.',
  },
  {
    q: 'Is my scanned certificate or ID card uploaded to any server?',
    a: 'No. All image processing and JFIF header modification occur 100% inside your local web browser via JavaScript. Your private marksheets, Aadhaar card, and identity documents never touch an external server.',
  },
  {
    q: 'What is the difference between 200 DPI and 300 DPI?',
    a: 'DPI (Dots Per Inch) determines print density. 200 DPI is the standard for online screen verification and exam document scans. 300 DPI is standard for physical high-gloss photo printing and passport/visa biometrics. You can select either 200 DPI or 300 DPI using the toggle buttons above.',
  },
];

const HOW_TO_STEPS = [
  'Click "Choose Image" or drag-and-drop your JPG, PNG, or WebP photo or scanned document.',
  'Verify that "200 DPI" is selected under the Target Print DPI section.',
  'Choose your desired resolution scaling (1x for original dimensions, 2x for enhanced quality).',
  'Click "Download Image" to save your calibrated 200 DPI JPEG file instantly.',
];

export default function Dpi200ConverterPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Structured Data */}
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="SizeSnap 200 DPI Converter"
        description="Free online 200 DPI converter to adjust image resolution and DPI metadata for UPSC, SSC, and competitive exam document uploads."
        url="https://www.sizesnap.in/tools/200-dpi-converter"
      />
      <HowToSchema
        name="How to Convert Image to 200 DPI Online"
        description="Step-by-step instructions to change photo or scanned document DPI to 200 for UPSC and SSC forms."
        stepByStep={HOW_TO_STEPS}
      />

      <Navbar />

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
          <span className="text-gray-800 font-semibold">200 DPI Converter</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-[#EEF1FB] text-[#414FA8] text-[11px] font-bold rounded uppercase tracking-wide">
                  UPSC &amp; SSC Mandatory Spec
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded border border-emerald-200">
                  Exact JFIF 200 DPI Header
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                200 DPI Converter Online Free
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Convert image resolution and DPI metadata to <strong>exact 200 DPI</strong> for UPSC CSE, OTR, SSC
                (CGL, CHSL), State PSC, and government application portals. 100% browser-side private with zero file uploads.
              </p>
            </div>

            {/* Interactive Upscaler / DPI Tool configured to 200 DPI */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <ImageUpscalerTool initialDpi={200} />
            </div>

            {/* UPSC & SSC DPI Guideline Card */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#414FA8]" />
                Why Government Exam Portals Require 200 DPI Scanning
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                When filling online applications for UPSC OTR, SSC CGL/CHSL, or State Public Service Commissions, the official
                notifications specify: <em>&quot;Set the scanner resolution to a minimum of 200 DPI (dots per inch) in True Color.&quot;</em>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs">
                  <div className="font-bold text-gray-900 mb-1">72 DPI (Standard Mobile)</div>
                  <div className="text-gray-500">Too low for official print verification; rejected due to pixelation on admit cards.</div>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded border border-[#414FA8]/30 text-xs">
                  <div className="font-bold text-[#414FA8] mb-1">200 DPI (Official Standard)</div>
                  <div className="text-gray-600 font-medium">Optimal sharpness with compact file size (&lt;50KB-200KB). Guaranteed portal acceptance.</div>
                </div>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs">
                  <div className="font-bold text-gray-900 mb-1">300 DPI+ (Print High-Res)</div>
                  <div className="text-gray-500">Ideal for physical photo studio prints, but file sizes exceed exam portal limits.</div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#414FA8]" />
                How to Change Photo Resolution to 200 DPI
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {HOW_TO_STEPS.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="font-semibold text-gray-800">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EEF1FB] flex items-center justify-center text-[#414FA8] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">100% Client-Side Privacy</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Your certificates and marksheets never touch any external server. All DPI adjustments happen in-browser.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Valid JFIF Header</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Proper density flags written to image metadata to pass automated exam portal validator checks.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Instant Download</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Immediate processing with zero queues, watermarks, or sign-up requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools Grid */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                Related Image &amp; Exam Tools
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="p-3 border border-gray-200 rounded-[4px] hover:border-[#414FA8] hover:shadow-xs transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-800 group-hover:text-[#414FA8] block mb-1">
                        {tool.name}
                      </span>
                      <span className="text-[11px] text-gray-500 line-clamp-2">
                        {tool.shortDescription}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#414FA8] mt-2 flex items-center gap-1">
                      Open Tool <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Frequently Asked Questions (200 DPI Converter)
                </h2>
              </div>
              <div className="space-y-4 divide-y divide-gray-100">
                {FAQS.map((faq, index) => (
                  <div key={index} className={index > 0 ? 'pt-4' : ''}>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5">{faq.q}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
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
