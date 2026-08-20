'use client'
import { useState, useRef } from 'react'
import {
  Upload,
  Download,
  PackageCheck,
  CheckCircle,
  FileText,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  FolderArchive,
  User,
  Calendar,
  AlertCircle,
  Clock,
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

interface SlotRequirement {
  id: string
  name: string
  type: 'photo' | 'signature' | 'thumb' | 'document' | 'postcard'
  targetKbMin: number
  targetKbMax: number
  aspectRatioLabel: string
  widthPx: number
  heightPx: number
  isPdfAllowed?: boolean
  description: string
}

interface ExamPreset {
  id: string
  name: string
  shortLabel: string
  badge: string
  color: string
  slots: SlotRequirement[]
}

const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc',
    name: 'SSC CGL / CHSL / MTS / GD (2026)',
    shortLabel: 'SSC Exam Suite',
    badge: 'Most Popular',
    color: 'from-blue-600 to-indigo-600',
    slots: [
      {
        id: 'photo',
        name: 'Passport Photo',
        type: 'photo',
        targetKbMin: 20,
        targetKbMax: 50,
        aspectRatioLabel: '3.5 x 4.5 cm (350x450 px)',
        widthPx: 350,
        heightPx: 450,
        description: 'White background, clear face, recent date'
      },
      {
        id: 'signature',
        name: 'Signature (Black/Blue Ink)',
        type: 'signature',
        targetKbMin: 10,
        targetKbMax: 20,
        aspectRatioLabel: '4.0 x 2.0 cm (400x200 px)',
        widthPx: 400,
        heightPx: 200,
        description: 'Plain white background, high contrast'
      },
      {
        id: 'marksheet',
        name: '10th Marksheet / Certificate',
        type: 'document',
        targetKbMin: 50,
        targetKbMax: 200,
        aspectRatioLabel: 'A4 Document Size',
        widthPx: 1240,
        heightPx: 1754,
        isPdfAllowed: true,
        description: 'Clear scan without shadows'
      }
    ]
  },
  {
    id: 'neet',
    name: 'NTA NEET UG 2026',
    shortLabel: 'NEET UG Suite',
    badge: 'NTA Standard',
    color: 'from-emerald-600 to-teal-600',
    slots: [
      {
        id: 'photo',
        name: 'Passport Photo (with Name & DOP)',
        type: 'photo',
        targetKbMin: 10,
        targetKbMax: 200,
        aspectRatioLabel: '3.5 x 4.5 cm (80% Face)',
        widthPx: 350,
        heightPx: 450,
        description: 'White background, Name & Date printed at bottom'
      },
      {
        id: 'postcard',
        name: 'Postcard Size Photo (4x6 inch)',
        type: 'postcard',
        targetKbMin: 10,
        targetKbMax: 200,
        aspectRatioLabel: '4 x 6 inch (1200x1800 px)',
        widthPx: 1200,
        heightPx: 1800,
        description: 'Large 4x6 photo with Name & Date'
      },
      {
        id: 'signature',
        name: 'Signature in Running Hand',
        type: 'signature',
        targetKbMin: 4,
        targetKbMax: 30,
        aspectRatioLabel: '4.0 x 2.0 cm',
        widthPx: 400,
        heightPx: 200,
        description: 'Black ink on white paper, no capitals only'
      },
      {
        id: 'thumb',
        name: 'Left & Right Hand Fingers / Thumb',
        type: 'thumb',
        targetKbMin: 10,
        targetKbMax: 200,
        aspectRatioLabel: 'Horizontal Impression',
        widthPx: 600,
        heightPx: 300,
        description: 'Blue ink impressions on white paper'
      }
    ]
  },
  {
    id: 'upsc',
    name: 'UPSC Civil Services / NDA / CDS',
    shortLabel: 'UPSC Suite',
    badge: 'Govt Standard',
    color: 'from-amber-600 to-orange-600',
    slots: [
      {
        id: 'photo',
        name: 'Passport Photo (with Name & Date)',
        type: 'photo',
        targetKbMin: 20,
        targetKbMax: 300,
        aspectRatioLabel: 'Min 350x350 px (Square/Portrait)',
        widthPx: 500,
        heightPx: 500,
        description: 'Recent photo (within 10 days) with Name & Date'
      },
      {
        id: 'signature',
        name: 'Clear Signature Scan',
        type: 'signature',
        targetKbMin: 20,
        targetKbMax: 300,
        aspectRatioLabel: 'Min 350x350 px',
        widthPx: 500,
        heightPx: 250,
        description: 'Plain paper scan with solid ink lines'
      },
      {
        id: 'idcard',
        name: 'Photo Identity Card (Aadhaar/PAN)',
        type: 'document',
        targetKbMin: 20,
        targetKbMax: 300,
        aspectRatioLabel: 'PDF Document',
        widthPx: 1200,
        heightPx: 800,
        isPdfAllowed: true,
        description: 'Merged front & back in single file'
      }
    ]
  },
  {
    id: 'ibps',
    name: 'IBPS PO / Clerk / SBI Banking',
    shortLabel: 'Banking Suite',
    badge: 'IBPS Guidelines',
    color: 'from-purple-600 to-pink-600',
    slots: [
      {
        id: 'photo',
        name: 'Candidate Photo',
        type: 'photo',
        targetKbMin: 20,
        targetKbMax: 50,
        aspectRatioLabel: '200 x 230 pixels',
        widthPx: 200,
        heightPx: 230,
        description: 'Light background, no red eye/caps'
      },
      {
        id: 'signature',
        name: 'Signature Scan',
        type: 'signature',
        targetKbMin: 10,
        targetKbMax: 20,
        aspectRatioLabel: '140 x 60 pixels',
        widthPx: 140,
        heightPx: 60,
        description: 'Black ink, running handwriting'
      },
      {
        id: 'thumb',
        name: 'Left Thumb Impression',
        type: 'thumb',
        targetKbMin: 20,
        targetKbMax: 50,
        aspectRatioLabel: '240 x 240 pixels',
        widthPx: 240,
        heightPx: 240,
        description: 'Blue or black ink clear thumbprint'
      },
      {
        id: 'declaration',
        name: 'Handwritten Declaration',
        type: 'document',
        targetKbMin: 50,
        targetKbMax: 100,
        aspectRatioLabel: '800 x 400 pixels',
        widthPx: 800,
        heightPx: 400,
        description: 'Written in English by candidate in black ink'
      }
    ]
  },
  {
    id: 'uppolice',
    name: 'UP Police Constable & SI Exams',
    shortLabel: 'UP Police Suite',
    badge: 'PRPB Standard',
    color: 'from-red-600 to-rose-600',
    slots: [
      {
        id: 'photo',
        name: 'Passport Size Photo',
        type: 'photo',
        targetKbMin: 20,
        targetKbMax: 50,
        aspectRatioLabel: '35 x 45 mm (350x450 px)',
        widthPx: 350,
        heightPx: 450,
        description: 'Plain white or light grey background'
      },
      {
        id: 'signature',
        name: 'Scanned Signature',
        type: 'signature',
        targetKbMin: 5,
        targetKbMax: 20,
        aspectRatioLabel: '3.5 x 1.5 cm (350x150 px)',
        widthPx: 350,
        heightPx: 150,
        description: 'Black pen on clean white sheet'
      }
    ]
  },
  {
    id: 'rrb',
    name: 'Railway RRB NTPC / ALP / Group D',
    shortLabel: 'RRB Railway Suite',
    badge: 'Railway Specs',
    color: 'from-blue-700 to-sky-600',
    slots: [
      {
        id: 'photo',
        name: 'Passport Photo (White BG)',
        type: 'photo',
        targetKbMin: 20,
        targetKbMax: 50,
        aspectRatioLabel: '35 x 45 mm',
        widthPx: 350,
        heightPx: 450,
        description: 'Must have a plain white background (Mandatory for RRB)'
      },
      {
        id: 'signature',
        name: 'Running Signature',
        type: 'signature',
        targetKbMin: 10,
        targetKbMax: 20,
        aspectRatioLabel: '50 x 20 mm',
        widthPx: 500,
        heightPx: 200,
        description: 'Signed on white paper with black/blue pen, no block letters'
      }
    ]
  },
  {
    id: 'ctet',
    name: 'CBSE CTET Exam',
    shortLabel: 'CTET Suite',
    badge: 'Teaching Exam',
    color: 'from-fuchsia-600 to-purple-600',
    slots: [
      {
        id: 'photo',
        name: 'Candidate Photo',
        type: 'photo',
        targetKbMin: 10,
        targetKbMax: 100,
        aspectRatioLabel: '3.5 x 4.5 cm',
        widthPx: 350,
        heightPx: 450,
        description: 'Clear face with no dark glasses'
      },
      {
        id: 'signature',
        name: 'Signature',
        type: 'signature',
        targetKbMin: 3,
        targetKbMax: 30,
        aspectRatioLabel: '3.5 x 1.5 cm',
        widthPx: 350,
        heightPx: 150,
        description: 'Black or blue ink on plain white paper'
      }
    ]
  },
  {
    id: 'agniveer',
    name: 'Indian Army Agniveer',
    shortLabel: 'Agniveer Suite',
    badge: 'Defence Specs',
    color: 'from-green-700 to-emerald-600',
    slots: [
      {
        id: 'photo',
        name: 'Passport Photo',
        type: 'photo',
        targetKbMin: 10,
        targetKbMax: 20,
        aspectRatioLabel: '35 x 45 mm',
        widthPx: 350,
        heightPx: 450,
        description: 'Light color background, no cap or dark glasses'
      },
      {
        id: 'signature',
        name: 'Signature',
        type: 'signature',
        targetKbMin: 5,
        targetKbMax: 10,
        aspectRatioLabel: '3.5 x 1.5 cm',
        widthPx: 350,
        heightPx: 150,
        description: 'Black or blue ink on plain white paper'
      }
    ]
  }
]



