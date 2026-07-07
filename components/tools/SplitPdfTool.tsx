'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, ShieldCheck, Cpu, FileText, Share2, Clipboard } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

type Status = 'idle' | 'loaded' | 'processing' | 'done' | 'error'

export default function SplitPdfTool() {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [selectedPages, setSelectedPages] = useState<boolean[]>([])
  const [rangeText, setRangeText] = useState<string>('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number>(0)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileArrayBuffer = useRef<ArrayBuffer | null>(null)

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [resultUrl])

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Invalid file format. Please upload a valid PDF document.')
      setStatus('error')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg('PDF is too large (Max 100MB).')
      setStatus('error')
      return
    }

    setStatus('processing')
    try {
      const arrayBuffer = await file.arrayBuffer()
      fileArrayBuffer.current = arrayBuffer

      const doc = await PDFDocument.load(arrayBuffer)
      const pagesCount = doc.getPageCount()

      if (pagesCount === 0) {
        throw new Error("This PDF does not contain any pages.")
      }

      setPdfDoc(doc)
      setTotalPages(pagesCount)
      setOriginalFile(file)
      // By default, select the first page
      const initialSelection = new Array(pagesCount).fill(false)
      initialSelection[0] = true
      setSelectedPages(initialSelection)
      setRangeText('1')
      setStatus('loaded')
      setErrorMsg('')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to read PDF file structures.')
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  // Parse page range input (e.g. "1, 2, 4-6")
  const parseRange = (text: string) => {
    setRangeText(text)
    const newSelection = new Array(totalPages).fill(false)
    const parts = text.split(',')

    for (const part of parts) {
      const trimmed = part.trim()
      if (!trimmed) continue

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-')
        const start = parseInt(startStr, 10)
        const end = parseInt(endStr, 10)
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, totalPages))
          const e = Math.max(1, Math.min(end, totalPages))
          const min = Math.min(s, e)
          const max = Math.max(s, e)
          for (let i = min - 1; i < max; i++) {
            newSelection[i] = true
          }
        }
      } else {
        const index = parseInt(trimmed, 10)
        if (!isNaN(index) && index >= 1 && index <= totalPages) {
          newSelection[index - 1] = true
        }
      }
    }
    setSelectedPages(newSelection)
  }

  const togglePageSelection = (index: number) => {
    const nextSelection = [...selectedPages]
    nextSelection[index] = !nextSelection[index]
    setSelectedPages(nextSelection)

    // Reconstruct rangeText string based on selection
    const selectedIndices: number[] = []
    nextSelection.forEach((val, i) => {
      if (val) selectedIndices.push(i + 1)
    })

    if (selectedIndices.length === 0) {
      setRangeText('')
      return
    }

    // Helper to format ranges beautifully
    let rangeStr = ''
    let start = selectedIndices[0]
    let end = selectedIndices[0]

    for (let i = 1; i < selectedIndices.length; i++) {
      if (selectedIndices[i] === end + 1) {
        end = selectedIndices[i]
      } else {
        rangeStr += start === end ? `${start}, ` : `${start}-${end}, `
        start = selectedIndices[i]
        end = selectedIndices[i]
      }
    }
    rangeStr += start === end ? `${start}` : `${start}-${end}`
    setRangeText(rangeStr)
  }

  const extractPages = async () => {
    const indicesToExtract: number[] = []
    selectedPages.forEach((selected, idx) => {
      if (selected) indicesToExtract.push(idx)
    })

    if (indicesToExtract.length === 0) {
      setErrorMsg("Please select at least one page to extract.")
      setStatus('error')
      return
    }

    setStatus('processing')
    try {
      const sourcePdf = await PDFDocument.load(fileArrayBuffer.current!)
      const destinationPdf = await PDFDocument.create()

      const copiedPages = await destinationPdf.copyPages(sourcePdf, indicesToExtract)
      copiedPages.forEach((page) => destinationPdf.addPage(page))

      const pdfBytes = await destinationPdf.save()
      const outputBlob = new Blob([pdfBytes as any], { type: 'application/pdf' })

      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultSize(outputBlob.size)
      setResultUrl(URL.createObjectURL(outputBlob))
      setStatus('done')
      setErrorMsg('')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to split PDF document.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setOriginalFile(null)
    setPdfDoc(null)
    setTotalPages(0)
    setSelectedPages([])
    setRangeText('')
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setResultSize(0)
    setStatus('idle')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleShare = async () => {
    if (!resultUrl || !originalFile) return
    try {
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const file = new File([blob], `split-${originalFile.name}`, { type: 'application/pdf' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Split PDF - SizeSnap',
          text: 'I split and extracted pages from my PDF online locally using SizeSnap.in!',
        })
      } else {
        await navigator.clipboard.writeText("https://sizesnap.in")
        alert("Link copied to clipboard! You can paste and share it with your friends on WhatsApp.")
      }
    } catch (err) {
      console.error("Share failed", err)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-sans">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Split PDF &amp; Extract Pages</h3>
          <p className="text-blue-100 text-xs mt-1">Split multi-page PDF documents locally inside your browser.</p>
        </div>
        {status === 'loaded' && (
          <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
            TOTAL PAGES: <span className="font-extrabold text-amber-300">{totalPages}</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Upload */}
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleUpload(file)
            }}
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base mb-1">Select Multi-page PDF Document</h4>
            <p className="text-xs text-gray-500">Supports PDF documents up to 100MB.</p>
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose PDF File
            </button>
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
          </div>
        )}

        {/* State 2: Processing */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Splitting PDF Catalog...</h4>
            <p className="text-xs text-gray-500 mt-1">Extracting page markers locally in client browser memory.</p>
          </div>
        )}

        {/* State 3: Error */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">Operation Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button onClick={handleReset} className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm">
              Reset and Retry
            </button>
          </div>
        )}

        {/* State 4: Loaded Document Grid Selector */}
        {status === 'loaded' && originalFile && (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 shadow-inner space-y-4">
              <label className="text-xs font-bold text-gray-700 block">
                Enter Custom Page Ranges (e.g. 1-3, 5):
              </label>
              <input
                type="text"
                value={rangeText}
                placeholder="Example: 1, 2, 4-6"
                onChange={e => parseRange(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Pages Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Select Pages to Extract:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[280px] overflow-y-auto p-1">
                {selectedPages.map((selected, idx) => (
                  <div
                    key={idx}
                    onClick={() => togglePageSelection(idx)}
                    className={`border rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative ${
                      selected
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className={`w-8 h-8 mb-1.5 stroke-1.5 ${selected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-xs font-bold ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
                      Page {idx + 1}
                    </span>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {}}
                      className="absolute top-2 right-2 w-3.5 h-3.5 accent-blue-600 cursor-pointer pointer-events-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={extractPages}
                disabled={!selectedPages.some(v => v)}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                  selectedPages.some(v => v)
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Split &amp; Save PDF
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-3.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* State 5: Done */}
        {status === 'done' && resultUrl && originalFile && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="max-w-md mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-slate-50 p-6 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="font-bold text-gray-800 text-sm mb-2">PDF Split Successfully!</h4>
              <p className="text-xs text-gray-500 mb-4">
                Extracted pages: <span className="font-bold text-gray-700">{rangeText}</span>
              </p>
              <div className="bg-white rounded-lg border border-gray-150 p-4 w-full flex justify-between items-center text-left text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-gray-800 font-bold truncate max-w-[200px]">split-{originalFile.name}</p>
                    <p className="text-[10px] text-gray-400 font-normal">{(resultSize / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100 max-w-lg mx-auto">
              <a
                href={resultUrl}
                download={`split-${originalFile.name}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center text-sm"
              >
                <Download className="w-5 h-5" /> Download Split PDF
              </a>
              <button
                onClick={handleShare}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm border-none"
              >
                <Share2 className="w-4 h-4" /> Share / Send
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold text-sm cursor-pointer"
              >
                Start Fresh
              </button>
            </div>
          </div>
        )}

        {/* Security Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client side split:</strong> Performed purely in JavaScript memory cache.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Text elements intact:</strong> Keeps original fonts, structures and metadata vectors.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
