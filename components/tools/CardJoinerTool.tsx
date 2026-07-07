'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, ShieldCheck, Cpu, LayoutGrid, ArrowDown, ArrowRight, Share2 } from 'lucide-react'

interface Props {
  config: {
    maxKB?: number
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'
type Arrangement = 'vertical' | 'horizontal'

export default function CardJoinerTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [frontUrl, setFrontUrl] = useState<string | null>(null)
  const [backUrl, setBackUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [arrangement, setArrangement] = useState<Arrangement>('vertical')
  const [spacing, setSpacing] = useState<number>(10)
  const [maxKb, setMaxKb] = useState<number>(config.maxKB || 100)
  const [errorMsg, setErrorMsg] = useState('')

  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Clean object URLs
  useEffect(() => {
    return () => {
      if (frontUrl) URL.revokeObjectURL(frontUrl)
      if (backUrl) URL.revokeObjectURL(backUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [frontUrl, backUrl, resultUrl])

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (frontUrl) URL.revokeObjectURL(frontUrl)
      setFrontFile(file)
      setFrontUrl(URL.createObjectURL(file))
      setStatus('idle')
    }
  }

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (backUrl) URL.revokeObjectURL(backUrl)
      setBackFile(file)
      setBackUrl(URL.createObjectURL(file))
      setStatus('idle')
    }
  }

  const joinCards = useCallback(async () => {
    if (!frontFile || !backFile) {
      setErrorMsg("Please upload both front and back images.")
      setStatus('error')
      return
    }

    setStatus('processing')
    try {
      const loadImg = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = () => reject(new Error("Could not load image"))
          img.src = url
        })
      }

      const [frontImg, backImg] = await Promise.all([
        loadImg(frontUrl!),
        loadImg(backUrl!)
      ])

      const canvas = canvasRef.current
      if (!canvas) throw new Error("Canvas element not found.")
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error("Could not get canvas 2D context.")

      // Determine dimensions
      let totalWidth = 0
      let totalHeight = 0
      let frontDrawWidth = 0
      let frontDrawHeight = 0
      let backDrawWidth = 0
      let backDrawHeight = 0

      if (arrangement === 'vertical') {
        // Match widths to the larger one
        const maxWidth = Math.max(frontImg.width, backImg.width)
        frontDrawWidth = maxWidth
        frontDrawHeight = frontImg.height * (maxWidth / frontImg.width)
        backDrawWidth = maxWidth
        backDrawHeight = backImg.height * (maxWidth / backImg.width)

        totalWidth = maxWidth
        totalHeight = frontDrawHeight + backDrawHeight + spacing
      } else {
        // Match heights to the larger one
        const maxHeight = Math.max(frontImg.height, backImg.height)
        frontDrawHeight = maxHeight
        frontDrawWidth = frontImg.width * (maxHeight / frontImg.height)
        backDrawHeight = maxHeight
        backDrawWidth = backImg.width * (maxHeight / backImg.height)

        totalWidth = frontDrawWidth + backDrawWidth + spacing
        totalHeight = maxHeight
      }

      // Add a border margin around
      const margin = 15
      canvas.width = totalWidth + margin * 2
      canvas.height = totalHeight + margin * 2

      // Draw background (white)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw front image
      const frontX = margin
      const frontY = margin
      ctx.drawImage(frontImg, frontX, frontY, frontDrawWidth, frontDrawHeight)

      // Draw back image
      let backX = margin
      let backY = margin
      if (arrangement === 'vertical') {
        backY = margin + frontDrawHeight + spacing
      } else {
        backX = margin + frontDrawWidth + spacing
      }
      ctx.drawImage(backImg, backX, backY, backDrawWidth, backDrawHeight)

      // Compress and export locally
      let quality = 0.95
      let blob: Blob | null = null
      
      // Perform iterative quality adjustment to stay under maxKB target
      for (let i = 0; i < 10; i++) {
        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
        })
        if (!blob) break
        const sizeKB = blob.size / 1024
        if (sizeKB <= maxKb || quality <= 0.2) break
        quality -= 0.1
      }

      if (blob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl)
        setResultUrl(URL.createObjectURL(blob))
        setStatus('done')
        setErrorMsg('')
      } else {
        throw new Error("Blob compilation failed.")
      }

    } catch (err: any) {
      setErrorMsg(err.message || "Failed merging cards.")
      setStatus('error')
    }
  }, [frontFile, backFile, frontUrl, backUrl, arrangement, spacing, maxKb, resultUrl])

  const handleReset = () => {
    setFrontFile(null)
    setBackFile(null)
    setFrontUrl(null)
    setBackUrl(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setStatus('idle')
    setErrorMsg('')
  }

  const handleShare = async () => {
    if (!resultUrl) return
    try {
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const file = new File([blob], 'merged-id-card.jpg', { type: 'image/jpeg' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Merged ID Card - SizeSnap',
          text: 'I merged my ID card front & back side online locally using SizeSnap.in!',
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
          <h3 className="font-bold text-lg leading-tight font-sans">Aadhaar &amp; ID Card Joiner</h3>
          <p className="text-blue-100 text-xs mt-1">Combine Front &amp; Back side of your ID card into a single sheet locally.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
          TARGET LIMIT: <span className="font-extrabold text-amber-300">{maxKb} KB</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {status !== 'done' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Card Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">1. Front Side Image:</label>
              {frontUrl ? (
                <div className="relative border border-gray-200 bg-slate-50 rounded-xl overflow-hidden min-h-[160px] flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frontUrl} alt="Front" className="max-h-[140px] rounded shadow-sm object-contain" />
                  <button 
                    onClick={() => frontInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-sm transition-all"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => frontInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-50/30 rounded-xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-blue-500 mb-2 stroke-1.5" />
                  <span className="text-xs font-bold text-gray-700">Upload Front Side</span>
                  <span className="text-[10px] text-gray-400 mt-1">Click to select photo</span>
                </div>
              )}
              <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={handleFrontChange} />
            </div>

            {/* Back Card Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">2. Back Side Image:</label>
              {backUrl ? (
                <div className="relative border border-gray-200 bg-slate-50 rounded-xl overflow-hidden min-h-[160px] flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={backUrl} alt="Back" className="max-h-[140px] rounded shadow-sm object-contain" />
                  <button 
                    onClick={() => backInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-sm transition-all"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => backInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-50/30 rounded-xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-blue-500 mb-2 stroke-1.5" />
                  <span className="text-xs font-bold text-gray-700">Upload Back Side</span>
                  <span className="text-[10px] text-gray-400 mt-1">Click to select photo</span>
                </div>
              )}
              <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={handleBackChange} />
            </div>
          </div>
        )}

        {/* Configurations panel (when idle / editing) */}
        {status !== 'done' && status !== 'processing' && (
          <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-inner">
            {/* Layout selectors */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Layout Style</span>
              <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
                <button 
                  onClick={() => setArrangement('vertical')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1 ${arrangement === 'vertical' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <ArrowDown className="w-3.5 h-3.5" /> Vertical
                </button>
                <button 
                  onClick={() => setArrangement('horizontal')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1 ${arrangement === 'horizontal' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Horizontal
                </button>
              </div>
            </div>

            {/* Spacing selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Spacing: <span className="text-blue-600">{spacing}px</span></span>
              <input 
                type="range" min={0} max={100} step={5} value={spacing} onChange={e => setSpacing(Number(e.target.value))}
                className="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* KB target selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Target Size: <span className="text-indigo-600 font-black">{maxKb} KB</span></span>
              <input 
                type="range" min={30} max={500} step={10} value={maxKb} onChange={e => setMaxKb(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* State: Processing */}
        {status === 'processing' && (
          <div className="text-center py-8 bg-slate-50/50 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-sm">Merging image canvases...</h4>
            <p className="text-[11px] text-gray-500">Compiling front &amp; back templates locally.</p>
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
          <div className="text-center py-6 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-sm">Failed to join cards</h4>
            <p className="text-xs text-red-700 mt-1 px-4">{errorMsg}</p>
            <button onClick={() => setStatus('idle')} className="mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-xs hover:bg-gray-50 transition-all">
              Try Again
            </button>
          </div>
        )}

        {/* State: Done (Result Screen) */}
        {status === 'done' && resultUrl && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="max-w-md mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-slate-50 p-6 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="font-bold text-gray-800 text-sm mb-4">Cards Joined Successfully!</h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="Merged ID result" className="max-h-[260px] rounded shadow-md border border-gray-200 bg-white object-contain" />
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100 max-w-lg mx-auto">
              <a 
                href={resultUrl} download={`merged-${frontFile?.name || 'id-card'}.jpg`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm"
              >
                <Download className="w-5 h-5" /> Download Joined ID Card
              </a>
              <button 
                onClick={handleShare}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm border-none"
              >
                <Share2 className="w-4 h-4" /> Share / Send
              </button>
              <button onClick={handleReset} className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold text-sm">
                Start Fresh
              </button>
            </div>
          </div>
        )}

        {/* Trigger Button (if editing) */}
        {status !== 'done' && status !== 'processing' && (
          <button 
            onClick={joinCards}
            disabled={!frontFile || !backFile}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
              frontFile && backFile ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <LayoutGrid className="w-5 h-5" /> Merge Front &amp; Back Images
          </button>
        )}

        {/* Hidden rendering canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Security Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>100% Private:</strong> Joined locally in browser. No file uploads.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Optimized KB:</strong> Auto-compresses below the target threshold.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
