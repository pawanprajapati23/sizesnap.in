'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, ShieldCheck, Cpu, ArrowRight, Image as ImageIcon } from 'lucide-react'

interface Props {
  config: {
    format?: string
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function ConvertImageTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [convertedSize, setConvertedSize] = useState<number>(0)
  const [imageResolution, setImageResolution] = useState<{ w: number; h: number } | null>(null)

  // Interactive Target format selector
  const [targetFormat, setTargetFormat] = useState<string>(config.format || 'jpg')
  // Quality adjustment slider (for JPG/WEBP)
  const [quality, setQuality] = useState<number>(90)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Load and read uploaded image
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP, GIF, BMP).')
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
      setOriginalSize(file.size)
      setImageResolution({ w: img.width, h: img.height })
      setStatus('processing')
      setErrorMsg('')
      // Trigger instant conversion
      runConversion(img, file.name, targetFormat, quality)
    }
    img.onerror = () => {
      setErrorMsg('Could not read image file. It may be corrupted.')
      setStatus('error')
    }
    img.src = url
  }

  // Core conversion method
  const runConversion = async (img: HTMLImageElement, filename: string, format: string, qVal: number) => {
    setStatus('processing')
    try {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!

      // White background for JPG if transparency exists
      if (format === 'jpg' || format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      let mimeType = 'image/jpeg'
      if (format === 'png') mimeType = 'image/png'
      if (format === 'webp') mimeType = 'image/webp'

      // Convert quality scale 0-100 to 0.0-1.0
      const finalQuality = qVal / 100

      canvas.toBlob(blob => {
        if (blob) {
          if (resultUrl) URL.revokeObjectURL(resultUrl)
          setResultUrl(URL.createObjectURL(blob))
          setConvertedSize(blob.size)
          setStatus('done')
        } else {
          throw new Error('Blob output generated null')
        }
      }, mimeType, finalQuality)

    } catch (e: any) {
      setErrorMsg(e.message || 'Image formatting failed.')
      setStatus('error')
    }
  }

  // Reactive trigger on format / quality shifts
  useEffect(() => {
    if (imgRef.current && originalFile) {
      runConversion(imgRef.current, originalFile.name, targetFormat, quality)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetFormat, quality])

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
  }, [targetFormat, quality])

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    imgRef.current = null
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setOriginalUrl(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setErrorMsg('')
    setImageResolution(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [originalUrl, resultUrl])

  // Savings helper
  const sizeDiff = originalSize - convertedSize
  const savingsPercent = originalSize > 0 ? Math.round((sizeDiff / originalSize) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Smart Image Converter</h3>
          <p className="text-blue-100 text-xs mt-1">Convert image layouts securely without server upload delays.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Target: <span className="font-extrabold text-amber-300">{targetFormat}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Upload box */}
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
              Select or Drop Image
            </h4>
            <p className="text-xs text-gray-500">Supports PNG, JPG, JPEG, WEBP, GIF, BMP, HEIC.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose File
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

        {/* State 2: Processing state */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Processing formatting conversion...</h4>
            <p className="text-xs text-gray-500 mt-1">Executing in-memory Canvas rendering.</p>
          </div>
        )}

        {/* State 3: Error state */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Format Conversion Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 4: Conversion Done */}
        {status === 'done' && resultUrl && (
          <div className="space-y-6 animate-fadeIn">
            {/* Success Alert */}
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">Image converted to {targetFormat.toUpperCase()} successfully!</span>
            </div>

            {/* Split layout: controls on left/top, preview on right/bottom */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Controls Column */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                    Conversion settings
                  </span>

                  {/* Format Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 block">Output File Format:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['jpg', 'png', 'webp'].map((fmt) => (
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

                  {/* Quality slider (if format supports compression) */}
                  {targetFormat !== 'png' && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span>Quality / Compression:</span>
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
                        <span>Small size</span>
                        <span>Balanced</span>
                        <span>Max Clarity</span>
                      </div>
                    </div>
                  )}

                  {/* Info stats */}
                  <div className="space-y-2 pt-3 border-t border-gray-200 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">File Name:</span>
                      <span className="font-semibold text-gray-700 truncate max-w-[150px]">
                        {originalFile?.name}
                      </span>
                    </div>
                    {imageResolution && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Resolution:</span>
                        <span className="font-semibold text-gray-700">
                          {imageResolution.w} x {imageResolution.h} px
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Size Comparison Card */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 block">
                    File payload details
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">Original</p>
                      <p className="font-extrabold text-sm text-gray-700">{(originalSize / 1024).toFixed(1)} KB</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-400 mx-2" />
                    <div className="text-center flex-1">
                      <p className="text-[10px] text-blue-500 uppercase font-semibold">Converted</p>
                      <p className="font-extrabold text-sm text-blue-900">{(convertedSize / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  {sizeDiff > 0 && (
                    <div className="text-center bg-blue-100/50 rounded-lg py-1.5 text-xs text-blue-700 font-bold">
                      Saved {savingsPercent}% on disk size!
                    </div>
                  )}
                </div>
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

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultUrl}
                download={`converted-${originalFile?.name.substring(0, originalFile.name.lastIndexOf('.')) || 'image'}.${targetFormat}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
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
            <span><strong>Secure Sandbox:</strong> Files stay safe in your device memory.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Browser processing:</strong> No server logs or conversions logs are saved.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
