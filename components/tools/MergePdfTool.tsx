'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileText, Trash2, ArrowUp, ArrowDown, Plus, ShieldCheck, Cpu } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config: {
    format?: string
  }
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'

interface PdfFileItem {
  id: string
  file: File
  sizeBytes: number
  pageCount: number
}

export default function MergePdfTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [pdfList, setPdfList] = useState<PdfFileItem[]>([])
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number>(0)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [pdfName, setPdfName] = useState('merged-document')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const appendInputRef = useRef<HTMLInputElement>(null)

  // Load and read PDF information (page count)
  const readPdfDetails = async (file: File): Promise<{ pageCount: number }> => {
    try {
      const buffer = await file.arrayBuffer()
      const doc = await PDFDocument.load(buffer, { updateMetadata: false })
      return { pageCount: doc.getPageCount() }
    } catch (e) {
      console.error(e)
      throw new Error(`File "${file.name}" is password-protected or not a valid PDF.`)
    }
  }

  // Handle uploaded files
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setStatus('processing')
    setErrorMsg('')

    const list: PdfFileItem[] = []
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
          continue // skip non-PDFs
        }
        const { pageCount } = await readPdfDetails(file)
        list.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          sizeBytes: file.size,
          pageCount
        })
      }

      if (list.length === 0 && pdfList.length === 0) {
        throw new Error('No valid PDF files found. Please upload .pdf files.')
      }

      setPdfList(prev => [...prev, ...list])
      setStatus('editing')
    } catch (e: any) {
      setErrorMsg(e.message || 'Error loading PDF files.')
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files)
  }

  const handleAppendFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files)
    if (appendInputRef.current) appendInputRef.current.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfList])

  // Item shifting
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= pdfList.length) return
    const list = [...pdfList]
    const temp = list[index]
    list[index] = list[targetIdx]
    list[targetIdx] = temp
    setPdfList(list)
  }

  const removeItem = (id: string) => {
    const list = pdfList.filter(x => x.id !== id)
    setPdfList(list)
    if (list.length === 0) {
      setStatus('idle')
    }
  }

  // Merge execution
  const mergePdfs = async () => {
    if (pdfList.length < 2) {
      setErrorMsg('Please upload at least 2 PDF files to merge.')
      setStatus('error')
      return
    }

    setStatus('processing')
    setErrorMsg('')

    try {
      const mergedPdf = await PDFDocument.create()

      for (const item of pdfList) {
        const arrayBuffer = await item.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page)
        })
      }

      const pdfBytes = await mergedPdf.save()
      const resultBlob = new Blob([pdfBytes as any], { type: 'application/pdf' })

      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultUrl(URL.createObjectURL(resultBlob))
      setResultSize(resultBlob.size)
      setStatus('done')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Something went wrong merging your PDFs. Make sure they are not encrypted.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setPdfList([])
    setStatus('idle')
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setResultSize(0)
    setErrorMsg('')
    setPdfName('merged-document')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [resultUrl])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">PDF Stitcher & Merger</h3>
          <p className="text-blue-100 text-xs mt-1">Combine two or more PDF documents into a single file instantly.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Client-Side
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Upload box */}
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50/30'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base mb-1">
              Select or Drop PDF Files
            </h4>
            <p className="text-xs text-gray-500">Upload at least 2 PDF files. Hold Ctrl/Cmd key to choose multiple.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose PDF Files
            </button>

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

        {/* State 2: Merge Editor Workspace */}
        {status === 'editing' && pdfList.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: List of PDFs */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Selected Documents ({pdfList.length})
                  </span>
                  <button 
                    onClick={() => appendInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add More PDFs
                  </button>
                  <input
                    ref={appendInputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={handleAppendFile}
                  />
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {pdfList.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-150 rounded-xl hover:bg-gray-100/50 transition-all">
                      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 flex-shrink-0 text-indigo-600">
                        <FileText className="w-6 h-6 stroke-1.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate leading-tight">
                          {item.file.name}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Pages: <span className="font-semibold text-gray-600">{item.pageCount}</span> • Size: <span className="font-semibold text-gray-600">{(item.sizeBytes / 1024).toFixed(0)} KB</span>
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveItem(idx, 'up')}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === pdfList.length - 1}
                          onClick={() => moveItem(idx, 'down')}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all ml-1"
                          title="Remove PDF"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Configurations */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-4 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                    Output configuration
                  </span>

                  {/* Output Filename */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Output PDF Name:</label>
                    <input
                      type="text"
                      value={pdfName}
                      onChange={e => setPdfName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                      placeholder="merged-document"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Details stats summary */}
                  <div className="text-xs text-gray-500 space-y-1.5 pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span>Total PDF Files:</span>
                      <span className="font-semibold text-gray-700">{pdfList.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Combined Pages:</span>
                      <span className="font-semibold text-gray-700">
                        {pdfList.reduce((acc, curr) => acc + curr.pageCount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Size:</span>
                      <span className="font-semibold text-gray-700">
                        {(pdfList.reduce((acc, curr) => acc + curr.sizeBytes, 0) / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={mergePdfs}
                disabled={pdfList.length < 2}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:pointer-events-none transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Merge PDFs Now
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* State 3: Stitching Process Screen */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Stitching layers & copying indexing tables...</h4>
            <p className="text-xs text-gray-500 mt-1">Stitching document components locally in memory.</p>
          </div>
        )}

        {/* State 4: Error Screen */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Merge Operation Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 5: Done & Download */}
        {status === 'done' && resultUrl && (
          <div className="space-y-6 animate-fadeIn">
            {/* Success Alert */}
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">PDF documents merged successfully!</span>
            </div>

            {/* Document display stats */}
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 max-w-md mx-auto">
              <FileText className="w-16 h-16 text-indigo-600 animate-bounce" />
              <h4 className="font-bold text-gray-800 text-sm mt-2">{pdfName}.pdf</h4>
              <p className="text-xs text-gray-400">
                Final Size: <span className="font-extrabold text-gray-700">{(resultSize / (1024 * 1024)).toFixed(2)} MB</span> • Total Pages: {pdfList.reduce((acc, curr) => acc + curr.pageCount, 0)}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultUrl}
                download={`${pdfName}.pdf`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <Download className="w-5 h-5" />
                Download Merged PDF
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Merge More
              </button>
            </div>
          </div>
        )}

        {/* Security badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client-Side logic:</strong> PDF compilation runs 100% locally.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Privacy Guaranteed:</strong> SizeSnap never uploads documents to any server.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
