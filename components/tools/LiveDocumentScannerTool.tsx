'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Camera, RefreshCw, Download, FileText, CheckCircle, Plus, Trash2, CameraOff } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config?: any
}

type Mode = 'idle' | 'camera' | 'preview'
type ScanFilter = 'color' | 'grayscale' | 'magic'

interface Page {
  id: string
  originalDataUrl: string
  filteredDataUrl: string
  filter: ScanFilter
}

export default function LiveDocumentScannerTool({ config }: Props) {
  const [mode, setMode] = useState<Mode>('idle')
  const [pages, setPages] = useState<Page[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState('')
  const [isCompiling, setIsCompiling] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfSize, setPdfSize] = useState<number>(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError('')
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      })
      setStream(mediaStream)
      setMode('camera')
    } catch (err: any) {
      setCameraError('Camera access denied or unavailable. Please allow camera permissions.')
    }
  }

  // Bind stream to video element
  useEffect(() => {
    if (mode === 'camera' && videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(e => console.error(e))
    }
  }, [mode, stream])

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
    }
  }, [stream])

  // Capture Photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
    
    const newPage: Page = {
      id: crypto.randomUUID(),
      originalDataUrl: dataUrl,
      filteredDataUrl: dataUrl, // will be updated
      filter: 'magic'
    }

    setPages(prev => [...prev, newPage])
    
    // Process filter immediately
    applyFilter(newPage.id, 'magic', dataUrl)
    setMode('preview')
    
    // Stop camera temporarily
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
    }
  }

  // Image Processing (Filters)
  const applyFilter = (pageId: string, filterType: ScanFilter, sourceDataUrl: string) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data

      // Advanced Magic Filter (Contrast Boost + Grayscale mix)
      if (filterType === 'magic') {
        const contrast = 60
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i], g = data[i+1], b = data[i+2]
          r = factor * (r - 128) + 128
          g = factor * (g - 128) + 128
          b = factor * (b - 128) + 128
          const gray = 0.299 * r + 0.587 * g + 0.114 * b
          // Threshold slightly to pure white
          const val = Math.min(255, Math.max(0, gray > 200 ? 255 : gray))
          data[i] = val
          data[i+1] = val
          data[i+2] = val
        }
      } else if (filterType === 'grayscale') {
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]
          data[i] = gray
          data[i+1] = gray
          data[i+2] = gray
        }
      }

      ctx.putImageData(imgData, 0, 0)
      const filteredUrl = canvas.toDataURL('image/jpeg', 0.8)
      
      setPages(prev => prev.map(p => {
        if (p.id === pageId) {
          return { ...p, filter: filterType, filteredDataUrl: filteredUrl }
        }
        return p
      }))
    }
    img.src = sourceDataUrl
  }

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id))
    if (pages.length === 1) {
      startCamera()
    }
  }

  // Compile PDF
  const compilePdf = async () => {
    if (pages.length === 0) return
    setIsCompiling(true)
    try {
      const pdfDoc = await PDFDocument.create()
      
      for (const page of pages) {
        // convert base64 to arraybuffer
        const base64Data = page.filteredDataUrl.split(',')[1]
        const byteString = atob(base64Data)
        const arrayBuffer = new ArrayBuffer(byteString.length)
        const int8Array = new Uint8Array(arrayBuffer)
        for (let i = 0; i < byteString.length; i++) {
          int8Array[i] = byteString.charCodeAt(i)
        }
        
        const image = await pdfDoc.embedJpg(arrayBuffer)
        const { width, height } = image.scale(1)
        
        // A4 format approach: resize to fit A4
        const a4Width = 595.28
        const a4Height = 841.89
        const pdfPage = pdfDoc.addPage([a4Width, a4Height])
        
        const scale = Math.min(a4Width / width, a4Height / height)
        const scaledWidth = width * scale
        const scaledHeight = height * scale
        
        pdfPage.drawImage(image, {
          x: (a4Width - scaledWidth) / 2,
          y: (a4Height - scaledHeight) / 2,
          width: scaledWidth,
          height: scaledHeight,
        })
      }
      
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      setPdfUrl(url)
      setPdfSize(blob.size)
      
      // trigger confetti
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#3B82F6']
        });
      });
      
    } catch (err) {
      console.error(err)
      setCameraError('Failed to compile PDF.')
    }
    setIsCompiling(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight">Live CamScanner Document Maker</h3>
          <p className="text-teal-100 text-xs mt-1">Scan physical documents directly via mobile camera to A4 PDF.</p>
        </div>
      </div>

      <div className="p-6">
        {mode === 'idle' && pages.length === 0 && !pdfUrl && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Turn your Phone into a Scanner</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">Tap the button below to open your camera, snap your documents, and we will enhance and convert them into a professional PDF.</p>
            
            <button 
              onClick={startCamera}
              className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 mx-auto transition-all text-lg"
            >
              <Camera className="w-5 h-5" />
              Open Camera & Scan
            </button>
            {cameraError && <p className="text-red-500 text-sm mt-4 font-semibold">{cameraError}</p>}
          </div>
        )}

        {mode === 'camera' && (
          <div className="relative bg-black rounded-xl overflow-hidden aspect-[3/4] w-full max-w-md mx-auto flex items-center justify-center shadow-inner">
            <video ref={videoRef} playsInline className="absolute inset-0 w-full h-full object-cover"></video>
            
            {/* Camera Overlay Guide */}
            <div className="absolute inset-8 border-2 border-white/40 border-dashed rounded-lg pointer-events-none"></div>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
              <button 
                onClick={() => { setMode('preview'); stream?.getTracks().forEach(t => t.stop()) }}
                className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              >
                <CameraOff className="w-6 h-6" />
              </button>
              
              <button 
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-teal-500 hover:scale-105 transition-transform"
              >
                <div className="w-14 h-14 bg-white rounded-full"></div>
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden"></canvas>

        {mode === 'preview' && !pdfUrl && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pages.map((page, idx) => (
                <div key={page.id} className="relative group rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-gray-50">
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
                    Pg {idx + 1}
                  </div>
                  <button 
                    onClick={() => deletePage(page.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 shadow-md text-white rounded-full flex items-center justify-center z-10 hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <img src={page.filteredDataUrl} alt={`Page ${idx + 1}`} className="w-full aspect-[3/4] object-cover" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm border-t border-gray-200 flex justify-between gap-1">
                    <button 
                      onClick={() => applyFilter(page.id, 'color', page.originalDataUrl)}
                      className={`flex-1 text-[10px] py-1 font-bold rounded ${page.filter === 'color' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      Color
                    </button>
                    <button 
                      onClick={() => applyFilter(page.id, 'magic', page.originalDataUrl)}
                      className={`flex-1 text-[10px] py-1 font-bold rounded ${page.filter === 'magic' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      Magic B&W
                    </button>
                  </div>
                </div>
              ))}
              
              <div 
                onClick={startCamera}
                className="rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center aspect-[3/4] cursor-pointer hover:bg-teal-50 hover:border-teal-400 transition-colors group"
              >
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mb-2" />
                <span className="text-sm font-semibold text-gray-500 group-hover:text-teal-600">Add Page</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100">
              <div>
                <h4 className="font-bold text-teal-900">Total Pages: {pages.length}</h4>
                <p className="text-xs text-teal-700">Ready to compile into PDF.</p>
              </div>
              <button 
                onClick={compilePdf}
                disabled={isCompiling}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isCompiling ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                {isCompiling ? 'Compiling...' : 'Save as PDF'}
              </button>
            </div>
          </div>
        )}

        {pdfUrl && (
          <div className="text-center py-10 space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900">PDF Successfully Created!</h3>
              <p className="text-gray-500 mt-1">Compiled {pages.length} pages • {(pdfSize / 1024).toFixed(0)} KB</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto">
              <a 
                href={pdfUrl}
                download="sizesnap-scanned-doc.pdf"
                className="flex-1 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
              <button 
                onClick={() => {
                  setPdfUrl(null);
                  setPages([]);
                  setMode('idle');
                }}
                className="py-3.5 px-6 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Scan New
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
