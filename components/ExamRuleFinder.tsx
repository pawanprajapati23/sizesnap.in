'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Filter,
  Sparkles,
  Camera,
  PenTool,
  Calendar,
  FileCheck2
} from 'lucide-react'

interface ExamRuleData {
  id: string
  name: string
  fullName: string
  category: 'SSC' | 'Railway' | 'UPSC' | 'Banking' | 'Medical/Eng' | 'State Police' | 'Defence'
  photoSize: string
  photoDimensions: string
  photoBg: string
  nameDateRequired: boolean
  nameDateNote: string
  signSize: string
  signDimensions: string
  signInk: string
  actionUrl: string
  actionLabel: string
}

const EXAM_DATABASE: ExamRuleData[] = [
  {
    id: 'ssc_cgl',
    name: 'SSC CGL / CHSL / MTS',
    fullName: 'Staff Selection Commission Exams',
    category: 'SSC',
    photoSize: '20 KB to 50 KB',
    photoDimensions: '3.5 cm × 4.5 cm (200 DPI)',
    photoBg: 'Plain White or Light Gray',
    nameDateRequired: false,
    nameDateNote: 'Live webcam capture or recent without cap/specs',
    signSize: '10 KB to 20 KB',
    signDimensions: '4.0 cm × 2.0 cm',
    signInk: 'Black ink on white paper',
    actionUrl: '/image-size-for-ssc-form',
    actionLabel: 'Format for SSC Form'
  },
  {
    id: 'nta_neet',
    name: 'NTA NEET UG 2026',
    fullName: 'National Eligibility cum Entrance Test',
    category: 'Medical/Eng',
    photoSize: '10 KB to 200 KB',
    photoDimensions: 'Passport (3.5x4.5cm) + Postcard (4x6 inch)',
    photoBg: 'Pure White Background (80% Face)',
    nameDateRequired: true,
    nameDateNote: 'Candidate Name & Date of Photo mandatory at bottom',
    signSize: '4 KB to 30 KB',
    signDimensions: 'Running handwriting scan',
    signInk: 'Black ink on white paper (No capitals)',
    actionUrl: '/image-size-for-neet-form',
    actionLabel: 'Format for NEET 2026'
  },
  {
    id: 'upsc_cse',
    name: 'UPSC IAS / IPS / CDS / NDA',
    fullName: 'Union Public Service Commission',
    category: 'UPSC',
    photoSize: '20 KB to 300 KB',
    photoDimensions: '350 × 350 px (Min) to 1000 × 1000 px',
    photoBg: 'Plain White / Off-white',
    nameDateRequired: true,
    nameDateNote: 'Name & Date of Photo (not older than 10 days) at bottom',
    signSize: '20 KB to 300 KB',
    signDimensions: '350 × 350 px (Min) to 1000 × 1000 px',
    signInk: 'Black ink signature scan',
    actionUrl: '/photo-size-for-upsc-form',
    actionLabel: 'Format for UPSC Form'
  },
  {
    id: 'rrb_ntpc',
    name: 'Railway RRB NTPC / ALP / Group D',
    fullName: 'Railway Recruitment Board',
    category: 'Railway',
    photoSize: '20 KB to 50 KB',
    photoDimensions: '3.5 cm × 4.5 cm (300 DPI)',
    photoBg: 'Plain White Background Only',
    nameDateRequired: false,
    nameDateNote: 'Recent color photo without dark glasses',
    signSize: '10 KB to 20 KB',
    signDimensions: '4.0 cm × 2.0 cm or 50 × 20 mm',
    signInk: 'Black ink on white paper',
    actionUrl: '/image-size-for-rrb-exam',
    actionLabel: 'Format for Railway Form'
  },
  {
    id: 'up_police',
    name: 'UP Police Constable & SI',
    fullName: 'Uttar Pradesh Police Recruitment (UPPRPB)',
    category: 'State Police',
    photoSize: '20 KB to 50 KB',
    photoDimensions: '3.5 cm × 4.5 cm (70% Face)',
    photoBg: 'White or Light Gray background',
    nameDateRequired: false,
    nameDateNote: 'Neutral expression, ears clearly visible',
    signSize: '5 KB to 20 KB',
    signDimensions: '3.5 cm × 1.5 cm',
    signInk: 'Black ink pen scan',
    actionUrl: '/photo-size-for-up-police-form',
    actionLabel: 'Format for UP Police'
  },
  {
    id: 'ibps_sbi',
    name: 'IBPS PO / Clerk & SBI Bank',
    fullName: 'Institute of Banking Personnel Selection',
    category: 'Banking',
    photoSize: '20 KB to 50 KB',
    photoDimensions: '4.5 cm × 3.5 cm (200 × 230 px)',
    photoBg: 'Light colored / White background',
    nameDateRequired: false,
    nameDateNote: 'Color passport photograph with clear eyes',
    signSize: '10 KB to 20 KB',
    signDimensions: '140 × 60 pixels',
    signInk: 'Black ink only (Capital letters not allowed)',
    actionUrl: '/image-size-for-ibps-exam',
    actionLabel: 'Format for Bank Form'
  },
  {
    id: 'jee_main',
    name: 'NTA JEE Main & Advanced',
    fullName: 'Joint Entrance Examination (Engineering)',
    category: 'Medical/Eng',
    photoSize: '10 KB to 200 KB',
    photoDimensions: '3.5 cm × 4.5 cm',
    photoBg: 'White Background (80% Face coverage)',
    nameDateRequired: false,
    nameDateNote: 'Spectacles allowed only if used regularly',
    signSize: '4 KB to 30 KB',
    signDimensions: '3.5 cm × 1.5 cm',
    signInk: 'Black / Blue ink on white paper',
    actionUrl: '/image-size-for-jee-main',
    actionLabel: 'Format for JEE Main'
  },
  {
    id: 'bpsc_mppsc',
    name: 'BPSC & MPPSC State PSC',
    fullName: 'Bihar & Madhya Pradesh Public Service',
    category: 'UPSC',
    photoSize: '25 KB to 100 KB',
    photoDimensions: '3.5 cm × 4.5 cm',
    photoBg: 'Light or White Background',
    nameDateRequired: false,
    nameDateNote: 'Clear passport size studio photograph',
    signSize: '10 KB to 50 KB',
    signDimensions: 'Clear rectangular scan',
    signInk: 'Dark ink signature',
    actionUrl: '/photo-size-for-bpsc-exam',
    actionLabel: 'Format for State PSC'
  },
  {
    id: 'ctet_exam',
    name: 'CTET / State TET (Teaching)',
    fullName: 'Central Teacher Eligibility Test',
    category: 'Medical/Eng',
    photoSize: '10 KB to 100 KB',
    photoDimensions: '3.5 cm × 4.5 cm',
    photoBg: 'White Background',
    nameDateRequired: false,
    nameDateNote: 'Passport style photo',
    signSize: '3 KB to 30 KB',
    signDimensions: '3.5 cm × 1.5 cm',
    signInk: 'Black or Blue ink',
    actionUrl: '/image-size-for-ctet-form',
    actionLabel: 'Format for CTET'
  },
  {
    id: 'dsssb_delhi',
    name: 'DSSSB Delhi Govt Exams',
    fullName: 'Delhi Subordinate Services Selection Board',
    category: 'State Police',
    photoSize: '50 KB to 300 KB',
    photoDimensions: '5 x 7 inch Postcard (400 x 600 px)',
    photoBg: 'White Background',
    nameDateRequired: false,
    nameDateNote: 'Postcard size photo is strictly mandated',
    signSize: '10 KB to 50 KB',
    signDimensions: '140 x 110 pixels',
    signInk: 'Dark ink signature scan',
    actionUrl: '/dsssb-postcard-photo-resizer',
    actionLabel: 'Format for DSSSB Postcard'
  }
]

