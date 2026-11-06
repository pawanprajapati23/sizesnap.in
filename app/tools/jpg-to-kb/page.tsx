import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { KbCompressor } from '@/components/tool-ui/KbCompressor';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield, CheckCircle2, Sliders } from 'lucide-react';
import { KbTargetPills } from '@/components/KbTargetPills';

export const metadata: Metadata = {
  title: 'JPG to KB - Compress JPG Image File to Exact KB Size Online Free | SizeSnap',
  description:
    'Free online JPG to KB compressor. Reduce JPG image file size to exact KB (20KB, 50KB, 100KB, 200KB) for SSC, UPSC, IBPS, and government job portals. Fast, 100% private in browser.',
  keywords: [
    'jpg to kb',
    'jpg file compressor',
    'jpg image compress',
    'jpg image compressor',
    'jpg photo compressor',
    'compressed jpg',
    'compress jpg to kb',
    'jpg size reducer',
    'reduce jpg file size',
    'compress jpg image in kb',
    'photo compressor in kb',
    'jpg file size reducer to 50kb',
    'jpg compressor online free',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/jpg-to-kb',
  },
  openGraph: {
    title: 'JPG to KB - Compress JPG Image File to Exact KB Size Online Free | SizeSnap',
    description:
      'Compress JPG photo or signature to exact 20KB, 50KB, 100KB, or 200KB online. Fast, secure, and 100% offline.',
    url: 'https://www.sizesnap.in/tools/jpg-to-kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'jpeg-to-jpg',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'compress-image-to-100kb',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How does the JPG to KB compressor work?',
    a: 'SizeSnap uses an intelligent binary search compression engine that runs directly inside your browser. It adjusts the JPEG quantization matrices and pixel dimensions iteratively until your output file reaches your exact requested target (e.g. exactly 50KB or 20KB), without uploading your file to any cloud server.',
  },
  {
    q: 'Can I compress my JPG to an exact KB number like 20KB or 50KB?',
    a: 'Yes! You can choose popular presets (20KB, 40KB, 50KB, 100KB, 200KB) or enter any custom target KB number required by your exam or employment portal (such as SSC, UPSC, State PSCs, or Bank exams). SizeSnap guarantees the file will not exceed your limit.',
  },
  {
    q: 'Will my JPG photo lose clarity or become blurry?',
    a: 'SizeSnap is engineered to maximize visual fidelity. It prioritizes perceptual quality first, so your facial features, text documents, or signature lines stay sharp and legible while shedding unnecessary metadata and redundancy.',
  },
  {
    q: 'Why do portals require photos to be strictly under 50KB or 20KB?',
    a: 'Government and institutional recruitment servers handle millions of applicants concurrently. Limiting individual passport photographs to 20KB-50KB and signatures to 10KB-20KB keeps server bandwidth lightweight and database indexing lightning-fast.',
  },
  {
    q: 'Is it safe to compress Aadhaar, PAN card, or personal passport photos here?',
    a: 'Yes, 100% secure. SizeSnap processes your pictures locally using HTML5 Canvas and WebAssembly. Your documents and photographs are never sent over the internet and never saved to any database.',
  },
];

