'use client'
import { useState, useCallback, useRef } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config: {
    format?: string
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function ImageToPdfTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG).')
      setStatus('error')
      return
    }

    setOriginalFile(file)
    setStatus('processing')
    setErrorMsg('')

    try {
      let arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.create()
      let image

      // pdf-lib only supports JPG and PNG embedding out of the box
      if (file.type === 'image/jpeg') {
        image = await pdfDoc.embedJpg(arrayBuffer)
      } else if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(arrayBuffer)
      } else {
        // Fallback: Use Canvas to convert WEBP (or other) to JPG before embedding
        const img = new Image()
        img.src = URL.createObjectURL(file)
        await new Promise(res => { img.onload = res })
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.95))
        if (!blob) throw new Error('Conversion failed')
        arrayBuffer = await blob.arrayBuffer()
        image = await pdfDoc.embedJpg(arrayBuffer)
      }

      const page = pdfDoc.addPage([image.width, image.height])
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
      
      const pdfBytes = await pdfDoc.save()
      const resultBlob = new Blob([pdfBytes as any], { type: 'application/pdf' })

      setResultUrl(URL.createObjectURL(resultBlob))
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg('Something went wrong generating the PDF.')
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
  }, [])

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    setResultUrl(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
        <p className="text-blue-100 text-sm">
          Target format: <strong className="text-white">PDF Document</strong> — Perfect 1:1 image embedding
        </p>
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
              Drop your image here or click to upload
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
            <p className="font-semibold text-gray-700">Generating PDF...</p>
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
              <span className="text-sm font-medium">Image converted to PDF successfully!</span>
            </div>

            <div className="flex gap-3">
              <a
                href={resultUrl}
                download={`document-${originalFile?.name.split('.')[0] || 'image'}.pdf`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
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
