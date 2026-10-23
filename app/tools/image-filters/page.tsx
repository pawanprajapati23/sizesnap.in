import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageFiltersTool } from '@/components/ImageFiltersTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image Filters & Effects Online (Grayscale, B&W, Blur, Pixelate) | SizeSnap',
  description:
    'Apply instant image filters locally in your browser. Grayscale, black & white, sepia, blur, pixelate, sharpen, and invert photo effects. 100% private, no watermark.',
  keywords: [
    'image filters online',
    'photo effects free',
    'grayscale image converter',
    'black and white photo maker',
    'pixelate image online',
    'sharpen photo online',
    'sepia filter online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/image-filters',
  },
};

const FAQS = [
  {
    question: 'How do I convert a photo to black and white or grayscale online?',
    answer:
      'Upload your image into SizeSnap Image Filters and click the "Grayscale" or "Black & White" preset button. Your photo will instantly convert to a monochrome look with balanced contrast. Download in high-resolution JPG or PNG.',
  },
  {
    question: 'Can I pixelate or blur faces to censor private details?',
    answer:
      'Yes. The Pixelate filter lets you censor sensitive identity cards, faces, license plates, or financial documents before sharing publicly.',
  },
  {
    question: 'Does applying filters reduce the resolution or dimensions of my image?',
    answer:
      'No. The canvas processes your photo at its native width and height, preserving 100% of the original resolution and clarity.',
  },
  {
    question: 'Are my images uploaded to any server?',
    answer:
      'All image processing executes locally in your browser using HTML5 Canvas APIs. No images ever touch our servers.',
  },
];

export default function ImageFiltersPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'image-filters').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Image Filters</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Online Image Filters &amp; Photo Effects
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Apply instant professional visual filters—Grayscale, Black &amp; White, Sepia, Blur, Pixelate, Sharpen, and Invert—directly in your browser with zero latency.
          </p>

          <ImageFiltersTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="Image Filters & Effects"
          description="SizeSnap Image Filters is a versatile photo effects suite designed for creators, students, and professionals. Whether you need an artistic black-and-white look for vintage photography, high-contrast monochrome conversion for document scanning, or pixelated censoring for privacy protection, our real-time engine applies color transformations instantly."
          howToSteps={[
            'Upload Image: Select your JPG, PNG, or WebP picture.',
            'Choose Filter: Pick from Grayscale, Black & White, Sepia, Blur, Sharpen, Invert, or Pixelate.',
            'Fine-Tune Intensity: Adjust sliders to calibrate tone contrast and effect intensity.',
            'Download Result: Click Download to save your modified photo in original high quality.',
          ]}
          features={[
            {
              title: 'Instant Hardware-Accelerated Shaders',
              desc: 'Filters render at 60 FPS using GPU-accelerated canvas matrices with zero rendering delay.',
            },
            {
              title: 'Document High-Contrast B&W',
              desc: 'Cleans up yellowed paper and shadows on scanned book pages and official certificates.',
            },
            {
              title: 'Identity Censoring & Pixelation',
              desc: 'Censor sensitive phone numbers, signatures, and faces before sharing images on social media.',
            },
            {
              title: '100% Offline & Private',
              desc: 'All image rendering happens locally in your device RAM without transmitting data online.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Image Filters Online',
            'Photo Effects Free',
            'Grayscale Image Converter',
            'Black and White Photo Maker',
            'Pixelate Image Online',
            'Sharpen Photo Online',
            'Sepia Filter Online',
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
