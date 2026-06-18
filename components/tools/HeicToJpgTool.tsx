'use client'
import { useState, useCallback, useRef } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileImage } from 'lucide-react'

// Due to constraints, we might dynamically import heic2any to avoid SSR issues
let heic2any: any
if (typeof window !== 'undefined') {
  // @ts-ignore
  import('heic2any').then(mod => heic2any = mod.default)
}

interface Props {
  config: any
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function HeicToJpgTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = async (file: File) => {
    setStatus('processing')
    setErrorMsg('')

    try {
      if (!heic2any) {
        // @ts-ignore
        heic2any = (await import('heic2any')).default
      }

      const resultBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9
      })
      
      const blob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob

      setFinalFile(blob)
      setResultUrl(URL.createObjectURL(blob))
      setStatus('done')
    } catch (err) {
      setErrorMsg('Could not convert HEIC. Please ensure it is a valid Apple HEIC photo.')
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
    setResultUrl(null)
    setFinalFile(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4 flex items-center justify-between">
        <p className="text-green-100 text-sm">
          Target: <strong className="text-white">JPG Format</strong> 
        </p>
        <FileImage className="w-5 h-5 text-green-200" />
      </div>

      <div className="p-5 space-y-4">
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 mb-1">
              Select HEIC photo
            </p>
            <p className="text-sm text-gray-400">iPhone Photos (.heic)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".heic,image/heic,image/heif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {status === 'processing' && (
          <div className="text-center py-10">
            <RefreshCw className="w-10 h-10 text-green-500 mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-gray-700">Converting from HEIC...</p>
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
              <span className="text-sm font-medium">Converted successfully!</span>
            </div>

            <div className="flex justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
               <div className="w-48 h-auto rounded overflow-hidden shadow">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={resultUrl} alt="Converted" className="w-full h-auto object-cover" />
               </div>
            </div>

            <div className="flex gap-3">
              <a
                href={resultUrl}
                download="converted-image.jpg"
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download JPG
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
