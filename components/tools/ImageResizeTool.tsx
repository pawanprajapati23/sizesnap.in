'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Image as ImageIcon, ShieldCheck, Cpu, Sliders, Share2, Zap } from 'lucide-react'
import CompareSlider from '@/components/CompareSlider'
import { processImageWithWorker } from '@/lib/imageWorker'

interface Props {
  config: {
    maxKB?: number
    width?: number
    height?: number
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function ImageResizeTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [resultSize, setResultSize] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Custom target size in KB (initialized from config or defaulting to 50KB)
  const [targetKB, setTargetKB] = useState<number>(config.maxKB || 50)
  const [customRange, setCustomRange] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadingSteps = [
    'Reading image file...',
    'Analyzing color parameters...',
    'Quantizing visual pixels...',
    'Iterating resolution adjustments...',
    'Evaluating size limits...',
    'Finalizing byte buffers...'
  ]

  // Web Worker accelerated compression
  const compressImage = useCallback(async (file: File, maxKB: number) => {
    const res = await processImageWithWorker(file, {
      targetKB: maxKB,
      targetWidth: config.width,
      targetHeight: config.height,
      format: 'image/jpeg',
      initialQuality: 0.95
    })
    return res.blob
  }, [config])

  const processImage = useCallback(async (file: File, customLimit?: number) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file type. Please upload a JPG, PNG, or WEBP photo.')
      setStatus('error')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File too large. Please upload an image under 25MB.')
      setStatus('error')
      return
    }

    setOriginalFile(file)
    // Clean old original URL if exists
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setOriginalUrl(URL.createObjectURL(file))

    setOriginalSize(file.size)
    setStatus('processing')
    setErrorMsg('')
    setLoadingStep(0)

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 5 ? prev + 1 : prev))
    }, 200)

    const finalLimit = customLimit !== undefined ? customLimit : targetKB

    try {
      const compressedBlob = await compressImage(file, finalLimit)
      clearInterval(interval)
      
      // Clean old URL
      if (resultUrl) URL.revokeObjectURL(resultUrl)

      setResultUrl(URL.createObjectURL(compressedBlob))
      setResultSize(compressedBlob.size)
      setStatus('done')
    } catch (err: any) {
      clearInterval(interval)
      setErrorMsg(err.message || 'Something went wrong. Please try a different photo.')
      setStatus('error')
    }
  }, [targetKB, compressImage, resultUrl, originalUrl])

  // Automatically re-compress if targetKB slider changes
  const handleSliderChange = (newVal: number) => {
    setTargetKB(newVal)
    if (originalFile) {
      processImage(originalFile, newVal)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImage(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processImage(file)
  }, [processImage])

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setOriginalUrl(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setOriginalSize(0)
    setResultSize(0)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleShare = async () => {
    if (!resultUrl || !originalFile) return
    try {
      // Fetch the blob from resultUrl
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const file = new File([blob], originalFile.name || 'image.jpg', { type: 'image/jpeg' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Resized Image - SizeSnap',
          text: 'I resized my image to target size using SizeSnap.in!',
        })
      } else {
        await navigator.clipboard.writeText("https://sizesnap.in")
        alert("Link copied to clipboard! You can paste and share it with your friends on WhatsApp.")
      }
    } catch (err) {
      console.error("Share failed", err)
    }
  }

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [originalUrl, resultUrl])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Banner with target info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight">Exact Size Image Resizer</h3>
          <p className="text-blue-100 text-xs mt-1">Guaranteed to fit strictly below your target KB.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
          Target: <span className="font-extrabold text-amber-300">{targetKB} KB</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Step 1: Adjust target size BEFORE or DURING processing */}
        {status !== 'processing' && (
          <div className="space-y-3 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              1. Choose Target Size:
            </label>
            
            <div className="flex flex-wrap gap-2">
              {[20, 50, 100, 200].map(kb => (
                <button
                  key={kb}
                  onClick={() => {
                    setCustomRange(false)
                    handleSliderChange(kb)
                  }}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                    targetKB === kb && !customRange
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {kb} KB
                </button>
              ))}
              <button
                onClick={() => setCustomRange(true)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                  customRange
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Custom Value...
              </button>
            </div>

            {(customRange || ![20, 50, 100, 200].includes(targetKB)) && (
              <div className="pt-2 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>Target File Size:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={targetKB}
                      min={10}
                      max={2000}
                      onChange={e => handleSliderChange(Math.max(10, Math.min(2000, Number(e.target.value))))}
                      className="w-20 px-2 py-1 text-center border rounded-md text-sm font-bold text-blue-700"
                    />
                    <span className="font-semibold text-gray-500 text-xs">KB</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={5}
                  value={targetKB <= 500 ? targetKB : 500}
                  onChange={e => handleSliderChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Upload Zone */}
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base mb-1">
              Select or Drop Image Here
            </h4>
            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP up to 25MB</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Browse Files
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Processing State */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 rounded-2xl border border-gray-100 space-y-4 px-6">
            <RefreshCw className="w-12 h-12 text-blue-600 mx-auto animate-spin stroke-1.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800 text-base">Optimizing and Resizing...</h4>
              <p className="text-xs text-blue-600 font-semibold animate-pulse">
                {loadingSteps[loadingStep]}
              </p>
            </div>
            
            {/* Smooth animated progress bar */}
            <div className="w-full max-w-xs mx-auto bg-gray-250 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${(loadingStep + 1) * 16.6}%` }}
              />
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Processing Failed</h4>
            <p className="text-sm text-red-700 max-w-md mx-auto px-4 mt-1">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Try Another Image
            </button>
          </div>
        )}

        {/* Success Result Panel */}
        {status === 'done' && resultUrl && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="text-xs sm:text-sm font-semibold">
                Successfully resized strictly below your target budget!
              </div>
            </div>

            {/* Stats Comparison Card */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Original Size</p>
                <p className="font-extrabold text-sm sm:text-base text-gray-800">{formatBytes(originalSize)}</p>
              </div>
              <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Savings</p>
                <p className="font-extrabold text-sm sm:text-base text-green-600">
                  -{Math.max(0, Math.round((1 - resultSize / originalSize) * 100))}%
                </p>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-blue-600 mb-1">New Size</p>
                <p className="font-extrabold text-sm sm:text-base text-blue-700">{formatBytes(resultSize)}</p>
              </div>
            </div>

            {/* Image Preview Window */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                Live Result Preview (Drag slider to compare quality):
              </span>
              {originalUrl && resultUrl && (
                <CompareSlider originalUrl={originalUrl} resultUrl={resultUrl} />
              )}
            </div>

            {/* Actions CTA (Sticky on Mobile) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-6 sm:pb-0">
              <a
                href={resultUrl}
                download={`resized-${originalFile?.name || 'photo.jpg'}`}
                className="hidden sm:flex flex-1 items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download {formatBytes(resultSize)} Photo
              </a>
              
              {/* Mobile Sticky Download */}
              <div className="sm:hidden fixed bottom-6 left-4 right-4 z-50 flex gap-2">
                <a
                  href={resultUrl}
                  download={`resized-${originalFile?.name || 'photo.jpg'}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 px-5 rounded-2xl font-bold active:bg-indigo-800 shadow-xl text-center text-lg shadow-indigo-600/30 border border-indigo-500"
                >
                  <Download className="w-6 h-6 animate-bounce" />
                  Download Now
                </a>
                <button
                  onClick={handleShare}
                  className="px-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center active:bg-emerald-800"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="hidden sm:flex px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share / Send
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Resize Another
              </button>
            </div>
          </div>
        )}

        {/* Security & Trust lines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>100% Secure:</strong> Processing runs client-side in browser.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Zero uploads:</strong> Your photos never touch a web server.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
