import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { HeicToJpgConverter } from '@/components/tool-ui/HeicToJpgConverter';
import { ALL_TOOLS } from '@/data/tools';
import {
  ChevronRight,
  HelpCircle,
  Zap,
  Shield,
  FileCheck,
  CheckCircle2,
  Smartphone,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Convert HEIC to JPG Online Free (iPhone .heic to .jpg) | SizeSnap',
  description:
    'Convert Apple iPhone HEIC and HEIF photos to high quality JPG online for free. Fix rejected iPhone photos on SSC, UPSC, NSDL, and job portals. 100% private in browser with zero server uploads.',
  keywords: [
    'heic to jpg',
    'convert heic to jpg',
    'heic to jpg converter',
    'heic to jpg online free',
    'iphone photo to jpg',
    'convert heic to jpg online',
    'heif to jpg',
    'apple heic to jpg converter',
    'iphone image to jpg',
    'convert heic to jpeg',
    'change heic to jpg',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/heic-to-jpg',
  },
  openGraph: {
    title: 'Convert HEIC to JPG Online Free (iPhone .heic to .jpg) | SizeSnap',
    description:
      'Instantly convert iPhone HEIC & HEIF photos to standard JPG format. Fix portal rejection errors with 100% browser-side privacy. Batch ZIP download supported.',
    url: 'https://www.sizesnap.in/tools/heic-to-jpg',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert HEIC to JPG Online Free (iPhone to JPG) | SizeSnap',
    description:
      'Batch convert Apple iPhone .heic photos to universally supported .jpg format in your browser. 100% client-side private.',
  },
};

const RELATED_SLUGS = [
  'jpeg-to-jpg',
  'jpg-to-kb',
  'png-to-jpg',
  'reduce-image-size-in-kb',
  'pan-card-photo-resizer',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'What is a HEIC file and why does my iPhone save photos in this format?',
    a: 'HEIC (High Efficiency Image Container) is Apple\'s default photo format introduced in iOS 11. It uses advanced HEVC (H.265) compression to store higher dynamic range and vibrant colors at roughly half the file size of an equivalent JPEG. While great for conserving iPhone storage, most websites, Windows PCs, and government portals do not support it natively.',
  },
  {
    q: 'Why do Indian government job and exam portals reject HEIC photos?',
    a: 'Government portals like SSC, UPSC, IBPS, State PSCs, NSDL, and college admission sites use legacy web servers and verification scripts that strictly accept only standard ".jpg" or ".jpeg" formats. When you attempt to upload an iPhone .heic file, the portal shows an error such as "File format not supported" or "Invalid image file". SizeSnap converts your .heic into compliant .jpg in seconds.',
  },
  {
    q: 'Does converting HEIC to JPG decrease image quality?',
    a: 'No. SizeSnap uses WebAssembly-powered decoding to render the full color spectrum and high-resolution details of your Apple photo. Our default quality setting is 90% (which preserves sharpness and color balance while creating a lightweight JPG). You can also slide the quality to 100% for maximum lossless output.',
  },
  {
    q: 'Are my private iPhone photos uploaded to any external server?',
    a: 'Never. SizeSnap operates 100% client-side inside your web browser. The decoding and encoding take place locally on your computer or mobile device via WebAssembly and Canvas. Your personal family photos, ID proofs, and documents never leave your device.',
  },
  {
    q: 'How can I stop my iPhone from taking HEIC photos in the future?',
    a: 'On your iPhone or iPad, go to Settings > Camera > Formats, and switch the option from "High Efficiency" to "Most Compatible". Your phone will then automatically save future camera photos as standard JPEGs. However, for all photos already taken in HEIC, use SizeSnap to batch convert them.',
  },
  {
    q: 'Can I convert multiple HEIC photos at once and download them as a ZIP?',
    a: 'Yes! You can drag and drop up to 50 HEIC photos at once. Click "Convert to JPG" and then click "Download All as ZIP" to get all converted images neatly bundled into a single file.',
  },
];