export default function JpgToKbPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/jpg-to-kb#webapp',
        name: 'SizeSnap JPG to KB Compressor',
        url: 'https://www.sizesnap.in/tools/jpg-to-kb',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Compress JPG images to exact KB size (20KB, 50KB, 100KB, 200KB)',
          'Smart iterative compression algorithm for peak clarity',
          'Automatic byte padding support to hit minimum KB constraints',
          '100% Client-side privacy with zero cloud file storage',
          'Free without watermarks or file limits',
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
            name: 'Image Compressor',
            item: 'https://www.sizesnap.in/#directory',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'JPG to KB',
            item: 'https://www.sizesnap.in/tools/jpg-to-kb',
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Compress JPG to Exact KB Size Online',
        description: 'Step-by-step instructions for reducing JPG image size to exact KB for online applications.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload JPG Image',
            text: 'Click "Select Image" or drag and drop your JPG or JPEG photo into the tool.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Choose Target KB Size',
            text: 'Select a standard preset (20KB, 50KB, 100KB, 200KB) or enter your exact custom target KB.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Download Compressed JPG',
            text: 'Click "Compress Image" and download your perfectly sized JPG file immediately.',
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
                Compress Image
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <li className="font-semibold text-gray-800">JPG to KB Compressor</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                JPG to KB - Compress JPG Image File to Exact KB Size
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Compress JPG, JPEG, and photo files to exact KB targets (20KB, 50KB, 100KB, 200KB) online for free. Guaranteed to pass exam portal size validators without quality loss.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-[4px] border border-gray-200 shadow-xs">
                <Sliders className="h-3.5 w-3.5 text-[#414FA8]" />
                <span>Exact KB Targeting</span>
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-[4px] border border-gray-200 shadow-xs">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Instant In-Browser Compression</span>
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-[4px] border border-gray-200 shadow-xs">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Client-Side Privacy</span>
              </span>
            </div>

            {/* Quick Target KB Presets Network */}
            <KbTargetPills type="image" activeSlug="jpg-to-kb" />

            {/* Tool Interactive Card */}
            <div className="bg-white rounded-[4px] border border-[#9AA3C8] shadow-xs p-4 sm:p-6">
              <React.Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading SizeSnap Compressor...</div>}>
                <KbCompressor initialTargetKb={50} title="Compress JPG to KB" showSeoContent={false} />
              </React.Suspense>
            </div>

            {/* In-depth SEO & Portal Guide */}
            <article className="bg-white rounded-[4px] border border-gray-200 shadow-xs p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Best Online JPG File Compressor & Size Reducer
                </h2>
                <p>
                  Whether applying for competitive examinations like <strong>SSC CGL, UPSC Civil Services, IBPS Bank PO/Clerk, Railway RRB, CTET, NEET</strong>, or submitting passport and visa forms, almost every recruitment portal has strict file size criteria for JPG images.
                </p>
                <p>
                  A photo taken with a modern smartphone typically ranges from <strong>3 MB to 8 MB</strong> (3000KB to 8000KB). When you try to upload this image to an official portal demanding a file size under 50KB or 20KB, the upload fails immediately with errors like <em>&quot;File size must be between 20KB and 50KB&quot;</em>.
                </p>
                <p>
                  SizeSnap’s <strong>JPG to KB</strong> tool solves this challenge by mathematically recalculating the image matrix to meet your required KB specification while maintaining full readability of your facial features and documents.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900">
                  Standard JPG File Size Specifications for Govt Portals
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-gray-200 rounded">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                      <tr>
                        <th className="p-2.5 border-b border-gray-200">Exam / Portal Name</th>
                        <th className="p-2.5 border-b border-gray-200">Photograph Required</th>
                        <th className="p-2.5 border-b border-gray-200">Signature Required</th>
                        <th className="p-2.5 border-b border-gray-200">Acceptable Format</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="p-2.5 font-medium text-gray-800">SSC (CGL, CHSL, MTS, GD)</td>
                        <td className="p-2.5">20 KB – 50 KB</td>
                        <td className="p-2.5">10 KB – 20 KB</td>
                        <td className="p-2.5">JPG / JPEG</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-gray-800">UPSC (CSE, CDS, NDA, OTR)</td>
                        <td className="p-2.5">20 KB – 300 KB</td>
                        <td className="p-2.5">20 KB – 300 KB</td>
                        <td className="p-2.5">JPG / JPEG</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-gray-800">IBPS / SBI Bank Exams</td>
                        <td className="p-2.5">20 KB – 50 KB</td>
                        <td className="p-2.5">10 KB – 20 KB</td>
                        <td className="p-2.5">JPG / JPEG</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-gray-800">Railway RRB (NTPC, ALP, Group D)</td>
                        <td className="p-2.5">30 KB – 70 KB</td>
                        <td className="p-2.5">30 KB – 70 KB</td>
                        <td className="p-2.5">JPG / JPEG</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-gray-800">PAN Card (NSDL / UTIITSL)</td>
                        <td className="p-2.5">Under 50 KB (200 DPI)</td>
                        <td className="p-2.5">Under 20 KB (200 DPI)</td>
                        <td className="p-2.5">JPG / JPEG</td>
                      </tr>
                    </tbody>
                  </table>
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
              <h3 className="text-sm font-bold text-gray-900">Related Tools</h3>
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
