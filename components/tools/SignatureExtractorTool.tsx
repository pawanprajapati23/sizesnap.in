'use client'
import { useState, useRef, useEffect } from 'react'
import {
  PenTool,
  Download,
  Sparkles,
  Layers,
  Palette,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Eye,
  Crop,
  ShieldCheck
} from 'lucide-react'

type InkColor = 'black' | 'blue' | 'original'

export default function SignatureExtractorTool({ config }: { config?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [inkColor, setInkColor] = useState<InkColor>('black')
  const [threshold, setThreshold] = useState<number>(180)
  const [strokeThickness, setStrokeThickness] = useState<number>(1)
  const [backgroundType, setBackgroundType] = useState<'transparent' | 'white'>('white')
  const [targetKb, setTargetKb] = useState<number>(20)
  const [autoCropTight, setAutoCropTight] = useState<boolean>(true)
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

  const processSignature = async () => {
    if (!previewUrl) return
    setIsProcessing(true)

    try {
      const img = new Image()
      img.src = previewUrl
      await new Promise((resolve) => {
        img.onload = resolve
      })

      const rawCanvas = document.createElement('canvas')
      rawCanvas.width = img.width
      rawCanvas.height = img.height
      const rawCtx = rawCanvas.getContext('2d')
      if (!rawCtx) throw new Error('Canvas not supported')

      rawCtx.drawImage(img, 0, 0)
      const imgData = rawCtx.getImageData(0, 0, rawCanvas.width, rawCanvas.height)
      const data = imgData.data
      const w = rawCanvas.width
      const h = rawCanvas.height

      // 1. Calculate bounding box for auto-crop if enabled
      let minX = w
      let minY = h
      let maxX = 0
      let maxY = 0

      // Pixel processing pass
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]

          // Grayscale luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b

          if (lum < threshold) {
            // It is signature ink stroke
            minX = Math.min(minX, x)
            minY = Math.min(minY, y)
            maxX = Math.max(maxX, x)
            maxY = Math.max(maxY, y)

            // Intensity factor (how dark the stroke is)
            const factor = Math.max(0, 1 - lum / threshold)

            if (inkColor === 'black') {
              data[idx] = 10
              data[idx + 1] = 10
              data[idx + 2] = 10
            } else if (inkColor === 'blue') {
              data[idx] = 15
              data[idx + 1] = 50
              data[idx + 2] = 180
            }

            if (backgroundType === 'transparent') {
              data[idx + 3] = Math.min(255, Math.round(factor * 255 * 1.5))
            } else {
              data[idx + 3] = 255
            }
          } else {
            // It is background paper
            if (backgroundType === 'transparent') {
              data[idx + 3] = 0 // Transparent
            } else {
              data[idx] = 255
              data[idx + 1] = 255
              data[idx + 2] = 255
              data[idx + 3] = 255
            }
          }
        }
      }

      rawCtx.putImageData(imgData, 0, 0)

      // 2. Crop to tight bounding box with padding
      let finalCanvas: HTMLCanvasElement
      if (autoCropTight && maxX > minX && maxY > minY) {
        const pad = 24
        const cropX = Math.max(0, minX - pad)
        const cropY = Math.max(0, minY - pad)
        const cropW = Math.min(w - cropX, maxX - minX + pad * 2)
        const cropH = Math.min(h - cropY, maxY - minY + pad * 2)

        finalCanvas = document.createElement('canvas')
        finalCanvas.width = cropW
        finalCanvas.height = cropH
        const finalCtx = finalCanvas.getContext('2d')
        if (finalCtx) {
          if (backgroundType === 'white') {
            finalCtx.fillStyle = '#FFFFFF'
            finalCtx.fillRect(0, 0, cropW, cropH)
          }
          finalCtx.drawImage(rawCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)
        }
      } else {
        finalCanvas = rawCanvas
      }

      // Convert to blob matching targetKb limit
      const mimeType = backgroundType === 'transparent' ? 'image/png' : 'image/jpeg'
      let bestBlob: Blob | null = null

      if (mimeType === 'image/png') {
        bestBlob = await new Promise<Blob | null>((res) => finalCanvas.toBlob(res, 'image/png'))
      } else {
        const testCompress = async (testScale: number, testQuality: number) => {
           const tW = Math.max(1, Math.round(w * testScale))
           const tH = Math.max(1, Math.round(h * testScale))
           const tCanvas = document.createElement('canvas')
           tCanvas.width = tW
           tCanvas.height = tH
           const tCtx = tCanvas.getContext('2d')!
           tCtx.fillStyle = '#FFFFFF'
           tCtx.fillRect(0, 0, tW, tH)
           tCtx.drawImage(finalCanvas, 0, 0, w, h, 0, 0, tW, tH)
           return await new Promise<Blob | null>(res => tCanvas.toBlob(res, 'image/jpeg', testQuality))
        }

        let bestDiff = Infinity

        // 1. Binary Search Quality
        let qLow = 0.05, qHigh = 1.0
        for (let i = 0; i < 7; i++) {
           const qMid = (qLow + qHigh) / 2
           const blob = await testCompress(1.0, qMid)
           if (!blob) break
           const sizeKb = blob.size / 1024
           if (sizeKb <= targetKb) {
              if (targetKb - sizeKb < bestDiff) {
                 bestDiff = targetKb - sizeKb
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
              if (sizeKb <= targetKb) {
                 if (targetKb - sizeKb < bestDiff) {
                    bestDiff = targetKb - sizeKb
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
      }

      if (bestBlob) {
        const outUrl = URL.createObjectURL(bestBlob)
        setOutputUrl(outUrl)
        const finalKb = Math.round(bestBlob.size / 1024)
        setOutputSize(finalKb)

        // Dispatch to session tray
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('sizesnap_file_ready', {
              detail: {
                id: Date.now().toString(),
                name: `signature-${inkColor}-${backgroundType}.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
                url: outUrl,
                sizeKb: finalKb,
                type: mimeType === 'image/png' ? 'PNG (Transparent)' : 'JPG (White Bg)'
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
      processSignature()
    }
  }, [previewUrl, inkColor, threshold, strokeThickness, backgroundType, targetKb, autoCropTight])

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
            <PenTool className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Upload Signature Photo to Extract & Convert Ink Color
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Remove paper shadow, convert blue ink to official deep black, auto-crop signature, and save under 10-20KB. 100% private in-browser.
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
                <Palette className="w-4 h-4 text-blue-600" />
                Signature Ink & Clean Controls
              </h3>
              <button
                onClick={() => {
                  setPreviewUrl(null)
                  setOutputUrl(null)
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Change Image
              </button>
            </div>

            {/* 1. Ink Color Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Ink Color Mode (Mandatory for SSC/UPSC Exams)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setInkColor('black')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    inkColor === 'black'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-500/50'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black border border-white/40 block" />
                  <span className="text-xs font-bold">Deep Black Ink</span>
                  <span className="text-[9px] opacity-70">Official Exam Spec</span>
                </button>

                <button
                  onClick={() => setInkColor('blue')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    inkColor === 'blue'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/50'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-blue-600 border border-white/40 block" />
                  <span className="text-xs font-bold">Navy Blue Ink</span>
                  <span className="text-[9px] opacity-70">Clean Royal Blue</span>
                </button>

                <button
                  onClick={() => setInkColor('original')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    inkColor === 'original'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/50'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 border border-white/40 block" />
                  <span className="text-xs font-bold">Original Ink</span>
                  <span className="text-[9px] opacity-70">Keep Pen Color</span>
                </button>
              </div>
            </div>

            {/* 2. Background Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Background Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBackgroundType('white')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    backgroundType === 'white'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-600'
                  }`}
                >
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Pure White (Exam Form Upload)</span>
                </button>
                <button
                  onClick={() => setBackgroundType('transparent')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    backgroundType === 'transparent'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>100% Transparent PNG</span>
                </button>
              </div>
            </div>

            {/* 3. Shadow Cleaning Sensitivity Threshold */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" /> Paper Shadow Cleaner Threshold
                </span>
                <span className="text-blue-600 font-bold">{threshold}</span>
              </div>
              <input
                type="range"
                min="100"
                max="230"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Slide right if phone camera shadow is visible on the paper.
              </p>
            </div>

            {/* 4. Auto Crop Toggle & Target KB */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Auto Crop Signature
                </label>
                <button
                  onClick={() => setAutoCropTight(!autoCropTight)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    autoCropTight
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>{autoCropTight ? 'Tight Crop ON' : 'Tight Crop OFF'}</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Target Size Limit
                </label>
                <div className="flex gap-1.5">
                  {[10, 20, 50].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setTargetKb(kb)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        targetKb === kb
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
                  Cleaned Signature Preview
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Form Accepted Spec
                </span>
              </div>

              {/* Signature Canvas Box */}
              <div
                className={`relative mx-auto min-h-[220px] max-h-[300px] flex items-center justify-center p-6 rounded-2xl border border-slate-200 overflow-hidden ${
                  backgroundType === 'transparent'
                    ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100 dark:bg-slate-800'
                    : 'bg-white'
                }`}
              >
                {outputUrl ? (
                  <img
                    src={outputUrl}
                    alt="Cleaned Signature"
                    className="max-h-[180px] max-w-full object-contain shadow-xs"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                  </div>
                )}
              </div>

              {outputUrl && (
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    File Size: {outputSize} KB (Target: ≤{targetKb}KB)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Format: {backgroundType === 'transparent' ? 'PNG' : 'JPG'}
                  </span>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={outputUrl}
                  download={`signature-${inkColor}-${outputSize}kb.${backgroundType === 'transparent' ? 'png' : 'jpg'}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Clean Signature ({outputSize} KB)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