interface SlotState {
  file: File | null
  processedBlob: Blob | null
  processedUrl: string | null
  processedSizeKb: number
  status: 'empty' | 'processing' | 'ready' | 'error'
  error?: string
}

export default function ExamPackGeneratorTool({ config }: { config?: any }) {
  const [selectedExam, setSelectedExam] = useState<ExamPreset>(() => {
    if (config?.presetId) {
      const found = EXAM_PRESETS.find(p => p.id === config.presetId)
      if (found) return found
    }
    return EXAM_PRESETS[0]
  })
  const [candidateName, setCandidateName] = useState<string>('')
  const [photoDate, setPhotoDate] = useState<string>(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  })
  const [includeDateStamp, setIncludeDateStamp] = useState<boolean>(true)

  // Slot states mapped by slot.id
  const [slotStates, setSlotStates] = useState<Record<string, SlotState>>({})
  const [isZipping, setIsZipping] = useState<boolean>(false)
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null)

  // Process a single slot image with exact target dimensions and size
  const processSlotFile = async (slot: SlotRequirement, file: File) => {
    setSlotStates((prev) => ({
      ...prev,
      [slot.id]: { file, processedBlob: null, processedUrl: null, processedSizeKb: 0, status: 'processing' }
    }))

    try {
      const url = URL.createObjectURL(file)
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      const canvas = document.createElement('canvas')
      canvas.width = slot.widthPx
      canvas.height = slot.heightPx
      const ctx = canvas.getContext('2d')!

      // White background fill
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Maintain aspect ratio or fill center
      const imgAspect = img.width / img.height
      const targetAspect = canvas.width / canvas.height

      let drawW = canvas.width
      let drawH = canvas.height
      let drawX = 0
      let drawY = 0

      if (imgAspect > targetAspect) {
        drawW = canvas.height * imgAspect
        drawX = (canvas.width - drawW) / 2
      } else {
        drawH = canvas.width / imgAspect
        drawY = (canvas.height - drawH) / 2
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH)

      // Signature auto-contrast if signature
      if (slot.type === 'signature') {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const d = imgData.data
        for (let i = 0; i < d.length; i += 4) {
          const brightness = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114)
          // Paper whitening threshold
          if (brightness > 185) {
            d[i] = 255
            d[i + 1] = 255
            d[i + 2] = 255
          } else {
            // Darken ink
            d[i] = Math.max(0, d[i] - 40)
            d[i + 1] = Math.max(0, d[i + 1] - 40)
            d[i + 2] = Math.max(0, d[i + 2] - 40)
          }
        }
        ctx.putImageData(imgData, 0, 0)
      }

      // Add Name & Date Stamp if photo & requested
      if ((slot.type === 'photo' || slot.type === 'postcard') && includeDateStamp && (candidateName || photoDate)) {
        const bannerHeight = Math.round(canvas.height * 0.18)
        const bannerY = canvas.height - bannerHeight

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, bannerY, canvas.width, bannerHeight)

        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 1
        ctx.strokeRect(0, bannerY, canvas.width, bannerHeight)

        ctx.fillStyle = '#0f172a'
        ctx.textAlign = 'center'

        const fontSize = Math.max(12, Math.round(bannerHeight * 0.32))
        ctx.font = `bold ${fontSize}px sans-serif`

        if (candidateName && photoDate) {
          ctx.fillText(candidateName.toUpperCase(), canvas.width / 2, bannerY + bannerHeight * 0.42)
          ctx.font = `600 ${Math.round(fontSize * 0.85)}px sans-serif`
          ctx.fillText(`DOP: ${photoDate}`, canvas.width / 2, bannerY + bannerHeight * 0.82)
        } else if (candidateName) {
          ctx.fillText(candidateName.toUpperCase(), canvas.width / 2, bannerY + bannerHeight * 0.62)
        } else if (photoDate) {
          ctx.fillText(`DOP: ${photoDate}`, canvas.width / 2, bannerY + bannerHeight * 0.62)
        }
      }

      // Compress to target KB range (Binary search quality)
      const targetMidKb = (slot.targetKbMin + slot.targetKbMax) / 2
      let minQuality = 0.3
      let maxQuality = 0.98
      let bestBlob: Blob | null = null

      for (let attempt = 0; attempt < 6; attempt++) {
        const q = (minQuality + maxQuality) / 2
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', q))
        if (!blob) break

        const kb = blob.size / 1024
        bestBlob = blob

        if (kb > slot.targetKbMax) {
          maxQuality = q
        } else if (kb < slot.targetKbMin) {
          minQuality = q
        } else {
          // Inside perfect range
          break
        }
      }

      URL.revokeObjectURL(url)

      if (bestBlob) {
        const pUrl = URL.createObjectURL(bestBlob)
        const sizeKb = Math.round(bestBlob.size / 1024)

        setSlotStates((prev) => ({
          ...prev,
          [slot.id]: {
            file,
            processedBlob: bestBlob,
            processedUrl: pUrl,
            processedSizeKb: sizeKb,
            status: 'ready'
          }
        }))
      }
    } catch (err: any) {
      console.error(err)
      setSlotStates((prev) => ({
        ...prev,
        [slot.id]: {
          file,
          processedBlob: null,
          processedUrl: null,
          processedSizeKb: 0,
          status: 'error',
          error: 'Failed to format image'
        }
      }))
    }
  }

  // Generate and download all files as a ZIP
  // Trigger multiple individual downloads (mobile friendly instead of ZIP)
  const handleDownloadAllIndividually = async () => {
    setIsZipping(true) // Reusing the state just for button loading indicator
    let delay = 0
    let addedCount = 0
    for (const slot of selectedExam.slots) {
      const state = slotStates[slot.id]
      if (state && state.processedUrl) {
        addedCount++
        // Slight delay to prevent browser from blocking multiple rapid downloads
        setTimeout(() => {
          const ext = 'jpg'
          const safeName = `${slot.id}-${candidateName ? candidateName.replace(/\\s+/g, '_') : 'file'}.${ext}`
          const a = document.createElement('a')
          a.href = state.processedUrl!
          a.download = safeName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }, delay)
        delay += 500
      }
    }
    
    if (addedCount === 0) {
      alert('Please upload at least 1 document to download.')
    }
    
    setTimeout(() => {
      setIsZipping(false)
    }, delay)
  }

  const allReadyCount = selectedExam.slots.filter((s) => slotStates[s.id]?.status === 'ready').length

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            1-Click Sarkari Exam Auto-Dossier
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1-Click Sarkari Exam Form Pack Generator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Auto-format Photo (with Name/Date), Signature, Thumb & Marksheets to official exam guidelines in 1-Click.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% In-Browser Privacy
          </span>
        </div>
      </div>

      {/* Exam Presets Selector Pills */}
      <div className="mt-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          1. Select Target Sarkari Exam Portal:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {EXAM_PRESETS.map((preset) => {
            const isSelected = selectedExam.id === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedExam(preset)
                  setSlotStates({})
                }}
                className={`p-3 rounded-2xl text-left border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {preset.badge}
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                    {preset.name}
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                  {preset.slots.length} Documents Required
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Candidate Optional Info (For Photo Name & Date Stamp) */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            2. Candidate Name & Date Stamp on Photo (Official SSC/NEET/UPSC Rule):
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDateStamp}
              onChange={(e) => setIncludeDateStamp(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            Print Name & Date on Photo
          </label>
        </div>

        {includeDateStamp && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Candidate Full Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. RAHUL KUMAR SHARMA"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white uppercase font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Date of Photo (DOP)
              </label>
              <input
                type="date"
                value={photoDate}
                onChange={(e) => setPhotoDate(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Multi-Slot Upload Matrix */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            3. Upload Your Raw Photos & Documents:
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Completed: <strong>{allReadyCount}</strong> of {selectedExam.slots.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedExam.slots.map((slot, index) => {
            const state = slotStates[slot.id] || { status: 'empty' }
            const isReady = state.status === 'ready'
            const isProcessing = state.status === 'processing'

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isReady
                    ? 'border-emerald-500/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60'
                }`}
              >
                {/* Slot Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{slot.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Target: <span className="font-semibold text-blue-600 dark:text-blue-400">{slot.targetKbMin}KB – {slot.targetKbMax}KB</span> ({slot.aspectRatioLabel})
                      </p>
                    </div>
                  </div>

                  {isReady && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {state.processedSizeKb} KB (Passed)
                    </span>
                  )}
                </div>

                {/* Upload or Preview Content */}
                <div className="flex items-center gap-3">
                  {/* Thumbnail / Upload Area */}
                  {isReady && state.processedUrl ? (
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center p-1">
                      <img
                        src={state.processedUrl}
                        alt={slot.name}
                        className="max-h-full max-w-full object-contain rounded"
                      />
                    </div>
                  ) : (
                    <label className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-center gap-2 transition">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          if (e.target.files?.[0]) processSlotFile(slot, e.target.files[0])
                        }}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {isProcessing ? 'Processing & Compressing...' : `Upload ${slot.name}`}
                      </span>
                    </label>
                  )}

                  {/* Actions when Ready */}
                  {isReady && (
                    <div className="flex-1 flex flex-col gap-2">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Auto-adjusted resolution to {slot.widthPx}x{slot.heightPx}px and size to {state.processedSizeKb}KB.
                      </p>
                      <div className="flex items-center gap-2">
                        <a
                          href={state.processedUrl || '#'}
                          download={`${slot.id}-${candidateName ? candidateName.replace(/\s+/g, '_') : 'file'}.jpg`}
                          className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-[11px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                        <label className="px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-[11px] font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition flex items-center gap-1">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                              if (e.target.files?.[0]) processSlotFile(slot, e.target.files[0])
                            }}
                            className="hidden"
                          />
                          <RefreshCw className="w-3 h-3" />
                          Change
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Big Master Action: Download Complete Exam Pack */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Download {selectedExam.shortLabel} (Ready-to-Upload Bundle)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Auto-downloads all completed files (photo, signature, etc.) individually to your device without requiring ZIP extraction.
          </p>
        </div>

        <button
          onClick={handleDownloadAllIndividually}
          disabled={allReadyCount === 0 || isZipping}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FolderArchive className="w-4 h-4" />
          {isZipping ? 'Downloading Files...' : `Download ${allReadyCount} Ready Files`}
        </button>
      </div>
    </div>
  )
}
