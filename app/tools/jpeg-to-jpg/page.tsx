import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { JpegToJpgConverter } from '@/components/tool-ui/JpegToJpgConverter';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield, FileCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Convert JPEG to JPG Online Free (Instant .jpeg to .jpg) | SizeSnap',
  description:
    'Convert JPEG to JPG format online for free. Fix rejected .jpeg and .jfif files for official portals (SSC, UPSC, Police, IBPS, NSDL) with 100% loss-free clarity. Batch download, 100% private in browser.',
  keywords: [
    'convert jpeg to jpg',
    'jpeg to jpg',
    'jpeg to jpg convert',
    'convert jpeg to jpg format',
    'converter jpeg',
    'jpg file converter',
    'jpg image converter',
    'change image format to jpg',
    'jfif to jpg',
    'jpeg to jpg converter online',
    'change jpeg to jpg online free',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/jpeg-to-jpg',
  },
  openGraph: {
    title: 'Convert JPEG to JPG Online Free (Instant .jpeg to .jpg) | SizeSnap',
    description:
      'Instantly change .jpeg and .jfif files to standard .jpg format for exam & job portals without quality loss. Free, client-side, zero upload.',
    url: 'https://www.sizesnap.in/tools/jpeg-to-jpg',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'jpg-to-kb',
  'png-to-jpg',
  'reduce-image-size-in-kb',
  'passport-photo-maker',
  'compress-image',
  'image-to-pdf',
];

const FAQS = [
  {
    q: 'What is the difference between JPEG and JPG?',
    a: 'Technically, there is zero difference in image data or compression between JPEG and JPG. Both use the exact same Joint Photographic Experts Group raster compression algorithm. The only difference is the file extension: older Windows systems (MS-DOS) required 3-letter extensions (.jpg), whereas Macintosh and Unix systems used 4 letters (.jpeg). Today, modern systems treat them identically, but rigid upload portals still specifically demand .jpg.',
  },
  {
    q: 'Why do government job and exam portals reject .jpeg files?',
    a: 'Many official submission systems (such as SSC, UPSC, State PSCs, IBPS, and University admissions) use rigid file verification scripts that specifically check if the uploaded filename ends with ".jpg". If your phone or camera saved the file as ".jpeg" or ".jfif", the portal throws an error like "Only .JPG format allowed". SizeSnap standardizes the file header and extension to .jpg so your application uploads without errors.',
  },
  {
    q: 'Does converting JPEG to JPG degrade picture quality?',
    a: 'No. When converting with SizeSnap, quality is preserved at up to 100% loss-free precision. Your original pixels, sharpness, and clarity remain intact without visible compression artifacts.',
  },
  {
    q: 'Can I convert .jfif and .png files to .jpg as well?',
    a: 'Yes! Windows often downloads images from Google Chrome with the .jfif extension. SizeSnap automatically recognizes .jfif, .jpeg, .png, and .webp files and converts them into standardized .jpg format in seconds.',
  },
  {
    q: 'Is it safe to convert my private ID documents and passport photo here?',
    a: '100% safe. Unlike traditional conversion websites, SizeSnap does all processing locally inside your device using HTML5 Canvas API. Your photos and sensitive ID proofs are never uploaded to any server or third party.',
  },
];

