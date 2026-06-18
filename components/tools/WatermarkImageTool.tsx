'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage } from 'lucide-react'

interface Props {
  config: any
}

type Status = 'idle' | 'editing' | 'done' | 'error'

export default function WatermarkImageTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)
  
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  
  const [nameText, setNameText] = useState('')
  const [dateText, setDateText] = useState(new Date().toLocaleDateString('en-GB')) // DD/MM/YYYY

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

  const applyWatermark = useCallback(() => {
    if (!originalImage) return
    setStatus('editing') // show processing state implicitly if slow, but usually fast

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      const width = originalImage.width
      const bottomAreaHeight = Math.max(100, Math.floor(originalImage.height * 0.2)) // 20% of height for text area
      const height = originalImage.height + bottomAreaHeight

      canvas.width = width
      canvas.height = height

      // Draw original image
      ctx.drawImage(originalImage, 0, 0)
      
      // Draw white rectangle at bottom
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, originalImage.height, width, bottomAreaHeight)
      
      // Draw text
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const fontSize = Math.floor(bottomAreaHeight * 0.3)
      ctx.font = `bold ${fontSize}px sans-serif`
      
      // Draw Name
      if (nameText) {
         ctx.fillText(nameText, width / 2, originalImage.height + (bottomAreaHeight * 0.35))
      }
      
      // Draw Date
      if (dateText) {
         ctx.font = `${fontSize}px sans-serif`
         ctx.fillText(dateText, width / 2, originalImage.height + (bottomAreaHeight * 0.75))
      }

      canvas.toBlob(blob => {
        if (blob) {
          setFinalFile(blob)
          setResultUrl(URL.createObjectURL(blob))
          setStatus('done')
        }
      }, 'image/jpeg', 0.95)

    } catch (err) {
       setErrorMsg('Error generating image.')
       setStatus('error')
    }
  }, [originalImage, nameText, dateText])

  useEffect(() => {
    if (originalImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      applyWatermark()
    }
  }, [originalImage, nameText, dateText, applyWatermark])

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
    setNameText('')
    setDateText(new Date().toLocaleDateString('en-GB'))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-5 py-4 flex items-center justify-between">
        <p className="text-blue-100 text-sm">
          Target: <strong className="text-white">Photo with Name & Date</strong> 
        </p>
        <FileImage className="w-5 h-5 text-blue-200" />
      </div>

      <div className="p-5 space-y-4">
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 mb-1">
              Select Passport Photo
            </p>
            <p className="text-sm text-gray-400">Add text plate at the bottom automatically</p>
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
              <div className="flex-1 max-w-sm mx-auto bg-gray-100 rounded-xl p-4 flex items-center justify-center border border-gray-200">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={resultUrl} alt="Watermarked" className="max-w-full h-auto shadow bg-white" />
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-5 bg-gray-50 p-5 rounded-xl border border-gray-200">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Candidate Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. RAHUL KUMAR"
                      value={nameText} 
                      onChange={e => setNameText(e.target.value.toUpperCase())}
                      className="w-full p-3 border border-gray-300 rounded font-medium"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Photo</label>
                    <input 
                      type="text" 
                      placeholder="DD/MM/YYYY"
                      value={dateText} 
                      onChange={e => setDateText(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded font-medium"
                    />
                 </div>

                 <div className="pt-4 flex flex-col gap-3">
                    <a
                      href={resultUrl}
                      download={`photo_${nameText.replace(/\s+/g,'_') || 'dated'}.jpg`}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Photo
                    </a>
                    <button
                      onClick={handleReset}
                      className="py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition-colors font-medium"
                    >
                      Upload New Photo
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
