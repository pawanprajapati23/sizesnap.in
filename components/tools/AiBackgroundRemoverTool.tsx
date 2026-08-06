'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Sliders,
  Sparkles,
  Eraser,
  Paintbrush,
  Pipette,
  Eye,
  Undo2,
  ZoomIn,
  ZoomOut,
  Layers,
  Share2
} from 'lucide-react'

interface Props {
  config?: {
    targetColor?: 'white' | 'blue' | 'transparent'
    maxKB?: number
  }
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'
type BrushMode = 'auto' | 'erase' | 'restore'

export default function AiBackgroundRemoverTool({ config = {} }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [resultSize, setResultSize] = useState<number>(0)

  // AI & Segmentation Parameters
  const [tolerance, setTolerance] = useState<number>(42) // 5 to 120
  const [edgeSoftness, setEdgeSoftness] = useState<number>(18) // 0 to 40
  const [bgColor, setBgColor] = useState<string>(
    config.targetColor === 'blue' ? '#87CEEB' : config.targetColor === 'transparent' ? 'transparent' : '#FFFFFF'
  )
  const [bgType, setBgType] = useState<'solid' | 'transparent' | 'blur'>(
    config.targetColor === 'transparent' ? 'transparent' : 'solid'
  )
  const [samplePoints, setSamplePoints] = useState<{ x: number; y: number; r: number; g: number; b: number }[]>([])
  
  // Interactive Brush Editing
  const [brushMode, setBrushMode] = useState<BrushMode>('auto')
  const [brushSize, setBrushSize] = useState<number>(24)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Clean URLs
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [originalUrl, resultUrl])

  // Handle image upload
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid format. Please upload a portrait photo (JPG, PNG, WEBP).')
      setStatus('error')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('Image size is too large (Max 25MB).')
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

