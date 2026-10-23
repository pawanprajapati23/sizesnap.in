import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShippingLabelToA4Tool } from '@/components/tool-ui/ShippingLabelToA4Tool';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, Scissors, Printer, PackageCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Label to A4 Sheet Converter – Print 1, 2, 4, 6, 8 Labels Per Page | SizeSnap',
  description:
    'Arrange Amazon, Flipkart, Shiprocket, and Delhivery shipping labels onto A4 pages for easy printing. Free multi-label PDF converter with cutting guides.',
  keywords: [
    'shipping label to a4',
    'print multiple shipping labels on one page',
    'amazon shipping label 4 in 1',
    'flipkart shipping label to a4',
    'shiprocket label crop',
    'delhivery shipping label a4',
    'thermal label to a4 pdf',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/shipping-label-to-a4',
  },
  openGraph: {
    title: 'Shipping Label to A4 Sheet Converter Free | SizeSnap',
    description: 'Convert and fit single shipping labels into multi-up A4 printable sheets (1, 2, 4, 6, 8 per page) with zero privacy loss.',
    url: 'https://www.sizesnap.in/tools/shipping-label-to-a4',
    type: 'website',
  },
};

const FAQS = [
  {
    question: 'How do I combine multiple shipping labels into a single A4 page?',
    answer:
      'Upload your bulk shipping label PDF file. Select your desired grid layout (4 per page is standard for e-commerce, 6 or 8 for smaller parcels). Click "Generate A4 PDF" to download the organized PDF ready for laser or inkjet printing.',
  },
  {
    question: 'Does this tool work for Amazon Easy Ship and Flipkart smart labels?',
    answer:
      'Yes. The tool automatically detects label bounding boxes and aligns them squarely across rows and columns, preserving 100% of the barcode contrast and invoice numbers.',
  },
  {
    question: 'Do I need special sticker paper to print these labels?',
    answer:
      'You can print on standard A4 70/80 GSM copy paper and stick with tape or glue, or use pre-cut 4-per-page A4 sticker/label sheets available in stationery shops.',
  },
  {
    question: 'Are my shipping manifests or customer phone numbers uploaded to servers?',
    answer:
      'No. SizeSnap runs entirely in your local browser using client-side JavaScript. Your orders, customer addresses, and sensitive invoices never leave your computer or phone.',
  },
];

export default function ShippingLabelToA4Page() {
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
      { '@type': 'ListItem', position: 3, name: 'Shipping Label to A4', item: 'https://www.sizesnap.in/tools/shipping-label-to-a4' },
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
            <span className="text-gray-800 font-semibold">Shipping Label to A4</span>
          </div>

          {/* Tool Container */}
          <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#414FA8] uppercase tracking-wider bg-[#EEF1FB] px-2 py-0.5 rounded">
                  E-Commerce Packaging Utility
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                  Multi-Shipping Label to A4 Arranger
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Format Amazon, Flipkart, Shiprocket, Meesho, and Delhivery shipping labels onto standard A4 paper. Select 1, 2, 4, 6, or 8 labels per page.
                </p>
              </div>
            </div>

            {/* Interactive Tool */}
            <div className="mt-4">
              <ShippingLabelToA4Tool isMeesho={false} />
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Compatible with all carriers</span>
              </div>
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Automatic cut boundaries</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero server upload privacy</span>
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs mb-6 space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                How E-Commerce Sellers Save Money with Multi-Up Label Printing
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most online marketplaces generate shipping labels formatted for 4&times;6 thermal printers. If your small business operates standard laser or inkjet desktop printers, attempting to print 4&times;6 labels one by one results in massive wasted margins on A4 paper. SizeSnap reorganizes your bulk PDF labels into tight <strong>2&times;2 (4-up)</strong>, <strong>2&times;3 (6-up)</strong>, or <strong>2&times;4 (8-up)</strong> matrices, drastically lowering your daily operating costs.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Supported E-Commerce Marketplaces &amp; Logistics Aggregators
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span><strong>Amazon Seller Central:</strong> Easy Ship &amp; Self Ship A4 layouts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span><strong>Flipkart Seller Hub:</strong> Smart fulfillment dispatch labels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span><strong>Shiprocket &amp; Pickrr:</strong> Multi-carrier 4-in-1 consolidated sheets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span><strong>Delhivery, Bluedart, Xpressbees:</strong> Thermal to A4 PDF conversion</span>
                </li>
              </ul>
            </div>

            {/* Keyword Badges */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Related Keyword Searches</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Amazon Label A4', 'Flipkart 4 in 1 Label', 'Shiprocket A4 Label Print', 'Thermal to A4 PDF', 'Print 4 Labels per Page', 'Delhivery Manifest Label'].map((kw) => (
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
              Related Seller Utilities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <Link href="/tools/meesho-shipping-label-to-a4" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Meesho Shipping Label to A4</span>
                <span className="text-gray-500">Dedicated Meesho 4-up arranger</span>
              </Link>
              <Link href="/tools/product-image-resizer" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Product Image Resizer</span>
                <span className="text-gray-500">Amazon &amp; Flipkart pixel specs</span>
              </Link>
              <Link href="/tools/product-image-compressor" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Product Image Compressor</span>
                <span className="text-gray-500">Fast listing image shrink</span>
              </Link>
              <Link href="/tools/crop-image" className="p-3 border border-gray-200 rounded hover:border-[#414FA8] transition-colors block">
                <span className="font-bold text-gray-900 block mb-1">Image Crop Tool</span>
                <span className="text-gray-500">Custom ratios &amp; freehand crop</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
