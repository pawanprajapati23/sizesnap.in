import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlurBackgroundTool } from '@/components/BlurBackgroundTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Background Blur Online Free (DSLR Portrait Bokeh) | SizeSnap',
  description:
    'Blur photo backgrounds online for free. Create stunning DSLR depth-of-field portrait mode bokeh on any phone photo. 100% private, no watermark.',
  keywords: [
    'blur background online',
    'ai blur background',
    'portrait mode photo editor',
    'dslr bokeh effect online',
    'blur photo background free',
    'defocus background online',
    'make background blurry',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/blur-background',
  },
};

const FAQS = [
  {
    question: 'How do I blur the background of a photo on mobile or PC?',
    answer:
      'Upload your photo into SizeSnap AI Blur Background. The on-device portrait segmentation model automatically identifies the main subject and applies a smooth optical lens blur to the background. Adjust the blur slider to your taste and download.',
  },
  {
    question: 'Can I control the intensity of the background blur?',
    answer:
      'Yes! Use the blur slider to dial in anything from a subtle f/2.8 lens blur to a creamy f/1.4 dramatic bokeh effect.',
  },
  {
    question: 'Does this tool work on photos taken without portrait mode?',
    answer:
      'Yes! Even if your original photo was captured on a standard single-lens phone camera with everything in focus, SizeSnap generates depth maps to create realistic optical blur.',
  },
  {
    question: 'Are my personal images uploaded to any server?',
    answer:
      'No. The AI vision model runs 100% locally in your web browser. Your photos are never uploaded or saved to remote databases.',
  },
];

export default function BlurBackgroundPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'blur-background').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Blur Background</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">AI Background Blur Online</h1>
          <p className="text-sm text-gray-600 mb-6">
            Apply realistic DSLR portrait bokeh and background defocus to any photo instantly without uploading to servers.
          </p>
          <BlurBackgroundTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="AI Background Blur Tool"
          description="SizeSnap AI Background Blur transforms standard everyday photos into cinematic studio portraits. Using depth-aware semantic segmentation, the tool detects the subject's silhouette and softens distracting background clutter (busy streets, crowded rooms, messy offices) with natural optical blur."
          howToSteps={[
            'Upload Image: Drag or select any portrait, selfie, or product photo.',
            'Automatic Depth Estimation: AI segments the foreground subject from the background plane.',
            'Adjust Blur Strength: Fine-tune the blur slider from a subtle professional defocus to deep bokeh.',
            'Download HD Image: Click Download to export your studio-style portrait photo with zero watermarks.',
          ]}
          features={[
            {
              title: 'Natural Gaussian & Bokeh Diffusion',
              desc: 'Simulates genuine photographic camera lenses (f/1.8 – f/2.8) rather than artificial radial blurs.',
            },
            {
              title: 'Precise Subject Edge Separation',
              desc: 'Preserves sharp hair, shoulders, and glasses frames while cleanly blurring the surrounding environment.',
            },
            {
              title: 'Adjustable Blur Radius',
              desc: 'Custom slider lets you dial in the exact depth of field required for your profile or portfolio.',
            },
            {
              title: 'Zero Cloud Storage',
              desc: 'Full processing runs in local browser memory for 100% data confidentiality.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Blur Background Online',
            'AI Blur Background',
            'Portrait Mode Photo Editor',
            'DSLR Bokeh Effect Online',
            'Blur Photo Background Free',
            'Defocus Background Online',
            'Make Background Blurry',
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
