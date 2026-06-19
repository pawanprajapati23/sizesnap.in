'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage, ShieldCheck, Cpu, ArrowRight } from 'lucide-react'

// Dynamic import heic2any to avoid SSR compilation failures
let heic2any: any
if (typeof window !== 'undefined') {
  // @ts-ignore
  import('heic2any').then(mod => heic2any = mod.default)
}

interface Props {
  config?: any
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function HeicToJpgTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalBlob, setFinalBlob] = useState<Blob | null>(null)

  // Custom configurations
  const [targetFormat, setTargetFormat] = useState<'jpg' | 'png' | 'webp'>('jpg')
  const [quality, setQuality] = useState<number>(85)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Core conversion method
  const processImage = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.heic') && !file.name.toLowerCase().endsWith('.heif') && file.type !== 'image/heic') {
      setErrorMsg('Invalid file format. Please select an Apple HEIC or HEIF image.')
      setStatus('error')
      return
    }

    setOriginalFile(file)
    setStatus('processing')
    setErrorMsg('')

    try {
      if (!heic2any) {
        // @ts-ignore
        heic2any = (await import('heic2any')).default
      }

      let mimeType = 'image/jpeg'
      if (targetFormat === 'png') mimeType = 'image/png'
      if (targetFormat === 'webp') mimeType = 'image/webp'

      // heic2any handles the heavy conversion on main thread or worker
      const convertedBlob = await heic2any({
        blob: file,
        toType: mimeType,
        quality: quality / 100
      })

      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
      if (!blob) throw new Error('Conversion result returned empty')

      if (resultUrl) URL.revokeObjectURL(resultUrl)

      setFinalBlob(blob)
      setResultUrl(URL.createObjectURL(blob))
      setStatus('done')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Could not convert HEIC. Please ensure it is a valid Apple HEIC photo.')
      setStatus('error')
    }
  }

  // Reactive trigger on format/quality tweak (if file loaded)
  useEffect(() => {
    if (originalFile) {
      processImage(originalFile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetFormat, quality])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImage(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processImage(file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetFormat, quality])

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setFinalBlob(null)
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Apple HEIC to JPG Converter</h3>
          <p className="text-blue-100 text-xs mt-1">Convert iPhone photo formats (.HEIC) instantly inside your browser.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Client-Side
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
              Select HEIC Image
            </h4>
            <p className="text-xs text-gray-500">Select files ending in .heic, .heif or .HEIC from your iPhone/device.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose HEIC File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".heic,.heif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* State 2: Converting Processing */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Unpacking HEIC layers & decoding pixels...</h4>
            <p className="text-xs text-gray-500 mt-1">This takes 1-3 seconds depending on image resolution.</p>
          </div>
        )}

        {/* State 3: Error state */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Conversion Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 4: Done and Ready */}
        {status === 'done' && resultUrl && finalBlob && originalFile && (
          <div className="space-y-6 animate-fadeIn">
            {/* Success alert */}
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">HEIC image converted to {targetFormat.toUpperCase()} successfully!</span>
            </div>

            {/* Split layout: options on left, preview on right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Options Column */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-4 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                    Format & Details
                  </span>

                  {/* Format selectors */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 block">Target Output Format:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['jpg', 'png', 'webp'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setTargetFormat(fmt)}
                          className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all text-center uppercase ${
                            targetFormat === fmt
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Selector (for JPG/WEBP) */}
                  {targetFormat !== 'png' && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span>Output Quality:</span>
                        <span className="text-blue-600">{quality}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={quality}
                        onChange={e => setQuality(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Min Size</span>
                        <span>Balanced</span>
                        <span>High Quality</span>
                      </div>
                    </div>
                  )}

                  {/* Stats summary */}
                  <div className="text-xs text-gray-500 pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between">
                      <span>Source File:</span>
                      <span className="font-semibold text-gray-700 truncate max-w-[150px]">{originalFile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Original HEIC Size:</span>
                      <span className="font-semibold text-gray-700">{(originalFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Converted Size:</span>
                      <span className="font-semibold text-blue-600 font-extrabold">{(finalBlob.size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </div>

                {/* Reduction metrics (if smaller) */}
                {originalFile.size > finalBlob.size && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-xs text-blue-800 font-bold">Disk Size saved:</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-lg">
                      {Math.round(((originalFile.size - finalBlob.size) / originalFile.size) * 100)}% Smallest
                    </span>
                  </div>
                )}
              </div>

              {/* Preview Column */}
              <div className="md:col-span-7 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 self-start mb-2 uppercase tracking-wider">Converted Preview:</span>
                <div className="w-full h-full min-h-[220px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Converted output"
                    className="max-w-full max-h-64 object-contain rounded shadow-sm bg-white"
                  />
                </div>
              </div>

            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultUrl}
                download={`${originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || 'photo'}.${targetFormat}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center animate-pulse"
              >
                <Download className="w-5 h-5" />
                Download {targetFormat.toUpperCase()} Image
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Convert Another
              </button>
            </div>
          </div>
        )}

        {/* Security badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Secure Sandbox:</strong> Conversions are processed in-browser.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Instant Result:</strong> No files are stored or uploaded to servers.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
