'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  Type,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Tag
} from 'lucide-react'

export default function PhotoNameDateStamperTool({ config }: { config?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [candidateName, setCandidateName] = useState<string>('NAME HERE')
  const [dateText, setDateText] = useState<string>(() => {
    const today = new Date()
    const d = String(today.getDate()).padStart(2, '0')
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const y = today.getFullYear()
    return `DOP: ${d}/${m}/${y}`
  })
  const [stampStyle, setStampStyle] = useState<'solid_white' | 'translucent' | 'two_line'>('solid_white')
  const [fontSize, setFontSize] = useState<number>(24)
  const [targetKb, setTargetKb] = useState<number>(50)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    setOutputUrl(null)
  }

  const renderStampedPhoto = async () => {
    if (!previewUrl) return
    setIsProcessing(true)

    try {
      const img = new Image()
      img.src = previewUrl
      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Standard Passport 3.5 x 4.5 ratio standard canvas (413 x 531 px)
      const canvasW = 413
      const canvasH = 531
      const canvas = document.createElement('canvas')
      canvas.width = canvasW
      canvas.height = canvasH
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')

      // 1. Draw source image (cover/center crop)
      const scale = Math.max(canvasW / img.width, canvasH / img.height)
      const scaledW = img.width * scale
      const scaledH = img.height * scale
      const offsetX = (canvasW - scaledW) / 2
      const offsetY = (canvasH - scaledH) / 2

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvasW, canvasH)
      ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH)

      // 2. Draw Stamp Box at the bottom
      const bannerHeight = stampStyle === 'two_line' ? 88 : 72
      const bannerY = canvasH - bannerHeight

      if (stampStyle === 'solid_white' || stampStyle === 'two_line') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, bannerY, canvasW, bannerHeight)
        // Add subtle divider line
        ctx.strokeStyle = '#E2E8F0'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(0, bannerY)
        ctx.lineTo(canvasW, bannerY)
        ctx.stroke()
      } else if (stampStyle === 'translucent') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
        ctx.fillRect(0, bannerY, canvasW, bannerHeight)
      }

      // 3. Render Text
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const textColor = stampStyle === 'translucent' ? '#FFFFFF' : '#0F172A'
      ctx.fillStyle = textColor

      if (stampStyle === 'two_line') {
        // Line 1: Candidate Name
        ctx.font = `bold 20px Inter, Arial, sans-serif`
        ctx.fillText(candidateName.toUpperCase(), canvasW / 2, bannerY + 28)

        // Line 2: Date of Photo
        ctx.font = `bold 18px Inter, Arial, sans-serif`
        ctx.fillText(dateText.toUpperCase(), canvasW / 2, bannerY + 60)
      } else {
        // Single Combined or Two Line layout
        ctx.font = `bold 19px Inter, Arial, sans-serif`
        ctx.fillText(candidateName.toUpperCase(), canvasW / 2, bannerY + 25)

        ctx.font = `bold 17px Inter, Arial, sans-serif`
        ctx.fillText(dateText.toUpperCase(), canvasW / 2, bannerY + 52)
      }

      // 4. Compress to target KB
      let minQ = 0.4
      let maxQ = 0.98
      let bestBlob: Blob | null = null

      for (let i = 0; i < 5; i++) {
        const mid = (minQ + maxQ) / 2
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, 'image/jpeg', mid)
        )
        if (!blob) break
        const sizeKb = blob.size / 1024
        bestBlob = blob
        if (sizeKb > targetKb) maxQ = mid
        else minQ = mid
      }

      if (bestBlob) {
        const outUrl = URL.createObjectURL(bestBlob)
        setOutputUrl(outUrl)
        const finalKb = Math.round(bestBlob.size / 1024)
        setOutputSize(finalKb)

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('sizesnap_file_ready', {
              detail: {
                id: Date.now().toString(),
                name: `photo-with-name-date-${finalKb}kb.jpg`,
                url: outUrl,
                sizeKb: finalKb,
                type: 'JPG (SSC/NEET Stamp)'
              }
            })
          )
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (previewUrl) {
      renderStampedPhoto()
    }
  }, [previewUrl, candidateName, dateText, stampStyle, fontSize, targetKb])

  return (
    <div className="space-y-6">
      {/* Upload State */}
      {!previewUrl && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-400/60 dark:border-blue-500/30 rounded-3xl p-10 text-center cursor-pointer hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Upload Passport Photo to Add Name & Date of Photo (DOP / DOB)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Mandatory for SSC CGL, CHSL, MTS, GD, NEET & UPSC forms. Formats photo to official 3.5 x 4.5 cm with crisp printed name bar under 50KB.
          </p>
        </div>
      )}

      {/* Main Studio Interface */}
      {previewUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                Name & Date Inputs
              </h3>
              <button
                onClick={() => {
                  setPreviewUrl(null)
                  setOutputUrl(null)
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Change Photo
              </button>
            </div>

            {/* Candidate Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-blue-600" /> Candidate Full Name (Capital Letters)
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value.toUpperCase())}
                placeholder="e.g. PAWAN PRAJAPATI"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Date of Photo (DOP) Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Date of Photo (DOP) / Date of Birth (DOB)
              </label>
              <input
                type="text"
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                placeholder="e.g. DOP: 15/07/2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    const today = new Date()
                    const d = String(today.getDate()).padStart(2, '0')
                    const m = String(today.getMonth() + 1).padStart(2, '0')
                    const y = today.getFullYear()
                    setDateText(`DOP: ${d}/${m}/${y}`)
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                >
                  Set Today's Date
                </button>
                <button
                  onClick={() => setDateText('DOB: 12/04/2002')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                >
                  Set DOB Format
                </button>
              </div>
            </div>

            {/* Banner Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Name & Date Banner Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStampStyle('solid_white')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    stampStyle === 'solid_white'
                      ? 'bg-blue-50 border-blue-600 text-blue-950 dark:bg-blue-950/40 dark:text-blue-200 ring-1 ring-blue-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold block">Solid White Banner</span>
                  <span className="text-[10px] text-slate-500 block">Official SSC / UPSC standard</span>
                </button>

                <button
                  onClick={() => setStampStyle('translucent')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    stampStyle === 'translucent'
                      ? 'bg-blue-50 border-blue-600 text-blue-950 dark:bg-blue-950/40 dark:text-blue-200 ring-1 ring-blue-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold block">Translucent Dark Banner</span>
                  <span className="text-[10px] text-slate-500 block">Modern overlay style</span>
                </button>
              </div>
            </div>

            {/* Target KB Limit */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target File Size Limit
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[20, 50, 100, 200].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => setTargetKb(kb)}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      targetKb === kb
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ≤{kb}KB {kb === 50 && '⭐ (SSC)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Stamped Photo Preview (3.5 x 4.5 cm)
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Official SSC/NEET Spec
                </span>
              </div>

              {/* Photo Box */}
              <div className="relative mx-auto max-h-[340px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-150 overflow-hidden">
                {outputUrl && (
                  <img
                    src={outputUrl}
                    alt="Stamped Passport Photo"
                    className="max-h-[300px] w-auto object-contain rounded-lg shadow-md border border-slate-300"
                  />
                )}
              </div>

              {outputUrl && (
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Size: {outputSize} KB (Target: ≤{targetKb}KB)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Dimensions: 413 x 531 px
                  </span>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={outputUrl}
                  download={`photo-with-name-date-${outputSize}kb.jpg`}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Stamped Photo ({outputSize} KB)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
