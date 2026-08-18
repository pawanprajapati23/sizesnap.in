'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Sliders,
  Sparkles,
  ShieldCheck,
  RotateCw,
  Sun,
  Contrast
} from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

export default function DocumentGrayscaleTool({ config }: { config?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const [mode, setMode] = useState<'pure-bw' | 'grayscale' | 'high-contrast'>('grayscale')
  const [contrast, setContrast] = useState<number>(30)
  const [brightness, setBrightness] = useState<number>(10)
  const [targetKb, setTargetKb] = useState<number>(100) // Default 100KB for government forms

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)
  const [isPdfDownloading, setIsPdfDownloading] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (f: File) => {
    if (!f.type.startsWith('image/')) return
    setFile(f)
    setImageUrl(URL.createObjectURL(f))
  }

  const processGrayscale = useCallback(async () => {
    if (!imageUrl) return
    setIsProcessing(true)

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((res, rej) => {
        img.onload = res
        img.onerror = rej
        img.src = imageUrl
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')

      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data

      const contrastFactor = (259 * (contrast + 100)) / (100 * (259 - contrast))
      const brightOffset = brightness * 1.5

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Luminance grayscale
        let gray = 0.299 * r + 0.587 * g + 0.114 * b

        // Brightness & Contrast
        gray = contrastFactor * (gray - 128) + 128 + brightOffset
        gray = Math.max(0, Math.min(255, gray))

        if (mode === 'pure-bw') {
          // Binarize (Strict Black & White for laser scan look)
          const bwVal = gray > 140 ? 255 : 0
          data[i] = bwVal
          data[i + 1] = bwVal
          data[i + 2] = bwVal
        } else if (mode === 'high-contrast') {
          // High contrast for dark sharp text on white
          const enhanced = gray > 180 ? 255 : Math.round(gray * 0.8)
          data[i] = enhanced
          data[i + 1] = enhanced
          data[i + 2] = enhanced
        } else {
          // Standard official grayscale
          data[i] = Math.round(gray)
          data[i + 1] = Math.round(gray)
          data[i + 2] = Math.round(gray)
        }
      }

      ctx.putImageData(imgData, 0, 0)

      // Compress under target KB
      let minQ = 0.4
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
                name: `bw-document-${finalKb}kb.jpg`,
                url: outUrl,
                sizeKb: finalKb,
                type: 'Black & White Document'
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
  }, [imageUrl, mode, contrast, brightness, targetKb])

  useEffect(() => {
    if (imageUrl) {
      processGrayscale()
    }
  }, [imageUrl, mode, contrast, brightness, targetKb, processGrayscale])

  const downloadPdf = async () => {
    if (!outputUrl) return
    setIsPdfDownloading(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595.28, 841.89]) // A4
      const imageBytes = await fetch(outputUrl).then((res) => res.arrayBuffer())
      const embeddedImg = await pdfDoc.embedJpg(imageBytes)

      const imgAspect = embeddedImg.width / embeddedImg.height
      const pageAspect = 595.28 / 841.89

      let drawW = 595.28
      let drawH = 841.89

      if (imgAspect > pageAspect) {
        drawW = 595.28 - 20
        drawH = drawW / imgAspect
      } else {
        drawH = 841.89 - 20
        drawW = drawH * imgAspect
      }

      page.drawImage(embeddedImg, {
        x: (595.28 - drawW) / 2,
        y: (841.89 - drawH) / 2,
        width: drawW,
        height: drawH
      })

      const pdfBytes = await pdfDoc.save()
      const pdfBlob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const pdfDownloadUrl = URL.createObjectURL(pdfBlob)

      const link = document.createElement('a')
      link.href = pdfDownloadUrl
      link.download = `bw-document-${targetKb}kb.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error(e)
    } finally {
      setIsPdfDownloading(false)
    }
  }

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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white mx-auto flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
            <Contrast className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Upload Document or Marksheet Photo
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Convert color document scans to official Black &amp; White (Grayscale), remove yellow paper background, and compress under 100KB.
          </p>
          <button className="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/20 inline-flex items-center gap-2">
            <Upload className="w-4 h-4" /> Select Color Document
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
                <Contrast className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                Black &amp; White Modes
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

            {/* Grayscale Mode Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                B&amp;W Conversion Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'grayscale', label: 'Official Grayscale' },
                  { id: 'high-contrast', label: 'High Contrast Text' },
                  { id: 'pure-bw', label: 'Pure 1-Bit B&W' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      mode === item.id
                        ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Contrast & Brightness */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Clean Paper Brightness
                  </span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="50"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-slate-900 dark:accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Text Sharpness Contrast
                  </span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-slate-900 dark:accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Target Size Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Maximum File Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 200, 500].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => setTargetKb(kb)}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      targetKb === kb
                        ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ≤{kb}KB {kb === 100 && '⭐'}
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
                  B&amp;W Document Preview
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Crisp Scan
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative mx-auto min-h-[260px] max-h-[360px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-150 overflow-hidden">
                {outputUrl && (
                  <img
                    src={outputUrl}
                    alt="Grayscale Document"
                    className="max-h-[300px] w-auto object-contain rounded-lg shadow-md border border-slate-300 bg-white"
                  />
                )}
              </div>

              {outputUrl && (
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Size: {outputSize} KB (Target: ≤{targetKb}KB)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                    Mode: Grayscale
                  </span>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={downloadPdf}
                  disabled={isPdfDownloading}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  {isPdfDownloading ? 'Creating PDF...' : 'Download B&W A4 PDF'}
                </button>

                <a
                  href={outputUrl}
                  download={`bw-document-${outputSize}kb.jpg`}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download JPG ({outputSize} KB)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
