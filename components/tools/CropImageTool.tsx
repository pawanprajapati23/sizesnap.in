'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Upload,
  Download,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Circle,
  Square,
  Sliders,
  Share2
} from 'lucide-react'

interface Props {
  config?: any
}

type AspectRatio = 'free' | '1:1' | 'circle' | '16:9' | '4:3' | '3:2' | '35:45'
type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'

export default function CropImageTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number>(0)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Crop parameters
  const [aspect, setAspect] = useState<AspectRatio>('1:1')
  const [rotation, setRotation] = useState<number>(0)
  const [flipH, setFlipH] = useState<boolean>(false)
  const [flipV, setFlipV] = useState<boolean>(false)

  // Crop Box normalized coordinates (0 to 1)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.1,
    y: 0.1,
    w: 0.8,
    h: 0.8
  })

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [originalUrl, resultUrl])

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a JPG, PNG, or WEBP photo.')
      setStatus('error')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File too large (Max 25MB).')
      setStatus('error')
      return
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setOriginalFile(file)
      setOriginalUrl(url)
      setStatus('editing')
      setErrorMsg('')
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
      setCropBox({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 })
    }
    img.src = url
  }

  // Draw crop preview on canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = (canvas.width = img.naturalWidth || img.width)
    const h = (canvas.height = img.naturalHeight || img.height)

    ctx.save()
    ctx.clearRect(0, 0, w, h)

    // Translate & rotate
    ctx.translate(w / 2, h / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.drawImage(img, -w / 2, -h / 2, w, h)
    ctx.restore()

    // Dim background outside crop box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
    const bx = cropBox.x * w
    const by = cropBox.y * h
    const bw = cropBox.w * w
    const bh = cropBox.h * h

    if (aspect === 'circle') {
      ctx.beginPath()
      ctx.rect(0, 0, w, h)
      ctx.arc(bx + bw / 2, by + bh / 2, Math.min(bw, bh) / 2, 0, Math.PI * 2, true)
      ctx.fill()

      // Circle border
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = Math.max(2, w / 300)
      ctx.beginPath()
      ctx.arc(bx + bw / 2, by + bh / 2, Math.min(bw, bh) / 2, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      // Dark overlay
      ctx.beginPath()
      ctx.rect(0, 0, w, by) // Top
      ctx.rect(0, by, bx, bh) // Left
      ctx.rect(bx + bw, by, w - (bx + bw), bh) // Right
      ctx.rect(0, by + bh, w, h - (by + bh)) // Bottom
      ctx.fill()

      // Crop border & Rule of Thirds Grid
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = Math.max(2, w / 300)
      ctx.strokeRect(bx, by, bw, bh)

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(bx + bw / 3, by)
      ctx.lineTo(bx + bw / 3, by + bh)
      ctx.moveTo(bx + (2 * bw) / 3, by)
      ctx.lineTo(bx + (2 * bw) / 3, by + bh)
      ctx.moveTo(bx, by + bh / 3)
      ctx.lineTo(bx + bw, by + bh / 3)
      ctx.moveTo(bx, by + (2 * bh) / 3)
      ctx.lineTo(bx + bw, by + (2 * bh) / 3)
      ctx.stroke()
    }
  }, [cropBox, aspect, rotation, flipH, flipV])

  useEffect(() => {
    if (status === 'editing') {
      drawPreview()
    }
  }, [drawPreview, status])

  // Crop & Export
  const handleCropExport = (format: 'png' | 'jpeg') => {
    const img = imgRef.current
    if (!img) return

    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height

    const bx = cropBox.x * w
    const by = cropBox.y * h
    const bw = cropBox.w * w
    const bh = cropBox.h * h

    const cropCanvas = document.createElement('canvas')
    const finalW = aspect === 'circle' ? Math.min(bw, bh) : bw
    const finalH = aspect === 'circle' ? Math.min(bw, bh) : bh
    cropCanvas.width = finalW
    cropCanvas.height = finalH
    const ctx = cropCanvas.getContext('2d')
    if (!ctx) return

    if (aspect === 'circle') {
      ctx.beginPath()
      ctx.arc(finalW / 2, finalH / 2, finalW / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    // Draw rotated image into sub coordinates
    ctx.save()
    ctx.translate(-bx, -by)
    ctx.drawImage(img, 0, 0, w, h)
    ctx.restore()

    const mime = format === 'png' ? 'image/png' : 'image/jpeg'
    cropCanvas.toBlob(
      (blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        if (resultUrl) URL.revokeObjectURL(resultUrl)
        setResultUrl(url)
        setResultSize(blob.size)
        setStatus('done')

        // Trigger Download
        const a = document.createElement('a')
        a.href = url
        a.download = `cropped-${originalFile?.name || 'photo'}.${format === 'png' ? 'png' : 'jpg'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      },
      mime,
      0.95
    )
  }

  const resetAll = () => {
    setStatus('idle')
    setOriginalFile(null)
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setOriginalUrl(null)
    setResultUrl(null)
    setErrorMsg('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-2">
            <Crop className="w-3.5 h-3.5" />
            Precise Crop & Circle Avatars
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crop & Circle Image Tool Online</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Crop photos to 1:1 square, round circle avatars, 16:9 banners, passport 35x45mm, or freeform.
          </p>
        </div>

        {status !== 'idle' && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Upload New Photo
          </button>
        )}
      </div>

      {/* Upload Drop Zone */}
      {status === 'idle' && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0])
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
            dragOver
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
            <Crop className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Select Photo to Crop or Round
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports JPG, PNG, WEBP photos (Up to 25MB)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Private (Runs in Browser)
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <Circle className="w-3.5 h-3.5 text-blue-500" />
              Round Avatar PNG
            </span>
          </div>
        </div>
      )}

      {/* Editing State */}
      {(status === 'editing' || status === 'done') && (
        <div className="mt-6 space-y-6">
          {/* Ratio & Rotation Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            {/* Aspect Ratio Presets */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAspect('1:1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition ${
                  aspect === '1:1'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
              >
                1:1 Square
              </button>

              <button
                type="button"
                onClick={() => setAspect('circle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition ${
                  aspect === 'circle'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
              >
                <Circle className="w-3 h-3" />
                Circle Avatar
              </button>

              <button
                type="button"
                onClick={() => setAspect('35:45')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition ${
                  aspect === '35:45'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
              >
                35x45mm Passport
              </button>

              <button
                type="button"
                onClick={() => setAspect('16:9')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition ${
                  aspect === '16:9'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
              >
                16:9 Banner
              </button>
            </div>

            {/* Transform buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-2 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFlipH((f) => !f)}
                className="p-2 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer"
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 flex items-center justify-center p-4 min-h-[380px]">
            <canvas ref={canvasRef} className="max-h-[480px] w-auto object-contain rounded-lg shadow-lg" />
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            <button
              onClick={() => handleCropExport('png')}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition shadow-md shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              Download Cropped PNG
            </button>

            <button
              onClick={() => handleCropExport('jpeg')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download JPG
            </button>
          </div>

          {/* Success Banner */}
          {status === 'done' && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Cropped image downloaded successfully! File size: <strong>{Math.round(resultSize / 1024)} KB</strong>.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-500/20 rounded-xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg || 'An error occurred while cropping the image.'}</span>
        </div>
      )}
    </div>
  )
}
