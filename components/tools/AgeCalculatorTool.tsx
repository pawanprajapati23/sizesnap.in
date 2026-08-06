'use client'
import { useState, useMemo } from 'react'
import {
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Share2,
  Zap,
  Sparkles
} from 'lucide-react'

interface ExamRule {
  id: string
  name: string
  org: string
  minAge: number
  maxAgeGeneral: number
  obcRelax: number
  scstRelax: number
  pwdRelax: number
}

const EXAM_RULES: ExamRule[] = [
  { id: 'ssc_cgl', name: 'SSC CGL (Group B/C)', org: 'Staff Selection Commission', minAge: 18, maxAgeGeneral: 32, obcRelax: 3, scstRelax: 5, pwdRelax: 10 },
  { id: 'ssc_chsl', name: 'SSC CHSL / MTS', org: 'Staff Selection Commission', minAge: 18, maxAgeGeneral: 27, obcRelax: 3, scstRelax: 5, pwdRelax: 10 },
  { id: 'upsc_cse', name: 'UPSC IAS / IPS (CSE)', org: 'Union Public Service Commission', minAge: 21, maxAgeGeneral: 32, obcRelax: 3, scstRelax: 5, pwdRelax: 10 },
  { id: 'rrb_ntpc', name: 'Railway RRB NTPC / ALP', org: 'Railway Recruitment Board', minAge: 18, maxAgeGeneral: 33, obcRelax: 3, scstRelax: 5, pwdRelax: 10 },
  { id: 'up_police', name: 'UP Police / State Constable', org: 'State Police Recruitment', minAge: 18, maxAgeGeneral: 25, obcRelax: 3, scstRelax: 5, pwdRelax: 5 },
  { id: 'ibps_po', name: 'IBPS / SBI Bank PO', org: 'Banking Personnel Selection', minAge: 20, maxAgeGeneral: 30, obcRelax: 3, scstRelax: 5, pwdRelax: 10 },
  { id: 'ibps_clerk', name: 'IBPS / SBI Bank Clerk', org: 'Banking Personnel Selection', minAge: 20, maxAgeGeneral: 28, obcRelax: 3, scstRelax: 5, pwdRelax: 10 },
  { id: 'nda', name: 'UPSC NDA (Defense)', org: 'National Defence Academy', minAge: 16.5, maxAgeGeneral: 19.5, obcRelax: 0, scstRelax: 0, pwdRelax: 0 },
  { id: 'cds', name: 'UPSC CDS (IMA/OTA)', org: 'Combined Defence Services', minAge: 19, maxAgeGeneral: 24, obcRelax: 0, scstRelax: 0, pwdRelax: 0 },
  { id: 'neet_ug', name: 'NTA NEET UG', org: 'National Testing Agency', minAge: 17, maxAgeGeneral: 99, obcRelax: 0, scstRelax: 0, pwdRelax: 0 },
]

