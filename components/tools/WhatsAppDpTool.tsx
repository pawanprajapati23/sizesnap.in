'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage } from 'lucide-react'

interface Props {
  config: any
}

type Status = 'idle' | 'editing' | 'done' | 'error'

export default function WhatsAppDpTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [blurAmount, setBlurAmount] = useState<number>(20) // px blur
  const [paddingColor, setPaddingColor] = useState<string>('blur') // 'blur', 'white', 'black'
  
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = async (file: File) => {
    setStatus('editing')
    setErrorMsg('')
    try {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await new Promise(res => { img.onload = res })
      setOriginalImage(img)
    } catch (err) {
      setErrorMsg('Could not process image.')
      setStatus('error')
    }
  }

  const generateSquare = useCallback(() => {
    if (!originalImage) return
    setStatus('editing')

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      const size = Math.max(originalImage.width, originalImage.height)
      const outputSize = Math.max(1024, size) // Ensure good quality output
      
      canvas.width = outputSize
      canvas.height = outputSize

      const scale = outputSize / size

      const imgScaledWidth = originalImage.width * scale
      const imgScaledHeight = originalImage.height * scale

      const dx = (outputSize - imgScaledWidth) / 2
      const dy = (outputSize - imgScaledHeight) / 2

      // Background
      if (paddingColor === 'blur') {
         ctx.filter = `blur(${blurAmount}px)`
         ctx.drawImage(originalImage, -outputSize*0.1, -outputSize*0.1, outputSize*1.2, outputSize*1.2)
         ctx.filter = 'none'
         // add a slight dark overlay
         ctx.fillStyle = 'rgba(0,0,0,0.2)'
         ctx.fillRect(0,0, outputSize, outputSize)
      } else {
         ctx.fillStyle = paddingColor
         ctx.fillRect(0, 0, outputSize, outputSize)
      }
      
      // Draw actual image in the center
      ctx.drawImage(originalImage, dx, dy, imgScaledWidth, imgScaledHeight)

      canvas.toBlob(blob => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob))
          setStatus('done')
        }
      }, 'image/jpeg', 0.95)

    } catch (err) {
       setErrorMsg('Error generating image.')
       setStatus('error')
    }
  }, [originalImage, blurAmount, paddingColor])

  useEffect(() => {
    if (originalImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateSquare()
    }
  }, [originalImage, blurAmount, paddingColor, generateSquare])

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
    setErrorMsg('')
    setOriginalImage(null)
    setBlurAmount(20)
    setPaddingColor('blur')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4 flex items-center justify-between">
        <p className="text-emerald-100 text-sm">
          Target: <strong className="text-white">Full Square DP</strong> 
        </p>
        <FileImage className="w-5 h-5 text-emerald-100" />
      </div>

      <div className="p-5 space-y-4">
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 mb-1">
              Select Your Photo
            </p>
            <p className="text-sm text-gray-400">Fits entirely in square size</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
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

        {(status === 'editing' || status === 'done') && resultUrl && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Preview */}
              <div className="flex-1 max-w-sm mx-auto flex items-center justify-center">
                 <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white ring-1 ring-gray-200">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={resultUrl} alt="Square preview format" className="w-full h-full object-cover" />
                 </div>
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-5 bg-gray-50 p-5 rounded-xl border border-gray-200">
                 
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Background Style</label>
                    <div className="flex gap-2">
                      <button onClick={() => setPaddingColor('blur')} className={`flex-1 py-2 text-sm rounded border ${paddingColor === 'blur' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300'}`}>Blur</button>
                      <button onClick={() => setPaddingColor('white')} className={`flex-1 py-2 text-sm rounded border ${paddingColor === 'white' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300'}`}>White</button>
                      <button onClick={() => setPaddingColor('black')} className={`flex-1 py-2 text-sm rounded border ${paddingColor === 'black' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300'}`}>Black</button>
                    </div>
                 </div>

                 {paddingColor === 'blur' && (
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blur Amount: {blurAmount}</label>
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      value={blurAmount} 
                      onChange={e => setBlurAmount(parseInt(e.target.value))}
                      className="w-full"
                    />
                 </div>
                 )}

                 <div className="pt-4 flex flex-col gap-3">
                    <a
                      href={resultUrl}
                      download={`whatsapp_dp_square.jpg`}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Square Image
                    </a>
                    <button
                      onClick={handleReset}
                      className="py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition-colors font-medium"
                    >
                      Choose New Photo
                    </button>
                 </div>
                 
                 <p className="text-xs text-center text-gray-500 mt-2">The preview is rounded to show how it looks as a DP, but downloads as a perfect square.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
