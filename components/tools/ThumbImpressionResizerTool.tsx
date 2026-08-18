'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Fingerprint,
  Upload,
  Download,
  CheckCircle2,
  Sliders,
  Sparkles,
  ShieldCheck,
  RotateCw,
  Sun,
  Palette
} from 'lucide-react'

type InkType = 'black' | 'blue' | 'original'
type ThumbLabelType = 'left' | 'right' | 'none'

export default function ThumbImpressionResizerTool({ config }: { config?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const [thumbLabel, setThumbLabel] = useState<ThumbLabelType>('left')
  const [inkColor, setInkColor] = useState<InkType>('blue')
  const [contrast, setContrast] = useState<number>(45) // 0 to 100
  const [ridgeSharpness, setRidgeSharpness] = useState<number>(35) // 0 to 100
  const [bgWhiten, setBgWhiten] = useState<number>(40) // 0 to 100
  const [targetKb, setTargetKb] = useState<number>(20) // Default 20KB for SSC/IBPS

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (f: File) => {
    if (!f.type.startsWith('image/')) return
    setFile(f)
    setImageUrl(URL.createObjectURL(f))
  }

  const processThumb = useCallback(async () => {
    if (!imageUrl) return
    setIsProcessing(true)

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })

      // Standard thumb impression aspect ratio: 4:3 (approx 400x300 px)
      const targetW = 400
      const targetH = 300
      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')

      // White background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, targetW, targetH)

      // Fit image centered
      const scale = Math.min((targetW - 30) / img.width, (targetH - 45) / img.height, 1.2)
      const drawW = img.width * scale
      const drawH = img.height * scale
      const offsetX = (targetW - drawW) / 2
      const offsetY = (targetH - 30 - drawH) / 2

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH)

      // Ridge Enhancement & Background Whitening Filter
      const imgData = ctx.getImageData(0, 0, targetW, targetH - 30)
      const data = imgData.data

      const threshold = 255 - (bgWhiten * 1.8) // Higher bgWhiten means higher threshold
      const contrastFactor = (259 * (contrast + 100)) / (100 * (259 - contrast))

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Grayscale luminance
        let gray = 0.299 * r + 0.587 * g + 0.114 * b

        // Apply contrast
        gray = contrastFactor * (gray - 128) + 128
        gray = Math.max(0, Math.min(255, gray))

        // Whiten background if lighter than threshold
        if (gray > threshold) {
          data[i] = 255
          data[i + 1] = 255
          data[i + 2] = 255
        } else {
          // Dark ink area (ridge)
          const inkIntensity = (threshold - gray) / threshold // 0 to 1

          if (inkColor === 'blue') {
            // Official stamp pad blue ink: #0F3B82
            data[i] = Math.round(255 - inkIntensity * (255 - 15))
            data[i + 1] = Math.round(255 - inkIntensity * (255 - 59))
            data[i + 2] = Math.round(255 - inkIntensity * (255 - 130))
          } else if (inkColor === 'black') {
            // Deep official black ink
            const darkVal = Math.round(gray * (1 - ridgeSharpness / 120))
            data[i] = darkVal
            data[i + 1] = darkVal
            data[i + 2] = darkVal
          } else {
            // Original enhanced
            data[i] = Math.max(0, Math.min(255, r * (1 + contrast / 100)))
            data[i + 1] = Math.max(0, Math.min(255, g * (1 + contrast / 100)))
            data[i + 2] = Math.max(0, Math.min(255, b * (1 + contrast / 100)))
          }
        }
      }

      ctx.putImageData(imgData, 0, 0)

      // Bottom Label (Optional Left/Right Thumb)
      if (thumbLabel !== 'none') {
        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(0, targetH - 28, targetW, 28)
        ctx.strokeStyle = '#E2E8F0'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, targetH - 28)
        ctx.lineTo(targetW, targetH - 28)
        ctx.stroke()

        ctx.fillStyle = '#1E293B'
        ctx.font = 'bold 11px Inter, Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const labelText =
          thumbLabel === 'left' ? 'LEFT THUMB IMPRESSION (LTI)' : 'RIGHT THUMB IMPRESSION (RTI)'
        ctx.fillText(labelText, targetW / 2, targetH - 14)
      }

      // Outer border
      ctx.strokeStyle = '#CBD5E1'
      ctx.lineWidth = 1
      ctx.strokeRect(0, 0, targetW, targetH)

      // Compress under target KB
      let minQ = 0.3
      let maxQ = 0.95
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
      
      // Emergency scale down fallback
      if (bestBlob && bestBlob.size / 1024 > targetKb) {
        let emergencyScale = 0.9
        while (bestBlob && bestBlob.size / 1024 > targetKb && emergencyScale > 0.1) {
          const ew = Math.max(1, Math.round(targetW * emergencyScale))
          const eh = Math.max(1, Math.round(targetH * emergencyScale))
          const eCanvas = document.createElement('canvas')
          eCanvas.width = ew
          eCanvas.height = eh
          const eCtx = eCanvas.getContext('2d')
          if (eCtx) {
            eCtx.drawImage(canvas, 0, 0, targetW, targetH, 0, 0, ew, eh)
            bestBlob = await new Promise<Blob | null>(res => eCanvas.toBlob(res, 'image/jpeg', 0.4))
          }
          emergencyScale *= 0.8
        }
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
                name: `thumb-impression-${thumbLabel}-${finalKb}kb.jpg`,
                url: outUrl,
                sizeKb: finalKb,
                type: 'Scanned Thumb Impression'
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
  }, [imageUrl, thumbLabel, inkColor, contrast, ridgeSharpness, bgWhiten, targetKb])

  useEffect(() => {
    if (imageUrl) {
      processThumb()
    }
  }, [imageUrl, thumbLabel, inkColor, contrast, ridgeSharpness, bgWhiten, targetKb, processThumb])

  return (
    <div className="space-y-6">
      {/* Upload Screen */}
      {!imageUrl && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-300 dark:border-blue-700/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/40 rounded-3xl p-10 text-center cursor-pointer transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Fingerprint className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Upload Thumb Impression (LTI / RTI)
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Auto-enhances fingerprint ridges, cleans paper shadows, and resizes to exact 10KB-20KB for SSC, IBPS, and NEET.
          </p>
          <button className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 inline-flex items-center gap-2">
            <Upload className="w-4 h-4" /> Select Scanned Thumb Photo
          </button>
        </div>
      )}

      {/* Editor & Studio */}
      {imageUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-blue-600" />
                Ridge &amp; Ink Studio
              </h3>
              <button
                onClick={() => {
                  setImageUrl(null)
                  setOutputUrl(null)
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Change Photo
              </button>
            </div>

            {/* Thumb Label Preset */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Thumb Impression Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'left', label: 'Left Hand (LTI)' },
                  { id: 'right', label: 'Right Hand (RTI)' },
                  { id: 'none', label: 'No Printed Bar' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setThumbLabel(item.id as ThumbLabelType)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      thumbLabel === item.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ink Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                Official Ink Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'blue', label: 'Official Blue Ink', color: 'bg-blue-600' },
                  { id: 'black', label: 'Pure Black Ink', color: 'bg-slate-900' },
                  { id: 'original', label: 'Original Scan', color: 'bg-slate-400' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setInkColor(item.id as InkType)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                      inkColor === item.id
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Ridge Sharpness & Clean Paper */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Clean Paper Background
                  </span>
                  <span>{bgWhiten}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={bgWhiten}
                  onChange={(e) => setBgWhiten(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Ridge Pattern Contrast
                  </span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Target Size Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Maximum File Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 50, 100].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => setTargetKb(kb)}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      targetKb === kb
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ≤{kb}KB {kb === 20 && '⭐ (SSC)'}
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
                  Enhanced Scanned Result
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Form Upload Ready
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative mx-auto min-h-[220px] max-h-[300px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-150 overflow-hidden">
                {outputUrl && (
                  <img
                    src={outputUrl}
                    alt="Enhanced Thumb Impression"
                    className="max-h-[240px] w-auto object-contain rounded-lg shadow-md border border-slate-300 bg-white"
                  />
                )}
              </div>

              {outputUrl && (
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Size: {outputSize} KB (Target: ≤{targetKb}KB)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Aspect: 4 x 3 cm
                  </span>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={outputUrl}
                  download={`thumb-impression-${thumbLabel}-${outputSize}kb.jpg`}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Thumb Impression ({outputSize} KB JPG)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
