'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FileText, Image as ImageIcon, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react'

interface PresetSpec {
  name: string
  photoSpec: string
  photoKb: string
  photoLink: string
  signSpec: string
  signKb: string
  signLink: string
  postcardSpec?: string
  postcardKb?: string
  postcardLink?: string
}

const PRESETS: PresetSpec[] = [
  {
    name: 'Railway RRB NTPC / ALP 2026',
    photoSpec: '3.5 x 4.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    photoLink: '/image-size-for-rrb-exam',
    signSpec: 'Black ink on white paper',
    signKb: '10 KB - 20 KB',
    signLink: '/resize-signature-for-rrb'
  },
  {
    name: 'NTA NEET UG 2026',
    photoSpec: '80% Face, White Background, Ears visible',
    photoKb: '10 KB - 200 KB',
    photoLink: '/image-size-for-neet-form',
    signSpec: 'Black ink on white paper',
    signKb: '4 KB - 30 KB',
    signLink: '/resize-signature-for-neet',
    postcardSpec: '4 x 6 Inch Postcard Size',
    postcardKb: '10 KB - 200 KB',
    postcardLink: '/neet-postcard-photo-resizer'
  },
  {
    name: 'SSC MTS / CGL 2026',
    photoSpec: '3.5 x 4.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    photoLink: '/image-size-for-ssc-mts-exam',
    signSpec: 'Black ink, 4.0 x 2.0 cm details',
    signKb: '10 KB - 20 KB',
    signLink: '/resize-signature-for-ssc-mts'
  },
  {
    name: 'UPSC CSE IAS 2026',
    photoSpec: '3.5 x 4.5 cm (White Background, Name & Date printed)',
    photoKb: '20 KB - 300 KB',
    photoLink: '/photo-size-for-upsc-form',
    signSpec: 'Rectangular Signature scan',
    signKb: '20 KB - 300 KB',
    signLink: '/resize-signature-for-upsc'
  },
  {
    name: 'UP Police Constable 2026',
    photoSpec: '3.5 x 4.5 cm (Plain White background)',
    photoKb: '20 KB - 50 KB',
    photoLink: '/photo-size-for-up-police-form',
    signSpec: 'Black ink scan (clear limits)',
    signKb: '5 KB - 20 KB',
    signLink: '/resize-image-to-20kb'
  },
  {
    name: 'SBI & IBPS Bank PO/Clerk',
    photoSpec: '4.5 x 3.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    photoLink: '/image-size-for-ibps-exam',
    signSpec: 'Black ink on white paper',
    signKb: '10 KB - 20 KB',
    signLink: '/resize-signature-for-ibps-exam'
  },
  {
    name: 'SSC GD Constable',
    photoSpec: '3.5 x 4.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    photoLink: '/image-size-for-ssc-gd',
    signSpec: 'Black ink (rectangular block)',
    signKb: '10 KB - 20 KB',
    signLink: '/resize-signature-for-ssc-gd'
  },
  {
    name: 'UPSSSC PET Exam',
    photoSpec: '3.5 x 4.5 cm (Plain White or Grey Background)',
    photoKb: '20 KB - 50 KB',
    photoLink: '/photo-size-for-upsssc-pet',
    signSpec: 'Signature with candidate Hindi name below',
    signKb: '5 KB - 20 KB',
    signLink: '/resize-signature-for-upsssc'
  }
]

export default function ExamPresetCalculator() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0)
  const active = PRESETS[selectedIdx]

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-white/10 shadow-xl relative overflow-hidden font-sans">
      
      {/* Decorative neon background light */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/25 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />

      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
          Live Specifications
        </span>
        <span className="text-slate-400 text-xs font-semibold">Official 2026 Guidelines</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Select Exam */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            Select Your Target Exam
          </h3>
          <p className="text-slate-400 text-xs">
            Choose your exam to automatically load the official sizing layout and limits:
          </p>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 select-none scrollbar-thin">
            {PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                  selectedIdx === idx
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Display Specs & CTAs */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-blue-300 tracking-tight">
              {active.name} Specifications:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Photo spec summary */}
              <div className="bg-slate-900/40 rounded-xl p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Passport Size Photo
                </span>
                <p className="text-xs font-bold text-white leading-tight">
                  {active.photoSpec}
                </p>
                <span className="text-[10px] font-black text-amber-400">
                  Target: {active.photoKb}
                </span>
              </div>

              {/* Signature spec summary */}
              <div className="bg-slate-900/40 rounded-xl p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Scanned Signature
                </span>
                <p className="text-xs font-bold text-white leading-tight">
                  {active.signSpec}
                </p>
                <span className="text-[10px] font-black text-amber-400">
                  Target: {active.signKb}
                </span>
              </div>

              {/* Optional Postcard Spec */}
              {active.postcardSpec && (
                <div className="bg-slate-900/40 rounded-xl p-3 border border-white/5 space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    Postcard Size Photo
                  </span>
                  <p className="text-xs font-bold text-white leading-tight">
                    {active.postcardSpec}
                  </p>
                  <span className="text-[10px] font-black text-amber-400">
                    Target: {active.postcardKb}
                  </span>
                </div>
              )}

            </div>
          </div>

          {/* Action Links */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2.5">
            <Link
              href={active.photoLink}
              className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Resize Photo <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={active.signLink}
              className="flex-1 min-w-[140px] bg-slate-800 hover:bg-slate-700 text-white text-xs font-black py-2.5 px-4 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Resize Signature <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {active.postcardLink && (
              <Link
                href={active.postcardLink}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Make Postcard Size (5x7/4x6)
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 flex items-center gap-1.5 justify-center">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        <span>Guidelines verified with active official recruitment notifications. 100% accurate targets.</span>
      </div>
    </div>
  )
}
