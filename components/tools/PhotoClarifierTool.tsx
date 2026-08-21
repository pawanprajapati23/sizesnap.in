'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Wand2,
  Sparkles,
  Download,
  Sliders,
  Sun,
  Contrast,
  Zap,
  CheckCircle2,
  RefreshCw,
  FileText,
  Eye,
  RotateCcw
} from 'lucide-react'

type PresetMode = 'auto' | 'sharp_text' | 'remove_yellow' | 'doc_scan' | 'custom'

export default function PhotoClarifierTool({ config }: { config?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mode, setMode] = useState<PresetMode>('auto')
  const [brightness, setBrightness] = useState<number>(15)
  const [contrast, setContrast] = useState<number>(25)
  const [sharpness, setSharpness] = useState<number>(35)
  const [deyellow, setDeyellow] = useState<number>(20)
  const [maxKb, setMaxKb] = useState<number>(100)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)
  const [showOriginal, setShowOriginal] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    setOutputUrl(null)
  }

  // Apply preset adjustments
  const handlePresetSelect = (preset: PresetMode) => {
    setMode(preset)
    if (preset === 'auto') {
      setBrightness(15)
      setContrast(25)
      setSharpness(35)
      setDeyellow(20)
    } else if (preset === 'sharp_text') {
      setBrightness(10)
      setContrast(45)
      setSharpness(65)
      setDeyellow(30)
    } else if (preset === 'remove_yellow') {
      setBrightness(25)
      setContrast(30)
      setSharpness(20)
      setDeyellow(60)
    } else if (preset === 'doc_scan') {
      setBrightness(35)
      setContrast(60)
      setSharpness(50)
      setDeyellow(80)
    }
  }

  const applyEnhancements = async () => {
    if (!previewUrl) return
    setIsProcessing(true)

    try {
      const img = new Image()
      img.src = previewUrl
      await new Promise((resolve) => {
        img.onload = resolve
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')

      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data

      const bFactor = brightness * 1.2
      const cFactor = (259 * (contrast + 255)) / (255 * (259 - contrast))
      const dyFactor = deyellow / 100

      // Pixel manipulation pass
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // 1. De-yellow / Color Cast Normalization
        if (dyFactor > 0) {
          const avg = (r + g + b) / 3
          // If pixel is background paper (bright but yellowish: r > b and g > b)
          if (r > 160 && g > 150) {
            r = r + (avg - r) * dyFactor
            g = g + (avg - g) * dyFactor
            b = b + (avg - b) * dyFactor
          }
        }

        // 2. Brightness
        r += bFactor
        g += bFactor
        b += bFactor

        // 3. Contrast
        r = cFactor * (r - 128) + 128
        g = cFactor * (g - 128) + 128
        b = cFactor * (b - 128) + 128

        data[i] = Math.min(255, Math.max(0, r))
        data[i + 1] = Math.min(255, Math.max(0, g))
        data[i + 2] = Math.min(255, Math.max(0, b))
      }

      ctx.putImageData(imgData, 0, 0)

      // 4. Sharpness Convolution Kernel (Unsharp Mask)
      if (sharpness > 0) {
        const sharpCanvas = document.createElement('canvas')
        sharpCanvas.width = canvas.width
        sharpCanvas.height = canvas.height
        const sharpCtx = sharpCanvas.getContext('2d')
        if (sharpCtx) {
          sharpCtx.drawImage(canvas, 0, 0)
          const srcData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const outData = sharpCtx.createImageData(canvas.width, canvas.height)
          const src = srcData.data
          const dst = outData.data
          const w = canvas.width
          const h = canvas.height

          const kWeight = (sharpness / 100) * 0.6
          const kernel = [
            0, -kWeight, 0,
            -kWeight, 1 + 4 * kWeight, -kWeight,
            0, -kWeight, 0
          ]

          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = (y * w + x) * 4
              for (let c = 0; c < 3; c++) {
                let val =
                  src[((y - 1) * w + x) * 4 + c] * kernel[1] +
                  src[(y * w + (x - 1)) * 4 + c] * kernel[3] +
                  src[(y * w + x) * 4 + c] * kernel[4] +
                  src[(y * w + (x + 1)) * 4 + c] * kernel[5] +
                  src[((y + 1) * w + x) * 4 + c] * kernel[7]

                dst[idx + c] = Math.min(255, Math.max(0, val))
              }
              dst[idx + 3] = src[idx + 3]
            }
          }
          sharpCtx.putImageData(outData, 0, 0)
          ctx.drawImage(sharpCanvas, 0, 0)
        }
      }

      // Convert to blob matching target maxKb using exact binary search
      const testCompress = async (testScale: number, testQuality: number) => {
         const tW = Math.max(1, Math.round(w * testScale))
         const tH = Math.max(1, Math.round(h * testScale))
         const tCanvas = document.createElement('canvas')
         tCanvas.width = tW
         tCanvas.height = tH
         const tCtx = tCanvas.getContext('2d')!
         tCtx.drawImage(canvas, 0, 0, w, h, 0, 0, tW, tH)
         return await new Promise<Blob | null>((res) => tCanvas.toBlob(res, 'image/jpeg', testQuality))
      }

      let bestBlob: Blob | null = null
      let bestDiff = Infinity

      // 1. Binary Search Quality
      let qLow = 0.05, qHigh = 1.0
      for (let i = 0; i < 7; i++) {
         const qMid = (qLow + qHigh) / 2
         const blob = await testCompress(1.0, qMid)
         if (!blob) break
         const sizeKb = blob.size / 1024
         if (sizeKb <= maxKb) {
            if (maxKb - sizeKb < bestDiff) {
               bestDiff = maxKb - sizeKb
               bestBlob = blob
            }
            qLow = qMid
         } else {
            qHigh = qMid
         }
      }

      // 2. Binary Search Scale
      if (!bestBlob) {
         let sLow = 0.1, sHigh = 0.95
         bestDiff = Infinity
         for (let i = 0; i < 7; i++) {
            const sMid = (sLow + sHigh) / 2
            const blob = await testCompress(sMid, 0.6)
            if (!blob) break
            const sizeKb = blob.size / 1024
            if (sizeKb <= maxKb) {
               if (maxKb - sizeKb < bestDiff) {
                  bestDiff = maxKb - sizeKb
                  bestBlob = blob
               }
               sLow = sMid
            } else {
               sHigh = sMid
            }
         }
      }

      if (!bestBlob) {
         bestBlob = await testCompress(0.2, 0.2)
      }

      if (bestBlob) {
        setOutputUrl(URL.createObjectURL(bestBlob))
        setOutputSize(Math.round(bestBlob.size / 1024))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (previewUrl) {
      applyEnhancements()
    }
  }, [previewUrl, brightness, contrast, sharpness, deyellow, maxKb])

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
            <Wand2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Upload Blurry or Dark Photo / Marksheet to Clarify
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            1-Click auto-contrast, unblur text, remove yellow shadows, and brighten dark phone camera scans. 100% private in-browser.
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
                <Sparkles className="w-4 h-4 text-blue-600" />
                1-Click Enhancement Presets
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

            {/* Quick 1-Click Preset Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePresetSelect('auto')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  mode === 'auto'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Smart AI Auto-Fix
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Balanced brightness & clarity
                </span>
              </button>

              <button
                onClick={() => handlePresetSelect('sharp_text')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  mode === 'sharp_text'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Unblur Marksheet Text
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Sharpen edges & roll numbers
                </span>
              </button>

              <button
                onClick={() => handlePresetSelect('remove_yellow')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  mode === 'remove_yellow'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold block flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-orange-500" />
                  Remove Yellow Shadow
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Clean white background cast
                </span>
              </button>

              <button
                onClick={() => handlePresetSelect('doc_scan')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  mode === 'doc_scan'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold block flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-purple-500" />
                  High-Contrast Scan
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Ultra readable dark print
                </span>
              </button>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Manual Sliders</span>
                <button
                  onClick={() => handlePresetSelect('auto')}
                  className="text-blue-600 hover:underline flex items-center gap-1 lowercase first-letter:uppercase"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Brightness
                  </span>
                  <span className="text-slate-500">{brightness > 0 ? `+${brightness}` : brightness}</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="60"
                  value={brightness}
                  onChange={(e) => {
                    setMode('custom')
                    setBrightness(parseInt(e.target.value))
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Contrast className="w-3.5 h-3.5 text-indigo-500" /> Contrast & Clarity
                  </span>
                  <span className="text-slate-500">+{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={contrast}
                  onChange={(e) => {
                    setMode('custom')
                    setContrast(parseInt(e.target.value))
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Sharpness (Unblur) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Wand2 className="w-3.5 h-3.5 text-purple-500" /> Text Sharpness (Unblur)
                  </span>
                  <span className="text-slate-500">+{sharpness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={sharpness}
                  onChange={(e) => {
                    setMode('custom')
                    setSharpness(parseInt(e.target.value))
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Max KB Target */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Max File Size Limit</span>
                  <span className="text-blue-600 font-bold">{maxKb} KB</span>
                </div>
                <div className="flex gap-2">
                  {[50, 100, 200, 500].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setMaxKb(kb)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex-1 transition-all ${
                        maxKb === kb
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      ≤{kb}KB
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {showOriginal ? 'Showing Original' : 'Enhanced Clarity Output'}
                </span>
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Hold to Compare</span>
                </button>
              </div>

              <div className="relative mx-auto max-h-[320px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-150 overflow-hidden">
                <img
                  src={showOriginal ? previewUrl : outputUrl || previewUrl}
                  alt="Clarified Document"
                  className="max-h-[280px] object-contain rounded-lg shadow-sm"
                />
              </div>

              {outputUrl && (
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Size: {outputSize} KB (Target: ≤{maxKb}KB)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Format: High-Res JPG
                  </span>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={outputUrl}
                  download="sizesnap-enhanced-clarified.jpg"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Enhanced Photo ({outputSize} KB)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
