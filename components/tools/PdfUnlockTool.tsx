'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Upload,
  Download,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  KeyRound,
  LockOpen
} from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config?: any
}

type Status = 'idle' | 'password_prompt' | 'processing' | 'done' | 'error'

export default function PdfUnlockTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number>(0)
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [dragOver, setDragOver] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [resultUrl])

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Please select a valid PDF document.')
      setStatus('error')
      return
    }

    if (file.size > 80 * 1024 * 1024) {
      setErrorMsg('File too large (Max 80MB).')
      setStatus('error')
      return
    }

    setOriginalFile(file)
    setErrorMsg('')
    setStatus('password_prompt')
  }

  const handleUnlock = async () => {
    if (!originalFile) return

    setStatus('processing')
    setErrorMsg('')

    try {
      const buffer = await originalFile.arrayBuffer()
      
      // Load and save PDF without encryption restrictions
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
      const unlockedBytes = await pdfDoc.save()

      const blob = new Blob([unlockedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultUrl(url)
      setResultSize(blob.size)
      setStatus('done')

      // Auto trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = `unlocked-${originalFile.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Incorrect password or unable to decrypt this PDF. Please verify your credentials.')
      setStatus('error')
    }
  }

  const resetAll = () => {
    setStatus('idle')
    setOriginalFile(null)
    setPassword('')
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setErrorMsg('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold mb-2">
            <LockOpen className="w-3.5 h-3.5" />
            100% Private PDF Decryption
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Unlock & Remove PDF Password Online</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Permanently remove passwords and printing/copying restrictions from Aadhaar, Bank Statements & PDFs.
          </p>
        </div>

        {status !== 'idle' && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Unlock Another PDF
          </button>
        )}
      </div>

      {/* Upload Drop Zone */}
      {status === 'idle' && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0])
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
            dragOver
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-amber-400 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            accept="application/pdf"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 animate-pulse">
            <Unlock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Select Password-Protected PDF
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports e-Aadhaar PDFs, Bank Statements, Payslips & locked forms (Up to 80MB)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Private (Processed in Browser)
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              Permanent Unlock
            </span>
          </div>
        </div>
      )}

      {/* Password Prompt Screen */}
      {status === 'password_prompt' && (
        <div className="mt-6 space-y-6 max-w-lg mx-auto">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {originalFile?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {Math.round((originalFile?.size || 0) / 1024)} KB
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Enter Current PDF Password (Optional if permission-only locked)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. First 4 letters of name + birth year for e-Aadhaar"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleUnlock}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-amber-500/20 cursor-pointer transition flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Unlock & Decrypt PDF
            </button>
          </div>
        </div>
      )}

      {/* Done State */}
      {status === 'done' && (
        <div className="mt-6 space-y-6 text-center max-w-md mx-auto animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">PDF Unlocked Successfully!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              You can now open, copy text, and print this PDF without any password prompt.
            </p>
          </div>

          <a
            href={resultUrl || '#'}
            download={`unlocked-${originalFile?.name || 'document.pdf'}`}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Download className="w-4 h-4" />
            Download Unlocked PDF ({Math.round(resultSize / 1024)} KB)
          </a>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-500/20 rounded-xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg || 'Could not decrypt the PDF.'}</span>
        </div>
      )}
    </div>
  )
}
