'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Crop, MoveVertical, MoveHorizontal, ZoomIn, ShieldCheck, Cpu, Sliders, Type, Check } from 'lucide-react'

interface Props {
  config: {
    width?: number
    height?: number
    maxKB?: number
  }
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'

export default function SignatureResizeTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)

  // Configuration Presets (Fallback if not provided)
  const [customWidth, setCustomWidth] = useState<number>(config.width || 140)
  const [customHeight, setCustomHeight] = useState<number>(config.height || 60)
  const [selectedPreset, setSelectedPreset] = useState<string>(
    config.width === 350 ? 'upsc' : config.width === 140 ? 'ssc' : 'custom'
  )

  // Crop / Alignment
  const [zoom, setZoom] = useState<number>(1.0)
  const [shiftX, setShiftX] = useState<number>(0)
  const [shiftY, setShiftY] = useState<number>(0)

  // Image Enhancement Filters
  const [brightness, setBrightness] = useState<number>(10)
  const [contrast, setContrast] = useState<number>(30)
  const [monochrome, setMonochrome] = useState<boolean>(true)
  const [threshold, setThreshold] = useState<number>(180) // 0-255
  const [inkColor, setInkColor] = useState<'original' | 'black' | 'blue'>('black')

  // Target KB size
  const [targetKB, setTargetKB] = useState<number>(config.maxKB || 20)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Active target dimensions based on selected preset
  const getActiveDimensions = () => {
    if (selectedPreset === 'ssc') {
      return { w: 140, h: 60 }
    } else if (selectedPreset === 'upsc') {
      return { w: 350, h: 350 }
    } else {
      return { w: customWidth, h: customHeight }
    }
  }

  const { w: activeWidth, h: activeHeight } = getActiveDimensions()

  // File loading
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file format. Please select a JPG, PNG or WEBP image.')
      setStatus('error')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File too large. Please select an image under 15MB.')
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
    img.onerror = () => {
      setErrorMsg('Could not read image file. It may be corrupted.')
      setStatus('error')
    }
    img.src = url
  }

  // Apply Pixel Level filters to Canvas Context
  const applyFilters = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imgData = ctx.getImageData(0, 0, width, height)
      const data = imgData.data

      // Contrast lookup factor
      // contrast range: -100 to 100
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // Apply Brightness
        r += brightness
        g += brightness
        b += brightness

        // Apply Contrast
        r = factor * (r - 128) + 128
        g = factor * (g - 128) + 128
        b = factor * (b - 128) + 128

        // Calculate Grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b

        if (monochrome) {
          // Binary threshold
          if (gray > threshold) {
            data[i] = 255
            data[i + 1] = 255
            data[i + 2] = 255
          } else {
            if (inkColor === 'black') {
              data[i] = 0
              data[i + 1] = 0
              data[i + 2] = 0
            } else if (inkColor === 'blue') {
              data[i] = 10
              data[i + 1] = 50
              data[i + 2] = 160 // Dark blue ink tone
            } else {
              data[i] = Math.max(0, Math.min(255, r))
              data[i + 1] = Math.max(0, Math.min(255, g))
              data[i + 2] = Math.max(0, Math.min(255, b))
            }
          }
        } else {
          // Color mode but with contrast/brightness adjustments
          data[i] = Math.max(0, Math.min(255, r))
          data[i + 1] = Math.max(0, Math.min(255, g))
          data[i + 2] = Math.max(0, Math.min(255, b))
        }
      }

      ctx.putImageData(imgData, 0, 0)
    } catch (e) {
      console.error("Filter application failed", e)
    }
  }

  // Update editor preview
  const updatePreview = useCallback(() => {
    const canvas = previewCanvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and fill White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const imageRatio = img.width / img.height
    const targetRatio = activeWidth / activeHeight

    let baseWidth = img.width
    let baseHeight = img.height

    if (imageRatio > targetRatio) {
      // Image is wider than target frame
      baseWidth = img.height * targetRatio
    } else {
      // Image is taller than target frame
      baseHeight = img.width / targetRatio
    }

    // Zoom adjust
    const sWidth = baseWidth / zoom
    const sHeight = baseHeight / zoom

    // Default center
    const defaultSx = (img.width - baseWidth) / 2
    const defaultSy = (img.height - baseHeight) / 2

    // Apply shifts in px
    const pixelShiftX = (shiftX / 100) * baseWidth
    const pixelShiftY = (shiftY / 100) * baseHeight

    const sx = Math.max(0, Math.min(img.width - sWidth, defaultSx + (baseWidth - sWidth) / 2 + pixelShiftX))
    const sy = Math.max(0, Math.min(img.height - sHeight, defaultSy + (baseHeight - sHeight) / 2 + pixelShiftY))

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height)

    // Run custom filter processing
    applyFilters(ctx, canvas.width, canvas.height)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, shiftX, shiftY, activeWidth, activeHeight, brightness, contrast, monochrome, threshold, inkColor])

  useEffect(() => {
    if (status === 'editing') {
      updatePreview()
    }
  }, [status, updatePreview])

  // Final file generation with binary-search compression
  const generateSignature = async () => {
    const img = imgRef.current
    if (!img) return

    setStatus('processing')

    try {
      const canvas = document.createElement('canvas')
      canvas.width = activeWidth
      canvas.height = activeHeight

      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const imageRatio = img.width / img.height
      const targetRatio = activeWidth / activeHeight

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

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, activeWidth, activeHeight)

      // Apply signature clarity/contrast filter
      applyFilters(ctx, activeWidth, activeHeight)

      let quality = 0.95
      let blob: Blob | null = null

      const getBlob = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q))

      // Binary search compression loop
      let low = 0.05
      let high = 0.95
      const safetyMargin = 0.98
      const maxTargetSize = targetKB * safetyMargin

      for (let i = 0; i < 11; i++) {
        quality = (low + high) / 2
        blob = await getBlob(quality)
        if (!blob) throw new Error('Render output generation failed')

        const currentKB = blob.size / 1024
        if (currentKB > maxTargetSize) {
          high = quality
        } else {
          low = quality
        }
      }

      // Check one last fallback
      if (blob && (blob.size / 1024) > targetKB) {
        blob = await getBlob(0.05)
      }

      if (!blob) throw new Error('Failed to output signature stream.')

      if (resultUrl) URL.revokeObjectURL(resultUrl)

      setFinalFile(blob)
      setResultUrl(URL.createObjectURL(blob))
      setStatus('done')
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong compiling the signature.')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setZoom(1.0)
    setShiftX(0)
    setShiftY(0)
    setBrightness(10)
    setContrast(30)
    setMonochrome(true)
    setThreshold(180)
    setInkColor('black')
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
          <h3 className="font-bold text-lg leading-tight font-sans">Signature Cropper & Optimizer</h3>
          <p className="text-blue-100 text-xs mt-1">Enhance scanned ink, remove dark shadows & compress to exact size.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
          Active Format: <span className="font-extrabold text-amber-300">{activeWidth}x{activeHeight} px</span>
          {targetKB && <span className="text-white"> (Target {targetKB}KB)</span>}
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
              Upload Scanned Signature
            </h4>
            <p className="text-xs text-gray-500">Sign on plain white paper. Select a clear phone photo or scan.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Select Signature File
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Crop Guidelines & Live Filtered Preview */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 self-start mb-2 uppercase tracking-wider">Live Preview Frame:</span>
                <div className="relative border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center p-8 w-full min-h-[220px]">
                  
                  {/* Dynamic Scaled Render Box */}
                  <div 
                    style={{ 
                      width: '100%', 
                      maxWidth: '350px',
                      aspectRatio: `${activeWidth} / ${activeHeight}` 
                    }} 
                    className="relative border-2 border-dashed border-blue-400 bg-white overflow-hidden shadow-inner flex items-center justify-center"
                  >
                    <canvas
                      ref={previewCanvasRef}
                      width={activeWidth}
                      height={activeHeight}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Visual guidelines */}
                    <div className="absolute inset-0 pointer-events-none border border-red-500/20" />
                  </div>

                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded font-medium">
                    {activeWidth} x {activeHeight} px
                  </span>
                </div>

                {/* Quick Info */}
                <div className="mt-3 text-center text-xs text-gray-500">
                  Adjust controls on the right to align and sharpen the ink.
                </div>
              </div>

              {/* Right Column: Sliders, Preset selectors, Color tools */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Section 1: Presets & Size Specs */}
                <div className="space-y-2 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    1. Format & Limits:
                  </span>
                  
                  {/* Size Preset Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setSelectedPreset('ssc')
                        setZoom(1.0)
                        setShiftX(0)
                        setShiftY(0)
                      }}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                        selectedPreset === 'ssc'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      SSC (140x60)
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPreset('upsc')
                        setZoom(1.0)
                        setShiftX(0)
                        setShiftY(0)
                      }}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                        selectedPreset === 'upsc'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      UPSC (350x350)
                    </button>
                    <button
                      onClick={() => setSelectedPreset('custom')}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                        selectedPreset === 'custom'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {/* Custom Dimensions fields if selected */}
                  {selectedPreset === 'custom' && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">Width (px)</label>
                        <input
                          type="number"
                          value={customWidth}
                          min={50}
                          max={2000}
                          onChange={e => setCustomWidth(Math.max(50, Number(e.target.value)))}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">Height (px)</label>
                        <input
                          type="number"
                          value={customHeight}
                          min={20}
                          max={2000}
                          onChange={e => setCustomHeight(Math.max(20, Number(e.target.value)))}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Target KB slider */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Max Allowed File Size:</span>
                      <span className="text-blue-600 font-extrabold">{targetKB} KB</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={200}
                      step={5}
                      value={targetKB}
                      onChange={e => setTargetKB(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>5 KB</span>
                      <span>50 KB (SSC/Govt)</span>
                      <span>200 KB</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Crop Position Controls */}
                <div className="space-y-3 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-indigo-600" />
                    2. Scale & Position Alignment:
                  </span>

                  {/* Zoom */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                      <span>Zoom:</span>
                      <span className="font-bold text-gray-800">{zoom.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.4}
                      max={4.0}
                      step={0.05}
                      value={zoom}
                      onChange={e => setZoom(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Shifts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                        <span className="flex items-center gap-1"><MoveHorizontal className="w-3 h-3 text-gray-400" /> Horiz:</span>
                        <span className="font-bold text-gray-800">{shiftX}%</span>
                      </div>
                      <input
                        type="range"
                        min={-60}
                        max={60}
                        step={1}
                        value={shiftX}
                        onChange={e => setShiftX(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                        <span className="flex items-center gap-1"><MoveVertical className="w-3 h-3 text-gray-400" /> Vert:</span>
                        <span className="font-bold text-gray-800">{shiftY}%</span>
                      </div>
                      <input
                        type="range"
                        min={-60}
                        max={60}
                        step={1}
                        value={shiftY}
                        onChange={e => setShiftY(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Clean Ink Enhancements */}
                <div className="space-y-3 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-emerald-600" />
                      3. Ink Clarity & Shadow Remover:
                    </span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                      <input
                        type="checkbox"
                        checked={monochrome}
                        onChange={e => setMonochrome(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 w-4 h-4 cursor-pointer"
                      />
                      B&W Scanner Mode
                    </label>
                  </div>

                  {monochrome ? (
                    <>
                      {/* Ink Threshold */}
                      <div className="space-y-1 bg-white border border-gray-200 rounded-lg p-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                          <span>Ink Stroke Density (Threshold):</span>
                          <span className="text-emerald-600 font-extrabold">{threshold}</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={230}
                          step={2}
                          value={threshold}
                          onChange={e => setThreshold(Number(e.target.value))}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                          <span>Faint Lines</span>
                          <span>Dark / Bold</span>
                        </div>
                      </div>

                      {/* Ink Color Selector */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-gray-600">Select Ink Color tint:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {['original', 'black', 'blue'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setInkColor(color as any)}
                              className={`px-2 py-1.5 rounded-lg text-xs font-bold border capitalize flex items-center justify-center gap-1 transition-all ${
                                inkColor === color
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {inkColor === color && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                              {color === 'original' ? 'Grayscale' : color}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Brightness */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-gray-600">
                          <span>Brightness:</span>
                          <span>{brightness > 0 ? `+${brightness}` : brightness}</span>
                        </div>
                        <input
                          type="range"
                          min={-50}
                          max={80}
                          step={2}
                          value={brightness}
                          onChange={e => setBrightness(Number(e.target.value))}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      {/* Contrast */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-gray-600">
                          <span>Contrast:</span>
                          <span>{contrast > 0 ? `+${contrast}` : contrast}</span>
                        </div>
                        <input
                          type="range"
                          min={-20}
                          max={80}
                          step={2}
                          value={contrast}
                          onChange={e => setContrast(Number(e.target.value))}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={generateSignature}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <Crop className="w-5 h-5" />
                Format and Compress Signature
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
            <h4 className="font-bold text-gray-800 text-base">Enhancing ink & adjusting binary sizes...</h4>
            <p className="text-xs text-gray-500 mt-1">Compressing file to strict targets.</p>
          </div>
        )}

        {/* State 4: Error screen */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Failed to Compile Signature</h4>
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
              <span className="text-xs sm:text-sm font-semibold">Signature cropped & enhanced successfully!</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center p-6 bg-gray-50/80 border border-gray-100 rounded-2xl">
              {originalUrl && (
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Scanned Input</p>
                  <div className="w-40 h-20 opacity-50 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={originalUrl} alt="Original Signature" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>
              )}
              
              <div className="h-6 w-6 border-r-2 border-b-2 border-slate-300 transform rotate-45 sm:-rotate-45 my-2 sm:my-0" />
              
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold tracking-wider text-green-600 mb-2">Enhanced Output</p>
                <div className="w-40 h-20 rounded-lg overflow-hidden border-2 border-green-500 shadow-md bg-white flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Enhanced Signature Output" className="max-w-full max-h-full object-contain animate-fadeIn" />
                </div>
                <span className="inline-block mt-2 text-xs font-bold text-gray-700 bg-slate-200/50 px-2 py-0.5 rounded">
                  {(finalFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultUrl}
                download="signature.jpg"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download Signature Image
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
            <span><strong>Client-Side logic:</strong> signature operations run 100% locally in your browser.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Data Safe:</strong> Your document signatures never get uploaded to any servers.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

