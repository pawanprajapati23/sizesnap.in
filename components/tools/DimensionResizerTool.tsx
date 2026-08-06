'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Ruler,
  Image as ImageIcon,
  Download,
  Lock,
  Unlock,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react'

type Unit = 'cm' | 'mm' | 'inch' | 'px'

interface Preset {
  name: string
  w: number
  h: number
  unit: Unit
  dpi: number
  kb: number
}

const PRESETS: Preset[] = [
  { name: '3.5 x 4.5 cm (Standard Passport / SSC / UPSC)', w: 3.5, h: 4.5, unit: 'cm', dpi: 300, kb: 50 },
  { name: '4.0 x 2.0 cm (Standard Signature Scan)', w: 4.0, h: 2.0, unit: 'cm', dpi: 200, kb: 20 },
  { name: '2 x 2 Inch / 5 x 5 cm (US / Passport Visa)', w: 2.0, h: 2.0, unit: 'inch', dpi: 300, kb: 100 },
  { name: '4 x 6 Inch (NEET UG Postcard Photo)', w: 4.0, h: 6.0, unit: 'inch', dpi: 300, kb: 200 },
  { name: '3.0 x 4.0 cm (State Police / UPSSSC)', w: 3.0, h: 4.0, unit: 'cm', dpi: 200, kb: 50 },
  { name: '35 x 45 mm (UK / Schengen Visa)', w: 35, h: 45, unit: 'mm', dpi: 300, kb: 100 },
]

export default function DimensionResizerTool({ config }: { config?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [unit, setUnit] = useState<Unit>('cm')
  const [width, setWidth] = useState<number>(3.5)
  const [height, setHeight] = useState<number>(4.5)
  const [dpi, setDpi] = useState<number>(300)
  const [lockAspect, setLockAspect] = useState<boolean>(false)
  const [maxKb, setMaxKb] = useState<number>(50)
  const [aspectRatio, setAspectRatio] = useState<number>(3.5 / 4.5)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)
  const [outputDimensions, setOutputDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert current physical units to pixels
  const computedPixels = useMemo(() => {
    let pxW = 0
    let pxH = 0

    if (unit === 'px') {
      pxW = Math.round(width)
      pxH = Math.round(height)
    } else if (unit === 'inch') {
      pxW = Math.round(width * dpi)
      pxH = Math.round(height * dpi)
    } else if (unit === 'cm') {
      pxW = Math.round((width / 2.54) * dpi)
      pxH = Math.round((height / 2.54) * dpi)
    } else if (unit === 'mm') {
      pxW = Math.round((width / 25.4) * dpi)
      pxH = Math.round((height / 25.4) * dpi)
    }

    return { w: Math.max(10, pxW), h: Math.max(10, pxH) }
  }, [width, height, unit, dpi])

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    setOutputUrl(null)

    const img = new Image()
    img.onload = () => {
      setAspectRatio(img.width / img.height)
    }
    img.src = url
  }

  const handleWidthChange = (val: number) => {
    setWidth(val)
    if (lockAspect && aspectRatio > 0) {
      setHeight(parseFloat((val / aspectRatio).toFixed(2)))
    }
  }

  const handleHeightChange = (val: number) => {
    setHeight(val)
    if (lockAspect && aspectRatio > 0) {
      setWidth(parseFloat((val * aspectRatio).toFixed(2)))
    }
  }

  const applyPreset = (preset: Preset) => {
    setUnit(preset.unit)
    setWidth(preset.w)
    setHeight(preset.h)
    setDpi(preset.dpi)
    setMaxKb(preset.kb)
  }

  const processImage = async () => {
    if (!previewUrl) return
    setIsProcessing(true)

    try {
      const img = new Image()
      img.src = previewUrl
      await new Promise((resolve) => {
        img.onload = resolve
      })

      const canvas = document.createElement('canvas')
      canvas.width = computedPixels.w
      canvas.height = computedPixels.h
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('Canvas not supported')

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Quality scaling to match target max KB
      let minQuality = 0.4
      let maxQuality = 0.98
      let bestBlob: Blob | null = null

      for (let i = 0; i < 6; i++) {
        const mid = (minQuality + maxQuality) / 2
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, 'image/jpeg', mid)
        )
        if (!blob) break

        const kb = blob.size / 1024
        bestBlob = blob

        if (kb > maxKb) {
          maxQuality = mid
        } else {
          minQuality = mid
        }
      }

      if (bestBlob) {
        const outUrl = URL.createObjectURL(bestBlob)
        setOutputUrl(outUrl)
        setOutputSize(Math.round(bestBlob.size / 1024))
        setOutputDimensions({ w: canvas.width, h: canvas.height })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Box */}
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
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Ruler className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Upload Image to Resize in CM, MM, Inches or Pixels
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Choose physical print dimensions (e.g. 3.5 x 4.5 cm @ 300 DPI) or exact pixels. 100% private in-browser.
          </p>
        </div>
      )}

      {/* Main Control Panel */}
      {previewUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                Dimension Settings
              </h3>
              <button
                onClick={() => {
                  setPreviewUrl(null)
                  setOutputUrl(null)
                }}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Change Photo
              </button>
            </div>

            {/* Presets List */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                Quick Official Dimension Presets:
              </label>
              <select
                onChange={(e) => {
                  const idx = parseInt(e.target.value)
                  if (!isNaN(idx)) applyPreset(PRESETS[idx])
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- Choose Exam / Standard Preset --</option>
                {PRESETS.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                Select Unit (इकाई चुनें):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['cm', 'mm', 'inch', 'px'] as Unit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      unit === u
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Width & Height Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Width ({unit}):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={width}
                  onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Height ({unit}):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* DPI & File Size Target */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Resolution DPI:
                </label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={100}>100 DPI (Web Fast)</option>
                  <option value={200}>200 DPI (Govt Forms)</option>
                  <option value={300}>300 DPI (Studio Print)</option>
                  <option value={600}>600 DPI (Ultra HD)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Max File Size:
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={maxKb}
                    onChange={(e) => setMaxKb(parseInt(e.target.value) || 50)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500">KB</span>
                </div>
              </div>
            </div>

            {/* Computed Real Pixels Notification */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                Calculated Pixels:
              </span>
              <strong className="text-blue-700 dark:text-blue-400 font-mono font-black">
                {computedPixels.w} × {computedPixels.h} px
              </strong>
            </div>

            <button
              onClick={processImage}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Exact Dimensions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Convert & Resize Now</span>
                </>
              )}
            </button>
          </div>

          {/* Result / Preview Canvas Column */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="space-y-3 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                {outputUrl ? 'Ready to Download' : 'Image Preview'}
              </span>

              <div className="relative mx-auto max-h-[300px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-150 overflow-hidden">
                <img
                  src={outputUrl || previewUrl}
                  alt="Dimension Preview"
                  className="max-h-[260px] object-contain rounded-lg shadow-sm"
                />
              </div>

              {outputUrl && (
                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold">
                    Size: {outputSize} KB (Target: ≤{maxKb}KB)
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-800 font-bold">
                    Pixels: {outputDimensions.w} × {outputDimensions.h}
                  </div>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={outputUrl}
                  download={`sizesnap-${width}x${height}${unit}.jpg`}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resized Photo ({outputSize} KB)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