export default function JpegToJpgPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/jpeg-to-jpg#webapp',
        name: 'SizeSnap JPEG to JPG Converter',
        url: 'https://www.sizesnap.in/tools/jpeg-to-jpg',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Convert .jpeg and .jfif images to standard .jpg format',
          'Instant client-side canvas conversion with zero cloud uploads',
          'Batch convert multiple JPEG files simultaneously',
          '1-Click bulk ZIP download',
          'Adjustable JPEG quality slider (up to 100% lossless)',
          '100% free with no daily limits or watermarks',
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
            name: 'JPEG to JPG',
            item: 'https://www.sizesnap.in/tools/jpeg-to-jpg',
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Convert JPEG to JPG Online Free',
        description: 'Step-by-step guide to converting JPEG and JFIF files to standard JPG format for portal uploads.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload JPEG Photos',
            text: 'Drag and drop your .jpeg, .jfif, or image files into the upload box or click "Select JPEG Images".',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Set Desired Quality',
            text: 'Leave quality at 95% for maximum clarity, or adjust down if you also need smaller file sizes.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Convert & Download',
            text: 'Click "Convert All to .JPG" to process all images instantly in your browser, then download individually or as a single ZIP file.',
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
    <div className="min-h-screen bg-[#F4F6F9] text-gray-800 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-xs text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#414FA8] transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <li>
              <Link href="/#directory" className="hover:text-[#414FA8] transition-colors">
                Image Tools
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <li className="font-semibold text-gray-800">JPEG to JPG Converter</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Convert JPEG to JPG Online Free
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Instantly convert <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-semibold">.jpeg</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-semibold">.jfif</code> photos into standard <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800 font-semibold">.jpg</code> format. Solves portal validation rejections with 100% local browser security.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-[4px] border border-gray-200 shadow-xs">
                <FileCheck className="h-3.5 w-3.5 text-[#414FA8]" />
                <span>Fixes &quot;Only .JPG&quot; Errors</span>
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-[4px] border border-gray-200 shadow-xs">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Instant Local Conversion</span>
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-[4px] border border-gray-200 shadow-xs">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Browser Privacy</span>
              </span>
            </div>

            {/* Tool Interactive Card */}
            <div className="bg-white rounded-[4px] border border-[#9AA3C8] shadow-xs p-4 sm:p-6">
              <JpegToJpgConverter />
            </div>

            {/* In-depth SEO & Portal Guide */}
            <article className="bg-white rounded-[4px] border border-gray-200 shadow-xs p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Why Do Portals Demand .JPG Instead of .JPEG?
                </h2>
                <p>
                  If you have ever tried applying for government recruitments (such as SSC CGL, CHSL, UPSC Civil Services, State Police, Railway RRB, or IBPS Bank exams), you may have encountered the frustrating error: <em>&quot;Invalid image file format. Only .jpg files are allowed.&quot;</em>
                </p>
                <p>
                  While <strong>JPEG</strong> and <strong>JPG</strong> are scientifically identical image encoding formats developed by the Joint Photographic Experts Group, many backend form validation scripts rely on strict file-extension patterns (e.g., regex checking strictly for <code>\.jpg$</code>). If your smartphone, digital camera, or image editor exported your photograph with the four-letter extension <code>.jpeg</code>, the server rejects it.
                </p>
                <p>
                  SizeSnap solves this instantly. By rendering your image through client-side HTML5 canvas technology, it generates a standard JPEG stream with the exact <code>image/jpeg</code> MIME type and the universally compliant <code>.jpg</code> extension.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900">
                  Key Benefits of Converting with SizeSnap
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Loss-Free Quality
                    </h4>
                    <p className="text-xs text-gray-600">
                      Preserve facial clarity, signature strokes, and text sharp without aggressive lossy compression.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> JFIF & PNG Support
                    </h4>
                    <p className="text-xs text-gray-600">
                      Also converts confusing Windows .jfif files and transparent PNGs to clean .jpg in one click.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Batch Processing & ZIP
                    </h4>
                    <p className="text-xs text-gray-600">
                      Convert dozens of images simultaneously and download them all bundled into a single ZIP archive.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Absolute Data Privacy
                    </h4>
                    <p className="text-xs text-gray-600">
                      All calculations execute strictly inside your web browser. Zero files are sent across the web.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQs Section */}
              <section className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                  Frequently Asked Questions (FAQ)
                </h3>
                <div className="space-y-3">
                  {FAQS.map((faq, i) => (
                    <details
                      key={i}
                      className="group border border-gray-200 rounded-[4px] p-3 [&_summary::-webkit-details-marker]:none bg-white"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900 font-semibold text-xs sm:text-sm">
                        <span>{faq.q}</span>
                        <span className="text-gray-400 group-open:-rotate-180 transition-transform duration-200">
                          ▾
                        </span>
                      </summary>
                      <p className="mt-2 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            </article>

            {/* Related Tools */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Related Image & Compressor Tools</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedTools.map((tool) => (
                  <ToolButton key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
