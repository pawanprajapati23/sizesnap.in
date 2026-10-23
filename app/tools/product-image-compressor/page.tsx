import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KbCompressor } from '@/components/tool-ui/KbCompressor';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, Gauge, FileCheck2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Image Compressor for E-Commerce (Amazon, Flipkart, Shopify) | SizeSnap',
  description:
    'Compress product catalog images to under 500KB or 1MB without losing sharpness or texture. Optimize loading speeds for Amazon, Flipkart, and Shopify stores.',
  keywords: [
    'product image compressor',
    'ecommerce image optimizer',
    'compress product image for amazon',
    'flipkart image compressor',
    'compress photo under 500kb',
    'shopify image compressor online',
    'catalog image size reducer',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/product-image-compressor',
  },
  openGraph: {
    title: 'Product Image Compressor Online Free | SizeSnap',
    description: 'Compress e-commerce product photos to exact KB limits while preserving fabric textures, fine details, and true colors.',
    url: 'https://www.sizesnap.in/tools/product-image-compressor',
    type: 'website',
  },
};

const FAQS = [
  {
    question: 'Why should I compress product images for my online store?',
    answer:
      'Large uncompressed photos (3MB to 8MB) cause high page load latency, which increases bounce rates and reduces conversions. Compressing product images to 300KB–500KB ensures lightning-fast loading on mobile 4G/5G networks while keeping product details razor sharp.',
  },
  {
    question: 'What is the maximum allowed file size on Amazon and Flipkart?',
    answer:
      'Amazon allows product images up to 10 MB (JPEG, TIFF, PNG, or GIF). However, Amazon algorithms prefer files under 2 MB for faster CDN distribution. Flipkart recommends JPEG images strictly under 5 MB.',
  },
  {
    question: 'Does this compressor blur fabric patterns or serial numbers?',
    answer:
      'No. SizeSnap uses an adaptive chrominance and luminance quantization engine that preserves high-contrast edges (stitching, text, serial numbers, labels) while eliminating redundant color data.',
  },
  {
    question: 'Are my brand photos secure during compression?',
    answer:
      'Yes, 100%. All compression executes directly inside your browser engine. No files are transmitted to external cloud servers, preventing image leaks before official launch dates.',
  },
];

export default function ProductImageCompressorPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.sizesnap.in' },
      { '@type': 'ListItem', position: 2, name: 'E-commerce Tools', item: 'https://www.sizesnap.in/ecommerce-tools' },
      { '@type': 'ListItem', position: 3, name: 'Product Image Compressor', item: 'https://www.sizesnap.in/tools/product-image-compressor' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
              <ArrowLeft className="h-3.5 w-3.5" /> All Tools
            </Link>
            <span>/</span>
            <Link href="/ecommerce-tools" className="hover:text-[#414FA8]">
              E-commerce Tools
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold">Product Image Compressor</span>
          </div>

          {/* Tool Container */}
          <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#414FA8] uppercase tracking-wider bg-[#EEF1FB] px-2 py-0.5 rounded">
                  E-Commerce Performance Tool
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                  E-Commerce Product Image Compressor
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Compress high-resolution product photos to under 500KB or custom KB limits. Increase Shopify and marketplace conversion rates with fast-loading images.
                </p>
              </div>
            </div>

            {/* Interactive Tool */}
            <div className="mt-4">
              <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading compressor...</div>}>
                <KbCompressor title="Product Image Compressor" initialTargetKb={500} />
              </Suspense>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Boosts store loading speed</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Retains fabric &amp; text sharpness</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>100% In-Browser Privacy</span>
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs mb-6 space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Why Faster Product Images Mean Higher E-Commerce Sales
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Google and e-commerce platforms heavily penalize slow-loading product pages. A 1-second delay in mobile page load time can reduce conversions by up to 20%. By compressing heavy RAW or DSLR product photos down to <strong>300 KB – 500 KB</strong>, you ensure that shoppers on smartphones can instantly swipe through product galleries without buffering or lagging.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                How to Optimize Product Images on SizeSnap
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 leading-relaxed">
                <li><strong>Upload Catalog Photo:</strong> Drag and drop your JPG, PNG, or WebP product image into the box above.</li>
                <li><strong>Set Target KB:</strong> Enter your marketplace ceiling (e.g., 500 KB for Shopify, 200 KB for quick mobile galleries).</li>
                <li><strong>Download Optimized JPG:</strong> Click Compress. SizeSnap automatically balances file weight against clarity, delivering a crystal-clear file ready to upload.</li>
              </ol>
            </div>

            {/* Keyword Pills */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Popular Keywords</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Product Image Compressor', 'Compress Amazon Photos', 'Shopify Speed Optimization', 'Compress Image Under 500KB', 'Flipkart Photo Shrink', 'Fast Loading Product Gallery'].map((kw) => (
                  <span key={kw} className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">{faq.question}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-white p-5 rounded-[4px] border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
              Related E-Commerce Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <Link href="/tools/product-image-resizer" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Product Image Resizer</span>
                <span className="text-gray-500">1000x1000 marketplace pixels</span>
              </Link>
              <Link href="/tools/meesho-shipping-label-to-a4" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Meesho Label to A4</span>
                <span className="text-gray-500">Crop 4 labels per sheet</span>
              </Link>
              <Link href="/tools/remove-background" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">AI Background Remover</span>
                <span className="text-gray-500">Pure white background</span>
              </Link>
              <Link href="/tools/bulk-image-resizer" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Bulk Image Resizer</span>
                <span className="text-gray-500">Resize 50+ photos at once</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
