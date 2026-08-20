'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Sliders, ShieldCheck, Cpu, Percent, Share2 } from 'lucide-react'
import CompareSlider from '@/components/CompareSlider'

interface Props {
  config: {
    maxKB?: number
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function ImageCompressTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [resultSize, setResultSize] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Compression modes: 'quality' or 'size'
  const [mode, setMode] = useState<'quality' | 'size'>('quality')
  
  // Controls
  const [compressQuality, setCompressQuality] = useState<number>(75) // Default 75% quality
  const [targetKB, setTargetKB] = useState<number>(config.maxKB || 100)
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

  // Local GPU-Accelerated Canvas Compression
  const compressImage = useCallback(async (file: File, qualityPercent: number, targetSizeKB?: number) => {
    return new Promise<Blob>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = async () => {
          try {
            let width = img.width
            let height = img.height

            // Limit huge dimensions to optimize processing speeds
            const maxDim = 1600
            if (width > maxDim || height > maxDim) {
              const ratio = Math.min(maxDim / width, maxDim / height)
              width = Math.round(width * ratio)
              height = Math.round(height * ratio)
            }

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              reject(new Error('Browser canvas context not available.'))
              return
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            // Mode 1: Compress to exact KB limit using iteration
            if (mode === 'size' && targetSizeKB) {
              let quality = 0.95
              let scale = 1.0
              let resultBlob: Blob | null = null
              let iterations = 0
              const maxIterations = 30
              const safetyMargin = 0.98

              while (iterations < maxIterations) {
                canvas.width = Math.max(1, Math.round(width * scale))
                canvas.height = Math.max(1, Math.round(height * scale))
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                resultBlob = await new Promise<Blob | null>((res) => {
                  canvas.toBlob((b) => res(b), 'image/jpeg', quality)
                })

                if (!resultBlob) {
                  reject(new Error('Failed to compress.'))
                  return
                }

                const currentSizeKB = resultBlob.size / 1024
                if (currentSizeKB <= targetSizeKB * safetyMargin) {
                  break
                } else {
                  if (quality > 0.45) {
                    quality -= 0.12
                  } else {
                    scale = scale * 0.85
                  }
                }
                iterations++
              }

              // Emergency Fallback
              if (resultBlob && resultBlob.size / 1024 > targetSizeKB) {
                let emergencyScale = scale * 0.7
                while (resultBlob.size / 1024 > targetSizeKB && emergencyScale > 0.05) {
                  canvas.width = Math.max(1, Math.round(width * emergencyScale))
                  canvas.height = Math.max(1, Math.round(height * emergencyScale))
                  ctx.clearRect(0, 0, canvas.width, canvas.height)
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                  resultBlob = await new Promise<Blob | null>((res) => {
                    canvas.toBlob((b) => res(b), 'image/jpeg', 0.3)
                  })

                  if (!resultBlob) break
                  emergencyScale *= 0.7
                }
              }

              if (resultBlob) {
                resolve(resultBlob)
              } else {
                reject(new Error('Failed to compress target size.'))
              }
            } else {
              // Mode 2: Simple Quality Compression (instant)
              try {
                canvas.toBlob((blob) => {
                  if (blob) {
                    resolve(blob)
                  } else {
                    reject(new Error('Failed to generate image blob.'))
                  }
                }, 'image/jpeg', qualityPercent / 100)
              } catch (err) {
                reject(err)
              }
            }
          } catch (error) {
            reject(error instanceof Error ? error : new Error('Unknown error during compression.'))
          }
        }
        img.onerror = () => reject(new Error('Corrupted image file.'))
        img.src = event.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read image stream.'))
      reader.readAsDataURL(file)
    })
  }, [mode])

  const processImage = useCallback(async (file: File, overrideQuality?: number, overrideKB?: number) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file type. Please upload a JPG, PNG, or WEBP image.')
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

    const q = overrideQuality !== undefined ? overrideQuality : compressQuality
    const kb = overrideKB !== undefined ? overrideKB : targetKB

    try {
      const blob = await compressImage(file, q, kb)
      clearInterval(interval)
      
      if (resultUrl) URL.revokeObjectURL(resultUrl)

      setResultUrl(URL.createObjectURL(blob))
      setResultSize(blob.size)
      setStatus('done')
      
      // Fire confetti gamification!
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#3B82F6']
        });
      });
    } catch (err: any) {
      clearInterval(interval)
      setErrorMsg(err.message || 'Compression failed. Try a different format.')
      setStatus('error')
    }
  }, [compressQuality, targetKB, compressImage, resultUrl, originalUrl])

  // Triggers processing immediately on control adjustments
  const handleQualityChange = (val: number) => {
    setCompressQuality(val)
    if (originalFile) processImage(originalFile, val, undefined)
  }

  const handleKBChange = (val: number) => {
    setTargetKB(val)
    if (originalFile) processImage(originalFile, undefined, val)
  }

  const handleModeChange = (newMode: 'quality' | 'size') => {
    setMode(newMode)
    if (originalFile) {
      // Re-trigger with temporary updated mode state
      setTimeout(() => {
        if (newMode === 'quality') {
          processImage(originalFile, compressQuality, undefined)
        } else {
          processImage(originalFile, undefined, targetKB)
        }
      }, 50)
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
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const file = new File([blob], originalFile.name || 'image.jpg', { type: 'image/jpeg' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Compressed Image - SizeSnap',
          text: 'I compressed my image using SizeSnap.in!',
        })
      } else {
        await navigator.clipboard.writeText("https://sizesnap.in")
        alert("Link copied to clipboard! You can paste and share it with your friends on WhatsApp.")
      }
    } catch (err) {
      console.error("Share failed", err)
    }
  }

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [originalUrl, resultUrl])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight">Smart Image Compressor</h3>
          <p className="text-indigo-100 text-xs mt-1">Shrink image file size locally in your browser.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
          Mode: <span className="font-extrabold text-amber-300">{mode === 'quality' ? 'Quality Optimized' : `${targetKB}KB Target`}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Toggle Mode */}
        {status !== 'processing' && (
          <div className="space-y-4">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleModeChange('quality')}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  mode === 'quality'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Compress by Quality
              </button>
              <button
                onClick={() => handleModeChange('size')}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  mode === 'size'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Compress to Target Size (KB)
              </button>
            </div>

            {/* Quality Slider Control */}
            {mode === 'quality' && (
              <div className="space-y-2 bg-gray-50/50 border border-gray-100 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <Percent className="w-4 h-4 text-indigo-600" />
                    Quality Level:
                  </span>
                  <span className="font-bold text-indigo-700">{compressQuality}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={5}
                  value={compressQuality}
                  onChange={e => handleQualityChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>SMALL FILE (Low Quality)</span>
                  <span>BALANCED</span>
                  <span>BEST QUALITY (High Size)</span>
                </div>
              </div>
            )}

            {/* Target Size Slider Control */}
            {mode === 'size' && (
              <div className="space-y-2 bg-gray-50/50 border border-gray-100 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    Max File Size Budget:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={targetKB}
                      min={10}
                      max={2000}
                      onChange={e => handleKBChange(Math.max(10, Math.min(2000, Number(e.target.value))))}
                      className="w-20 px-2 py-0.5 border text-center rounded-md text-sm font-bold text-indigo-700"
                    />
                    <span className="text-xs text-gray-500 font-semibold">KB</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={5}
                  value={targetKB <= 500 ? targetKB : 500}
                  onChange={e => handleKBChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>10 KB</span>
                  <span>250 KB</span>
                  <span>500 KB</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Privacy & Trust Badge */}
        {status === 'idle' && (
          <div className="mb-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center justify-center gap-2 animate-fadeIn">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              100% Private: Photos are processed locally on your device. Never uploaded to any server.
            </span>
          </div>
        )}

        {/* Upload Zone */}
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/20'
                : 'border-gray-300 dark:border-zinc-700 hover:border-indigo-400 hover:bg-gray-50/30 dark:hover:bg-zinc-800/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-indigo-500 mx-auto mb-4 stroke-1.5" />
            <h4 className="font-bold text-gray-800 dark:text-zinc-100 text-base mb-1">
              Select Image to Compress
            </h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Supports JPG, PNG, WEBP files up to 25MB</p>
            
            <button className="mt-4 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-100 transition-colors inline-flex items-center gap-2">
              Select Photo
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

        {/* Processing Spinner */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 rounded-2xl border border-gray-100 space-y-4 px-6">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto animate-spin stroke-1.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800 text-base">Compressing File...</h4>
              <p className="text-xs text-indigo-600 font-semibold animate-pulse">
                {loadingSteps[loadingStep]}
              </p>
            </div>
            
            {/* Smooth animated progress bar */}
            <div className="w-full max-w-xs mx-auto bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${(loadingStep + 1) * 16.6}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Frame */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">An Error Occurred</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Compression Done Panel */}
        {status === 'done' && resultUrl && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">Image compressed successfully with no watermark!</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Before</p>
                <p className="font-extrabold text-sm sm:text-base text-gray-800">{formatBytes(originalSize)}</p>
              </div>
              <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Reduced</p>
                <p className="font-extrabold text-sm sm:text-base text-green-600">
                  -{Math.max(0, Math.round((1 - resultSize / originalSize) * 100))}%
                </p>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 mb-1">After</p>
                <p className="font-extrabold text-sm sm:text-base text-indigo-700">{formatBytes(resultSize)}</p>
              </div>
            </div>

            {/* Preview Box */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Result Preview (Drag slider to compare quality):</span>
              {originalUrl && resultUrl && (
                <CompareSlider originalUrl={originalUrl} resultUrl={resultUrl} />
              )}
            </div>

            {/* Actions CTA (Sticky on Mobile) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-6 sm:pb-0">
              {/* Desktop Download */}
              <a
                href={resultUrl}
                download={`compressed-${originalFile?.name || 'photo.jpg'}`}
                className="hidden sm:flex flex-1 items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download {formatBytes(resultSize)} Photo
              </a>
              
              {/* Mobile Sticky Download */}
              <div className="sm:hidden fixed bottom-6 left-4 right-4 z-50 flex gap-2">
                <a
                  href={resultUrl}
                  download={`compressed-${originalFile?.name || 'photo.jpg'}`}
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

              {/* Desktop Share */}
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
                Compress Another
              </button>
            </div>

            {/* Cross-Sell Feature */}
            <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div>
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Applying for Sarkari Exams? 🏛️</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">Generate your complete SSC/UPSC Photo & Signature pack in 1 click.</p>
              </div>
              <a href="/sarkari-exam-pack-generator" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 whitespace-nowrap shadow-sm">
                Try Exam Pack Maker &rarr;
              </a>
            </div>
          </div>
        )}

        {/* Safety Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client-Side Engine:</strong> Processing happens offline in your browser.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span><strong>Zero lag:</strong> Local image quantization yields instant results.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
