'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage, ShieldCheck, Cpu, Sliders, Eye, EyeOff, MoveHorizontal, MoveVertical, ZoomIn } from 'lucide-react'

interface Props {
  config?: any
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'
type BgStyle = 'blur' | 'solid' | 'gradient'

// Curated aesthetic gradients for background padding
const GRADIENTS = [
  { name: 'Sunset Glow', css: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)', colors: ['#f59e0b', '#ef4444', '#ec4899'] },
  { name: 'Ocean Mist', css: 'linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)', colors: ['#06b6d4', '#3b82f6', '#6366f1'] },
  { name: 'Aurora Sky', css: 'linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6)', colors: ['#10b981', '#06b6d4', '#8b5cf6'] },
  { name: 'Midnight Neon', css: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)', colors: ['#6366f1', '#a855f7', '#ec4899'] },
  { name: 'Warm Clay', css: 'linear-gradient(135deg, #f97316, #b45309, #78350f)', colors: ['#f97316', '#b45309', '#78350f'] }
]

export default function WhatsAppDpTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalBlob, setFinalBlob] = useState<Blob | null>(null)
  
  // Custom Controls
  const [paddingStyle, setPaddingStyle] = useState<BgStyle>('blur')
  const [blurAmount, setBlurAmount] = useState<number>(20)
  const [solidColor, setSolidColor] = useState<string>('#ffffff')
  const [selectedGradient, setSelectedGradient] = useState<number>(0)
  
  // Alignment & Scaling
  const [zoom, setZoom] = useState<number>(0.9) // 0.9 default leaves a small margin, looks great
  const [shiftX, setShiftX] = useState<number>(0)
  const [shiftY, setShiftY] = useState<number>(0)
  
  // Preview Guideline Toggle (Circular Mask)
  const [showCircularMask, setShowCircularMask] = useState<boolean>(true)

  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file format. Please select a JPG, PNG or WEBP image.')
      setStatus('error')
      return
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setOriginalImage(img)
      setOriginalFile(file)
      setOriginalUrl(url)
      setStatus('editing')
      setErrorMsg('')
    }
    img.onerror = () => {
      setErrorMsg('Could not read photo file.')
      setStatus('error')
    }
    img.src = url
  }

  // Draw and compile the square image
  const generateSquare = useCallback(() => {
    if (!originalImage) return
    setStatus('processing')

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      const size = Math.max(originalImage.width, originalImage.height)
      const outputSize = Math.max(1024, size) // 1024px minimum for high resolution
      
      canvas.width = outputSize
      canvas.height = outputSize

      // 1. Draw Background
      if (paddingStyle === 'blur') {
        // Draw blurred stretched copy of the image as background
        ctx.filter = `blur(${blurAmount}px)`
        ctx.drawImage(originalImage, -outputSize * 0.1, -outputSize * 0.1, outputSize * 1.2, outputSize * 1.2)
        ctx.filter = 'none'
        
        // Add subtle overlay tint so background is slightly dimmed
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        ctx.fillRect(0, 0, outputSize, outputSize)
      } else if (paddingStyle === 'solid') {
        ctx.fillStyle = solidColor
        ctx.fillRect(0, 0, outputSize, outputSize)
      } else if (paddingStyle === 'gradient') {
        const gradData = GRADIENTS[selectedGradient]
        const gradient = ctx.createLinearGradient(0, 0, outputSize, outputSize)
        gradient.addColorStop(0, gradData.colors[0])
        gradient.addColorStop(0.5, gradData.colors[1])
        gradient.addColorStop(1, gradData.colors[2])
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, outputSize, outputSize)
      }

      // 2. Draw centered image with Zoom & Shifts
      const imageRatio = originalImage.width / originalImage.height
      let drawW = outputSize
      let drawH = outputSize

      if (imageRatio > 1) {
        // Wider than tall
        drawH = outputSize / imageRatio
      } else {
        // Taller than wide or equal
        drawW = outputSize * imageRatio
      }

      // Apply zoom ratio
      drawW = drawW * zoom
      drawH = drawH * zoom

      // Centered positions adjusted by shifts percentages
      const dx = (outputSize - drawW) / 2 + (shiftX / 100) * outputSize
      const dy = (outputSize - drawH) / 2 + (shiftY / 100) * outputSize

      ctx.drawImage(originalImage, dx, dy, drawW, drawH)

      canvas.toBlob(blob => {
        if (blob) {
          if (resultUrl) URL.revokeObjectURL(resultUrl)
          setFinalBlob(blob)
          setResultUrl(URL.createObjectURL(blob))
          setStatus('done')
        } else {
          throw new Error('Output blob rendering failed')
        }
      }, 'image/jpeg', 0.95)

    } catch (e: any) {
      console.error(e)
      setErrorMsg(e.message || 'Error compiling square image.')
      setStatus('error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalImage, paddingStyle, blurAmount, solidColor, selectedGradient, zoom, shiftX, shiftY])

  // Trigger rebuild when controls modify
  useEffect(() => {
    if (originalImage) {
      generateSquare()
    }
  }, [originalImage, paddingStyle, blurAmount, solidColor, selectedGradient, zoom, shiftX, shiftY, generateSquare])

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
    setOriginalImage(null)
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setOriginalUrl(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setFinalBlob(null)
    setPaddingStyle('blur')
    setBlurAmount(20)
    setSolidColor('#ffffff')
    setSelectedGradient(0)
    setZoom(0.9)
    setShiftX(0)
    setShiftY(0)
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
          <h3 className="font-bold text-lg leading-tight font-sans">No Crop Profile DP Maker</h3>
          <p className="text-blue-100 text-xs mt-1">Convert rectangle photos to square profiles with blurred borders or design patterns.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Profile Builder
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
              Select Profile Photo
            </h4>
            <p className="text-xs text-gray-500">Supports horizontal & vertical pictures. Converts to neat circles/squares.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose Image File
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

        {/* State 2: Processing compiling */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Enhancing layers & compiling square borders...</h4>
            <p className="text-xs text-gray-500 mt-1">Executing standard canvas rendering filters.</p>
          </div>
        )}

        {/* State 3: Error */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Generation Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 4: Done workspace edit */}
        {(status === 'editing' || status === 'done') && resultUrl && originalFile && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Visual Circular/Square preview */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">DP Canvas Preview:</span>
                  
                  {/* Mask guideline toggle */}
                  <button
                    onClick={() => setShowCircularMask(!showCircularMask)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                  >
                    {showCircularMask ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Hide Circle guide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Show Circle guide
                      </>
                    )}
                  </button>
                </div>

                <div className="w-full min-h-[300px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center p-6 shadow-inner">
                  
                  {/* Square frame or circular preview mask wrapper */}
                  <div className={`relative max-w-[260px] aspect-square w-full shadow-lg border border-gray-250 bg-white overflow-hidden transition-all duration-300 ${
                    showCircularMask ? 'rounded-full border-4 border-white ring-1 ring-gray-200' : 'rounded-xl'
                  }`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultUrl}
                      alt="WhatsApp DP Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Faint circle layout outline if square preview selected */}
                    {!showCircularMask && (
                      <div className="absolute inset-0 border border-dashed border-red-500/25 rounded-full pointer-events-none" />
                    )}
                  </div>

                </div>

                <p className="text-[10px] text-center text-gray-400 mt-2.5 font-medium leading-relaxed max-w-sm">
                  {showCircularMask ? 'Circular DP layout preview (WhatsApp cut-off guide).' : 'Complete square format preview. Downloads as 1024x1024 square image.'}
                </p>
              </div>

              {/* Right Column: Customizer Controls */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Section 1: Background Layout Customizer */}
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-4 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                    Background padding style
                  </span>

                  {/* Padding color style selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'blur', label: 'Blur Copy' },
                      { id: 'solid', label: 'Solid Color' },
                      { id: 'gradient', label: 'Curated Gradient' }
                    ].map(style => (
                      <button
                        key={style.id}
                        onClick={() => setPaddingStyle(style.id as BgStyle)}
                        className={`py-2 text-xs font-bold border rounded-lg transition-all text-center leading-tight ${
                          paddingStyle === style.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>

                  {/* Contextual Options */}
                  {paddingStyle === 'blur' && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-200">
                      <div className="flex justify-between text-xs font-semibold text-gray-600">
                        <span>Border Blur Intensity:</span>
                        <span className="font-extrabold text-blue-600">{blurAmount}px</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={45}
                        step={1}
                        value={blurAmount}
                        onChange={e => setBlurAmount(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  )}

                  {paddingStyle === 'solid' && (
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <label className="text-xs font-bold text-gray-600 block">Choose solid background color:</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={solidColor}
                          onChange={e => setSolidColor(e.target.value)}
                          className="w-12 h-10 border border-gray-200 rounded cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={solidColor}
                          onChange={e => setSolidColor(e.target.value)}
                          className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs font-mono w-24 focus:outline-none"
                        />
                        <div className="flex gap-1.5 ml-auto">
                          {['#ffffff', '#000000', '#f3f4f6', '#3b82f6'].map(col => (
                            <button
                              key={col}
                              onClick={() => setSolidColor(col)}
                              style={{ backgroundColor: col }}
                              className={`w-6 h-6 rounded-full border border-gray-300 ring-offset-1 ${
                                solidColor === col ? 'ring-2 ring-blue-500' : ''
                              }`}
                              title={col}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {paddingStyle === 'gradient' && (
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <label className="text-xs font-bold text-gray-600 block">Select Gradient design pattern:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {GRADIENTS.map((grad, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedGradient(idx)}
                            className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all flex items-center justify-between gap-1.5 ${
                              selectedGradient === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <span className="truncate">{grad.name}</span>
                            <span
                              style={{ background: grad.css }}
                              className="w-4 h-4 rounded-full border border-white flex-shrink-0"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 2: Scale & Shifts Alignment */}
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-4 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    Layout scale & alignment
                  </span>

                  {/* Zoom */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                      <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5 text-gray-400" /> Image Scale Size:</span>
                      <span className="font-bold text-gray-800">{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.4}
                      max={1.1}
                      step={0.02}
                      value={zoom}
                      onChange={e => setZoom(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Shifts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                        <span className="flex items-center gap-1"><MoveHorizontal className="w-3.5 h-3.5 text-gray-400" /> Horizontal:</span>
                        <span className="font-bold text-gray-800">{shiftX}%</span>
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
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                        <span className="flex items-center gap-1"><MoveVertical className="w-3.5 h-3.5 text-gray-400" /> Vertical:</span>
                        <span className="font-bold text-gray-800">{shiftY}%</span>
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
                  </div>
                </div>

              </div>

            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultUrl}
                download={`square-whatsapp-dp.jpg`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download Square DP Photo
              </a>
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
            <span><strong>Client-Side logic:</strong> Square conversions run strictly in your browser.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Privacy Guarded:</strong> Original profile images never get uploaded.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