      // Auto sample corner background points (4 corners + top center)
      setTimeout(() => {
        detectInitialBackground(img)
      }, 50)
    }
    img.src = url
  }

  const detectInitialBackground = (img: HTMLImageElement) => {
    const tempCanvas = document.createElement('canvas')
    const w = (tempCanvas.width = img.naturalWidth || img.width)
    const h = (tempCanvas.height = img.naturalHeight || img.height)
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(img, 0, 0, w, h)
    
    // Sample coordinates: top-left, top-right, top-middle, bottom-left
    const coords = [
      { x: Math.round(w * 0.05), y: Math.round(h * 0.05) },
      { x: Math.round(w * 0.95), y: Math.round(h * 0.05) },
      { x: Math.round(w * 0.50), y: Math.round(h * 0.03) },
      { x: Math.round(w * 0.05), y: Math.round(h * 0.95) }
    ]

    const samples: { x: number; y: number; r: number; g: number; b: number }[] = []
    coords.forEach(({ x, y }) => {
      const p = ctx.getImageData(x, y, 1, 1).data
      samples.push({ x, y, r: p[0], g: p[1], b: p[2] })
    })

    setSamplePoints(samples)
    renderComposite(img, samples, tolerance, edgeSoftness, bgColor, bgType)
  }

  // Render processed preview
  const renderComposite = useCallback(
    (
      img: HTMLImageElement,
      samples: { x: number; y: number; r: number; g: number; b: number }[],
      tol: number,
      softness: number,
      bg: string,
      type: 'solid' | 'transparent' | 'blur'
    ) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const w = (canvas.width = img.naturalWidth || img.width)
      const h = (canvas.height = img.naturalHeight || img.height)

      // Initialize mask canvas if needed
      if (!maskCanvasRef.current) {
        maskCanvasRef.current = document.createElement('canvas')
      }
      const maskCanvas = maskCanvasRef.current
      maskCanvas.width = w
      maskCanvas.height = h
      const maskCtx = maskCanvas.getContext('2d')
      if (!maskCtx) return

      // Draw original image
      const srcCanvas = document.createElement('canvas')
      srcCanvas.width = w
      srcCanvas.height = h
      const srcCtx = srcCanvas.getContext('2d')!
      srcCtx.drawImage(img, 0, 0, w, h)
      const imgData = srcCtx.getImageData(0, 0, w, h)
      const data = imgData.data

      // Create mask
      const maskData = maskCtx.createImageData(w, h)
      const mData = maskData.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Compare color distance with all background samples
        let minDist = 999999
        for (const s of samples) {
          const dr = r - s.r
          const dg = g - s.g
          const db = b - s.b
          // Color distance with human eye luminance weighting
          const dist = Math.sqrt(0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db)
          if (dist < minDist) minDist = dist
        }

        let alpha = 255
        if (minDist < tol) {
          alpha = 0 // Background removed
        } else if (minDist < tol + softness) {
          // Soft edge blending
          alpha = Math.round(((minDist - tol) / softness) * 255)
        }

        mData[i] = 255
        mData[i + 1] = 255
        mData[i + 2] = 255
        mData[i + 3] = alpha
      }
      maskCtx.putImageData(maskData, 0, 0)

      // Render Final Composite Canvas
      ctx.clearRect(0, 0, w, h)

      // 1. Draw Background Layer
      if (type === 'solid' && bg !== 'transparent') {
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, w, h)
      } else if (type === 'blur') {
        ctx.save()
        ctx.filter = 'blur(20px) brightness(0.95)'
        ctx.drawImage(img, -20, -20, w + 40, h + 40)
        ctx.restore()
      } else if (type === 'transparent') {
        // Transparent - keep clear
      }

      // 2. Draw foreground with mask
      const fgCanvas = document.createElement('canvas')
      fgCanvas.width = w
      fgCanvas.height = h
      const fgCtx = fgCanvas.getContext('2d')!
      fgCtx.drawImage(img, 0, 0, w, h)
      fgCtx.globalCompositeOperation = 'destination-in'
      fgCtx.drawImage(maskCanvas, 0, 0)

      ctx.drawImage(fgCanvas, 0, 0)
    },
    []
  )

  // Re-render when parameters change
  useEffect(() => {
    if (imgRef.current && status === 'editing') {
      renderComposite(imgRef.current, samplePoints, tolerance, edgeSoftness, bgColor, bgType)
    }
  }, [tolerance, edgeSoftness, bgColor, bgType, samplePoints, status, renderComposite])

  // Canvas click to sample new background color or brush touch up
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clickX = Math.round((e.clientX - rect.left) * scaleX)
    const clickY = Math.round((e.clientY - rect.top) * scaleY)

    if (brushMode === 'auto') {
      // Sample background color at click
      const temp = document.createElement('canvas')
      temp.width = canvas.width
      temp.height = canvas.height
      const tCtx = temp.getContext('2d')!
      tCtx.drawImage(img, 0, 0)
      const p = tCtx.getImageData(clickX, clickY, 1, 1).data

      const newSample = { x: clickX, y: clickY, r: p[0], g: p[1], b: p[2] }
      const nextSamples = [...samplePoints, newSample]
      setSamplePoints(nextSamples)
      renderComposite(img, nextSamples, tolerance, edgeSoftness, bgColor, bgType)
    }
  }

  // Final export download
  const handleDownload = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current
    if (!canvas) return

    setStatus('processing')
    const mime = format === 'png' ? 'image/png' : 'image/jpeg'
    const quality = format === 'png' ? 1.0 : 0.95

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setErrorMsg('Export failed')
          setStatus('error')
          return
        }

        const url = URL.createObjectURL(blob)
        setResultUrl(url)
        setResultSize(blob.size)
        setStatus('done')

        // Auto trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = `sizesnap-bg-removed.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      },
      mime,
      quality
    )
  }

  const resetAll = () => {
    setStatus('idle')
    setOriginalFile(null)
    setOriginalUrl(null)
    setResultUrl(null)
    setSamplePoints([])
    setErrorMsg('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            100% Private Client-Side AI Tool
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Passport & Photo Background Remover</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Instantly remove or change photo background to White, Sky Blue, or Transparent for SSC, UPSC, NEET & Visas.
          </p>
        </div>

        {status === 'editing' && (
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
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Click to select photo or drag & drop here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports JPG, PNG, WEBP portrait photos (Up to 25MB)
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Private (No Upload)
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Hair & Edge Softening
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              Instant Browser Processing
            </span>
          </div>
        </div>
      )}

      {/* Interactive Editor Workspace */}
      {(status === 'editing' || status === 'processing' || status === 'done') && (
        <div className="mt-6 space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            {/* Background Style Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Target Background Color
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBgType('solid')
                    setBgColor('#FFFFFF')
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition ${
                    bgType === 'solid' && bgColor === '#FFFFFF'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 inline-block" />
                  White (Govt Forms)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBgType('solid')
                    setBgColor('#87CEEB')
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition ${
                    bgType === 'solid' && bgColor === '#87CEEB'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-300 inline-block" />
                  Sky Blue (Bank/NEET)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBgType('transparent')
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition ${
                    bgType === 'transparent'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-slate-200 to-slate-400 inline-block" />
                  Transparent PNG
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBgType('blur')
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition ${
                    bgType === 'blur'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Portrait Blur
                </button>
              </div>
            </div>

            {/* Tolerance & Edge Softness Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Detection Sensitivity</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{tolerance}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Edge Feathering (Smooth Hair)</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{edgeSoftness}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={edgeSoftness}
                  onChange={(e) => setEdgeSoftness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Interactive Live Canvas Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] flex items-center justify-center p-4 min-h-[380px]">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-h-[500px] w-auto object-contain rounded-lg shadow-lg cursor-crosshair transition-transform"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Click to Sample Tip */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 pointer-events-none">
              <Pipette className="w-3 h-3 text-blue-400" />
              <span>Tip: Click on any background area to sample & remove it</span>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md text-white p-1 rounded-xl">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs px-1 font-mono">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Download Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {samplePoints.length} color reference point{samplePoints.length !== 1 ? 's' : ''} applied
            </div>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleDownload('png')}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Download className="w-4 h-4" />
                Download HD PNG
              </button>

              <button
                type="button"
                onClick={() => handleDownload('jpeg')}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Download className="w-4 h-4" />
                Download JPG (Forms)
              </button>
            </div>
          </div>

          {/* Success Message Banner */}
          {status === 'done' && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Photo exported successfully! Download size: <strong>{Math.round(resultSize / 1024)} KB</strong>.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-500/20 rounded-xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg || 'An error occurred while processing.'}</span>
        </div>
      )}
    </div>
  )
}
