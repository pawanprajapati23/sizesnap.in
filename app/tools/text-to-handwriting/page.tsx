import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TextToHandwritingTool } from '@/components/TextToHandwritingTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Text to Handwriting Converter Online Free (Assignments & Notes) | SizeSnap',
  description:
    'Convert digital text into realistic handwriting on ruled or blank notebook paper. Choose ink colors (blue, black, gel pen), handwriting styles, and paper textures. 100% free.',
  keywords: [
    'text to handwriting converter',
    'convert text to handwriting online',
    'assignment handwriting maker',
    'digital text to handwritten notes',
    'handwriting generator free',
    'make assignments look handwritten',
    'realistic handwriting font',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/text-to-handwriting',
  },
};

const FAQS = [
  {
    question: 'How do I make computer text look like realistic human handwriting?',
    answer:
      'Type or paste your text into the SizeSnap Text to Handwriting tool. Choose a natural handwriting font, select blue or black ink color, and pick a ruled notebook paper background. Download the resulting high-resolution image or PDF.',
  },
  {
    question: 'Can I use this tool for college and school assignments?',
    answer:
      'Yes! Many students use this tool to generate clean, legible handwritten assignment pages and homework submissions on ruled A4 sheets without finger fatigue.',
  },
  {
    question: 'Can I customize paper margins, line spacing, and ink color?',
    answer:
      'Yes. You can switch between blank white paper, single-line ruled school notebook paper, and grid paper. You can also customize margins, line height, letter spacing, and choose blue, black, or red ballpoint/gel pen ink.',
  },
  {
    question: 'Is my assignment text saved or shared with anyone?',
    answer:
      'No. All text-to-canvas rendering executes entirely inside your browser. Your notes, essays, and text are 100% private and never stored.',
  },
];

export default function TextToHandwritingPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'text-to-handwriting').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Text to Handwriting</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Text to Handwriting Converter Online
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Paste any digital text or essay and transform it into realistic human handwriting on ruled notebook paper in seconds.
          </p>

          <TextToHandwritingTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="Text to Handwriting Generator"
          description="SizeSnap Text to Handwriting Converter bridges the gap between digital convenience and traditional pen-and-paper appearance. Whether you are submitting college homework, preparing handwritten study summaries, writing personal letter notes, or designing authentic vintage journal graphics, our browser-based engine formats paragraphs into convincing organic handwriting."
          howToSteps={[
            'Paste Your Text: Copy text from Word, PDF, or ChatGPT and paste it into the editor.',
            'Choose Handwriting Style: Select from cursive, running, casual, or neat student handwriting fonts.',
            'Select Ink & Paper: Pick blue ballpoint, black gel pen, or fountain pen ink, and select ruled or blank notebook lines.',
            'Download PNG or PDF: Export your completed handwritten page ready for submission or printing.',
          ]}
          features={[
            {
              title: 'Realistic Organic Pen Variations',
              desc: 'Subtle baseline drift, irregular letter kerning, and pen pressure simulation mimic authentic human penmanship.',
            },
            {
              title: 'Ruled Notebook Backgrounds',
              desc: 'Pre-aligned blue ruled lines, red left margin rules, and paper textures for authentic Indian school notebook look.',
            },
            {
              title: 'Blue & Black Ballpoint Inks',
              desc: 'True-to-life pigment rendering mimicking Reynolds, Cello, and Parker ballpoint inks.',
            },
            {
              title: '100% In-Browser Privacy',
              desc: 'Your essays and assignment text are processed locally in your browser memory without cloud transmission.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Text to Handwriting Converter',
            'Convert Text to Handwriting Online',
            'Assignment Handwriting Maker',
            'Digital Text to Handwritten Notes',
            'Handwriting Generator Free',
            'Make Assignments Look Handwritten',
            'Realistic Handwriting Font',
          ]}
        />

        {relatedTools.length > 0 && (
          <div className="bg-white p-5 mt-6 rounded-[4px] border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
              Related Image &amp; Writing Tools
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
