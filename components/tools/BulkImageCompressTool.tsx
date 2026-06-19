'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Play, FileImage, ShieldCheck, Cpu, ArrowRight, Trash2, Layers } from 'lucide-react'

interface Props {
  config?: any
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'

interface BulkFileItem {
  id: string
  file: File
  previewUrl: string
  originalSize: number
  compressedSize?: number
  compressedUrl?: string
  savingsPercent?: number
}

export default function BulkImageCompressTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [filesList, setFilesList] = useState<BulkFileItem[]>([])
  
  // Custom controls
  const [targetKb, setTargetKb] = useState<number>(50)
  const [targetFormat, setTargetFormat] = useState<'original' | 'jpg' | 'webp'>('original')
  
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle uploaded files
  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const items: BulkFileItem[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue

      items.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        originalSize: file.size
      })
    }

    if (items.length === 0 && filesList.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WEBP).')
      setStatus('error')
      return
    }

    // Limit to max 25 files to preserve memory
    setFilesList(prev => [...prev, ...items].slice(0, 25))
    setStatus('editing')
    setErrorMsg('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesList])

  const removeItem = (id: string) => {
    const target = filesList.find(x => x.id === id)
    if (target) {
      URL.revokeObjectURL(target.previewUrl)
      if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl)
    }
    const list = filesList.filter(x => x.id !== id)
    setFilesList(list)
    if (list.length === 0) {
      setStatus('idle')
    }
  }

  // Compress batch loop
  const startBatchCompression = async () => {
    if (filesList.length === 0) return
    setStatus('processing')
    setProgress(0)

    try {
      const list = [...filesList]

      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        const img = new Image()
        img.src = item.previewUrl
        await new Promise(res => { img.onload = res })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = img.width
        canvas.height = img.height

        // White background for JPEG if transparency exists
        let outputType = item.file.type
        if (targetFormat === 'jpg') outputType = 'image/jpeg'
        if (targetFormat === 'webp') outputType = 'image/webp'

        if (outputType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        ctx.drawImage(img, 0, 0)

        const getBlob = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(res, outputType, q))

        // Binary search quality loop to match target KB limits
        let quality = 0.85
        let blob: Blob | null = null
        let low = 0.05
        let high = 0.95
        const maxBytes = targetKb * 1024 * 0.98 // 98% safety margin

        for (let i = 0; i < 9; i++) {
          quality = (low + high) / 2
          blob = await getBlob(quality)
          if (!blob) break

          if (blob.size > maxBytes) {
            high = quality
          } else {
            low = quality
          }
        }

        // Final fallback if high compression required
        if (blob && blob.size > targetKb * 1024) {
          blob = await getBlob(0.05)
        }

        if (blob) {
          if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
          item.compressedSize = blob.size
          item.compressedUrl = URL.createObjectURL(blob)
          const diff = item.originalSize - blob.size
          item.savingsPercent = item.originalSize > 0 ? Math.round((diff / item.originalSize) * 100) : 0
        }

        setProgress(Math.round(((index + 1) / list.length) * 100))
      }

      setFilesList(list)
      setStatus('done')
    } catch (e: any) {
      console.error(e)
      setErrorMsg(e.message || 'Error processing batch compression.')
      setStatus('error')
    }
  }

  // Trigger browser sequential downloads
  const downloadAll = () => {
    filesList.forEach((item, index) => {
      if (item.compressedUrl) {
        setTimeout(() => {
          const link = document.createElement('a')
          link.href = item.compressedUrl!
          // Replace extension to match new format
          const ext = targetFormat === 'jpg' ? 'jpg' : targetFormat === 'webp' ? 'webp' : item.file.name.split('.').pop()
          const baseName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || 'compressed'
          link.download = `${baseName}-compressed.${ext}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }, index * 250) // slight offset to prevent chrome from blocking batch popup downloads
      }
    })
  }

  const handleReset = () => {
    filesList.forEach(item => {
      URL.revokeObjectURL(item.previewUrl)
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
    })
    setFilesList([])
    setStatus('idle')
    setErrorMsg('')
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      filesList.forEach(item => {
        URL.revokeObjectURL(item.previewUrl)
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Batch Image Compressor</h3>
          <p className="text-blue-100 text-xs mt-1">Compress up to 25 photos to a strict KB limit simultaneously.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Bulk Sandbox
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
              Select Multiple Photos
            </h4>
            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP. Drag up to 25 files at once.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose Images
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* State 2: Editing Workspace */}
        {status === 'editing' && filesList.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Staging list */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Staged Images ({filesList.length})
                </span>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {filesList.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-150 rounded-xl">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.previewUrl} alt="thumbnail" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate leading-tight">{item.file.name}</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                          Original: {(item.originalSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Remove image"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Settings Panel */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-4 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                    Batch parameters
                  </span>

                  {/* Target KB Size selector */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                      <span>Target File Size Limit:</span>
                      <span className="text-blue-600 font-extrabold">{targetKb} KB</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={10}
                      value={targetKb}
                      onChange={e => setTargetKb(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] text-gray-400">
                      <span>10 KB</span>
                      <span>100 KB</span>
                      <span>500 KB</span>
                    </div>
                  </div>

                  {/* Target Format override */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-250">
                    <label className="text-xs font-bold text-gray-600 block">Convert Output format:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTargetFormat('original')}
                        className={`py-1.5 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          targetFormat === 'original' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Keep format
                      </button>
                      <button
                        onClick={() => setTargetFormat('jpg')}
                        className={`py-1.5 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          targetFormat === 'jpg' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        JPEG
                      </button>
                      <button
                        onClick={() => setTargetFormat('webp')}
                        className={`py-1.5 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          targetFormat === 'webp' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        WebP
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={startBatchCompression}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Batch Compress {filesList.length} Photos
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* State 3: Batch Processing */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Processing batch images: {progress}%</h4>
            <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* State 4: Error stage */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Batch Compression Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 5: Done results display */}
        {status === 'done' && filesList.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Success Alert */}
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">Bulk images compressed successfully!</span>
            </div>

            {/* Results Grid List */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 bg-gray-55 border border-gray-200 rounded-xl p-4">
              {filesList.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-150 shadow-sm">
                  <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.compressedUrl || item.previewUrl} alt="output thumbnail" className="max-w-full max-h-full object-contain" />
                  </div>

                  {/* Size compare details */}
                  <div className="flex-1 min-w-0 px-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-xs font-bold text-gray-700 truncate max-w-[200px] leading-tight block">
                      {item.file.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
                      <span>{(item.originalSize / 1024).toFixed(0)} KB</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="text-blue-600 font-extrabold">{(item.compressedSize ? item.compressedSize / 1024 : 0).toFixed(0)} KB</span>
                    </div>
                  </div>

                  {/* Savings bubble + download icon */}
                  <div className="flex items-center gap-2">
                    {item.savingsPercent ? (
                      <span className="hidden sm:inline-block bg-green-50 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-green-100">
                        -{item.savingsPercent}%
                      </span>
                    ) : null}
                    <a
                      href={item.compressedUrl}
                      download={`compressed-${item.file.name}`}
                      className="p-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={downloadAll}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download All Images
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
            <span><strong>Secure memory execution:</strong> Photos are compressed entirely in client memory.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>No tracking:</strong> Document uploads never touch external cloud layers.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
