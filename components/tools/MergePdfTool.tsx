'use client'
import { useState, useCallback, useRef } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config: {
    format?: string
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function MergePdfTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [files, setFiles] = useState<File[]>([])
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processPdfs = async (filesList: File[]) => {
    if (filesList.length < 2) {
      setErrorMsg('Please upload at least 2 PDF files to merge.')
      setStatus('error')
      return
    }

    if (filesList.some(f => f.type !== 'application/pdf')) {
      setErrorMsg('Please ensure all files are valid PDFs.')
      setStatus('error')
      return
    }

    setStatus('processing')
    setErrorMsg('')

    try {
      const mergedPdf = await PDFDocument.create()
      
      for (const file of filesList) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page)
        })
      }

      const pdfBytes = await mergedPdf.save()
      const resultBlob = new Blob([pdfBytes as any], { type: 'application/pdf' })

      setResultUrl(URL.createObjectURL(resultBlob))
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg('Something went wrong merging your PDFs. Make sure they are not password protected.')
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles)
      processPdfs(selectedFiles)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const selectedFiles = Array.from(e.dataTransfer.files || [])
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles)
      processPdfs(selectedFiles)
    }
  }, [])

  const handleReset = () => {
    setStatus('idle')
    setFiles([])
    setResultUrl(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
        <p className="text-blue-100 text-sm">
          Target: <strong className="text-white">Merge Multiple PDFs</strong> — Client-side merging
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
              Select multiple PDFs to merge
            </p>
            <p className="text-sm text-gray-400">Hold Ctrl or Cmd to select multiple files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {status === 'processing' && (
          <div className="text-center py-10">
            <RefreshCw className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-gray-700">Merging PDFs...</p>
            <p className="text-sm text-gray-400 mt-1">Stitching {files.length} documents together</p>
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
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Successfully merged {files.length} PDFs!</span>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-600 mb-2">Files merged:</p>
              <ul className="space-y-1">
                {files.map((file, i) => (
                  <li key={i} className="flex flex-row items-center gap-2 text-xs text-gray-500">
                    <FileText className="w-3 h-3 text-gray-400" />
                    <span className="truncate">{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 mt-4">
              <a
                href={resultUrl}
                download="merged-document.pdf"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Merged PDF
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
