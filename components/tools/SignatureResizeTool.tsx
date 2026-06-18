'use client'
import { useState, useCallback, useRef } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Edit3 } from 'lucide-react'

interface Props {
  config: {
    width?: number
    height?: number
    maxKB?: number
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function SignatureResizeTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
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

    setStatus('processing')
    setErrorMsg('')

    try {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await new Promise(res => { img.onload = res })

      const canvas = document.createElement('canvas')
      
      // If width/height is given, crop to it. Otherwise, keep aspect ratio but compress
      if (config.width && config.height) {
        canvas.width = config.width
        canvas.height = config.height
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }

      const ctx = canvas.getContext('2d')!
      
      // White background for signatures
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      if (config.width && config.height) {
        const imageRatio = img.width / img.height
        const targetRatio = canvas.width / canvas.height
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height
        
        if (imageRatio > targetRatio) {
          sWidth = img.height * targetRatio
          sx = (img.width - sWidth) / 2
        } else {
          sHeight = img.width / targetRatio
          sy = (img.height - sHeight) / 2
        }
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height)
      } else {
        ctx.drawImage(img, 0, 0)
      }

      let quality = 0.95
      let blob: Blob | null = null

      const getBlob = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q))

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
      setErrorMsg('Something went wrong formatting the signature.')
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
  }, [config])

  const handleReset = () => {
    setStatus('idle')
    setResultUrl(null)
    setFinalFile(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex items-center justify-between">
        <p className="text-blue-100 text-sm">
          Target: <strong className="text-white">Signature Format</strong> 
          {config.maxKB && <span> (Max {config.maxKB}KB)</span>}
        </p>
        <Edit3 className="w-5 h-5 text-blue-200" />
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
              Upload your signature scan
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
            <p className="font-semibold text-gray-700">Optimizing signature...</p>
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
              <span className="text-sm font-medium">Signature formatted successfully!</span>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center">
               <div className="w-full max-w-sm bg-white border border-gray-300 shadow-sm rounded p-4 flex items-center justify-center min-h-[100px]">
                 <img src={resultUrl} alt="Signature" className="max-w-full max-h-full object-contain mix-blend-multiply" />
               </div>
               <p className="text-sm text-gray-500 mt-3 font-medium">
                 Final size: {(finalFile.size / 1024).toFixed(2)} KB
               </p>
            </div>

            <div className="flex gap-3">
              <a
                href={resultUrl}
                download="signature.jpg"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Signature
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
