'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage, ShieldCheck, Cpu, Sliders, Calendar } from 'lucide-react'

interface Props {
  config?: any
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'

export default function WatermarkImageTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)

  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)

  // Name and Date details
  const [nameText, setNameText] = useState('')
  const [dateText, setDateText] = useState(new Date().toLocaleDateString('en-GB')) // DD/MM/YYYY

  // Visual customizer parameters
  const [plateBg, setPlateBg] = useState<'white' | 'black'>('white')
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans')
  const [plateHeightPct, setPlateHeightPct] = useState<number>(18) // percent of image height
  const [targetKb, setTargetKb] = useState<number>(50)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load original image file
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image photo file.')
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
      setErrorMsg('Could not read image file.')
      setStatus('error')
    }
    img.src = url
  }

  // Draw and compile the watermarked photo
  const compileWatermarkedImage = useCallback(async () => {
    if (!originalImage) return
    setStatus('processing')

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      const width = originalImage.width
      const bottomAreaHeight = Math.max(80, Math.floor(originalImage.height * (plateHeightPct / 100)))
      const height = originalImage.height + bottomAreaHeight

      canvas.width = width
      canvas.height = height

      // 1. Draw candidate photo
      ctx.drawImage(originalImage, 0, 0)

      // 2. Draw Bottom Label Plate Rectangle
      ctx.fillStyle = plateBg === 'white' ? '#FFFFFF' : '#000000'
      ctx.fillRect(0, originalImage.height, width, bottomAreaHeight)

      // 3. Draw separating hairline
      ctx.strokeStyle = plateBg === 'white' ? '#E2E8F0' : '#334155'
      ctx.lineWidth = Math.max(1, Math.floor(width * 0.003))
      ctx.beginPath()
      ctx.moveTo(0, originalImage.height)
      ctx.lineTo(width, originalImage.height)
      ctx.stroke()

      // 4. Draw labels text (Name & Date)
      ctx.fillStyle = plateBg === 'white' ? '#000000' : '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const fontName = fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'mono' ? 'monospace' : 'sans-serif'
      const fontSize = Math.floor(bottomAreaHeight * 0.28)
      
      // Draw Candidate Name
      if (nameText) {
        ctx.font = `bold ${fontSize}px ${fontName}`
        ctx.fillText(nameText.trim(), width / 2, originalImage.height + (bottomAreaHeight * 0.32))
      }

      // Draw Shot Date
      if (dateText) {
        ctx.font = `normal ${Math.floor(fontSize * 0.9)}px ${fontName}`
        ctx.fillText(dateText.trim(), width / 2, originalImage.height + (bottomAreaHeight * 0.7))
      }

      let quality = 0.9
      let blob: Blob | null = null

      const getBlob = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q))

      // Precise binary compression search to match form requirements
      let low = 0.05
      let high = 0.95
      const safetyMargin = 0.98
      const maxBytes = targetKb * 1024 * safetyMargin

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

      if (blob && blob.size > targetKb * 1024) {
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
      setErrorMsg(e.message || 'Error compiling watermarked image plate.')
      setStatus('error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalImage, nameText, dateText, plateBg, fontFamily, plateHeightPct, targetKb])

  // Trigger rebuild on control modification
  useEffect(() => {
    if (originalImage) {
      compileWatermarkedImage()
    }
  }, [originalImage, nameText, dateText, plateBg, fontFamily, plateHeightPct, targetKb, compileWatermarkedImage])

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
    setFinalFile(null)
    setNameText('')
    setDateText(new Date().toLocaleDateString('en-GB'))
    setPlateBg('white')
    setFontFamily('sans')
    setPlateHeightPct(18)
    setTargetKb(50)
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
          <h3 className="font-bold text-lg leading-tight font-sans">Dated Photo Maker (SSC / UPSC)</h3>
          <p className="text-blue-100 text-xs mt-1">Add candidate name & shot date to the bottom plate of passport photos.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Plate Sandbox
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
              Select Passport Photo
            </h4>
            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP. Adds a clean print label automatically.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose Photo File
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
            <h4 className="font-bold text-gray-800 text-base">Rendering text labels & checking sizes...</h4>
            <p className="text-xs text-gray-500 mt-1">Compressing image to match constraints locally.</p>
          </div>
        )}

        {/* State 3: Error */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Compilation Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 4: Editing Workspace / Done */}
        {(status === 'editing' || status === 'done') && resultUrl && originalFile && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Result Preview */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 self-start mb-2 uppercase tracking-wider">Dated Preview:</span>
                
                <div className="w-full min-h-[260px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Dated result"
                    className="max-w-xs max-h-72 object-contain rounded shadow-md border border-gray-200 bg-white"
                  />
                </div>

                <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-2 text-center text-xs text-blue-700 font-bold">
                  File Size: {(finalFile ? finalFile.size / 1024 : 0).toFixed(1)} KB (Max: {targetKb} KB)
                </div>
              </div>

              {/* Right Column: Parameters workspace */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Section 1: Candidate inputs */}
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-3.5 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                    Label entries
                  </span>

                  {/* Candidate Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Candidate Name (Full uppercase):</label>
                    <input
                      type="text"
                      placeholder="e.g. AMIT SHARMA"
                      value={nameText}
                      onChange={e => setNameText(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Date of Photo (DD/MM/YYYY):</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 20/06/2026"
                        value={dateText}
                        onChange={e => setDateText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                      />
                      <button 
                        onClick={() => setDateText(new Date().toLocaleDateString('en-GB'))}
                        className="absolute right-2 top-1.5 p-1 bg-white hover:bg-gray-100 rounded border border-gray-200 text-gray-400"
                        title="Use today's date"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 2: Visual options customizer */}
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-3.5 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    Styling customizer
                  </span>

                  {/* Plate Color toggle */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Plate Background Color:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPlateBg('white')}
                        className={`py-1.5 text-xs font-bold border rounded-lg transition-all text-center ${
                          plateBg === 'white' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        White Plate
                      </button>
                      <button
                        onClick={() => setPlateBg('black')}
                        className={`py-1.5 text-xs font-bold border rounded-lg transition-all text-center ${
                          plateBg === 'black' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Black Plate
                      </button>
                    </div>
                  </div>

                  {/* Plate Height Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>Label Area Height (Ratio):</span>
                      <span>{plateHeightPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={25}
                      step={1}
                      value={plateHeightPct}
                      onChange={e => setPlateHeightPct(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Fonts selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Label Font-Face style:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['sans', 'serif', 'mono'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFontFamily(f as any)}
                          className={`py-1 text-xs font-bold border rounded-lg transition-all text-center capitalize ${
                            fontFamily === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {f === 'sans' ? 'Modern' : f === 'serif' ? 'Formal' : 'Typewriter'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compression target KB size limit */}
                  <div className="space-y-1 pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>Target File Size Limit:</span>
                      <span className="text-blue-600 font-extrabold">{targetKb} KB</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={150}
                      step={5}
                      value={targetKb}
                      onChange={e => setTargetKb(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] text-gray-400">
                      <span>10 KB</span>
                      <span>50 KB (SSC Target)</span>
                      <span>150 KB</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
              <a
                href={resultUrl}
                download={`dated-photo-${nameText.trim().replace(/\s+/g, '-') || 'output'}.jpg`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download Dated Photo (JPG)
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
            <span><strong>Client-Side logic:</strong> Text rendering processes 100% locally.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Data Safe:</strong> Face features and identity metadata are not uploaded.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
