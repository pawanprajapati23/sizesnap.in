'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, ShieldCheck, Cpu, Sliders, Pipette, Share2 } from 'lucide-react'

interface Props {
  config: {
    targetColor?: 'white' | 'blue'
    maxKB?: number
  }
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'

export default function BackgroundChangerTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Configurations
  const [tolerance, setTolerance] = useState<number>(45) // 0 to 200
  const [edgeSoftness, setEdgeSoftness] = useState<number>(15) // 0 to 50
  const [bgColor, setBgColor] = useState<string>(config.targetColor === 'blue' ? '#A0C4DF' : '#FFFFFF')
  const [targetColorRGB, setTargetColorRGB] = useState<{r: number, g: number, b: number} | null>(null)
  const [targetKb, setTargetKb] = useState<number>(config.maxKB || 100)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Clean URLs
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [originalUrl, resultUrl])

  // Handle uploaded photo
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid format. Please upload a portrait photo image.')
      setStatus('error')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Image size is too large (Max 20MB).')
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
      
      // Auto-detect target color from top-left area
      setTimeout(() => {
        detectInitialBackground(img)
      }, 50)
    }
    img.src = url
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  // Sample the color near the top-left [10, 10] to auto-detect background
  const detectInitialBackground = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    
    // Sample a small 5x5 region at the corner to get average color
    const sampleSize = 5
    const imgData = ctx.getImageData(10, 10, sampleSize, sampleSize)
    const data = imgData.data
    let rSum = 0, gSum = 0, bSum = 0
    const count = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      rSum += data[i]
      gSum += data[i + 1]
      bSum += data[i + 2]
    }

    setTargetColorRGB({
      r: Math.round(rSum / count),
      g: Math.round(gSum / count),
      b: Math.round(bSum / count)
    })
  }

  // Handle Canvas Click to manually select background color
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current
    if (!canvas || !targetColorRGB) return
    const rect = canvas.getBoundingClientRect()
    
    // Scale coordinate to original image size
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width)
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height)

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pixel = ctx.getImageData(x, y, 1, 1).data
    setTargetColorRGB({
      r: pixel[0],
      g: pixel[1],
      b: pixel[2]
    })
  }

  // Parse Hex color to RGB object
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 }
  }

  // Draw the preview onto the editor canvas
  const drawPreview = useCallback(() => {
    const img = imgRef.current
    const canvas = previewCanvasRef.current
    if (!img || !canvas || !targetColorRGB) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Scale canvas to image size
    canvas.width = img.width
    canvas.height = img.height

    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const destRGB = hexToRgb(bgColor)
    const { r: tr, g: tg, b: tb } = targetColorRGB

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Manhattan distance
      const diff = Math.abs(r - tr) + Math.abs(g - tg) + Math.abs(b - tb)

      if (diff < tolerance) {
        // Complete replacement
        data[i] = destRGB.r
        data[i + 1] = destRGB.g
        data[i + 2] = destRGB.b
      } else if (diff < tolerance + edgeSoftness) {
        // Soft blend
        const factor = (diff - tolerance) / edgeSoftness // 0 to 1
        data[i] = Math.round(destRGB.r * (1 - factor) + r * factor)
        data[i + 1] = Math.round(destRGB.g * (1 - factor) + g * factor)
        data[i + 2] = Math.round(destRGB.b * (1 - factor) + b * factor)
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }, [bgColor, targetColorRGB, tolerance, edgeSoftness])

  // Redraw preview whenever settings change
  useEffect(() => {
    drawPreview()
  }, [drawPreview])

  // Execute processing and compress below Target KB
  const processImage = async () => {
    const canvas = previewCanvasRef.current
    if (!canvas) return

    setStatus('processing')
    try {
      let quality = 0.95
      let blob: Blob | null = null

      for (let j = 0; j < 10; j++) {
        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((bl) => resolve(bl), 'image/jpeg', quality)
        })
        if (!blob) break
        const currentSize = blob.size / 1024
        if (currentSize <= targetKb || quality <= 0.2) break
        quality -= 0.1
      }

      if (blob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl)
        setResultUrl(URL.createObjectURL(blob))
        setStatus('done')
        setErrorMsg('')
      } else {
        throw new Error("Failed compiling image binary.")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed generating photo background.")
      setStatus('error')
    }
  }

  const handleReset = () => {
    setOriginalFile(null)
    setOriginalUrl(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setStatus('idle')
    setErrorMsg('')
    setTargetColorRGB(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleShare = async () => {
    if (!resultUrl) return
    try {
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const file = new File([blob], 'background-changed-photo.jpg', { type: 'image/jpeg' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Background Changed Passport Photo - SizeSnap',
          text: 'I changed my photo background to white/blue online locally using SizeSnap.in!',
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
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Passport Photo Background Changer</h3>
          <p className="text-blue-100 text-xs mt-1">Change and replace passport photo background to plain white or sky blue locally.</p>
        </div>
        {status === 'editing' && (
          <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
            TARGET: <span className="font-extrabold text-amber-300">{targetKb} KB</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Upload */}
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleUpload(file)
            }}
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base mb-1">Upload Passport Photo / Portrait</h4>
            <p className="text-xs text-gray-500">Supports JPG, JPEG, and PNG images.</p>
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose Photo File
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        )}

        {/* State 2: Processing */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Replacing color pixels...</h4>
            <p className="text-xs text-gray-500 mt-1">Applying chroma key interpolation matrices in client sandbox memory.</p>
          </div>
        )}

        {/* State 3: Error */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Replacement Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button onClick={handleReset} className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm">
              Reset and Retry
            </button>
          </div>
        )}

        {/* State 4: Editor */}
        {status === 'editing' && originalUrl && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Canvas Preview */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 self-start mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Pipette className="w-3.5 h-3.5 text-blue-500" /> Click on Canvas to change replaced color:
                </span>
                <div className="w-full bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-4 max-h-[300px]">
                  <canvas 
                    ref={previewCanvasRef} 
                    onClick={handleCanvasClick} 
                    className="max-h-[260px] object-contain rounded shadow border border-gray-200 cursor-crosshair bg-white" 
                  />
                </div>
              </div>

              {/* Right Settings */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 shadow-inner space-y-4 text-left">
                  
                  {/* Color Preset Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 block">Select Target Background Color:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'White', color: '#FFFFFF' },
                        { label: 'Sky Blue', color: '#A0C4DF' },
                        { label: 'Royal Blue', color: '#3A86C8' },
                        { label: 'Navy Blue', color: '#0F2C59' }
                      ].map(preset => (
                        <button
                          key={preset.label}
                          onClick={() => setBgColor(preset.color)}
                          className={`py-2 text-[10px] font-bold border rounded-xl transition-all text-center flex flex-col items-center gap-1.5 ${
                            bgColor === preset.color ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: preset.color }} />
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tolerance slider */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex justify-between">
                      <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-blue-500" /> Color Tolerance:</span>
                      <span className="text-blue-600 font-extrabold">{tolerance}</span>
                    </label>
                    <input type="range" min={5} max={180} step={2} value={tolerance} onChange={e => setTolerance(Number(e.target.value))} className="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg cursor-pointer" />
                  </div>

                  {/* Edge Softness slider */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex justify-between">
                      <span>Edge Softness:</span>
                      <span className="text-indigo-600 font-extrabold">{edgeSoftness}</span>
                    </label>
                    <input type="range" min={2} max={40} step={1} value={edgeSoftness} onChange={e => setEdgeSoftness(Number(e.target.value))} className="w-full accent-indigo-600 h-1 bg-gray-200 rounded-lg cursor-pointer" />
                  </div>

                  {/* Target KB slider */}
                  <div className="space-y-1 pt-2 border-t border-gray-200">
                    <label className="text-xs font-bold text-gray-700 flex justify-between">
                      <span>Max Target Size:</span>
                      <span className="text-teal-600 font-black">{targetKb} KB</span>
                    </label>
                    <input type="range" min={15} max={300} step={5} value={targetKb} onChange={e => setTargetKb(Number(e.target.value))} className="w-full accent-teal-600 h-1 bg-gray-200 rounded-lg cursor-pointer" />
                  </div>

                  {/* Replaced Color Preview */}
                  {targetColorRGB && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-150 text-[10px] font-bold text-gray-500 uppercase">
                      <span>Replaced Color:</span>
                      <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: `rgb(${targetColorRGB.r}, ${targetColorRGB.g}, ${targetColorRGB.b})` }} />
                      <span className="font-mono">rgb({targetColorRGB.r}, {targetColorRGB.g}, {targetColorRGB.b})</span>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button onClick={processImage} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm text-sm">
                Apply Background Color &amp; Save
              </button>
              <button onClick={handleReset} className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* State 5: Done */}
        {status === 'done' && resultUrl && originalFile && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="max-w-md mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-slate-50 p-6 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="font-bold text-gray-800 text-sm mb-4">Background Replaced Successfully!</h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="Background changed result" className="max-h-[220px] object-contain rounded shadow-md border border-gray-200 bg-white" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100 max-w-lg mx-auto">
              <a
                href={resultUrl}
                download={`bg-changed-${originalFile.name}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center text-sm"
              >
                <Download className="w-5 h-5" /> Download Passport Photo
              </a>
              <button
                onClick={handleShare}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm border-none"
              >
                <Share2 className="w-4 h-4" /> Share / Send
              </button>
              <button onClick={handleReset} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold text-sm">
                Start Fresh
              </button>
            </div>
          </div>
        )}

        {/* Hidden detection canvases */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Security badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client processing:</strong> Pixels processed locally inside browser sandbox.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Privacy Guaranteed:</strong> Files are never uploaded to our servers.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
