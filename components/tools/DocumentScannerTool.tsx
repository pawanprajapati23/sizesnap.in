'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage, ShieldCheck, Cpu, ArrowRight } from 'lucide-react'

interface Props {
  config?: any
}

type Status = 'idle' | 'processing' | 'done' | 'error'
type ScanPreset = 'monochrome' | 'grayscale' | 'color' | 'magic'

export default function DocumentScannerTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)

  // Document Scan adjustment configurations
  const [preset, setPreset] = useState<ScanPreset>('monochrome')
  const [threshold, setThreshold] = useState<number>(128)
  const [contrast, setContrast] = useState<number>(40)
  const [brightness, setBrightness] = useState<number>(20)
  const [targetKb, setTargetKb] = useState<number>(150)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Handle uploaded files
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file format. Please select an image file (JPG, PNG, WEBP).')
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
      setStatus('processing')
      setErrorMsg('')
      runScannerRendering(img, preset, threshold, contrast, brightness, targetKb)
    }
    img.onerror = () => {
      setErrorMsg('Could not read document image file.')
      setStatus('error')
    }
    img.src = url
  }

  // Scan filter compiler
  const runScannerRendering = async (
    img: HTMLImageElement,
    mode: ScanPreset,
    thresh: number,
    cont: number,
    bright: number,
    target: number
  ) => {
    setStatus('processing')
    try {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!

      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data

      // Contrast adjustment factor
      const factor = (259 * (cont + 255)) / (255 * (259 - cont))

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // Apply Brightness & Contrast
        r = factor * (r + bright - 128) + 128
        g = factor * (g + bright - 128) + 128
        b = factor * (b + bright - 128) + 128

        // Standard Grayscale Luma metric
        const gray = 0.299 * r + 0.587 * g + 0.114 * b

        if (mode === 'monochrome') {
          // Pure Binary Black/White scanner
          const val = gray >= thresh ? 255 : 0
          data[i] = val
          data[i + 1] = val
          data[i + 2] = val
        } else if (mode === 'grayscale') {
          // Boosted high contrast Grayscale scan
          const val = Math.max(0, Math.min(255, gray))
          data[i] = val
          data[i + 1] = val
          data[i + 2] = val
        } else if (mode === 'magic') {
          // Clean background shadows, retain sharp colors
          // If pixel matches gray background spectrum, bleach it to white
          const luma = 0.299 * r + 0.587 * g + 0.114 * b
          if (luma > thresh) {
            data[i] = 255
            data[i + 1] = 255
            data[i + 2] = 255
          } else {
            data[i] = Math.max(0, Math.min(255, r * 1.1))
            data[i + 1] = Math.max(0, Math.min(255, g * 1.1))
            data[i + 2] = Math.max(0, Math.min(255, b * 1.1))
          }
        } else {
          // Normal boosted color scan
          data[i] = Math.max(0, Math.min(255, r))
          data[i + 1] = Math.max(0, Math.min(255, g))
          data[i + 2] = Math.max(0, Math.min(255, b))
        }
      }

      ctx.putImageData(imgData, 0, 0)

      let quality = 0.85
      let blob: Blob | null = null

      const getBlob = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q))

      // Compile exact file size using binary search quality checks
      let low = 0.05
      let high = 0.95
      const safetyMargin = 0.98
      const maxBytes = target * 1024 * safetyMargin

      for (let j = 0; j < 9; j++) {
        quality = (low + high) / 2
        blob = await getBlob(quality)
        if (!blob) break

        if (blob.size > maxBytes) {
          high = quality
        } else {
          low = quality
        }
      }

      if (blob && blob.size > target * 1024) {
        blob = await getBlob(0.05)
      }

      if (blob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl)
        setFinalFile(blob)
        setResultUrl(URL.createObjectURL(blob))
        setStatus('done')
      } else {
        throw new Error('Canvas render failed.')
      }

    } catch (e: any) {
      console.error(e)
      setErrorMsg(e.message || 'Error processing document scan filter.')
      setStatus('error')
    }
  }

  // Reload document scanner whenever config sliders change
  useEffect(() => {
    if (imgRef.current && originalFile) {
      runScannerRendering(imgRef.current, preset, threshold, contrast, brightness, targetKb)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, threshold, contrast, brightness, targetKb])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, threshold, contrast, brightness, targetKb])

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    imgRef.current = null
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setOriginalUrl(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setFinalFile(null)
    setPreset('monochrome')
    setThreshold(128)
    setContrast(40)
    setBrightness(20)
    setTargetKb(150)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [originalUrl, resultUrl])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Document PDF & JPG Scanner</h3>
          <p className="text-blue-100 text-xs mt-1">Convert photos of paperwork into clear high-contrast digital scans.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Client-Side
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Upload Box */}
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
              Select Document Photo
            </h4>
            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP files. Converts paper sheets to neat scans.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose Document
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

        {/* State 2: Processing */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Applying document scan enhancement filters...</h4>
            <p className="text-xs text-gray-500 mt-1">Executing standard pixel matrices conversions locally.</p>
          </div>
        )}

        {/* State 3: Error */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Scanning Operation Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 4: Scan completed done */}
        {status === 'done' && resultUrl && finalFile && originalFile && (
          <div className="space-y-6 animate-fadeIn">
            {/* Success message */}
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">Document scan filter compiled successfully!</span>
            </div>

            {/* Split layout: options on left, preview on right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Options Column */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-4 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                    Scanner configurations
                  </span>

                  {/* Preset Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 block">Filter Preset:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'monochrome', label: 'B&W (Form)' },
                        { id: 'grayscale', label: 'Grayscale' },
                        { id: 'color', label: 'Color Clean' },
                        { id: 'magic', label: 'Magic Color' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPreset(p.id as ScanPreset)}
                          className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all text-center leading-tight ${
                            preset === p.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Threshold slider (for B&W and Magic modes) */}
                  {(preset === 'monochrome' || preset === 'magic') && (
                    <div className="space-y-1 pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span>Threshold (Ink density):</span>
                        <span className="text-blue-600">{threshold}</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={220}
                        step={2}
                        value={threshold}
                        onChange={e => setThreshold(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Faint lines</span>
                        <span>Balanced</span>
                        <span>Bold/Dark</span>
                      </div>
                    </div>
                  )}

                  {/* Brightness & Contrast controls */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Brightness:</span>
                        <span>+{brightness}</span>
                      </div>
                      <input
                        type="range"
                        min={-40}
                        max={60}
                        step={2}
                        value={brightness}
                        onChange={e => setBrightness(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Contrast:</span>
                        <span>+{contrast}</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={80}
                        step={2}
                        value={contrast}
                        onChange={e => setContrast(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Target Compression size */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                      <span>Max Output File Size:</span>
                      <span className="text-blue-600 font-extrabold">{targetKb} KB</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={500}
                      step={10}
                      value={targetKb}
                      onChange={e => setTargetKb(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>20 KB</span>
                      <span>150 KB (Govt Limit)</span>
                      <span>500 KB</span>
                    </div>
                  </div>
                </div>

                {/* Size stats info */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between text-blue-900 font-bold">
                    <span>Original Size:</span>
                    <span>{(originalFile.size / 1024).toFixed(0)} KB</span>
                  </div>
                  <div className="flex justify-between text-blue-950 font-extrabold">
                    <span>Compressed Scan Size:</span>
                    <span>{(finalFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>

              {/* Preview Column */}
              <div className="md:col-span-7 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 self-start mb-2 uppercase tracking-wider">Scanned Preview:</span>
                <div className="w-full h-full min-h-[220px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Scanned output"
                    className="max-w-full max-h-64 object-contain rounded shadow-sm bg-white"
                  />
                </div>
              </div>

            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultUrl}
                download="scanned-document.jpg"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download Scanned Image (JPG)
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Scan Another
              </button>
            </div>
          </div>
        )}

        {/* Security badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client-Side logic:</strong> Document scanning processes inside your browser.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>100% Secure:</strong> Sensitive files and records are never saved to cloud servers.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
