import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AiPhotoEnhancerTool } from '@/components/AiPhotoEnhancerTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Photo Enhancer Online Free (Unblur, HD Clarity & Color) | SizeSnap',
  description:
    'Instantly enhance old, blurry, or low-light photos with AI for free. Automatic color correction, sharpness boost, and noise reduction. 100% private, no watermark.',
  keywords: [
    'ai photo enhancer',
    'photo enhancer online free',
    'unblur image online',
    'increase photo quality',
    'ai image quality enhancer',
    'enhance blurry photo',
    'fix dark photo online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/ai-photo-enhancer',
  },
};

const FAQS = [
  {
    question: 'How does the SizeSnap AI Photo Enhancer work?',
    answer:
      'SizeSnap uses adaptive image processing neural filters directly in your browser. It analyzes pixel contrast, shadow clipping, and edge gradient data to automatically boost dynamic range, sharpen facial features, and neutralize harsh yellow/blue tints.',
  },
  {
    question: 'Can this tool fix blurry or pixelated portraits?',
    answer:
      'Yes. It sharpens soft facial details, deepens contrast in the eyes, and smooths out noisy JPEG compression artifacts, making photos look crisp and vibrant.',
  },
  {
    question: 'Is it completely free with no subscription or watermark?',
    answer:
      'Yes! There are no daily limits, hidden subscription charges, or watermarks added to your downloaded images.',
  },
  {
    question: 'Are my private photos safe?',
    answer:
      'All image processing executes strictly in your browser using local canvas computation. Your photos never get uploaded to or stored on external servers.',
  },
];

export default function AiPhotoEnhancerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'ai-photo-enhancer').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">AI Photo Enhancer</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Free AI Photo Enhancer Online</h1>
          <p className="text-sm text-gray-600 mb-6">
            Automatically unblur, restore colors, and enhance contrast in one click without uploading to any server.
          </p>
          <AiPhotoEnhancerTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="AI Photo Enhancer"
          description="SizeSnap AI Photo Enhancer is a free web utility that repairs washed-out, dark, or blurry photos in seconds. Whether you are restoring an old family portrait, fixing low-light phone photos, or preparing sharp product photos for an online store, our intelligent enhancement engine brings out vibrant natural colors and crisp textures."
          howToSteps={[
            'Select Photo: Click or drag your JPG, PNG, or WebP photo into the upload box above.',
            'Automatic Enhancement: SizeSnap instantly balances exposure, cleans up shadows, and sharpens edge definitions.',
            'Compare Before & After: Toggle between the original and enhanced views to inspect color accuracy and facial clarity.',
            'Download Enhanced Image: Click Download to save your high-definition enhanced photo for free.',
          ]}
          features={[
            {
              title: 'One-Click Intelligent Auto-Color',
              desc: 'Calculates the optimal histogram distribution to eliminate dull grey casts and restore natural skin tones.',
            },
            {
              title: 'Noise & Grain Suppression',
              desc: 'Cleans up speckled sensor noise common in low-light and nighttime smartphone photography.',
            },
            {
              title: 'Edge Micro-Sharpening',
              desc: 'Sharpens blurred text, eyelashes, and textile textures without creating artificial halo rings.',
            },
            {
              title: '100% Client-Side Privacy',
              desc: 'Processes entirely in your device memory. No images are uploaded to any cloud server.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'AI Photo Enhancer',
            'Photo Enhancer Online Free',
            'Unblur Image Online',
            'Increase Photo Quality',
            'AI Image Quality Enhancer',
            'Fix Low Light Photo',
            'Old Photo Restoration',
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