const CATEGORIES = ['All', 'SSC', 'Railway', 'UPSC', 'Banking', 'Medical/Eng', 'State Police']

export default function ExamRuleFinder() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredExams = useMemo(() => {
    return EXAM_DATABASE.filter((exam) => {
      const matchesCategory =
        activeCategory === 'All' || exam.category === activeCategory
      const matchesQuery =
        exam.name.toLowerCase().includes(query.toLowerCase()) ||
        exam.fullName.toLowerCase().includes(query.toLowerCase()) ||
        exam.category.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Official Guidelines Database 2026
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Instant Sarkari Exam Photo & Signature Rule Finder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search any exam to check exact required dimensions, KB limits, Name/Date rules, and background requirements.
          </p>
        </div>

        <Link
          href="/sarkari-exam-pack-generator"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <span>⚡ 1-Click All-in-1 Pack</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Search Input Bar & Category Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your exam name (e.g. SSC CGL, NEET, UPSC, RRB, UP Police, SBI)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-4 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
          >
            <div className="space-y-3">
              {/* Exam Title & Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {exam.fullName}
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0">
                  {exam.category}
                </span>
              </div>

              {/* Photo & Sign Specs Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Photo Spec */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[11px] uppercase">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Photo Rules</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {exam.photoDimensions}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Size: <strong className="text-slate-700 dark:text-slate-300">{exam.photoSize}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Bg: {exam.photoBg}
                  </div>
                </div>

                {/* Signature Spec */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] uppercase">
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Sign Rules</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {exam.signDimensions}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Size: <strong className="text-slate-700 dark:text-slate-300">{exam.signSize}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Ink: {exam.signInk}
                  </div>
                </div>
              </div>

              {/* Name & Date on Photo Notice */}
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  exam.nameDateRequired
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {exam.nameDateRequired ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className="text-[11px] font-medium leading-tight">
                  {exam.nameDateRequired ? (
                    <strong>Name & Date on Photo MANDATORY: </strong>
                  ) : (
                    <strong>Name/Date on Photo NOT Required: </strong>
                  )}
                  {exam.nameDateNote}
                </span>
              </div>
            </div>

            {/* Direct Launch Button */}
            <Link
              href={exam.actionUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm group-hover:shadow-md"
            >
              <span>{exam.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}

        {filteredExams.length === 0 && (
          <div className="col-span-2 p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No exam matching "{query}" found in quick search.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching "SSC", "NEET", "UPSC", or use our custom dimension resizer tool.
            </p>
            <Link
              href="/resize-image-in-cm-and-mm"
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Open Custom CM/MM Resizer
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
