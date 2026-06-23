'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileText, ShieldCheck, Cpu, Sliders, Settings } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config: {
    maxKB?: number
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function PdfCompressTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [resultSize, setResultSize] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Compression Settings
  const [mode, setMode] = useState<'quality' | 'size'>('quality')
  const [compressLevel, setCompressLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [targetKB, setTargetKB] = useState<number>(config.maxKB || 200)
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const processPdf = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Invalid file format. Please upload a valid PDF document.')
      setStatus('error')
      return
    }

    if (file.size > 80 * 1024 * 1024) {
      setErrorMsg('File too large. SizeSnap processes PDFs up to 80MB.')
      setStatus('error')
      return
    }

    setOriginalFile(file)
    setOriginalSize(file.size)
    setStatus('processing')
    setErrorMsg('')
    setProgress(5)
    setLoadingMessage('Loading PDF reader module...')

    try {
      // 1. Load PDF.js dynamically
      let pdfjsLib: any = (window as any).pdfjsLib
      if (!pdfjsLib) {
         setLoadingMessage('Initializing document parsing components...')
         // @ts-ignore
         pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')
         pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`
         ;(window as any).pdfjsLib = pdfjsLib
      }

      setProgress(10)
      setLoadingMessage('Reading PDF structure and catalog...')
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
      let pdf: any
      try {
        pdf = await loadingTask.promise
      } catch (loadErr) {
        throw new Error('Failed to open PDF. It may be corrupted or password-protected.')
      }
      
      const numPages = pdf.numPages
      if (numPages === 0) {
        throw new Error('The uploaded PDF does not contain any pages.')
      }

      // 2. High-Performance Optimization: Render pages ONCE at scale 1.5 and cache images
      const pageImages: HTMLImageElement[] = []
      
      for (let i = 1; i <= numPages; i++) {
        setLoadingMessage(`Rasterizing page ${i} of ${numPages} (extracting layout)...`)
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: ctx, viewport }).promise

        const imgDataUrl = canvas.toDataURL('image/jpeg', 0.9)
        const img = new Image()
        img.src = imgDataUrl
        await new Promise((res) => { img.onload = res })
        pageImages.push(img)
        
        setProgress(10 + Math.round((i / numPages) * 40)) // Up to 50%
      }

      // 3. Compression settings configuration
      const targetSize = mode === 'size' ? targetKB * 1024 : undefined
      
      let currentScale = 1.0
      let currentQuality = 0.8

      if (mode === 'quality') {
        if (compressLevel === 'low') { // Low compression (High quality)
          currentScale = 0.95
          currentQuality = 0.85
        } else if (compressLevel === 'medium') { // Medium compression (Balanced)
          currentScale = 0.8
          currentQuality = 0.7
        } else if (compressLevel === 'high') { // High compression (Extreme size drop)
          currentScale = 0.6
          currentQuality = 0.5
        }
      }

      let attempts = 0
      const maxAttempts = mode === 'size' ? 5 : 1
      let finalBlob: Blob | null = null

      while (attempts < maxAttempts) {
        const attemptLabel = mode === 'size' ? ` (Attempt ${attempts + 1}/${maxAttempts})` : ''
        setLoadingMessage(`Optimizing documents rendering${attemptLabel}...`)
        const newPdfDoc = await PDFDocument.create()

        for (let i = 0; i < numPages; i++) {
          setLoadingMessage(`Compiling and compressing page ${i + 1} of ${numPages}${attemptLabel}...`)
          const imgElement = pageImages[i]
          const targetW = Math.round(imgElement.width * currentScale)
          const targetH = Math.round(imgElement.height * currentScale)

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          canvas.width = targetW
          canvas.height = targetH

          ctx.drawImage(imgElement, 0, 0, targetW, targetH)

          const compressedUrl = canvas.toDataURL('image/jpeg', currentQuality)
          const pdfImg = await newPdfDoc.embedJpg(compressedUrl)

          const pdfPage = newPdfDoc.addPage([targetW, targetH])
          pdfPage.drawImage(pdfImg, {
            x: 0,
            y: 0,
            width: targetW,
            height: targetH,
          })
          
          setProgress(50 + Math.round((i / numPages) * 40)) // Up to 90%
        }

        setLoadingMessage(`Assembling optimized document components${attemptLabel}...`)
        const pdfBytes = await newPdfDoc.save({ useObjectStreams: false })
        finalBlob = new Blob([pdfBytes as any], { type: 'application/pdf' })

        if (targetSize && finalBlob.size > targetSize) {
           currentScale -= 0.15
           currentQuality -= 0.12
           attempts++
           
           if (currentScale < 0.45) currentScale = 0.45
           if (currentQuality < 0.15) currentQuality = 0.15
        } else {
           break
        }
      }

      if (!finalBlob) throw new Error('Document assembly failed.')

      setLoadingMessage('Finalizing output stream...')
      setProgress(95)

      if (resultUrl) URL.revokeObjectURL(resultUrl)

      setResultUrl(URL.createObjectURL(finalBlob))
      setResultSize(finalBlob.size)
      setProgress(100)
      setStatus('done')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Something went wrong. Make sure the PDF is not password protected.')
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processPdf(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processPdf(file)
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setOriginalSize(0)
    setResultSize(0)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [resultUrl])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tool Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight">Smart PDF Compressor</h3>
          <p className="text-blue-100 text-xs mt-1">Shrink and compress PDF documents securely offline.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
          Limit: <span className="font-extrabold text-amber-300">{mode === 'quality' ? `${compressLevel.toUpperCase()} Compression` : `${targetKB}KB Target`}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Toggle Mode */}
        {status !== 'processing' && (
          <div className="space-y-4">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setMode('quality')}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  mode === 'quality'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Compress by Quality
              </button>
              <button
                onClick={() => setMode('size')}
                className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                  mode === 'size'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Compress to Target Size (KB)
              </button>
            </div>

            {/* Quality selection Control */}
            {mode === 'quality' && (
              <div className="space-y-2 bg-gray-50/50 border border-gray-100 rounded-xl p-4 animate-fadeIn">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  Compression Level:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'low', label: 'Low (Safe)', desc: 'High Quality' },
                    { val: 'medium', label: 'Medium', desc: 'Recommended' },
                    { val: 'high', label: 'Extreme', desc: 'Lowest Size' }
                  ].map(lvl => (
                    <button
                      key={lvl.val}
                      onClick={() => setCompressLevel(lvl.val as any)}
                      className={`px-3 py-2.5 rounded-lg border text-center transition-all ${
                        compressLevel === lvl.val
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-bold'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="block text-sm">{lvl.label}</span>
                      <span className={`block text-[9px] uppercase tracking-wider mt-0.5 ${compressLevel === lvl.val ? 'text-blue-100' : 'text-gray-400'}`}>{lvl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Target Size Slider Control */}
            {mode === 'size' && (
              <div className="space-y-2 bg-gray-50/50 border border-gray-100 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    Target PDF Size Limit:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={targetKB}
                      min={50}
                      max={5000}
                      onChange={e => setTargetKB(Math.max(50, Math.min(5000, Number(e.target.value))))}
                      className="w-20 px-2 py-0.5 border text-center rounded-md text-sm font-bold text-indigo-700"
                    />
                    <span className="text-xs text-gray-500 font-semibold">KB</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={50}
                  value={targetKB <= 2000 ? targetKB : 2000}
                  onChange={e => setTargetKB(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>50 KB</span>
                  <span>1000 KB</span>
                  <span>2000 KB</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Zone */}
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50/30'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base mb-1">
              Select or Drop PDF Here
            </h4>
            <p className="text-xs text-gray-500">Supports PDF documents up to 80MB</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose PDF
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
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
              <h4 className="font-bold text-gray-800 text-base">Rasterizing & Compressing Pages...</h4>
              <p className="text-xs text-blue-600 font-semibold animate-pulse">
                {loadingMessage}
              </p>
            </div>
            
            {/* Smooth animated progress bar */}
            <div className="w-full max-w-xs mx-auto bg-gray-250 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Frame */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Unable to Compress PDF</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success Done Panel */}
        {status === 'done' && resultUrl && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">PDF compressed successfully! Text remains crisp.</span>
            </div>

            {/* Metrics */}
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
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 mb-1">New Size</p>
                <p className="font-extrabold text-sm sm:text-base text-indigo-700">{formatBytes(resultSize)}</p>
              </div>
            </div>

            {/* Actions CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultUrl}
                download={`compressed-${originalFile?.name || 'document.pdf'}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download {formatBytes(resultSize)} PDF
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Compress Another
              </button>
            </div>
          </div>
        )}

        {/* Safety & Performance badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client-Side:</strong> Scans run inside browser sandbox locally.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Zero server lag:</strong> Compiled locally, preserving data integrity.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
