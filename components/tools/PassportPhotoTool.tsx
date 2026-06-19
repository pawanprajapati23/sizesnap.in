'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Crop, Maximize2, MoveVertical, MoveHorizontal, ZoomIn, ShieldCheck, Cpu } from 'lucide-react'

interface Props {
  config: {
    width?: number // target width like 413
    height?: number // target height like 531
    maxKB?: number
  }
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'

export default function PassportPhotoTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)
  
  // Crop / Layout Adjustments
  const [zoom, setZoom] = useState<number>(1.2)
  const [shiftY, setShiftY] = useState<number>(0)
  const [shiftX, setShiftX] = useState<number>(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const targetWidth = config.width || 413
  const targetHeight = config.height || 531

  // Handle file select and transition to edit state
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file format. Please select a JPG, PNG or WEBP image.')
      setStatus('error')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('File too large. Please select an image under 20MB.')
      setStatus('error')
      return
    }

    // Clean old URLs
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
    img.onerror = () => {
      setErrorMsg('Could not read image file. It may be corrupted.')
      setStatus('error')
    }
    img.src = url
  }

  // Draw preview onto standard canvas dimensions (in editor state)
  const updatePreview = useCallback(() => {
    const canvas = previewCanvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background white
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const imageRatio = img.width / img.height
    const targetRatio = targetWidth / targetHeight

    let baseWidth = img.width
    let baseHeight = img.height

    if (imageRatio > targetRatio) {
      baseWidth = img.height * targetRatio
    } else {
      baseHeight = img.width / targetRatio
    }

    // Zoom adjust crop source frame
    const sWidth = baseWidth / zoom
    const sHeight = baseHeight / zoom

    // Central frame coordinates
    const defaultSx = (img.width - baseWidth) / 2
    const defaultSy = (img.height - baseHeight) / 2

    // Apply offset shift percentages
    // Limit coordinates to keep image bounds inside cropping frame
    const maxShiftX = (img.width - sWidth) / 2
    const maxShiftY = (img.height - sHeight) / 2
    const pixelShiftX = (shiftX / 100) * baseWidth
    const pixelShiftY = (shiftY / 100) * baseHeight

    const sx = Math.max(0, Math.min(img.width - sWidth, defaultSx + (baseWidth - sWidth) / 2 + pixelShiftX))
    const sy = Math.max(0, Math.min(img.height - sHeight, defaultSy + (baseHeight - sHeight) / 2 + pixelShiftY))

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height)
  }, [zoom, shiftX, shiftY, targetWidth, targetHeight])

  // Run updatePreview on adjustment adjustments
  useEffect(() => {
    if (status === 'editing') {
      updatePreview()
    }
  }, [status, updatePreview])

  // Finalize passport crop and run compression loops
  const generatePassport = async () => {
    const img = imgRef.current
    if (!img) return

    setStatus('processing')

    try {
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')!

      // White background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const imageRatio = img.width / img.height
      const targetRatio = targetWidth / targetHeight

      let baseWidth = img.width
      let baseHeight = img.height

      if (imageRatio > targetRatio) {
        baseWidth = img.height * targetRatio
      } else {
        baseHeight = img.width / targetRatio
      }

      const sWidth = baseWidth / zoom
      const sHeight = baseHeight / zoom

      const defaultSx = (img.width - baseWidth) / 2
      const defaultSy = (img.height - baseHeight) / 2

      const pixelShiftX = (shiftX / 100) * baseWidth
      const pixelShiftY = (shiftY / 100) * baseHeight

      const sx = Math.max(0, Math.min(img.width - sWidth, defaultSx + (baseWidth - sWidth) / 2 + pixelShiftX))
      const sy = Math.max(0, Math.min(img.height - sHeight, defaultSy + (baseHeight - sHeight) / 2 + pixelShiftY))

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight)

      let quality = 0.95
      let blob: Blob | null = null

      const getBlob = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q))

      if (config.maxKB) {
        let low = 0.1
        let high = 0.95
        const safetyMargin = 0.98

        for (let i = 0; i < 10; i++) {
          quality = (low + high) / 2
          blob = await getBlob(quality)
          if (!blob) throw new Error('Render output generation failed')
          
          if (blob.size / 1024 > config.maxKB * safetyMargin) {
            high = quality
          } else {
            low = quality
          }
        }
      } else {
        blob = await getBlob(quality)
      }

      if (!blob) throw new Error('Failed to output JPEG stream.')

      if (resultUrl) URL.revokeObjectURL(resultUrl)

      setFinalFile(blob)
      setResultUrl(URL.createObjectURL(blob))
      setStatus('done')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed formatting photo sizes.')
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }, [])

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    imgRef.current = null
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setOriginalUrl(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setFinalFile(null)
    setZoom(1.2)
    setShiftY(0)
    setShiftX(0)
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
          <h3 className="font-bold text-lg leading-tight font-sans">Passport & Visa Photo Maker</h3>
          <p className="text-blue-100 text-xs mt-1">Resize, crop, and adjust your face alignment instantly.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
          Dimensions: <span className="font-extrabold text-amber-300">{targetWidth}x{targetHeight} px</span>
          {config.maxKB && <span className="text-white"> (Max {config.maxKB}KB)</span>}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Upload Dropzone */}
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
              Select Profile Photo
            </h4>
            <p className="text-xs text-gray-500">Ensure good lighting and white background for best output.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Select Image
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

        {/* State 2: Adjust / Crop Workspace */}
        {status === 'editing' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              
              {/* Guidelines Canvas Box */}
              <div className="relative border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center p-4">
                <div 
                  style={{ width: `${targetWidth > 250 ? targetWidth / 1.5 : targetWidth}px`, height: `${targetHeight > 320 ? targetHeight / 1.5 : targetHeight}px` }} 
                  className="relative overflow-hidden border border-slate-300 bg-white"
                >
                  <canvas
                    ref={previewCanvasRef}
                    width={targetWidth}
                    height={targetHeight}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Visually non-destructive head guideline overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Face alignment oval */}
                    <div className="w-[60%] h-[70%] border-2 border-dashed border-blue-500/80 rounded-full flex items-center justify-center bg-blue-500/5">
                      <div className="w-[90%] h-[30%] border-b border-dashed border-blue-500/60 mt-[-20%]" /> {/* Eye line */}
                    </div>
                    <span className="absolute bottom-2 bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded font-medium tracking-wider uppercase">Align Face inside Oval</span>
                  </div>
                </div>
              </div>

              {/* Adjustments Sliders */}
              <div className="flex-1 w-full space-y-4 max-w-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Alignment adjustments:</span>
                
                {/* Zoom */}
                <div className="space-y-1.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <ZoomIn className="w-4 h-4 text-blue-600" />
                      Zoom / Scale:
                    </span>
                    <span>{zoom.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.6}
                    max={3.0}
                    step={0.05}
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Move Vertical */}
                <div className="space-y-1.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <MoveVertical className="w-4 h-4 text-blue-600" />
                      Vertical Position:
                    </span>
                    <span>{shiftY}%</span>
                  </div>
                  <input
                    type="range"
                    min={-40}
                    max={40}
                    step={1}
                    value={shiftY}
                    onChange={e => setShiftY(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Move Horizontal */}
                <div className="space-y-1.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <MoveHorizontal className="w-4 h-4 text-blue-600" />
                      Horizontal Position:
                    </span>
                    <span>{shiftX}%</span>
                  </div>
                  <input
                    type="range"
                    min={-40}
                    max={40}
                    step={1}
                    value={shiftX}
                    onChange={e => setShiftX(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={generatePassport}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <Crop className="w-5 h-5" />
                Generate Passport Photo
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

        {/* State 3: Generating Screen */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Applying Specs & Compressing...</h4>
            <p className="text-xs text-gray-500 mt-1">Binary quality checks are compiling sizes.</p>
          </div>
        )}

        {/* State 4: Error screen */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl animate-fadeIn">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Failed to Compile Specs</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 5: Done and ready to Download */}
        {status === 'done' && resultUrl && finalFile && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">Standard passport size generated successfully!</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center p-6 bg-gray-50/80 border border-gray-100 rounded-2xl">
              {originalUrl && (
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Before</p>
                  <div className="w-28 h-36 opacity-50 rounded-lg overflow-hidden border border-gray-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={originalUrl} alt="Before resize" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              
              <div className="h-6 w-6 border-r-2 border-b-2 border-slate-300 transform rotate-45 sm:-rotate-45 my-2 sm:my-0" />
              
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold tracking-wider text-green-600 mb-2">Passport Result</p>
                <div className="w-28 h-36 rounded-lg overflow-hidden border-2 border-green-500 shadow-md bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Passport photo output" className="w-full h-full object-cover animate-fadeIn" />
                </div>
                <span className="inline-block mt-2 text-xs font-bold text-gray-700 bg-slate-200/50 px-2 py-0.5 rounded">
                  {(finalFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultUrl}
                download="passport-photo.jpg"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download Passport Photo
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Create Another
              </button>
            </div>
          </div>
        )}

        {/* Security badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client-Side logic:</strong> Cropping runs entirely in the browser canvas.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Secure execution:</strong> Your face features data are not uploaded to servers.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
