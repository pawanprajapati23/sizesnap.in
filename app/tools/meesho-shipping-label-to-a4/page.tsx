import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShippingLabelToA4Tool } from '@/components/tool-ui/ShippingLabelToA4Tool';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, Scissors, Printer, FileCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meesho Shipping Label to A4 – Print 4 Labels Per Page Free | SizeSnap',
  description:
    'Crop and arrange Meesho shipping labels to print 4 per A4 page. Save paper and ink for Meesho supplier orders without barcode distortion. 100% private.',
  keywords: [
    'meesho shipping label to a4',
    'meesho label crop 4 in 1',
    'print 4 meesho labels on one a4',
    'meesho shipping label resizer',
    'meesho supplier label crop',
    'crop meesho label pdf',
    'meesho barcode print a4',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/meesho-shipping-label-to-a4',
  },
  openGraph: {
    title: 'Meesho Shipping Label to A4 – Free 4-in-1 Label Arranger | SizeSnap',
    description: 'Save 75% printing costs by arranging 4 Meesho shipping labels onto a single A4 paper with cut guides.',
    url: 'https://www.sizesnap.in/tools/meesho-shipping-label-to-a4',
    type: 'website',
  },
};

const FAQS = [
  {
    question: 'How do I print 4 Meesho shipping labels on one A4 sheet?',
    answer:
      'Download your bulk shipping label PDF from the Meesho Supplier Panel. Upload it to SizeSnap Meesho Shipping Label to A4 tool, select the "4 Labels per Page (2x2 Grid)" layout, and click "Generate A4 PDF". Download and print at 100% scale.',
  },
  {
    question: 'Will courier partners (Delhivery, Shadowfax, Xpressbees) scan the resized barcode?',
    answer:
      'Yes, 100%. SizeSnap scales labels proportionally using vector PDF algorithms. Barcodes, customer addresses, tracking IDs, and QR codes remain crystal clear and scan instantly on handheld PDA scanners.',
  },
  {
    question: 'What printer settings should I use when printing on A4 paper?',
    answer:
      'In your printer dialog, always select "Actual Size" or "Scale: 100%". Do NOT use "Fit to Page", as that may slightly stretch barcodes and cause scanning delays during pickup.',
  },
  {
    question: 'Are my customer details and order invoices safe on SizeSnap?',
    answer:
      'Absolutely. All PDF cropping and merging runs 100% client-side inside your browser engine. Your customer names, phone numbers, delivery addresses, and price invoices are never uploaded to any external server.',
  },
];

export default function MeeshoLabelToA4Page() {
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
      { '@type': 'ListItem', position: 3, name: 'Meesho Shipping Label to A4', item: 'https://www.sizesnap.in/tools/meesho-shipping-label-to-a4' },
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
            <span className="text-gray-800 font-semibold">Meesho Shipping Label to A4</span>
          </div>

          {/* Tool Container */}
          <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#414FA8] uppercase tracking-wider bg-[#EEF1FB] px-2 py-0.5 rounded">
                  Meesho Seller Tool
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                  Meesho Shipping Label to A4 Sheet Converter
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Crop and arrange Meesho shipping labels into 4 per A4 sheet with cutting guidelines. Save 75% on thermal paper and A4 sheets.
                </p>
              </div>
            </div>

            {/* Interactive Tool */}
            <div className="mt-4">
              <ShippingLabelToA4Tool isMeesho={true} />
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Smart cutting guide lines</span>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero barcode / QR distortion</span>
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
                Why Meesho Sellers Need 4-in-1 A4 Label Printing
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                When you download shipping labels from the <strong>Meesho Supplier Panel</strong>, each order label is typically generated as a full-page A4 document or an unformatted strip. Printing 1 label per A4 paper wastes massive amounts of paper, ink, and money. By arranging <strong>4 Meesho shipping labels onto a single A4 page (2&times;2 grid)</strong>, sellers cut their packaging paper expenses by 75% without needing an expensive dedicated thermal printer.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                How to Crop &amp; Print Meesho Labels on A4 (Step-by-Step)
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 leading-relaxed">
                <li><strong>Download Bulk Orders PDF:</strong> Go to Meesho Supplier Panel &rarr; Orders &rarr; Ready to Ship &rarr; Download Shipping Labels.</li>
                <li><strong>Upload to SizeSnap:</strong> Click or drag the downloaded PDF into our free Meesho Label to A4 converter.</li>
                <li><strong>Select Layout &amp; Margins:</strong> The default &quot;4 Labels per Page&quot; with &quot;Show Cut Guides&quot; is preselected for Indian A4 standard sheets.</li>
                <li><strong>Generate &amp; Download:</strong> Click &quot;Generate A4 PDF&quot;. In seconds, your compiled multi-label PDF is ready.</li>
                <li><strong>Print at 100% Scale:</strong> In your printer software, choose <em>Actual Size / 100%</em> to guarantee instant barcode scanning during courier pickup.</li>
              </ol>
            </div>

            {/* Keyword Pills */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Meesho Label Crop', '4 in 1 A4 Printing', 'Meesho Supplier Shipping Label', 'Delhivery Barcode Print', 'Shadowfax Pickup Label', 'E-commerce Shipping A4'].map((kw) => (
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
              Frequently Asked Questions (Meesho Shipping Labels)
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
              <Link href="/tools/shipping-label-to-a4" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">General Shipping Label to A4</span>
                <span className="text-gray-500">For Amazon, Flipkart, Shiprocket</span>
              </Link>
              <Link href="/tools/product-image-resizer" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Product Image Resizer</span>
                <span className="text-gray-500">Exact pixel dimensions for marketplaces</span>
              </Link>
              <Link href="/tools/product-image-compressor" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Product Image Compressor</span>
                <span className="text-gray-500">Reduce listing image KB</span>
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
