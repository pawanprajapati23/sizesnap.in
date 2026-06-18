'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage } from 'lucide-react'

interface Props {
  config: any
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function DocumentScannerTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)
  
  // contrast 0 to 255
  const [threshold, setThreshold] = useState<number>(128)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImage = async (file: File) => {
    setStatus('processing')
    setErrorMsg('')

    try {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await new Promise(res => { img.onload = res })
      setOriginalImage(img)
      applyFilter(img, 128)
    } catch (err) {
      setErrorMsg('Could not process image.')
      setStatus('error')
    }
  }

  const applyFilter = (img: HTMLImageElement, currentThreshold: number) => {
    setStatus('processing')
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data

      for (let i = 0; i < data.length; i += 4) {
        // Grayscale conversion
        const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]
        
        // Thresholding
        const value = brightness >= currentThreshold ? 255 : 0

        data[i] = value     // red
        data[i + 1] = value // green
        data[i + 2] = value // blue
        // alpha remains unchanged
      }

      ctx.putImageData(imgData, 0, 0)

      canvas.toBlob(blob => {
        if (blob) {
          setFinalFile(blob)
          setResultUrl(URL.createObjectURL(blob))
          setStatus('done')
        }
      }, 'image/jpeg', 0.9)

    } catch (err) {
       setErrorMsg('Error applying filter.')
       setStatus('error')
    }
  }

  useEffect(() => {
    if (originalImage) {
      applyFilter(originalImage, threshold)
    }
  }, [threshold])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImage(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processImage(file)
  }, [])

  const handleReset = () => {
    setStatus('idle')
    setResultUrl(null)
    setFinalFile(null)
    setErrorMsg('')
    setOriginalImage(null)
    setThreshold(128)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-5 py-4 flex items-center justify-between">
        <p className="text-gray-100 text-sm">
          Target: <strong className="text-white">B&W Document Scanner</strong> 
        </p>
        <FileImage className="w-5 h-5 text-gray-200" />
      </div>

      <div className="p-5 space-y-4">
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-gray-500 bg-gray-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 mb-1">
              Select Document Photo
            </p>
            <p className="text-sm text-gray-400">Makes text black and background white</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {status === 'processing' && (
          <div className="text-center py-10">
            <RefreshCw className="w-10 h-10 text-gray-500 mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-gray-700">Applying scanner filter...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="font-semibold text-red-700">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'done' && resultUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Scan completed!</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 max-w-sm mx-auto bg-gray-50 border border-gray-200 rounded p-2">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={resultUrl} alt="Scanned" className="w-full h-auto object-contain" />
              </div>

              <div className="flex-1 space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adjust Contrast (Threshold)</label>
                    <input 
                      type="range" 
                      min="50" 
                      max="200" 
                      value={threshold} 
                      onChange={e => setThreshold(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                       <span>More Dark</span>
                       <span>More Light</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <a
                      href={resultUrl}
                      download="scanned-document.jpg"
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Scan
                    </a>
                    <button
                      onClick={handleReset}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Scan Another
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
