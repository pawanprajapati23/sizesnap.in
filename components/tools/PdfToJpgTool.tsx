'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage } from 'lucide-react'

// Due to constraints, we might dynamically import pdfjs to avoid SSR issues
let pdfjsLib: any
if (typeof window !== 'undefined') {
  // @ts-ignore
  import('pdfjs-dist/build/pdf.mjs').then(mod => {
    pdfjsLib = mod
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`
  })
}

interface Props {
  config: any
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function PdfToJpgTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [results, setResults] = useState<{url: string, size: number}[]>([])
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processPdf = async (file: File) => {
    setStatus('processing')
    setErrorMsg('')
    setProgress(0)

    try {
      if (!pdfjsLib) {
         // @ts-ignore
         pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')
         pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`
      }

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer))
      const pdf = await loadingTask.promise
      
      const numPages = pdf.numPages
      const processed: {url: string, size: number}[] = []

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2.0 }) // High res
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }

        await page.render(renderContext).promise

        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.9))
        if (blob) {
           processed.push({
             url: URL.createObjectURL(blob),
             size: blob.size
           })
        }

        setProgress(Math.round((i / numPages) * 100))
      }

      setResults(processed)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg('Could not extract PDF pages. Please ensure it is a valid PDF.')
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

  const handleReset = () => {
    setStatus('idle')
    setResults([])
    setErrorMsg('')
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-5 py-4 flex items-center justify-between">
        <p className="text-red-100 text-sm">
          Target: <strong className="text-white">JPG Images</strong> 
        </p>
        <FileImage className="w-5 h-5 text-red-100" />
      </div>

      <div className="p-5 space-y-4">
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 text-orange-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 mb-1">
              Select PDF document
            </p>
            <p className="text-sm text-gray-400">Pages will be converted to JPG</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {status === 'processing' && (
          <div className="text-center py-10">
            <RefreshCw className="w-10 h-10 text-orange-500 mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-gray-700 mb-2">Extracting pages...</p>
            <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}%</p>
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

        {status === 'done' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Extracted {results.length} pages successfully!</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
               {results.map((r, i) => (
                 <div key={i} className="flex flex-col bg-gray-50 rounded shadow-sm border border-gray-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.url} alt={`Page ${i+1}`} className="w-full aspect-auto border-b border-gray-200 bg-white" />
                    <div className="p-2 flex items-center justify-between bg-white text-xs">
                      <span className="font-mono text-gray-500">Page {i+1}</span>
                      <a href={r.url} download={`page-${i+1}.jpg`} className="text-orange-600 hover:text-orange-800 font-bold p-1 bg-orange-50 rounded">
                        <Download className="w-3 h-3" />
                      </a>
                    </div>
                 </div>
               ))}
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium flex justify-center"
            >
               Convert Another PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
