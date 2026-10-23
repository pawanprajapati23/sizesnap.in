import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PixelResizer } from '@/components/tool-ui/PixelResizer';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, Layers, ShoppingBag, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Image Resizer for E-Commerce (Amazon, Flipkart, Shopify) | SizeSnap',
  description:
    'Resize product images to exact pixel dimensions for Amazon (1000×1000), Flipkart, Meesho, and Shopify listings. Free online tool without blur or watermark.',
  keywords: [
    'product image resizer',
    'ecommerce photo resizer',
    'amazon product image size',
    'flipkart image dimensions',
    'resize photo to 1000x1000',
    'meesho product image resizer',
    'shopify image resizer online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/product-image-resizer',
  },
  openGraph: {
    title: 'Product Image Resizer Online Free | SizeSnap',
    description: 'Quickly resize e-commerce catalog photos to 1000x1000, 1600x1600, or custom pixels to meet marketplace upload requirements.',
    url: 'https://www.sizesnap.in/tools/product-image-resizer',
    type: 'website',
  },
};

const FAQS = [
  {
    question: 'What is the best image resolution for Amazon product listings?',
    answer:
      'Amazon recommends images of at least 1000 × 1000 pixels (and up to 1600 × 1600 pixels) in 1:1 square aspect ratio. This resolution enables the interactive mouse-over zoom feature on desktop and mobile.',
  },
  {
    question: 'What are Flipkart and Meesho product photo requirements?',
    answer:
      'Flipkart requires product images between 1100 × 1100 pixels and 2000 × 2000 pixels with pure white backgrounds. Meesho recommends square images (at least 500 × 500 pixels up to 1000 × 1000 pixels) with JPEG or PNG encoding.',
  },
  {
    question: 'Does resizing my product image stretch or distort its shape?',
    answer:
      'No. SizeSnap features an "Aspect Ratio Lock" toggle that prevents accidental stretching. You can also specify exact width and height or scale proportionally by percentage.',
  },
  {
    question: 'Will my catalog photos be stored on SizeSnap servers?',
    answer:
      'Never. All resizing operations execute strictly inside your local browser canvas. Your confidential upcoming launch photos and copyrighted catalog designs remain 100% private.',
  },
];

export default function ProductImageResizerPage() {
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
      { '@type': 'ListItem', position: 3, name: 'Product Image Resizer', item: 'https://www.sizesnap.in/tools/product-image-resizer' },
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
            <span className="text-gray-800 font-semibold">Product Image Resizer</span>
          </div>

          {/* Tool Container */}
          <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#414FA8] uppercase tracking-wider bg-[#EEF1FB] px-2 py-0.5 rounded">
                  Catalog Optimization Tool
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                  E-Commerce Product Image Resizer
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Resize your product images to exact pixel dimensions (1000×1000, 1600×1600, 1200×1200) for Amazon, Flipkart, Meesho, Myntra, and Shopify listings.
                </p>
              </div>
            </div>

            {/* Interactive Tool */}
            <div className="mt-4">
              <PixelResizer customTitle="Product Image Resizer" />
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Enables Amazon hover-zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Marketplace-compliant ratios</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero server upload privacy</span>
              </div>
            </div>
          </div>

          {/* Marketplace Dimension Table */}
          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs mb-6 space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Official Marketplace Dimension Standards
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Each online marketplace requires strict minimum resolutions to activate zoom functionality and pass automated catalog quality audits:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 border border-gray-200 font-semibold text-gray-800">Platform</th>
                      <th className="p-3 border border-gray-200 font-semibold text-gray-800">Recommended Pixels</th>
                      <th className="p-3 border border-gray-200 font-semibold text-gray-800">Aspect Ratio</th>
                      <th className="p-3 border border-gray-200 font-semibold text-gray-800">Max File Size</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="p-3 border border-gray-200 font-medium">Amazon</td>
                      <td className="p-3 border border-gray-200">1000 &times; 1000 to 1600 &times; 1600 px</td>
                      <td className="p-3 border border-gray-200">1:1 Square</td>
                      <td className="p-3 border border-gray-200">10 MB (JPEG/PNG)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-200 font-medium">Flipkart</td>
                      <td className="p-3 border border-gray-200">1100 &times; 1100 to 2000 &times; 2000 px</td>
                      <td className="p-3 border border-gray-200">1:1 Square</td>
                      <td className="p-3 border border-gray-200">5 MB (JPEG)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-200 font-medium">Meesho</td>
                      <td className="p-3 border border-gray-200">500 &times; 500 to 1000 &times; 1000 px</td>
                      <td className="p-3 border border-gray-200">1:1 Square</td>
                      <td className="p-3 border border-gray-200">4 MB (JPEG/PNG)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-200 font-medium">Shopify Store</td>
                      <td className="p-3 border border-gray-200">2048 &times; 2048 px</td>
                      <td className="p-3 border border-gray-200">1:1 Square</td>
                      <td className="p-3 border border-gray-200">20 MB (WebP/JPG)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Keyword Badges */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Amazon Product Image Resizer', 'Flipkart 1100x1100', '1000x1000 Photo Maker', 'Meesho Catalog Resizer', 'Shopify Product Photo Specs', 'Square Photo Resizer'].map((kw) => (
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
              <Link href="/tools/product-image-compressor" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Product Image Compressor</span>
                <span className="text-gray-500">Compress catalog image KB</span>
              </Link>
              <Link href="/tools/meesho-shipping-label-to-a4" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Meesho Label to A4</span>
                <span className="text-gray-500">Print 4 labels per page</span>
              </Link>
              <Link href="/tools/remove-background" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">AI Background Remover</span>
                <span className="text-gray-500">Pure white catalog background</span>
              </Link>
              <Link href="/tools/bulk-image-resizer" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Bulk Image Resizer</span>
                <span className="text-gray-500">Batch resize whole inventory</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
