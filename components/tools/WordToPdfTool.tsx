'use client'
import { useState, useCallback, useRef } from 'react'
import { Upload, Download, RefreshCw, FileText, CheckCircle, AlertCircle, ShieldCheck, Cpu, Share2 } from 'lucide-react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

interface Props {
  config: {
    format?: string
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function WordToPdfTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('document')
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4')
  const [margin, setMargin] = useState<'normal' | 'narrow' | 'wide'>('normal')
  const [fontFamily, setFontFamily] = useState<'Helvetica' | 'Courier' | 'TimesRoman'>('Helvetica')
  const [fontSize, setFontSize] = useState<number>(12)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number>(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle uploaded text file
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (extension !== 'txt' && extension !== 'docx' && extension !== 'doc') {
      setErrorMsg('Please upload a valid text file (.txt). For Word docs, you can copy-paste the text directly.')
      setStatus('error')
      return
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''))
    setStatus('processing')
    setErrorMsg('')

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const textContent = e.target?.result as string
        setText(textContent)
        setStatus('idle')
      }
      reader.readAsText(file)
    } catch (e: any) {
      setErrorMsg('Failed to read the file content.')
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  // Generate PDF from text with wrapping & pagination
  const generatePdf = async () => {
    if (!text.trim()) {
      setErrorMsg('Please write or upload some text to convert to PDF.')
      setStatus('error')
      return
    }

    setStatus('processing')
    setErrorMsg('')

    try {
      const pdfDoc = await PDFDocument.create()
      
      // Page size configuration
      const pageDims = {
        A4: { width: 595.27, height: 841.89 },
        Letter: { width: 612, height: 792 }
      }[pageSize]

      // Margin configuration
      const marginSize = {
        normal: 50,
        narrow: 25,
        wide: 75
      }[margin]

      // Font configuration
      const fontMap = {
        Helvetica: StandardFonts.Helvetica,
        Courier: StandardFonts.Courier,
        TimesRoman: StandardFonts.TimesRoman
      }
      const font = await pdfDoc.embedFont(fontMap[fontFamily])

      const printableWidth = pageDims.width - 2 * marginSize
      const printableHeight = pageDims.height - 2 * marginSize
      const lineHeight = fontSize * 1.25

      // Line wrapping algorithm
      const paragraphs = text.split(/\r?\n/)
      const lines: string[] = []

      for (const para of paragraphs) {
        if (para.trim() === '') {
          lines.push('') // Empty line for spacing
          continue
        }

        const words = para.split(/\s+/)
        let currentLine = ''

        for (const word of words) {
          const testLine = currentLine === '' ? word : `${currentLine} ${word}`
          const textWidth = font.widthOfTextAtSize(testLine, fontSize)
          
          if (textWidth > printableWidth) {
            lines.push(currentLine)
            currentLine = word
          } else {
            currentLine = testLine
          }
        }
        if (currentLine !== '') {
          lines.push(currentLine)
        }
      }

      // Add lines to pages
      let page = pdfDoc.addPage([pageDims.width, pageDims.height])
      let y = pageDims.height - marginSize

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Check if page height boundary is reached
        if (y - lineHeight < marginSize) {
          page = pdfDoc.addPage([pageDims.width, pageDims.height])
          y = pageDims.height - marginSize
        }

        if (line !== '') {
          page.drawText(line, {
            x: marginSize,
            y: y - fontSize,
            size: fontSize,
            font: font,
            color: rgb(0.1, 0.1, 0.1)
          })
        }
        y -= lineHeight
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      setResultUrl(url)
      setResultSize(pdfBytes.length)
      setStatus('done')
    } catch (e: any) {
      console.error(e)
      setErrorMsg('Failed to compile PDF. Ensure correct text format.')
      setStatus('error')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const triggerReset = () => {
    setText('')
    setResultUrl(null)
    setResultSize(0)
    setStatus('idle')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleShare = async () => {
    if (!resultUrl) return
    try {
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const file = new File([blob], `${fileName}.pdf`, { type: 'application/pdf' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My PDF Document - SizeSnap',
          text: 'I converted my text to PDF using SizeSnap.in!',
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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6">
      {status === 'idle' && (
        <div className="space-y-6">
          {/* File Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                : 'border-gray-300 hover:border-blue-400 bg-gray-50/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-700">Upload Text File (.txt) or Paste Text Below</p>
                <p className="text-xs text-gray-500 mt-1">Drag and drop file here, or click to browse</p>
              </div>
            </div>
          </div>

          {/* Text Area Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Write or Paste Your Document Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing your document text here or paste your Word/text content..."
              className="w-full min-h-[220px] p-4 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm font-sans"
            />
          </div>

          {/* Layout Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
              >
                <option value="A4">A4 (Standard)</option>
                <option value="Letter">US Letter</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Margins</label>
              <select
                value={margin}
                onChange={(e) => setMargin(e.target.value as any)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
              >
                <option value="normal">Normal (50pt)</option>
                <option value="narrow">Narrow (25pt)</option>
                <option value="wide">Wide (75pt)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Font Style</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
              >
                <option value="Helvetica">Sans-Serif (Helvetica)</option>
                <option value="TimesRoman">Serif (Times Roman)</option>
                <option value="Courier">Monospace (Courier)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
              >
                <option value={10}>Small (10pt)</option>
                <option value={12}>Medium (12pt)</option>
                <option value={14}>Large (14pt)</option>
                <option value={16}>Extra Large (16pt)</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={generatePdf}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-5 h-5" />
            Convert to PDF Now
          </button>
        </div>
      )}

      {/* Processing State */}
      {status === 'processing' && (
        <div className="py-12 flex flex-col items-center justify-center gap-4">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
          <div className="text-center">
            <h3 className="font-bold text-gray-800">Generating PDF Document</h3>
            <p className="text-sm text-gray-500 mt-1">formatting pages, wrapping lines and drawing text locally...</p>
          </div>
        </div>
      )}

      {/* Done State */}
      {status === 'done' && resultUrl && (
        <div className="py-6 space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-green-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">PDF Created Successfully!</h3>
            <p className="text-sm text-gray-500 mt-1">Your document has been compiled and is ready for download.</p>
          </div>

          <div className="max-w-md mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-gray-500">File Name:</span>
              <span className="font-semibold text-gray-800">{fileName}.pdf</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Output Format:</span>
              <span className="font-semibold text-gray-800">PDF Document</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">File Size:</span>
              <span className="font-semibold text-gray-800">{formatSize(resultSize)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <a
              href={resultUrl}
              download={`${fileName}.pdf`}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
            <button
              onClick={handleShare}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Share / Send
            </button>
            <button
              onClick={triggerReset}
              className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="py-8 space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Conversion Failed</h3>
            <p className="text-sm text-gray-500 mt-1">{errorMsg}</p>
          </div>
          <button
            onClick={triggerReset}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Privacy Notice footer inside tool container */}
      <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>100% Secure Client-Side Conversion (No server uploads)</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-500" />
          <span>Powered by local browser compilation</span>
        </div>
      </div>
    </div>
  )
}
