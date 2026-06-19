'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage, ShieldCheck, Cpu, ArrowRight, Layers } from 'lucide-react'

// Dynamic import pdfjs to avoid SSR compilation failures
let pdfjsLib: any
if (typeof window !== 'undefined') {
  // @ts-ignore
  import('pdfjs-dist/build/pdf.mjs').then(mod => {
    pdfjsLib = mod
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`
  })
}

interface Props {
  config?: any
}

type Status = 'idle' | 'processing' | 'done' | 'error'

interface ExtractedPage {
  index: number
  url: string
  sizeBytes: number
}

export default function PdfToJpgTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [results, setResults] = useState<ExtractedPage[]>([])
  const [progress, setProgress] = useState(0)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  
  // Custom Controls
  const [targetFormat, setTargetFormat] = useState<'jpg' | 'png' | 'webp'>('jpg')
  const [resolutionScale, setResolutionScale] = useState<number>(2.0) // 1.0 (72dpi), 2.0 (150dpi), 3.0 (300dpi)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // PDF Page extraction core
  const processPdf = async (file: File) => {
    setStatus('processing')
    setErrorMsg('')
    setProgress(0)

    try {
      if (!pdfjsLib) {
         // @ts-ignore
         pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')
         pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`
      }

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
      const pdf = await loadingTask.promise
      
      const numPages = pdf.numPages
      const processed: ExtractedPage[] = []

      let mimeType = 'image/jpeg'
      let extension = 'jpg'
      if (targetFormat === 'png') {
        mimeType = 'image/png'
        extension = 'png'
      } else if (targetFormat === 'webp') {
        mimeType = 'image/webp'
        extension = 'webp'
      }

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        
        // Custom scale for resolution DPI controls
        const viewport = page.getViewport({ scale: resolutionScale })
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }

        await page.render(renderContext).promise

        // Convert page to target quality and format
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, mimeType, 0.9))
        if (blob) {
           processed.push({
             index: i,
             url: URL.createObjectURL(blob),
             sizeBytes: blob.size
           })
        }

        setProgress(Math.round((i / numPages) * 100))
      }

      setResults(processed)
      setStatus('done')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Could not extract PDF pages. Please check if the file is secure or password-locked.')
      setStatus('error')
    }
  }

  // Reload PDF rendering when resolution/format settings change
  useEffect(() => {
    if (originalFile) {
      processPdf(originalFile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetFormat, resolutionScale])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setOriginalFile(file)
      processPdf(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setOriginalFile(file)
      processPdf(file)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetFormat, resolutionScale])

  // Sequentially trigger downloads for all pages
  const downloadAll = () => {
    const ext = targetFormat
    const baseName = originalFile?.name.substring(0, originalFile.name.lastIndexOf('.')) || 'extracted-page'
    results.forEach((item, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = item.url
        link.download = `${baseName}-page-${item.index}.${ext}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, index * 250) // slight offset to bypass browser block of multiple file triggers
    })
  }

  const handleReset = () => {
    results.forEach(r => URL.revokeObjectURL(r.url))
    setStatus('idle')
    setOriginalFile(null)
    setResults([])
    setErrorMsg('')
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      results.forEach(r => URL.revokeObjectURL(r.url))
    }
  }, [results])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">PDF to Image Converter</h3>
          <p className="text-blue-100 text-xs mt-1">Convert document pages into high-resolution JPG, PNG or WebP images.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Client-Side Sandbox
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Dropzone Upload */}
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
              Select PDF Document
            </h4>
            <p className="text-xs text-gray-500">Upload a PDF to extract pages. Works instantly in your browser.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose PDF File
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

        {/* State 2: Extracting Process */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Rendering document pages: {progress}%</h4>
            <p className="text-xs text-gray-500 mt-1">Executing standard raster graphics rendering in-memory.</p>
            <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* State 3: Error state */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Page Extraction Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 4: Done Results view */}
        {status === 'done' && results.length > 0 && originalFile && (
          <div className="space-y-6 animate-fadeIn">
            {/* Success message */}
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">Extracted {results.length} pages successfully!</span>
            </div>

            {/* Config workspace */}
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Output format override */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Output Image Format:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['jpg', 'png', 'webp'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`py-1.5 text-xs font-bold border rounded-lg uppercase transition-all text-center ${
                        targetFormat === fmt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution multiplier */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Output Resolution (DPI):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Standard (72dpi)', val: 1.0 },
                    { label: 'HD (150dpi)', val: 2.0 },
                    { label: 'Print (300dpi)', val: 3.0 }
                  ].map(res => (
                    <button
                      key={res.val}
                      onClick={() => setResolutionScale(res.val)}
                      className={`py-1.5 px-1 text-xs font-bold border rounded-lg transition-all text-center leading-tight ${
                        resolutionScale === res.val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery Staging Area */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Extracted Pages Pages Grid
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[340px] overflow-y-auto pr-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
                {results.map((r, i) => (
                  <div key={r.index} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all">
                    <div className="relative aspect-[3/4] bg-slate-100 flex items-center justify-center p-2 overflow-hidden border-b border-gray-150">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.url} alt={`Page ${r.index}`} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="p-2.5 flex items-center justify-between bg-white text-[10px] font-semibold text-gray-500">
                      <span className="font-mono">Page {r.index} ({(r.sizeBytes / 1024).toFixed(0)}KB)</span>
                      <a
                        href={r.url}
                        download={`page-${r.index}.${targetFormat}`}
                        className="p-1 bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
                        title="Download Page"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={downloadAll}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download All Pages ({results.length})
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Start Fresh
              </button>
            </div>
          </div>
        )}

        {/* Security badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Secure Sandbox:</strong> Conversions are processed inside your browser engine.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Data Safe:</strong> Files stay safe in your device memory. No server uploads.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
