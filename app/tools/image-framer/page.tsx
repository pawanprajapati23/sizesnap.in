import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageFramerTool } from '@/components/ImageFramerTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Add Borders & Round Corners to Image Online Free | SizeSnap',
  description:
    'Add clean white borders, custom colored frames, rounded corners, and drop shadows to photos online for free. Perfect for Instagram feeds, product mockups, and presentations.',
  keywords: [
    'add border to image',
    'white border photo maker',
    'round corners image online',
    'add frame to photo free',
    'instagram white border tool',
    'photo border editor',
    'rounded rectangle image maker',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/image-framer',
  },
};

const FAQS = [
  {
    question: 'How do I add a clean white border to a photo for Instagram?',
    answer:
      'Upload your photo into SizeSnap Image Framer. Select the "White Border" preset and adjust the border width slider (e.g. 20px to 50px). Download your framed photo ready to upload to your Instagram grid without cropping.',
  },
  {
    question: 'Can I round the corners of a photo and keep the background transparent?',
    answer:
      'Yes. Simply adjust the "Corner Radius" slider and select Transparent background. The tool outputs a clean PNG with transparent rounded corner alpha channels.',
  },
  {
    question: 'Can I choose custom border colors and outline thicknesses?',
    answer:
      'Yes! Use the integrated color picker or hex code input to select any border color (black, gold, pastels, neon) and set border thickness from 1px to 100px.',
  },
  {
    question: 'Are my images stored or uploaded to any server?',
    answer:
      'No. Framing and corner rounding execute 100% client-side in your browser canvas. Your files never leave your device.',
  },
];

export default function ImageFramerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'image-framer').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Image Framer</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Image Borders &amp; Rounded Corners Maker
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Add aesthetic white borders, custom colored frames, and smooth rounded corners to your photos online for free.
          </p>

          <ImageFramerTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="Image Borders & Framer"
          description="SizeSnap Image Framer gives your pictures a clean, modern aesthetic. Whether you are formatting portrait photos for a minimalist Instagram feed, rounding card corners for UI/UX presentations, or adding solid colored borders to e-commerce product badges, our online framing utility delivers pixel-perfect results in seconds."
          howToSteps={[
            'Upload Picture: Click or drop your JPG, PNG, or WebP file into the frame box.',
            'Choose Style: Select Border (Solid Color) or Rounded Corners.',
            'Adjust Dimensions: Use sliders to control border width (padding) and corner radius curvature.',
            'Download HD Image: Click Download to export your framed picture in original crisp quality.',
          ]}
          features={[
            {
              title: 'Instagram Grid White Padding',
              desc: 'Add square white margins to vertical and horizontal photos so they fit Instagram feeds without being cropped.',
            },
            {
              title: 'Smooth Anti-Aliased Rounded Corners',
              desc: 'Generates ultra-smooth curved borders with transparent outer alpha corners for app mockups.',
            },
            {
              title: 'Custom Hex Color Palette',
              desc: 'Select any custom brand color or pick colors directly from your photo using the color dropper.',
            },
            {
              title: '100% Client-Side Privacy',
              desc: 'Processed directly in your browser without uploading to external servers.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Add Border to Image',
            'White Border Photo Maker',
            'Round Corners Image Online',
            'Add Frame to Photo Free',
            'Instagram White Border Tool',
            'Photo Border Editor',
            'Rounded Rectangle Image Maker',
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
