'use client'
import { useState, useRef, useEffect } from 'react'
import { Upload, Download, EyeOff, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react'

export default function AadhaarMaskTool({ config }: { config?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  
  const [rects, setRects] = useState<{ x: number, y: number, w: number, h: number }[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentRect, setCurrentRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null)
  
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (f: File) => {
    if (!f.type.startsWith('image/')) return
    setFile(f)
    setImageUrl(URL.createObjectURL(f))
    setRects([])
    setOutputUrl(null)
  }

  const getRelativeCoordinates = (e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect()
    return {
      x: (e.clientX - bounds.left) / bounds.width,
      y: (e.clientY - bounds.top) / bounds.height
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getRelativeCoordinates(e)
    setStartPos(pos)
    setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 })
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing) return
    e.preventDefault()
    const pos = getRelativeCoordinates(e)
    
    setCurrentRect({
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      w: Math.abs(pos.x - startPos.x),
      h: Math.abs(pos.y - startPos.y)
    })
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (isDrawing && currentRect && currentRect.w > 0.02 && currentRect.h > 0.02) {
      setRects([...rects, currentRect])
    }
    setIsDrawing(false)
    setCurrentRect(null)
  }
  
  const clearMasks = () => {
    setRects([])
    setOutputUrl(null)
  }

  const processMasking = () => {
    if (!imageRef.current || rects.length === 0) return
    setIsProcessing(true)

    const img = imageRef.current
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw original image
    ctx.drawImage(img, 0, 0)

    // Draw mask rectangles
    ctx.fillStyle = '#000000'
    rects.forEach(rect => {
      ctx.fillRect(
        rect.x * canvas.width,
        rect.y * canvas.height,
        rect.w * canvas.width,
        rect.h * canvas.height
      )
    })

    // Export
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setOutputUrl(dataUrl)
    
    // Calculate approximate size
    const base64str = dataUrl.split(',')[1]
    const sizeInBytes = atob(base64str).length
    setOutputSize(sizeInBytes)
    
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      {/* Upload State */}
      {!imageUrl && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-500 bg-white cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if(e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]) }}
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <EyeOff className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Aadhaar to Mask</h3>
          <p className="text-gray-500 mb-6">Select your Aadhaar card image to blur/hide the first 8 digits securely.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl inline-flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Browse Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            className="hidden" 
            accept="image/*"
          />
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Private - No uploads to our server</span>
          </div>
        </div>
      )}

      {/* Editor State */}
      {imageUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-100 p-4 rounded-2xl text-center border border-gray-200">
              <p className="text-gray-600 text-sm font-medium mb-3">
                👉 <span className="text-blue-600">Draw a box</span> over the first 8 digits of your Aadhaar card to mask them.
              </p>
              <div 
                className="relative inline-block border-2 border-dashed border-gray-400 select-none cursor-crosshair shadow-sm touch-none bg-white max-w-full overflow-hidden"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <img 
                  ref={imageRef}
                  src={imageUrl} 
                  alt="Aadhaar" 
                  className="max-w-full h-auto object-contain pointer-events-none"
                  style={{ maxHeight: '60vh' }}
                  draggable={false}
                />
                
                {/* Render confirmed masks */}
                {rects.map((rect, i) => (
                  <div 
                    key={i}
                    className="absolute bg-black rounded-sm shadow-md border border-white/20 backdrop-blur-sm"
                    style={{
                      left: `${rect.x * 100}%`,
                      top: `${rect.y * 100}%`,
                      width: `${rect.w * 100}%`,
                      height: `${rect.h * 100}%`,
                    }}
                  />
                ))}

                {/* Render currently drawing mask */}
                {isDrawing && currentRect && (
                  <div 
                    className="absolute bg-black/80 border-2 border-white/50 border-dashed rounded-sm"
                    style={{
                      left: `${currentRect.x * 100}%`,
                      top: `${currentRect.y * 100}%`,
                      width: `${currentRect.w * 100}%`,
                      height: `${currentRect.h * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
               <button 
                onClick={() => { setFile(null); setImageUrl(null); setOutputUrl(null); setRects([]) }}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Upload Different
              </button>
              <button 
                onClick={clearMasks}
                disabled={rects.length === 0}
                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50 flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Masks
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" /> Mask Settings
              </h3>
              <p className="text-sm text-gray-500">Apply the mask securely before downloading.</p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
              <h4 className="text-sm font-semibold text-yellow-800 mb-1">UIDAI Guidelines</h4>
              <p className="text-xs text-yellow-700">Only share &quot;Masked Aadhaar&quot; where the first 8 digits are hidden. Keep the last 4 digits visible for verification.</p>
            </div>

            <button
              onClick={processMasking}
              disabled={rects.length === 0 || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? 'Processing...' : 'Apply Mask & Preview'}
            </button>

            {outputUrl && (
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-semibold text-green-900">Aadhaar Masked!</h4>
                      <p className="text-sm text-green-700">File size: {(outputSize / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                </div>
                
                <a 
                  href={outputUrl} 
                  download={`masked-aadhaar-secure.jpg`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Masked Aadhaar
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
