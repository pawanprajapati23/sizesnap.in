import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronRight, ArrowRight, Package, FileText, SplitSquareHorizontal, Smartphone, Zap, Shield, Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SizeSnap Seller Workbench | E-commerce Shipping & Packing Tools',
  description: 'Free tools for shipping, packing and everyday e-commerce tasks. Format Meesho labels to A4, organize seller PDFs, and streamline your dispatch workflow.',
  alternates: {
    canonical: 'https://sizesnap.in/ecommerce-tools',
  },
  openGraph: {
    title: 'SizeSnap Seller Workbench | E-commerce Shipping & Packing Tools',
    description: 'Free tools for shipping, packing and everyday e-commerce tasks. Format Meesho labels to A4, organize seller PDFs, and streamline your dispatch workflow.',
    url: 'https://sizesnap.in/ecommerce-tools',
    siteName: 'SizeSnap',
    type: 'website',
  },
};

export default function EcommerceToolsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I convert Meesho shipping labels to A4?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can use the Meesho Shipping Label to A4 tool. Just upload your PDF, choose 4 labels per page, and generate a new A4 PDF ready for printing.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I process multiple labels?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our tool allows you to upload a single PDF containing many labels, and it will arrange them automatically onto A4 pages.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use SizeSnap on mobile?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our tools are fully mobile-friendly. You can process your shipping labels and PDFs directly from your smartphone browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to install software?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, there is no software to install. All processing happens locally in your web browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'How should I print the generated A4 PDF?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When printing the downloaded PDF, make sure to select "Actual Size" or "Scale: 100%" in your printer settings. Avoid using "Fit to Page" as it might distort the label sizes.',
        },
      }
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-8 pb-12 sm:pt-12 sm:pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-800 font-semibold">Seller Workbench</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#333333] tracking-tight mb-4">
            SizeSnap Seller Workbench
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Free tools for shipping, packing and everyday e-commerce tasks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#today-dispatch"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#414FA8] text-white font-medium rounded-xl hover:bg-[#344190] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Start Packing <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#seller-tools"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Explore Seller Tools
            </a>
          </div>
        </div>
      </section>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* Today&apos;s Dispatch Section */}
        <section id="today-dispatch" className="scroll-mt-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Today&apos;s Dispatch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Prepare your shipping labels for printing in a few simple steps.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50/50">
              {[
                { step: 1, title: 'Upload label PDF' },
                { step: 2, title: 'Prepare labels' },
                { step: 3, title: 'Choose print layout' },
                { step: 4, title: 'Preview' },
                { step: 5, title: 'Download print-ready PDF' },
              ].map((s) => (
                <div key={s.step} className="p-4 sm:p-6 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#414FA8] font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                    {s.step}
                  </div>
                  <p className="text-sm font-medium text-gray-800">{s.title}</p>
                </div>
              ))}
            </div>
            <div className="p-8 text-center bg-white border-t border-gray-100">
               <Link
                  href="/tools/meesho-shipping-label-to-a4"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[#414FA8] text-white font-medium rounded-xl hover:bg-[#344190] transition-colors shadow-sm gap-2"
                >
                  <Package className="h-5 w-5" />
                  Open Meesho Label → A4 Tool
                </Link>
            </div>
          </div>
        </section>

        {/* Packing Station Section */}
        <section>
          <div className="mb-8 flex items-center gap-3">
             <div className="p-2.5 bg-blue-100 rounded-lg text-[#414FA8]">
                <Package className="h-6 w-6" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900">Packing Station</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
               <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#414FA8] transition-colors">Meesho Shipping Label → A4</h3>
               <p className="text-sm text-gray-600 mb-6">Prepare Meesho shipping labels into a print-ready A4 PDF.</p>
               <Link href="/tools/meesho-shipping-label-to-a4" className="inline-flex items-center text-sm font-medium text-[#414FA8] hover:text-[#344190]">
                 Open Tool <ChevronRight className="h-4 w-4 ml-1" />
               </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
               <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#414FA8] transition-colors">Shipping Label → A4</h3>
               <p className="text-sm text-gray-600 mb-6">Arrange generic individual shipping labels onto A4 pages for easy printing.</p>
               <Link href="/tools/shipping-label-to-a4" className="inline-flex items-center text-sm font-medium text-[#414FA8] hover:text-[#344190]">
                 Open Tool <ChevronRight className="h-4 w-4 ml-1" />
               </Link>
            </div>
          </div>
        </section>

        {/* Product Image Factory Section */}
        <section id="product-images" className="scroll-mt-8">
           <div className="mb-8 flex items-center gap-3">
             <div className="p-2.5 bg-purple-100 rounded-lg text-purple-600">
                <ImageIcon className="h-6 w-6" aria-hidden="true" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-gray-900">Product Image Factory</h2>
               <p className="text-sm text-gray-600 mt-1">Resize, crop and prepare product images for different selling platforms.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { title: 'Product Image Maker', desc: 'Bulk resize, pad, and format for marketplaces', slug: 'product-image-maker' },
               { title: 'Image Compressor', desc: 'Reduce product photo file sizes', slug: 'compress-image' },
               { title: 'Image Resizer', desc: 'Resize product images by pixel', slug: 'resize-image-pixel' },
               { title: 'Image Converter', desc: 'Convert JPG to PNG/WebP', slug: 'jpg-to-png' }
             ].map(tool => (
               <Link
                 key={tool.slug}
                 href={`/tools/${tool.slug}`}
                 className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#414FA8]/30 transition-all group"
               >
                 <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#414FA8] transition-colors">{tool.title}</h3>
                 <p className="text-xs text-gray-500">{tool.desc}</p>
               </Link>
             ))}
          </div>
        </section>

        {/* Seller PDF Tools Section */}
        <section id="seller-tools" className="scroll-mt-8">
           <div className="mb-8 flex items-center gap-3">
             <div className="p-2.5 bg-red-100 rounded-lg text-red-600">
                <FileText className="h-6 w-6" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-gray-900">Seller PDF Tools</h2>
               <p className="text-sm text-gray-600 mt-1">Fix, organize and optimize PDFs before printing or sharing.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { title: 'Compress PDF', desc: 'Reduce PDF file size', slug: 'compress-pdf' },
               { title: 'Split PDF', desc: 'Separate pages from a PDF', slug: 'split-pdf' },
               { title: 'Merge PDFs', desc: 'Combine multiple PDFs into one', slug: 'merge-pdfs' },
               { title: 'Rotate PDF', desc: 'Rotate PDF pages', slug: 'rotate-pdf' }
             ].map(tool => (
               <Link
                 key={tool.slug}
                 href={`/tools/${tool.slug}`}
                 className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#414FA8]/30 transition-all group"
               >
                 <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#414FA8] transition-colors">{tool.title}</h3>
                 <p className="text-xs text-gray-500">{tool.desc}</p>
               </Link>
             ))}
          </div>
        </section>

        {/* Popular Seller Workflows Section */}
        <section>
          <div className="mb-8 flex items-center gap-3">
             <div className="p-2.5 bg-green-100 rounded-lg text-green-600">
                <SplitSquareHorizontal className="h-6 w-6" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900">Popular Seller Workflows</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/tools/meesho-shipping-label-to-a4" className="block bg-white border border-gray-200 rounded-xl p-4 hover:bg-[#F8F9FA] transition-colors">
              <span className="block text-sm font-medium text-gray-900 mb-1">Prepare Meesho labels for A4 printing</span>
              <span className="text-xs text-[#414FA8] flex items-center">Start workflow <ArrowRight className="h-3 w-3 ml-1" /></span>
            </Link>
            <Link href="/tools/compress-pdf" className="block bg-white border border-gray-200 rounded-xl p-4 hover:bg-[#F8F9FA] transition-colors">
              <span className="block text-sm font-medium text-gray-900 mb-1">Compress a seller PDF</span>
              <span className="text-xs text-[#414FA8] flex items-center">Start workflow <ArrowRight className="h-3 w-3 ml-1" /></span>
            </Link>
            <Link href="/tools/split-pdf" className="block bg-white border border-gray-200 rounded-xl p-4 hover:bg-[#F8F9FA] transition-colors">
              <span className="block text-sm font-medium text-gray-900 mb-1">Split a large shipping PDF</span>
              <span className="text-xs text-[#414FA8] flex items-center">Start workflow <ArrowRight className="h-3 w-3 ml-1" /></span>
            </Link>
            <Link href="/tools/merge-pdfs" className="block bg-white border border-gray-200 rounded-xl p-4 hover:bg-[#F8F9FA] transition-colors">
              <span className="block text-sm font-medium text-gray-900 mb-1">Merge seller documents</span>
              <span className="text-xs text-[#414FA8] flex items-center">Start workflow <ArrowRight className="h-3 w-3 ml-1" /></span>
            </Link>
          </div>
        </section>

        {/* Why SizeSnap Section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-sm">
           <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why SizeSnap</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="text-center">
               <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#414FA8]">
                 <Shield className="h-6 w-6" />
               </div>
               <h3 className="font-semibold text-gray-900 mb-2">Browser-Based Processing</h3>
               <p className="text-sm text-gray-600">Many SizeSnap tools process files directly in your browser. No unnecessary server uploads.</p>
             </div>
             <div className="text-center">
               <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                 <Zap className="h-6 w-6" />
               </div>
               <h3 className="font-semibold text-gray-900 mb-2">Fast & Free</h3>
               <p className="text-sm text-gray-600">Completely free utilities built for speed. No unnecessary signup required to process your labels.</p>
             </div>
             <div className="text-center">
               <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                 <Smartphone className="h-6 w-6" />
               </div>
               <h3 className="font-semibold text-gray-900 mb-2">Mobile-Friendly</h3>
               <p className="text-sm text-gray-600">Process shipping labels and PDFs on the go right from your smartphone&apos;s browser.</p>
             </div>
           </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How do I convert Meesho shipping labels to A4?', a: 'You can use the Meesho Shipping Label to A4 tool. Just upload your PDF, choose 4 labels per page, and generate a new A4 PDF ready for printing.' },
              { q: 'Can I process multiple labels?', a: 'Yes! Our tool allows you to upload a single PDF containing many labels, and it will arrange them automatically onto A4 pages.' },
              { q: 'Can I use SizeSnap on mobile?', a: 'Yes, our tools are fully mobile-friendly. You can process your shipping labels and PDFs directly from your smartphone browser.' },
              { q: 'Do I need to install software?', a: 'No, there is no software to install. All processing happens locally in your web browser.' },
              { q: 'How should I print the generated A4 PDF?', a: 'When printing the downloaded PDF, make sure to select "Actual Size" or "Scale: 100%" in your printer settings. Avoid using "Fit to Page" as it might distort the label sizes.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
