import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageWatermarkTool } from '@/components/ImageWatermarkTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Add Watermark to Image Online Free (Text & PNG Logo) | SizeSnap',
  description:
    'Protect your photos from theft. Add custom text watermarks, copyright notices, or transparent PNG logos with custom opacity, rotation, and tiling. 100% private, no watermark.',
  keywords: [
    'add watermark to image',
    'watermark photo online free',
    'add logo to photo',
    'copyright watermark maker',
    'protect photos from theft',
    'text watermark on image',
    'batch watermark photos',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/image-watermark',
  },
};

const FAQS = [
  {
    question: 'How do I add a transparent logo watermark to my photos?',
    answer:
      'Upload your base photo into SizeSnap Image Watermark. Switch to "Logo Watermark" mode, upload your transparent PNG logo, adjust size and opacity sliders (e.g. 40%–60%), position it in the corner or center, and click Download.',
  },
  {
    question: 'Can I add repetitive diagonal tiled watermarks across the whole image?',
    answer:
      'Yes! Enable the "Tile Watermark" toggle to repeat your copyright name, website URL, or "CONFIDENTIAL / SAMPLE" stamp across the entire photo in a 45-degree diagonal pattern.',
  },
  {
    question: 'Does watermarking reduce the quality of the original image?',
    answer:
      'No. The watermark is composited directly onto the original pixel grid at full resolution, keeping the underlying image razor-sharp.',
  },
  {
    question: 'Are my copyrighted photographs uploaded to external servers?',
    answer:
      'No. All watermarking operations happen locally inside your browser memory. Your unreleased client shoots and commercial images are never transmitted or stored.',
  },
];

export default function ImageWatermarkPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'image-watermark').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Add Watermark</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Add Watermark to Image (Text &amp; Logo)
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Securely protect your photographs from unauthorized copying. Stamp custom text, copyright tags, or brand logos with adjustable opacity in your browser.
          </p>

          <ImageWatermarkTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="Image Watermark Tool"
          description="SizeSnap Image Watermark helps photographers, content creators, real estate agents, and e-commerce sellers safeguard their intellectual property. Easily stamp copyright notices, brand logos, or confidential sample text onto high-resolution photos before posting them on social media or sending proofs to clients."
          howToSteps={[
            'Upload Base Image: Drag and drop your JPG, PNG, or WebP photo into the canvas.',
            'Choose Type: Select Text Watermark (enter name, date, website) or Logo Watermark (upload transparent PNG).',
            'Customize Appearance: Adjust font size, text color, transparency opacity (0–100%), and corner placement.',
            'Download Watermarked Photo: Export your protected image in full resolution with zero quality loss.',
          ]}
          features={[
            {
              title: 'Text & Transparent Logo Support',
              desc: 'Seamlessly overlay typography with custom fonts or blend high-resolution transparent PNG brand emblems.',
            },
            {
              title: 'Adjustable Opacity & Blending',
              desc: 'Dial in subtle, non-intrusive 30% transparency or bold anti-theft proof stamps.',
            },
            {
              title: 'Multi-Position Corner Anchors',
              desc: 'Pin watermarks to Top-Left, Top-Right, Bottom-Left, Bottom-Right, or Center with custom pixel offsets.',
            },
            {
              title: '100% Client-Side Security',
              desc: 'Your photos and proprietary brand assets are never transmitted across the web.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Add Watermark to Image',
            'Watermark Photo Online Free',
            'Add Logo to Photo',
            'Copyright Watermark Maker',
            'Protect Photos from Theft',
            'Text Watermark on Image',
            'Batch Watermark Photos',
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
