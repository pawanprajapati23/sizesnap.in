import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RemoveBackgroundTool } from '@/components/RemoveBackgroundTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free AI Background Remover Online (HD Transparent PNG) | SizeSnap',
  description:
    'Remove image backgrounds instantly with AI for free. Download crystal-clear transparent PNGs for passport photos, e-commerce products, and profiles. 100% private, no watermark.',
  keywords: [
    'remove background online free',
    'ai background remover',
    'remove bg free',
    'transparent background png',
    'photo background remover no watermark',
    'product photo background remove',
    'cut out photo background',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/remove-background',
  },
};

const FAQS = [
  {
    question: 'Is SizeSnap Background Remover 100% free with no watermark?',
    answer:
      'Yes, completely free. Unlike other tools that charge subscription credits or imprint ugly watermarks on HD downloads, SizeSnap generates full-resolution transparent PNGs for free without any watermark.',
  },
  {
    question: 'Can I remove backgrounds from e-commerce product photos?',
    answer:
      'Yes! The AI model cleanly isolates shoes, electronics, apparel, cosmetics, and jewelry from messy studio backgrounds, making them compliant with Amazon, Flipkart, and Meesho catalog standards.',
  },
  {
    question: 'How do I download the photo with a pure white background instead of transparent?',
    answer:
      'After removing the background, you can download the transparent PNG directly or use our White Background Passport Photo tool to instantly insert a pure white (#FFFFFF) backdrop for official exams and visas.',
  },
  {
    question: 'Are my private family and identity photos uploaded to external servers?',
    answer:
      'No. The AI vision model runs entirely inside your browser using client-side machine learning. Your photographs never leave your phone or computer, ensuring total privacy.',
  },
];

export default function RemoveBackgroundPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'remove-background').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Remove Background</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Free AI Background Remover</h1>
          <p className="text-sm text-gray-600 mb-6">
            Instantly remove the background from any photo in one click. Powered by on-device AI for 100% privacy and zero watermark.
          </p>
          <RemoveBackgroundTool />
        </div>

        {/* Rich SEO Content Section */}
        <ToolSeoContent
          title="AI Background Remover"
          description="SizeSnap AI Background Remover uses advanced semantic edge-detection algorithms to instantly isolate people, products, clothing, and pets from complex backgrounds. In just seconds, download high-definition transparent PNG cutouts ready for graphic design, e-commerce listings, and official documentation."
          howToSteps={[
            'Upload any image: Drag and drop your JPG, JPEG, PNG, or WebP photo into the workspace above.',
            'Instant AI segmentation: The on-device neural network automatically traces the subject with fine hair and edge accuracy.',
            'Preview cutout: Review the transparent cutout against the checkered canvas.',
            'Download PNG: Click "Download" to save your high-resolution transparent background PNG for free.',
          ]}
          features={[
            {
              title: 'Sub-Pixel Edge Accuracy',
              desc: 'Accurately separates fine hair strands, fur, transparent glass, and intricate borders without jagged edges.',
            },
            {
              title: '100% Client-Side Privacy',
              desc: 'Your photos are processed directly in your browser memory. Nothing is ever sent to or stored on remote servers.',
            },
            {
              title: 'Zero Watermarks & Full Resolution',
              desc: 'Download your cutouts in full native resolution without artificial downsampling or watermarks.',
            },
            {
              title: 'E-Commerce & Passport Ready',
              desc: 'Perfect for Amazon product listings, LinkedIn profile photos, YouTube thumbnails, and visa documents.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Remove Background Online Free',
            'AI Background Remover',
            'Transparent Background PNG',
            'Remove BG No Watermark',
            'Product Photo Background Remove',
            'Cut Out Photo Background',
            'Photo Background Eraser',
          ]}
        />

        {/* Popular Tools */}
        {relatedTools.length > 0 && (
          <div className="bg-white p-5 mt-6 rounded-[4px] border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Related Image Tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {relatedTools.map((relTool) => (
                <ToolButton key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