export default function AgeCalculatorTool({ config }: { config?: any }) {
  const todayStr = new Date().toISOString().split('T')[0]
  const [dob, setDob] = useState<string>('2002-05-15')
  const [targetDate, setTargetDate] = useState<string>(todayStr)
  const [category, setCategory] = useState<'gen' | 'obc' | 'scst' | 'pwd'>('gen')
  const [copied, setCopied] = useState(false)

  // Calculate detailed age breakdown
  const ageResult = useMemo(() => {
    if (!dob || !targetDate) return null
    const birth = new Date(dob)
    const target = new Date(targetDate)

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) {
      return null
    }

    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months -= 1
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate()
      days += prevMonthLastDay
    }

    if (months < 0) {
      years -= 1
      months += 12
    }

    const diffTime = target.getTime() - birth.getTime()
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const decimalAge = years + months / 12 + days / 365.25

    // Next Birthday countdown
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1)
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    return {
      years,
      months,
      days,
      decimalAge,
      totalDays,
      totalWeeks,
      totalMonths,
      daysToNextBday
    }
  }, [dob, targetDate])

  // Check eligibility for exams based on category relaxation
  const eligibility = useMemo(() => {
    if (!ageResult) return []

    return EXAM_RULES.map((exam) => {
      let relaxation = 0
      if (category === 'obc') relaxation = exam.obcRelax
      else if (category === 'scst') relaxation = exam.scstRelax
      else if (category === 'pwd') relaxation = exam.pwdRelax

      const effectiveMax = exam.maxAgeGeneral + relaxation
      const isEligible = ageResult.decimalAge >= exam.minAge && ageResult.decimalAge <= effectiveMax
      const isUnderage = ageResult.decimalAge < exam.minAge

      return {
        ...exam,
        effectiveMax,
        relaxation,
        isEligible,
        isUnderage
      }
    })
  }, [ageResult, category])

  const handleCopy = () => {
    if (!ageResult) return
    const text = `🎯 SizeSnap Age & Eligibility Report
📅 Date of Birth: ${dob}
⏱️ Age as on ${targetDate}: ${ageResult.years} Years, ${ageResult.months} Months, ${ageResult.days} Days
📊 Total Days: ${ageResult.totalDays} | Total Weeks: ${ageResult.totalWeeks}
🎂 Next Birthday in: ${ageResult.daysToNextBday} Days
🔗 Check your Sarkari Exam Eligibility free on https://sizesnap.in`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              1. Date of Birth (जन्म तिथि)
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Target Cutoff Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              2. Age As On Date (कटऑफ तिथि)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Reservation Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              3. Category (आयु में छूट)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="gen">General / EWS (No Relaxation)</option>
              <option value="obc">OBC (Non-Creamy) (+3 Years)</option>
              <option value="scst">SC / ST (+5 Years)</option>
              <option value="pwd">PwD / Divyang (+10 Years)</option>
            </select>
          </div>
        </div>

        {/* Quick Cutoff Preset Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Popular Exam Cutoffs:
          </span>
          <button
            onClick={() => setTargetDate(`${new Date().getFullYear()}-01-01`)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 transition-colors"
          >
            01 Jan {new Date().getFullYear()} (SSC/RRB)
          </button>
          <button
            onClick={() => setTargetDate(`${new Date().getFullYear()}-08-01`)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 transition-colors"
          >
            01 Aug {new Date().getFullYear()} (UPSC CSE)
          </button>
          <button
            onClick={() => setTargetDate(todayStr)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Today ({todayStr})
          </button>
        </div>
      </div>

      {/* Main Age Result Display */}
      {ageResult ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Exact Age Calculation Result
                  </span>
                  <p className="text-xs text-slate-300 mt-1 font-medium">
                    Calculated for cutoff date: <strong className="text-white">{targetDate}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Mera Sarkari Exam Age Calculation: ${ageResult.years} Years, ${ageResult.months} Months, ${ageResult.days} Days as on ${targetDate}. Check your eligibility on https://sizesnap.in`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Primary Age Numbers */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-3xl sm:text-5xl font-black text-amber-400 leading-none">
                    {ageResult.years}
                  </span>
                  <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                    Years (वर्ष)
                  </span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-3xl sm:text-5xl font-black text-blue-400 leading-none">
                    {ageResult.months}
                  </span>
                  <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                    Months (महीने)
                  </span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-3xl sm:text-5xl font-black text-emerald-400 leading-none">
                    {ageResult.days}
                  </span>
                  <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                    Days (दिन)
                  </span>
                </div>
              </div>

              {/* Auxiliary Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Months</span>
                  <strong className="text-white text-sm">{ageResult.totalMonths} Months</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Weeks</span>
                  <strong className="text-white text-sm">{ageResult.totalWeeks} Weeks</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Days</span>
                  <strong className="text-white text-sm">{ageResult.totalDays.toLocaleString()} Days</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Birthday</span>
                  <strong className="text-amber-400 text-sm">{ageResult.daysToNextBday} Days Left</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sarkari Exam Live Eligibility Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Sarkari Exam Eligibility Status (2026)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Based on your age ({ageResult.years} Yrs) & {category.toUpperCase()} category relaxation (+{category === 'gen' ? 0 : category === 'obc' ? 3 : category === 'scst' ? 5 : 10} Yrs):
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eligibility.map((exam) => (
                <div
                  key={exam.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    exam.isEligible
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200 dark:border-rose-800/40 opacity-75'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {exam.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Age Limit: <span className="font-semibold">{exam.minAge} to {exam.effectiveMax} Years</span>
                      {exam.relaxation > 0 && <span className="text-emerald-600 font-bold ml-1">(+{exam.relaxation}y relaxed)</span>}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {exam.isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Eligible
                      </span>
                    ) : exam.isUnderage ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Underage
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider">
                        <XCircle className="w-3.5 h-3.5" />
                        Overage
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300">
          Please select a valid Date of Birth and Cutoff Date above to see your exact age and exam eligibility.
        </div>
      )}
    </div>
  )
}
