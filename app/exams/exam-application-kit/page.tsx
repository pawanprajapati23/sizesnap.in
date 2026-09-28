import { Metadata } from 'next';
import Link from 'next/link';
import MultiDocExamKit from '@/components/tool-ui/MultiDocExamKit';
import { ShieldCheck, Zap, FileCheck2, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All-in-One Govt Exam Application Kit - Photo, Signature & Thumb Resizer | SizeSnap',
  description:
    'Resize Photo, Signature, Thumb Impression, and Declaration simultaneously for SSC, UPSC, IBPS, and Police recruitment. Official dimensions, exact KB limits, 1-click individual downloads.',
  keywords: [
    'ssc photo and signature kit',
    'upsc otr photo signature resizer',
    'ibps photo signature thumb declaration kit',
    'govt exam application document resizer',
    'police exam photo and sign',
    'all in one exam photo resizer',
  ],
};

export default function ExamApplicationKitPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/exams"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Govt Exams Hub
          </Link>
          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Private
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">
            <Zap className="w-3.5 h-3.5" />
            Multi-Document Application Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            1-Click Multi-Document Exam Kit
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Upload your Photo, Signature, and Biometrics together. SizeSnap validates aspect ratio, background, and exact file size limits (KB) for instant portal acceptance.
          </p>
        </div>

        {/* Interactive MultiDoc Tool */}
        <MultiDocExamKit />

        {/* Informational Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Pre-Configured Exam Standards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No need to remember complicated cm, inch, or pixel charts. Each exam kit automatically loads official notification dimensions and target file sizes.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Zero Server Uploads
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your sensitive documents, signatures, and biometrics are processed 100% inside your browser&apos;s WebAssembly &amp; Canvas engine.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Direct Separate Downloads
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Skip unzipping archives on your mobile phone. Download each document individually with 1-click, clearly labeled for the respective portal upload fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
