import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PassportPhotoMaker } from '@/components/tool-ui/PassportPhotoMaker';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield, Calendar, User } from 'lucide-react';
import { FAQSchema, SoftwareAppSchema } from '@/components/SeoSchemas';
import AdsterraAd from '@/components/AdsterraAd';

export const metadata: Metadata = {
  title: 'Add Name and Date on Photo Online Free - SSC, UPSC, Govt Exam DOP Maker | SizeSnap',
  description:
    'Add Name and Date of Taking Photograph (DOP) on passport photo online for free. Official bottom strip for SSC CGL, CHSL, GD, UPSC OTR, and Police exams. 100% private.',
  keywords: [
    'add name and date on photo',
    'add name and date on photo online free',
    'name and date on photo for ssc',
    'dop photo maker',
    'photo par name aur date kaise dale',
    'date of photo generator',
    'photo with name and date online',
    'ssc photo date of photo maker',
    'photo name date editor',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/add-name-and-date-on-photo',
  },
  openGraph: {
    title: 'Add Name and Date on Photo Online Free - DOP Photo Maker | SizeSnap',
    description:
      'Free online tool to add Candidate Name and Date of Photograph (DOP) on passport photos for SSC, UPSC, and Indian recruitment forms. 100% browser-based.',
    url: 'https://www.sizesnap.in/tools/add-name-and-date-on-photo',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'passport-photo-maker',
  'resize-image-3-5cm-4-5cm',
  'compress-image-between-20kb-to-50kb',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'generate-signature',
];

const FAQS = [
  {
    q: 'How to add name and date on photo for SSC or UPSC online for free?',
    a: 'Upload your photo into SizeSnap. Type your full candidate name in the Name box and select the Date of Photo (defaults to today). Our tool automatically stamps an official white banner at the bottom with crisp black typography.',
  },
  {
    q: 'Photo par name aur date kaise likhein (फोटो पर नाम और डेट कैसे डालें)?',
    a: 'SizeSnap par apni photo select karein. "Add Name & Date" section me apna naam aur photo khinchne ki date enter karein. Tool photo ke neeche clean white strip me naam aur date set kar dega. Download par click karke turant save karein.',
  },
  {
    q: 'Is Date of Photo (DOP) mandatory for SSC CGL, CHSL & GD exams?',
    a: 'Yes. Staff Selection Commission (SSC) notifications require candidate photographs to have the date of photograph (DOP) printed clearly at the bottom. Photos must have been taken within 3 months prior to notification release.',
  },
  {
    q: 'What is the correct format for Date of Photo (DOP)?',
    a: 'The standard accepted format is DD-MM-YYYY or DD.MM.YYYY (e.g., "DEVANG SHARMA" on line 1, and "DOP: 15-01-2026" on line 2). SizeSnap formats this automatically according to commission standards.',
  },
  {
    q: 'Are my personal details or photos uploaded anywhere?',
    a: 'Never. SizeSnap executes entirely inside your browser using HTML5 Canvas. Your photograph, name, and date are processed 100% on your device with zero cloud storage.',
  },
];

export default function AddNameAndDateOnPhotoPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <>
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="SizeSnap Name and Date on Photo Maker"
        description="Free online tool to add Name and Date of Taking Photograph (DOP) on passport photos for SSC, UPSC, and Indian recruitment forms."
        url="https://www.sizesnap.in/tools/add-name-and-date-on-photo"
      />

      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/image-tools" className="hover:text-[#414FA8] font-medium transition-colors">
              Image Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-800 font-semibold">Name &amp; Date on Photo</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">

              {/* Header Box */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/40 rounded">
                    DOP Stamp Generator
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                    SSC / UPSC Compliant
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  Add Name and Date on Photo Online Free
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  Stamp your Candidate Name and Date of Photo (DOP) on passport pictures for SSC CGL, CHSL, MTS, GD, UPSC OTR, and State Police forms. Download high-resolution JPG ready for form submission.
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <Lock className="h-3 w-3" /> 100% Private in Browser
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    <Calendar className="h-3 w-3" /> Customizable Date
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded">
                    <Shield className="h-3 w-3" /> Clean Typography
                  </div>
                </div>
              </div>

              {/* Tool Engine */}
              <PassportPhotoMaker />

              {/* In-content Ad */}
              <div className="overflow-hidden rounded-[4px] border border-gray-100 bg-white p-2 shadow-xs flex justify-center">
                <AdsterraAd dataKey="3bd154ece61c60859c2b8242ae85b927" width={728} height={90} className="w-full hidden md:flex" />
                <AdsterraAd dataKey="f509bd7d24a58ce7a176067713ca61df" width={320} height={50} className="w-full md:hidden flex" />
              </div>

              {/* Educational Article Section */}
              <article className="bg-white p-5 sm:p-7 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 text-xs sm:text-sm leading-relaxed space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Official Guidelines for Name and Date of Photograph (DOP)
                </h2>
                <p>
                  Major Indian examination bodies mandate printing the candidate full name and date of capturing the
                  photograph at the bottom border to prevent candidate impersonation and the use of outdated pictures.
                </p>
                <p>
                  Manually editing photos using general image editing tools often results in mismatched font sizes,
                  blurred text, or wrong aspect ratios. SizeSnap creates an official, clean white bottom bar with
                  bold sans-serif lettering that complies precisely with commission instructions.
                </p>

                <h3 className="text-sm font-bold text-gray-900 pt-2">
                  Key Rules to Remember:
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>The date printed should be the date on which the photograph was taken, not your birth date.</li>
                  <li>The date must not be older than 3 months from the notification date.</li>
                  <li>Name should match exactly with the candidate matriculation (10th) certificate.</li>
                </ul>
              </article>

              {/* FAQs Section */}
              <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-base sm:text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-gray-100">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">{faq.q}</h3>
                      <p className="text-xs text-gray-600 leading-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Tools */}
              <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-sm font-bold text-gray-800 mb-3">Related Image &amp; Exam Tools</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedTools.map((t) => (
                    <ToolButton key={t.id} tool={t} />
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="w-full lg:col-span-4 xl:col-span-3 space-y-6">
              <Sidebar />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
