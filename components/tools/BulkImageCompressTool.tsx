'use client'
import { useState, useCallback, useRef } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Play } from 'lucide-react'

interface Props {
  config: any
}

type Status = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

export default function BulkImageCompressTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<{name: string, url: string, size: number}[]>([])
  const [targetKb, setTargetKb] = useState('50')
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files).slice(0, 20))
      setStatus('uploading')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files).slice(0, 20))
      setStatus('uploading')
    }
  }, [])

  const processBulk = async () => {
    setStatus('processing')
    setProgress(0)
    setErrorMsg('')
    const processed: {name: string, url: string, size: number}[] = []
    
    const kb = parseFloat(targetKb) || 50

    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const img = new Image()
        img.src = URL.createObjectURL(file)
        await new Promise(res => { img.onload = res })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        let quality = 0.9
        let blob: Blob | null = null

        const getBlob = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q))

        let low = 0.1
        let high = 0.95
        
        for (let i = 0; i < 7; i++) {
          quality = (low + high) / 2
          blob = await getBlob(quality)
          if (!blob) break
          if (blob.size / 1024 > kb) {
            high = quality
          } else {
            low = quality
          }
        }

        if (blob) {
          processed.push({
            name: file.name,
            url: URL.createObjectURL(blob),
            size: blob.size
          })
        }
        
        setProgress(Math.round(((index + 1) / files.length) * 100))
      }

      setResults(processed)
      setStatus('done')
    } catch (err) {
      setErrorMsg('Error processing batch. Some files may be corrupted.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setFiles([])
    setResults([])
    setErrorMsg('')
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 flex items-center justify-between">
        <p className="text-blue-100 text-sm">
          Target: <strong className="text-white">Batch Compress</strong> 
        </p>
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
              Select multiple photos
            </p>
            <p className="text-sm text-gray-400">Up to 20 images (JPG, PNG)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {status === 'uploading' && (
          <div className="py-6 text-center space-y-4">
             <p className="font-semibold text-gray-700">{files.length} files selected</p>
             <div className="flex justify-center flex-col max-w-xs mx-auto gap-2">
               <label className="text-sm text-gray-600 font-medium text-left">Target Size (KB)</label>
               <input
                 type="number"
                 className="p-3 border border-gray-300 rounded font-mono"
                 value={targetKb}
                 onChange={e => setTargetKb(e.target.value)}
                 min="1"
                 max="1000"
               />
               <button
                 onClick={processBulk}
                 className="mt-2 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
               >
                 <Play className="w-4 h-4" /> Start Compression
               </button>
             </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="text-center py-10">
            <RefreshCw className="w-10 h-10 text-indigo-500 mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-gray-700 mb-2">Compressing {files.length} files...</p>
            <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
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
              <span className="text-sm font-medium">Compress finished!</span>
            </div>

            <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-3 max-h-60 overflow-y-auto">
               {results.map((r, i) => (
                 <div key={i} className="flex items-center justify-between bg-white p-3 rounded shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-700 truncate w-2/3">{r.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-mono">{(r.size / 1024).toFixed(1)} KB</span>
                      <a href={r.url} download={r.name} className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-1.5 rounded">
                        <Download className="w-3 h-3 " />
                      </a>
                    </div>
                 </div>
               ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex-1 font-medium"
              >
                Compress More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
