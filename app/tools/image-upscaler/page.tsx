import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageUpscalerTool } from '@/components/ImageUpscalerTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image Upscaler & DPI Converter (2x, 4x, 200, 300, 600 DPI) | SizeSnap',
  description:
    'Upscale image resolution up to 4x and convert print DPI (200, 300, 600 DPI) online for free. Increase clarity for posters, exam documents, and printouts. 100% private.',
  keywords: [
    'image upscaler',
    'upscale image online free',
    'convert image to 300 dpi',
    '200 dpi converter',
    'increase photo resolution 4x',
    'super resolution online',
    'convert dpi for print',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/image-upscaler',
  },
};

const FAQS = [
  {
    question: 'How do I upscale an image to 2x or 4x resolution without blur?',
    answer:
      'Upload your image into SizeSnap Image Upscaler, select your scaling factor (2x or 4x), and click Upscale. The bicubic and neural edge-smoothing algorithm synthesizes sub-pixels to increase dimensions while keeping text and silhouettes crisp.',
  },
  {
    question: 'How do I convert an image to 300 DPI or 200 DPI for government exams?',
    answer:
      'Select the "Change DPI" option, choose 200 DPI (standard for UPSC and State PSCs) or 300 DPI (for NSDL PAN card and Passport Seva), and download your calibrated image. The tool embeds the exact physical print density into the JPEG/PNG EXIF header.',
  },
  {
    question: 'Is there a file size or dimension limit for upscaling?',
    answer:
      'You can upscale images up to 4000 &times; 4000 pixels. Because processing runs in your local browser engine, processing speed depends on your device RAM rather than a server queue.',
  },
  {
    question: 'Are my private documents uploaded to third-party cloud servers?',
    answer:
      'Never. SizeSnap processes all pixels and metadata locally in your browser session. Your certificates, signatures, and personal photos remain completely secure.',
  },
];

export default function ImageUpscalerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'image-upscaler').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Image Upscaler</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Online Image Upscaler &amp; DPI Converter
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Increase pixel resolution (2x, 4x) and calibrate print DPI metadata (72, 150, 200, 300, 600 DPI) without uploading to external servers.
          </p>

          <ImageUpscalerTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="Image Upscaler & DPI Converter"
          description="SizeSnap Image Upscaler & DPI Converter is an essential utility for photographers, graphic designers, and government exam applicants. Many Indian recruitment portals (such as UPSC, SSC, and NSDL PAN Card) demand specific 200 DPI or 300 DPI resolutions. Simultaneously, small web graphics often need high-resolution upscaling for crisp printouts on posters, banners, and merchandise."
          howToSteps={[
            'Upload Image: Select any low-resolution JPG, PNG, or WebP photo.',
            'Choose Upscaling Factor: Select 2x (Double resolution) or 4x (Quadruple resolution).',
            'Select Target DPI: Set 200 DPI (Exam standard), 300 DPI (High-definition print), or 600 DPI (Archival scan).',
            'Download High-Res File: Click Download to export your upscaled, print-ready file in seconds.',
          ]}
          features={[
            {
              title: 'Sub-Pixel Super-Resolution',
              desc: 'Synthesizes clean intermediate pixels to reduce pixelation and jagged stair-stepping on enlarged images.',
            },
            {
              title: 'Native EXIF DPI Header Injection',
              desc: 'Injects official JFIF / EXIF print resolution tags recognized by government portal verification scripts.',
            },
            {
              title: '200 DPI & 300 DPI Exam Presets',
              desc: 'One-click presets for PAN Card (300 DPI), UPSC OTR (200 DPI), and Passport Seva requirements.',
            },
            {
              title: '100% In-Browser Privacy',
              desc: 'Zero server communication. Your confidential identity proofs and documents stay 100% on your device.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Image Upscaler',
            'Upscale Image Online Free',
            'Convert Image to 300 DPI',
            '200 DPI Converter',
            'Increase Photo Resolution 4x',
            'Super Resolution Online',
            'Convert DPI for Print',
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
