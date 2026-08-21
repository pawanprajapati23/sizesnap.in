'use client'
import { useState, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, ZoomIn, ZoomOut, Move } from 'lucide-react'

export default function PassportSuitTool({ config }: any) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [suitUrl, setSuitUrl] = useState<string>('/mens_suit.png') // The generated transparent suit
  const [scale, setScale] = useState<number>(1.0)
  const [posX, setPosX] = useState<number>(0)
  const [posY, setPosY] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
      setPhotoUrl(URL.createObjectURL(file))
      // Reset positions
      setScale(1.0)
      setPosX(0)
      setPosY(0)
      setResultUrl(null)
    }
  }

  // Draw the face behind the suit on the canvas
  useEffect(() => {
    if (!photoUrl || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const faceImg = new Image()
    const suitImg = new Image()

    // 400x500 is a standard passport aspect ratio (8x10)
    canvas.width = 400
    canvas.height = 500

    faceImg.onload = () => {
      suitImg.onload = () => {
        // Clear canvas (white background for passport)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Calculate face dimensions
        const faceWidth = faceImg.width * scale
        const faceHeight = faceImg.height * scale
        // Default center face
        const centerX = (canvas.width - faceWidth) / 2 + posX
        const centerY = (canvas.height - faceHeight) / 2 + posY

        // Draw face
        ctx.drawImage(faceImg, centerX, centerY, faceWidth, faceHeight)

        // Draw Suit on top (fixed position, fills canvas)
        // Adjust suit so it fits passport crop nicely
        ctx.drawImage(suitImg, -50, 150, 500, 500)
      }
      suitImg.src = suitUrl
    }
    faceImg.src = photoUrl
  }, [photoUrl, scale, posX, posY, suitUrl])

  // Mouse Dragging Logic
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStart({ x: clientX - posX, y: clientY - posY })
  }

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setPosX(clientX - dragStart.x)
    setPosY(clientY - dragStart.y)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const downloadImage = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL('image/jpeg', 0.95)
    setResultUrl(url)
    
    // trigger auto download
    const link = document.createElement('a')
    link.download = 'passport-formal-suit.jpg'
    link.href = url
    link.click()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-xl leading-tight">Formal Passport Suit Maker</h3>
          <p className="text-gray-300 text-sm mt-1">Upload a normal selfie and drag it to fit inside the formal suit.</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {!photoUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-md mx-auto aspect-[4/5] border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-colors"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Upload Your Photo</h4>
            <p className="text-sm text-gray-500 mt-1">Select a front-facing face photo.</p>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="flex-1 w-full">
              <div className="relative w-full max-w-sm mx-auto aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200 cursor-move"
                   onMouseDown={handleMouseDown}
                   onMouseMove={handleMouseMove}
                   onMouseUp={handleMouseUp}
                   onMouseLeave={handleMouseUp}
                   onTouchStart={handleMouseDown}
                   onTouchMove={handleMouseMove}
                   onTouchEnd={handleMouseUp}
              >
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full object-cover touch-none pointer-events-none"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                  <Move className="w-3 h-3" /> Drag to align face
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 space-y-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Adjust Face Size</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-600">
                    <ZoomOut className="w-5 h-5" />
                    <input 
                      type="range" 
                      min="0.2" 
                      max="3.0" 
                      step="0.05"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full mx-3 accent-gray-800"
                    />
                    <ZoomIn className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-center text-gray-500 font-medium">Use slider to fit your face in the collar.</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={downloadImage}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-all bg-gray-900 hover:bg-black"
                >
                  <Download className="w-5 h-5" /> Download Formal Photo
                </button>
                
                <button
                  onClick={() => setPhotoUrl(null)}
                  className="w-full py-3 rounded-xl text-gray-700 font-bold border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Upload New Photo
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
