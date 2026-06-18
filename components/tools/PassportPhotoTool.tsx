'use client'
import { useState, useCallback, useRef } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Maximize, Crop } from 'lucide-react'

interface Props {
  config: {
    width?: number // target width like 413 for passport
    height?: number // target height like 531 for passport
    maxKB?: number
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function PassportPhotoTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file.')
      setStatus('error')
      return
    }

    setOriginalUrl(URL.createObjectURL(file))
    setStatus('processing')
    setErrorMsg('')

    try {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await new Promise(res => { img.onload = res })

      const targetWidth = config.width || 413
      const targetHeight = config.height || 531
      
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')!

      // White background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Calculate crop to fill the passport dimension (cover behavior)
      const imageRatio = img.width / img.height
      const targetRatio = targetWidth / targetHeight
      
      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height
      
      if (imageRatio > targetRatio) {
        // Image is wider than target
        sWidth = img.height * targetRatio
        sx = (img.width - sWidth) / 2
      } else {
        // Image is taller than target
        sHeight = img.width / targetRatio
        sy = (img.height - sHeight) / 2
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight)

      let quality = 0.95
      let blob: Blob | null = null

      const getBlob = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q))

      // Compress to hit maxKB if required
      if (config.maxKB) {
        let low = 0.1
        let high = 0.95
        
        for (let i = 0; i < 10; i++) {
          quality = (low + high) / 2
          blob = await getBlob(quality)
          if (!blob) throw new Error('Blob generation failed')
          
          if (blob.size / 1024 > config.maxKB) {
            high = quality
          } else {
            low = quality
          }
        }
      } else {
        blob = await getBlob(quality)
      }

      if (!blob) throw new Error('Final conversion failed')

      setFinalFile(blob)
      setResultUrl(URL.createObjectURL(blob))
      setStatus('done')
    } catch (err) {
      setErrorMsg('Something went wrong matching the passport specs.')
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImage(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processImage(file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  const handleReset = () => {
    setStatus('idle')
    setOriginalUrl(null)
    setResultUrl(null)
    setFinalFile(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex items-center justify-between">
        <p className="text-blue-100 text-sm">
          Target: <strong className="text-white">{config.width}x{config.height}px</strong> 
          {config.maxKB && <span> (Max {config.maxKB}KB)</span>}
        </p>
        <Crop className="w-5 h-5 text-blue-200" />
      </div>

      <div className="p-5 space-y-4">
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 mb-1">
              Select photo for passport processing
            </p>
            <p className="text-sm text-gray-400">JPG, PNG, WEBP</p>
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
            <RefreshCw className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-gray-700">Scaling and Cropping...</p>
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

        {status === 'done' && resultUrl && finalFile && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Passport photo formatted successfully!</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              {originalUrl && (
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Original</p>
                  <div className="w-32 h-40 opacity-70 rounded-lg overflow-hidden border border-gray-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={originalUrl} alt="Original" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <Maximize className="w-6 h-6 text-gray-300 transform rotate-90 md:rotate-0" />
              <div className="text-center">
                <p className="text-xs text-green-600 mb-2 font-semibold uppercase tracking-wider">Passport Output</p>
                <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-green-500 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Passport" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-500 mt-2">{(finalFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={resultUrl}
                download="passport-photo.jpg"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Photo
              </a>
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
