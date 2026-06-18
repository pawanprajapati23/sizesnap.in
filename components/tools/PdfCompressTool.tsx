'use client'
import { useState, useCallback, useRef } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config: {
    maxKB?: number
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function PdfCompressTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [resultSize, setResultSize] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processPdf = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid PDF document.')
      setStatus('error')
      return
    }

    setOriginalFile(file)
    setOriginalSize(file.size)
    setStatus('processing')
    setErrorMsg('')

    try {
      // 1. Dynamically load pdfjs to render pages
      let pdfjsLib: any = (window as any).pdfjsLib;
      if (!pdfjsLib) {
         // @ts-ignore
         pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
         pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;
         (window as any).pdfjsLib = pdfjsLib;
      }

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer))
      const pdf = await loadingTask.promise
      
      const numPages = pdf.numPages
      const targetSize = config.maxKB ? config.maxKB * 1024 : undefined

      let currentScale = 1.5
      let currentQuality = 0.8
      let attempts = 0
      let finalBlob: Blob | null = null

      while (attempts < 4) {
        const newPdfDoc = await PDFDocument.create()

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: currentScale })
          
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          canvas.width = viewport.width
          canvas.height = viewport.height

          await page.render({ canvasContext: ctx, viewport }).promise

          const imgDataUrl = canvas.toDataURL('image/jpeg', currentQuality)
          const img = await newPdfDoc.embedJpg(imgDataUrl)

          const pdfPage = newPdfDoc.addPage([viewport.width, viewport.height])
          pdfPage.drawImage(img, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          })
        }

        const pdfBytes = await newPdfDoc.save({ useObjectStreams: false })
        finalBlob = new Blob([pdfBytes as any], { type: 'application/pdf' })
        
        if (targetSize && finalBlob.size > targetSize) {
           currentScale -= 0.3
           currentQuality -= 0.2
           attempts++
           // Floor values to prevent unreadable output
           if (currentScale < 0.6) currentScale = 0.6
           if (currentQuality < 0.2) currentQuality = 0.2
        } else {
           // Either hit target or no target specified
           break
        }
      }

      if (!finalBlob) throw new Error("Compression failed")

      setResultUrl(URL.createObjectURL(finalBlob))
      setResultSize(finalBlob.size)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg('Something went wrong. Make sure the PDF is not password protected.')
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processPdf(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processPdf(file)
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    setResultUrl(null)
    setOriginalSize(0)
    setResultSize(0)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Tool Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
        <p className="text-blue-100 text-sm">
          Target size: <strong className="text-white">
            {config.maxKB
              ? config.maxKB >= 1024
                ? `${config.maxKB / 1024} MB`
                : `${config.maxKB} KB`
              : 'Custom'}
          </strong> — Free, instant, no signup
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Upload Zone */}
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
              Drop your PDF here or click to upload
            </p>
            <p className="text-sm text-gray-400">Up to 50MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Processing State */}
        {status === 'processing' && (
          <div className="text-center py-10">
            <RefreshCw className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-gray-700">Compressing your PDF...</p>
            <p className="text-sm text-gray-400 mt-1">This might take a few seconds</p>
          </div>
        )}

        {/* Error State */}
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

        {/* Done State */}
        {status === 'done' && resultUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">PDF compressed successfully!</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Original Size</p>
                <p className="font-semibold text-gray-800">{formatBytes(originalSize)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Reduction</p>
                <p className="font-semibold text-green-600">
                  {Math.round((1 - resultSize / originalSize) * 100)}%
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-500 mb-1">New Size</p>
                <p className="font-semibold text-blue-700">{formatBytes(resultSize)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href={resultUrl}
                download={`compressed-${originalFile?.name || 'document.pdf'}`}
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
