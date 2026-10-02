import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const ProductImageMakerTool = dynamic(
  () => import('@/components/tool-ui/ProductImageMakerTool').then((mod) => mod.ProductImageMakerTool),
  { loading: () => <div className="p-12 text-center">Loading editor...</div> }
);

export const metadata: Metadata = {
  title: 'Product Image Maker & Editor | E-commerce Seller Tools | SizeSnap',
  description: 'Resize, pad, and format product photos for Amazon, Flipkart, Meesho, and Shopify. Free client-side bulk product image factory.',
  alternates: { canonical: 'https://sizesnap.in/tools/product-image-maker' },
};

export default function ProductImageMakerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this tool really free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, SizeSnap tools are completely free to use with no hidden fees.' }
      },
      {
        '@type': 'Question',
        name: 'How does the background replacement work?',
        acceptedAnswer: { '@type': 'Answer', text: 'If your image has a transparent background (like a PNG), you can select a solid background color like White or Black, and the tool will fill the transparent areas before exporting to your desired format.' }
      },
      {
        '@type': 'Question',
        name: 'Does it support bulk processing?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can select and process up to 50 images at once, apply the same marketplace preset to all of them, and download the results in a single ZIP file.' }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 max-w-6xl mx-auto" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/ecommerce-tools" className="hover:text-[#414FA8] font-medium transition-colors">Seller Workbench</Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Product Image Maker</span>
        </nav>

        <div className="max-w-6xl mx-auto mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] tracking-tight mb-2">
            Product Image Factory
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Prepare product images for different e-commerce platforms in one workflow. Resize, pad, and check compliance entirely in your browser.
          </p>
        </div>

        <ProductImageMakerTool />

        <div className="max-w-6xl mx-auto mt-12 mb-8">
           <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
           <div className="space-y-4">
             <div className="bg-white border border-gray-200 rounded-lg p-5">
               <h3 className="font-medium text-gray-900 mb-2">Is this tool really free?</h3>
               <p className="text-sm text-gray-600">Yes, SizeSnap tools are completely free to use with no hidden fees.</p>
             </div>
             <div className="bg-white border border-gray-200 rounded-lg p-5">
               <h3 className="font-medium text-gray-900 mb-2">How does the background replacement work?</h3>
               <p className="text-sm text-gray-600">If your image has a transparent background (like a PNG), you can select a solid background color like White or Black, and the tool will fill the transparent areas before exporting to your desired format. Note: This does not automatically remove complex backgrounds using AI.</p>
             </div>
             <div className="bg-white border border-gray-200 rounded-lg p-5">
               <h3 className="font-medium text-gray-900 mb-2">Does it support bulk processing?</h3>
               <p className="text-sm text-gray-600">Yes, you can select and process up to 50 images at once, apply the same marketplace preset to all of them, and download the results in a single ZIP file.</p>
             </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
