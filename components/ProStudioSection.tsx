'use client'
import Link from 'next/link'
import {
  Zap,
  Printer,
  ShieldCheck,
  Sparkles,
  ScanText,
  Lock,
  ArrowRight,
  CheckCircle,
  FileCheck
} from 'lucide-react'

const PRO_TOOLS = [
  {
    title: '1-Click Sarkari Exam Pack',
    desc: 'Auto-format Photo (with Name/Date), Signature & Marksheet for SSC, NEET, UPSC in 1-Click ZIP.',
    tag: '⚡ 1-CLICK PACK',
    path: '/sarkari-exam-pack-generator',
    icon: Zap,
    gradient: 'from-amber-500/10 via-orange-500/10 to-yellow-500/10',
    border: 'border-amber-500/30 hover:border-amber-500',
    iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
  },
  {
    title: 'Sarkari Exam Age Calculator',
    desc: 'Calculate exact age (Years, Months, Days) as on cutoff date with live SSC, UPSC, Police eligibility badges.',
    tag: '🎂 SEO TRAFFIC KING',
    path: '/sarkari-exam-age-calculator',
    icon: ShieldCheck,
    gradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
    border: 'border-emerald-500/30 hover:border-emerald-500',
    iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
  },
  {
    title: '4x6 & A4 Passport Print Sheet Maker',
    desc: 'Arrange 6, 8, or 30 passport photos with cutting borders ready for printing (300 DPI PDF).',
    tag: '🖨️ CSC & CYBER CAFE',
    path: '/passport-photo-print-sheet-maker',
    icon: Printer,
    gradient: 'from-blue-500/10 via-indigo-500/10 to-cyan-500/10',
    border: 'border-blue-500/30 hover:border-blue-500',
    iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
  },
  {
    title: 'Resize Image in CM, MM & Inches',
    desc: 'Convert photo to 3.5x4.5 cm, 4x2 cm signature scan at 200/300 DPI with KB limiter.',
    tag: '📐 PHYSICAL UNITS',
    path: '/resize-image-in-cm-and-mm',
    icon: Sparkles,
    gradient: 'from-indigo-500/10 via-purple-500/10 to-pink-500/10',
    border: 'border-indigo-500/30 hover:border-indigo-500',
    iconBg: 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
  },
  {
    title: 'Merge PDF Documents Online',
    desc: 'Combine multiple PDF marksheets, certificates, and Aadhaar cards into single PDF in browser.',
    tag: '🔗 PDF COMBINER',
    path: '/merge-pdf-online',
    icon: Lock,
    gradient: 'from-rose-500/10 via-red-500/10 to-orange-500/10',
    border: 'border-rose-500/30 hover:border-rose-500',
    iconBg: 'bg-gradient-to-tr from-rose-600 to-red-600 text-white'
  },
  {
    title: 'Photo & Marksheet Clarifier & Unblur',
    desc: 'Auto-contrast, sharpen blurry roll numbers, and remove yellow phone camera tint in 1-click.',
    tag: '🪄 1-CLICK UNBLUR',
    path: '/unblur-photo-and-marksheet',
    icon: Sparkles,
    gradient: 'from-amber-500/10 via-yellow-500/10 to-orange-500/10',
    border: 'border-amber-500/30 hover:border-amber-500',
    iconBg: 'bg-gradient-to-tr from-amber-600 to-yellow-600 text-white'
  },
  {
    title: 'Photo AI Compliance Checker',
    desc: 'Run 8-point automated compliance audit (Size, Ratio, White Background, Blur) to prevent form rejection.',
    tag: '🛡️ REJECTION SHIELD',
    path: '/photo-compliance-checker',
    icon: FileCheck,
    gradient: 'from-slate-500/10 via-zinc-500/10 to-neutral-500/10',
    border: 'border-slate-500/30 hover:border-slate-400',
    iconBg: 'bg-gradient-to-tr from-slate-700 to-slate-900 text-white'
  }
]

export default function ProStudioSection() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            SizeSnap Pro Suite
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Next-Gen Sarkari Exam & Cyber Cafe Studio
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          100% Free · Client-Side Privacy · No Server Uploads
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRO_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.path}
              href={tool.path}
              className={`group p-5 rounded-2xl bg-white dark:bg-slate-900 border ${tool.border} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${tool.gradient} rounded-full blur-2xl pointer-events-none`} />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {tool.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
