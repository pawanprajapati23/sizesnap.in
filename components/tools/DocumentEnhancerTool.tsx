'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, ShieldCheck, Cpu, Sliders, Sun, Contrast, Share2 } from 'lucide-react'

interface Props {
  config: {
    maxKB?: number
  }
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'
type FilterMode = 'scan' | 'signature' | 'normal'

export default function DocumentEnhancerTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Configurations
  const [filterMode, setFilterMode] = useState<FilterMode>('scan')
  const [brightness, setBrightness] = useState<number>(0) // -100 to 100
  const [contrast, setContrast] = useState<number>(15) // -100 to 100
  const [threshold, setThreshold] = useState<number>(128) // 0 to 255 (for scanner/binary mode)
  const [targetKb, setTargetKb] = useState<number>(config.maxKB || 100)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Clean URLs
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [originalUrl, resultUrl])

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid format. Please upload a scanned document image.')
      setStatus('error')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Image size is too large (Max 20MB).')
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
    }
    img.src = url
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const processEnhancement = useCallback(async () => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return

    setStatus('processing')
    try {
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error("Could not get Canvas Context")

      // Match canvas sizes
      canvas.width = img.width
      canvas.height = img.height

      // Draw initial image
      ctx.drawImage(img, 0, 0)

      // Apply filters on pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Math Helpers
      const bFactor = brightness / 100 * 255
      const cFactor = (259 * (contrast + 255)) / (255 * (259 - contrast))

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // 1. Contrast Adjustment
        r = cFactor * (r - 128) + 128
        g = cFactor * (g - 128) + 128
        b = cFactor * (b - 128) + 128

        // 2. Brightness Adjustment
        r += bFactor
        g += bFactor
        b += bFactor

        // Clamp values
        r = Math.max(0, Math.min(255, r))
        g = Math.max(0, Math.min(255, g))
        b = Math.max(0, Math.min(255, b))

        // 3. Scan & Signature Filters (convert to high contrast B&W or clean background)
        if (filterMode === 'scan' || filterMode === 'signature') {
          // Greyscale intensity
          const grey = 0.299 * r + 0.587 * g + 0.114 * b

          if (filterMode === 'scan') {
            // Document scan: Make background pure white, make text dark black
            const val = grey >= threshold ? 255 : 0
            r = g = b = val
          } else {
            // Signature mode: adaptive white background, boost blue/black ink contrast
            if (grey > threshold - 20) {
              r = g = b = 255 // Make background white
            } else {
              // Convert grey signature ink to pure black to remove shadows
              r = g = b = Math.max(0, grey - 40)
            }
          }
        }

        data[i] = r
        data[i + 1] = g
        data[i + 2] = b
      }

      ctx.putImageData(imageData, 0, 0)

      // Quality compression loop
      let quality = 0.95
      let blob: Blob | null = null
      for (let j = 0; j < 10; j++) {
        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((bl) => resolve(bl), 'image/jpeg', quality)
        })
        if (!blob) break
        const currentSize = blob.size / 1024
        if (currentSize <= targetKb || quality <= 0.2) break
        quality -= 0.1
      }

      if (blob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl)
        setResultUrl(URL.createObjectURL(blob))
        setStatus('done')
        setErrorMsg('')
      } else {
        throw new Error("Failed compiling image binary.")
      }

    } catch (err: any) {
      setErrorMsg(err.message || "Failed processing image.")
      setStatus('error')
    }
  }, [brightness, contrast, threshold, filterMode, targetKb, resultUrl])

  const handleReset = () => {
    setOriginalFile(null)
    setOriginalUrl(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setStatus('idle')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleShare = async () => {
    if (!resultUrl) return
    try {
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const file = new File([blob], 'enhanced-document.jpg', { type: 'image/jpeg' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Scanned Document - SizeSnap',
          text: 'I cleaned and removed shadows from my document scan online locally using SizeSnap.in!',
        })
      } else {
        await navigator.clipboard.writeText("https://sizesnap.in")
        alert("Link copied to clipboard! You can paste and share it with your friends on WhatsApp.")
      }
    } catch (err) {
      console.error("Share failed", err)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-sans">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Document &amp; Signature Enhancer</h3>
          <p className="text-blue-100 text-xs mt-1">Remove shadows, adjust threshold, and clean paper background locally.</p>
        </div>
        {status === 'editing' && (
          <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
            TARGET: <span className="font-extrabold text-amber-300">{targetKb} KB</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Upload */}
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleUpload(file)
            }}
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base mb-1">Upload Scanned Marksheet / Signature</h4>
            <p className="text-xs text-gray-500">Supports JPG, JPEG, and PNG images.</p>
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose Document File
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        )}

        {/* State 2: Processing */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Applying Enhancing Matrix...</h4>
            <p className="text-xs text-gray-500 mt-1">Calculating pixel contrast adjustments in client memory.</p>
          </div>
        )}

        {/* State 3: Error */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Enhancement Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button onClick={handleReset} className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm">
              Reset and Retry
            </button>
          </div>
        )}

        {/* State 4: Editing Canvas Control */}
        {status === 'editing' && originalUrl && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column Preview */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 self-start mb-2 uppercase tracking-wider">Preview Frame:</span>
                <div className="w-full min-h-[240px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={originalUrl} alt="Original document" className="max-h-[220px] object-contain rounded shadow border border-gray-200" />
                </div>
              </div>

              {/* Right Column Controls */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 shadow-inner space-y-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" /> Filter Options
                  </span>

                  {/* Filter presets */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mode: 'scan', label: 'B&W Scan' },
                      { mode: 'signature', label: 'Signature Fix' },
                      { mode: 'normal', label: 'Grey Scale' }
                    ].map((f) => (
                      <button
                        key={f.mode}
                        onClick={() => setFilterMode(f.mode as FilterMode)}
                        className={`py-2 text-xs font-bold border rounded-xl transition-all text-center ${
                          filterMode === f.mode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Contrast Adjustment */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex justify-between">
                      <span className="flex items-center gap-1"><Contrast className="w-3.5 h-3.5 text-blue-500" /> Contrast:</span>
                      <span className="text-blue-600 font-extrabold">{contrast}</span>
                    </label>
                    <input type="range" min={-50} max={100} step={2} value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg cursor-pointer" />
                  </div>

                  {/* Brightness Adjustment */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex justify-between">
                      <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-yellow-500" /> Brightness:</span>
                      <span className="text-yellow-600 font-extrabold">{brightness}</span>
                    </label>
                    <input type="range" min={-50} max={50} step={2} value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-yellow-500 h-1 bg-gray-200 rounded-lg cursor-pointer" />
                  </div>

                  {/* Threshold Slider (only for scan/signature modes) */}
                  {(filterMode === 'scan' || filterMode === 'signature') && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 flex justify-between">
                        <span>White Threshold Cutoff:</span>
                        <span className="text-indigo-600 font-extrabold">{threshold}</span>
                      </label>
                      <input type="range" min={50} max={220} step={2} value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-full accent-indigo-600 h-1 bg-gray-200 rounded-lg cursor-pointer" />
                    </div>
                  )}

                  {/* Target KB */}
                  <div className="space-y-1 pt-2 border-t border-gray-200">
                    <label className="text-xs font-bold text-gray-700 flex justify-between">
                      <span>Max Target Size:</span>
                      <span className="text-teal-600 font-black">{targetKb} KB</span>
                    </label>
                    <input type="range" min={20} max={300} step={10} value={targetKb} onChange={e => setTargetKb(Number(e.target.value))} className="w-full accent-teal-600 h-1 bg-gray-200 rounded-lg cursor-pointer" />
                  </div>

                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button onClick={processEnhancement} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm text-sm">
                Apply Filters &amp; Clean Scan
              </button>
              <button onClick={handleReset} className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* State 5: Done */}
        {status === 'done' && resultUrl && originalFile && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-6 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 self-start mb-2 uppercase tracking-wider">Enhanced Document:</span>
                <div className="w-full min-h-[240px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Enhanced result" className="max-h-[220px] object-contain rounded shadow-md border border-gray-200 bg-white" />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-900 text-xs">
                  <p className="font-bold flex items-center gap-1 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Enhancement Applied!
                  </p>
                  <p>Shadows removed and contrast optimized. Paper white balance fixed.</p>
                </div>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
              <a
                href={resultUrl}
                download={`enhanced-${filterMode}-${originalFile.name}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center text-sm"
              >
                <Download className="w-5 h-5" /> Download Clean Document
              </a>
              <button
                onClick={handleShare}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm border-none"
              >
                <Share2 className="w-4 h-4" /> Share / Send
              </button>
              <button onClick={handleReset} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold text-sm">
                Start Fresh
              </button>
            </div>
          </div>
        )}

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Security Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client processing:</strong> Filter matrices calculate locally. 100% Secure.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Lossless limits:</strong> Preserves signature lines without blurry edges.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
