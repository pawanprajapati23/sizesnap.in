import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PhotoCollageMakerTool } from '@/components/PhotoCollageMakerTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Photo Collage Maker Online (Grid & Side-by-Side) | SizeSnap',
  description:
    'Combine multiple photos into beautiful grid layouts, side-by-side comparisons, and photo collages online for free. 100% private in-browser tool without watermark.',
  keywords: [
    'photo collage maker online',
    'free collage maker',
    'combine photos side by side',
    'picture grid maker online',
    'photo merger free',
    'make photo collage without watermark',
    'join multiple images',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/photo-collage-maker',
  },
};

const FAQS = [
  {
    question: 'How do I combine two photos side by side online?',
    answer:
      'Upload both photos into SizeSnap Photo Collage Maker. Choose the 2-column horizontal side-by-side grid layout, adjust spacing and border margins, and click Download to save your combined image.',
  },
  {
    question: 'Can I create a 3x3 or 4-photo grid collage?',
    answer:
      'Yes. You can select 2, 3, 4, 6, or 9 photos and choose custom grid layouts (2x2 square, 1 large + 2 small, or horizontal/vertical strips).',
  },
  {
    question: 'Is SizeSnap Collage Maker free without watermark?',
    answer:
      'Yes, 100% free with no watermarks, brand logos, or mandatory account registrations.',
  },
  {
    question: 'Are my private family and celebration pictures uploaded to the internet?',
    answer:
      'No. The collage canvas stitches images entirely in your local browser memory. Your pictures are never sent to external servers.',
  },
];

export default function PhotoCollageMakerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'photo-collage-maker').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Photo Collage Maker</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Free Photo Collage Maker Online
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Combine multiple photos into beautiful grids, side-by-side comparison cards, and photo montages instantly in your browser.
          </p>

          <PhotoCollageMakerTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="Photo Collage Maker"
          description="SizeSnap Photo Collage Maker enables you to tell visual stories by stitching multiple memories, before-and-after transformations, or product variations into a single unified layout. Perfect for Instagram posts, travel scrapbooks, real estate comparisons, and family greeting cards."
          howToSteps={[
            'Select Images: Upload 2 or more photos from your phone, tablet, or PC.',
            'Choose Layout: Pick your preferred grid template (2x2, side-by-side, vertical strip, or asymmetrical collage).',
            'Adjust Borders & Spacing: Fine-tune border thickness, corner roundness, and background color.',
            'Download Collage: Export your high-resolution collage in crisp JPG or PNG format with zero watermarks.',
          ]}
          features={[
            {
              title: 'Multi-Grid Layout Templates',
              desc: 'Seamlessly arrange 2 to 9 photos across square, widescreen (16:9), and vertical (9:16) story formats.',
            },
            {
              title: 'Custom Spacing & Rounded Corners',
              desc: 'Control grid gutter spacing and frame padding with real-time live canvas preview.',
            },
            {
              title: 'Side-by-Side Comparison Presets',
              desc: 'Quickly generate side-by-side before/after pictures for fitness progress, makeup, and restoration projects.',
            },
            {
              title: 'Zero Server Upload Privacy',
              desc: 'Processed directly in your device RAM without transmitting photos across the network.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Photo Collage Maker Online',
            'Free Collage Maker',
            'Combine Photos Side by Side',
            'Picture Grid Maker Online',
            'Photo Merger Free',
            'Make Photo Collage Without Watermark',
            'Join Multiple Images',
          ]}
        />

        {relatedTools.length > 0 && (
          <div className="bg-white p-5 mt-6 rounded-[4px] border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
              Related Image Tools
            </h2>
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