export default function HeicToJpgPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/heic-to-jpg#webapp',
        name: 'SizeSnap HEIC to JPG Converter',
        url: 'https://www.sizesnap.in/tools/heic-to-jpg',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Convert Apple iPhone .heic and .heif images to standard .jpg format',
          'Client-side WebAssembly conversion with zero cloud uploads',
          'Batch convert multiple HEIC files simultaneously',
          '1-Click bulk ZIP download',
          'Adjustable JPEG compression quality slider',
          '100% free with no file size limits or watermarks',
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
            name: 'Image Tools',
            item: 'https://www.sizesnap.in/#directory',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'HEIC to JPG',
            item: 'https://www.sizesnap.in/tools/heic-to-jpg',
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Convert Apple iPhone HEIC Photos to JPG Online',
        description: 'Convert .heic photos to standard .jpg format in 3 simple steps.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload HEIC Photos',
            text: 'Drag and drop your iPhone .heic or .heif photos into the converter box or click Select HEIC Photos.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Adjust Quality (Optional)',
            text: 'Leave at recommended 90% quality or use the slider to choose between smaller file size and maximum quality.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Download JPG Images',
            text: 'Click Convert All to JPG and download individual JPG files or download all files at once as a single ZIP.',
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
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">HEIC to JPG</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-[#EEF1FB] text-[#414FA8] text-[11px] font-bold rounded uppercase tracking-wide">
                  iPhone &amp; iPad Compatible
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded border border-emerald-200">
                  100% Client-Side Privacy
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Convert HEIC to JPG Online Free
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Convert Apple iPhone <strong>.heic</strong> and <strong>.heif</strong> photos to standard{' '}
                <strong>.jpg</strong> format. Solve upload rejections on SSC, UPSC, State Sarkari jobs, and university admission portals.
                Zero server upload — converted instantly in your browser.
              </p>
            </div>

            {/* Interactive HEIC to JPG Tool */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <HeicToJpgConverter />
            </div>

            {/* Why Portals Reject HEIC Guide */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Why Do Indian Portals Reject iPhone HEIC Photos?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="p-3.5 bg-gray-50 rounded border border-gray-200 space-y-1.5">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-gray-600" /> Apple HEIC Format
                  </h3>
                  <p>
                    Since iOS 11, Apple saves photos in High Efficiency Image Container (HEIC) to halve file size on iPhones. However, Windows PCs and older web servers cannot open or preview HEIC without specialized codecs.
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50 rounded border border-gray-200 space-y-1.5">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" /> Portal Compatibility (JPG)
                  </h3>
                  <p>
                    Recruitment portals (UPSC, SSC, Police, Railway, IBPS) only permit files ending in <code className="bg-white px-1 py-0.5 rounded font-bold text-[#414FA8]">.jpg</code>. Uploading an HEIC results in an instant &quot;Invalid File Type&quot; failure.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#414FA8]" />
                How to Convert iPhone HEIC Photos to JPG in 3 Simple Steps
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                <li>
                  <strong>Select or Drag HEIC Photos:</strong> Drop your photos from iPhone, Mac, or Windows into the dropzone above.
                </li>
                <li>
                  <strong>Set Desired Quality:</strong> Default 90% provides the optimal balance of sharp photo details and small file size.
                </li>
                <li>
                  <strong>Download as JPG or ZIP:</strong> Click &quot;Convert All to JPG&quot; and download individual files or the complete batch as a ZIP archive.
                </li>
              </ol>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EEF1FB] flex items-center justify-center text-[#414FA8] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">100% Client-Side Private</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Processed entirely inside your browser using WebAssembly. Your photos never touch any server.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Batch Convert up to 50</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Convert multiple HEIC files in parallel and download them in a single ZIP bundle with one click.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Free Forever</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    No sign-up, no hidden fees, no watermarks, and no annoying restrictions.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                Related Document &amp; Image Converters
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

            {/* FAQ Section */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Frequently Asked Questions (HEIC to JPG)
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
