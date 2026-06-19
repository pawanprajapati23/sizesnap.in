'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, ShieldCheck, Cpu, ArrowUp, ArrowDown, Trash2, Plus, FileText } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config: {
    format?: string
  }
}

type Status = 'idle' | 'editing' | 'processing' | 'done' | 'error'

interface ImageFileItem {
  id: string
  file: File
  previewUrl: string
  width: number
  height: number
}

export default function ImageToPdfTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [imageList, setImageList] = useState<ImageFileItem[]>([])
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number>(0)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [pdfName, setPdfName] = useState('compiled-document')

  // Configurations
  const [pageSize, setPageSize] = useState<'fit' | 'a4' | 'letter'>('fit')
  const [margin, setMargin] = useState<'none' | 'thin' | 'wide'>('none')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const appendInputRef = useRef<HTMLInputElement>(null)

  // Read dimensions and load image helper
  const loadImageDetails = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Invalid image file'))
      }
      img.src = url
    })
  }

  // Handle uploaded files
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setStatus('processing')
    setErrorMsg('')

    const list: ImageFileItem[] = []
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) {
          continue // skip non-images
        }
        const { width, height } = await loadImageDetails(file)
        list.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
          width,
          height
        })
      }

      if (list.length === 0) {
        throw new Error('No valid image files found. Please select JPG, PNG or WEBP.')
      }

      setImageList(prev => [...prev, ...list])
      setStatus('editing')
    } catch (e: any) {
      setErrorMsg(e.message || 'Error processing images.')
      setStatus('error')
    }
  }

  // File selection triggers
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
  }, [])

  // Item list adjustments
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= imageList.length) return
    const list = [...imageList]
    const temp = list[index]
    list[index] = list[nextIndex]
    list[nextIndex] = temp
    setImageList(list)
  }

  const removeItem = (id: string) => {
    const target = imageList.find(x => x.id === id)
    if (target) URL.revokeObjectURL(target.previewUrl)
    const list = imageList.filter(x => x.id !== id)
    setImageList(list)
    if (list.length === 0) {
      setStatus('idle')
    }
  }

  // Create PDF function
  const compilePdf = async () => {
    if (imageList.length === 0) return
    setStatus('processing')

    try {
      const pdfDoc = await PDFDocument.create()

      for (const item of imageList) {
        let arrayBuffer = await item.file.arrayBuffer()
        let embeddedImage

        // pdf-lib supports JPG/PNG directly. If WEBP/GIF, convert to JPG first via temporary canvas.
        const isJpg = item.file.type === 'image/jpeg' || item.file.type === 'image/jpg'
        const isPng = item.file.type === 'image/png'

        if (isJpg) {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer)
        } else if (isPng) {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer)
        } else {
          // Convert using HTML Image/Canvas
          const img = new Image()
          img.src = item.previewUrl
          await new Promise(res => { img.onload = res })
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')!
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)

          const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.95))
          if (!blob) throw new Error('Format conversion failed')
          arrayBuffer = await blob.arrayBuffer()
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer)
        }

        // Configure Page Dimensions
        // A4: 595.27 x 841.89 points
        // Letter: 612 x 792 points
        let pageWidth = embeddedImage.width
        let pageHeight = embeddedImage.height

        if (pageSize === 'a4') {
          pageWidth = 595.27
          pageHeight = 841.89
        } else if (pageSize === 'letter') {
          pageWidth = 612
          pageHeight = 792
        }

        const marginPoints = margin === 'thin' ? 20 : margin === 'wide' ? 40 : 0
        const usableWidth = pageWidth - marginPoints * 2
        const usableHeight = pageHeight - marginPoints * 2

        // Compute scaling ratio
        const scale = Math.min(usableWidth / embeddedImage.width, usableHeight / embeddedImage.height)
        const drawW = embeddedImage.width * scale
        const drawH = embeddedImage.height * scale

        // Center on page
        const xOffset = marginPoints + (usableWidth - drawW) / 2
        const yOffset = marginPoints + (usableHeight - drawH) / 2

        const page = pdfDoc.addPage([pageWidth, pageHeight])
        page.drawImage(embeddedImage, {
          x: xOffset,
          y: yOffset,
          width: drawW,
          height: drawH
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })

      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultUrl(URL.createObjectURL(blob))
      setResultSize(blob.size)
      setStatus('done')
    } catch (e: any) {
      console.error(e)
      setErrorMsg(e.message || 'Something went wrong rendering the document.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    imageList.forEach(x => URL.revokeObjectURL(x.previewUrl))
    setImageList([])
    setStatus('idle')
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setResultSize(0)
    setErrorMsg('')
    setPdfName('compiled-document')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      imageList.forEach(x => URL.revokeObjectURL(x.previewUrl))
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Multi-Image to PDF Converter</h3>
          <p className="text-blue-100 text-xs mt-1">Merge photos, scan pages, or notes into a single clean PDF document.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto uppercase">
          Client-Side Safe
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: Dropzone Upload */}
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
              Select or Drop Images
            </h4>
            <p className="text-xs text-gray-500">Upload multiple files (JPG, PNG, WEBP). They compile in order.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose Images
            </button>

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

        {/* State 2: Editor - Reorder & Configure */}
        {status === 'editing' && imageList.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left side: Upload list */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Pages list ({imageList.length})
                  </span>
                  <button 
                    onClick={() => appendInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Images
                  </button>
                  <input
                    ref={appendInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAppendFile}
                  />
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {imageList.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-150 rounded-xl hover:bg-gray-100/50 transition-all">
                      
                      {/* Thumbnail */}
                      <div className="w-12 h-16 bg-white border border-gray-200 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.previewUrl} alt="thumbnail" className="max-w-full max-h-full object-contain" />
                      </div>

                      {/* File Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate leading-tight">
                          {item.file.name}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {item.width} x {item.height} px • {(item.file.size / 1024).toFixed(0)} KB
                        </p>
                      </div>

                      {/* Reordering Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveItem(idx, 'up')}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === imageList.length - 1}
                          onClick={() => moveItem(idx, 'down')}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all ml-1"
                          title="Remove page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side: Options configuration */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-4 shadow-inner">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                    Document settings
                  </span>

                  {/* Output Document Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Output PDF Filename:</label>
                    <input
                      type="text"
                      value={pdfName}
                      onChange={e => setPdfName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                      placeholder="compiled-document"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Page Size Presets */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 block">Page Size Format:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPageSize('fit')}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          pageSize === 'fit' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        Fit Image
                      </button>
                      <button
                        onClick={() => setPageSize('a4')}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          pageSize === 'a4' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        A4
                      </button>
                      <button
                        onClick={() => setPageSize('letter')}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          pageSize === 'letter' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        Letter
                      </button>
                    </div>
                  </div>

                  {/* Page Margins Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 block">Margins:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setMargin('none')}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          margin === 'none' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        None
                      </button>
                      <button
                        onClick={() => setMargin('thin')}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          margin === 'thin' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        Thin
                      </button>
                      <button
                        onClick={() => setMargin('wide')}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all text-center ${
                          margin === 'wide' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        Wide
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={compilePdf}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Compile to PDF Document
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

        {/* State 3: Generating Screen */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Embedding graphics & building structure...</h4>
            <p className="text-xs text-gray-500 mt-1">Generating standard vector pages locally.</p>
          </div>
        )}

        {/* State 4: Error Screen */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">PDF Compilation Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset Tool
            </button>
          </div>
        )}

        {/* State 5: Done and Download */}
        {status === 'done' && resultUrl && (
          <div className="space-y-6 animate-fadeIn">
            {/* Success Alert */}
            <div className="flex items-center gap-3 text-green-800 bg-green-50/60 border border-green-100 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">PDF compiled successfully with {imageList.length} pages!</span>
            </div>

            {/* Document display stats */}
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 max-w-md mx-auto">
              <FileText className="w-16 h-16 text-indigo-600 animate-bounce" />
              <h4 className="font-bold text-gray-800 text-sm mt-2">{pdfName}.pdf</h4>
              <p className="text-xs text-gray-400">
                Size: <span className="font-extrabold text-gray-700">{(resultSize / (1024 * 1024)).toFixed(2)} MB</span> • Pages: {imageList.length}
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
                Download PDF Document
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Create Another
              </button>
            </div>
          </div>
        )}

        {/* Security badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client-Side logic:</strong> Compilation runs entirely in your sandbox memory.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>Zero upload logs:</strong> SizeSnap never sends document assets to any server.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
