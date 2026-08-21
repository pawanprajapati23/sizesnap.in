'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import FeedbackWidget from './FeedbackWidget'

const ImageResizeTool = dynamic(() => import('@/components/tools/ImageResizeTool'), { ssr: false })
const ImageCompressTool = dynamic(() => import('@/components/tools/ImageCompressTool'), { ssr: false })
const PdfCompressTool = dynamic(() => import('@/components/tools/PdfCompressTool'), { ssr: false })
const ConvertImageTool = dynamic(() => import('@/components/tools/ConvertImageTool'), { ssr: false })
const ImageToPdfTool = dynamic(() => import('@/components/tools/ImageToPdfTool'), { ssr: false })
const MergePdfTool = dynamic(() => import('@/components/tools/MergePdfTool'), { ssr: false })
const PassportPhotoTool = dynamic(() => import('@/components/tools/PassportPhotoTool'), { ssr: false })
const SignatureResizeTool = dynamic(() => import('@/components/tools/SignatureResizeTool'), { ssr: false })
const HeicToJpgTool = dynamic(() => import('@/components/tools/HeicToJpgTool'), { ssr: false })
const BulkImageCompressTool = dynamic(() => import('@/components/tools/BulkImageCompressTool'), { ssr: false })
const PdfToJpgTool = dynamic(() => import('@/components/tools/PdfToJpgTool'), { ssr: false })
const DocumentScannerTool = dynamic(() => import('@/components/tools/DocumentScannerTool'), { ssr: false })
const LiveDocumentScannerTool = dynamic(() => import('@/components/tools/LiveDocumentScannerTool'), { ssr: false })
const WatermarkImageTool = dynamic(() => import('@/components/tools/WatermarkImageTool'), { ssr: false })
const WhatsAppDpTool = dynamic(() => import('@/components/tools/WhatsAppDpTool'), { ssr: false })
const WordToPdfTool = dynamic(() => import('@/components/tools/WordToPdfTool'), { ssr: false })
const SmartAadharPrintTool = dynamic(() => import('@/components/tools/SmartAadharPrintTool'), { ssr: false })
const PassportSuitTool = dynamic(() => import('@/components/tools/PassportSuitTool'), { ssr: false })
const DpiConverterTool = dynamic(() => import('@/components/tools/DpiConverterTool'), { ssr: false })
const CardJoinerTool = dynamic(() => import('@/components/tools/CardJoinerTool'), { ssr: false })
const DocumentEnhancerTool = dynamic(() => import('@/components/tools/DocumentEnhancerTool'), { ssr: false })
const SplitPdfTool = dynamic(() => import('@/components/tools/SplitPdfTool'), { ssr: false })
const BackgroundChangerTool = dynamic(() => import('@/components/tools/BackgroundChangerTool'), { ssr: false })

// Smart AI & New Utilities
const AiBackgroundRemoverTool = dynamic(() => import('@/components/tools/AiBackgroundRemoverTool'), { ssr: false })
const OcrTextExtractorTool = dynamic(() => import('@/components/tools/OcrTextExtractorTool'), { ssr: false })
const PdfProtectTool = dynamic(() => import('@/components/tools/PdfProtectTool'), { ssr: false })
const PdfUnlockTool = dynamic(() => import('@/components/tools/PdfUnlockTool'), { ssr: false })
const PdfRotateTool = dynamic(() => import('@/components/tools/PdfRotateTool'), { ssr: false })
const CropImageTool = dynamic(() => import('@/components/tools/CropImageTool'), { ssr: false })

// 3 Killer Features
const ExamPackGeneratorTool = dynamic(() => import('@/components/tools/ExamPackGeneratorTool'), { ssr: false })
const PassportPrintSheetTool = dynamic(() => import('@/components/tools/PassportPrintSheetTool'), { ssr: false })
const PhotoComplianceCheckerTool = dynamic(() => import('@/components/tools/PhotoComplianceCheckerTool'), { ssr: false })

// SEO King Traffic Magnets
const AgeCalculatorTool = dynamic(() => import('@/components/tools/AgeCalculatorTool'), { ssr: false })
const DimensionResizerTool = dynamic(() => import('@/components/tools/DimensionResizerTool'), { ssr: false })
const PhotoClarifierTool = dynamic(() => import('@/components/tools/PhotoClarifierTool'), { ssr: false })
const SignatureExtractorTool = dynamic(() => import('@/components/tools/SignatureExtractorTool'), { ssr: false })
const PhotoNameDateStamperTool = dynamic(() => import('@/components/tools/PhotoNameDateStamperTool'), { ssr: false })
const PhotoSignatureJoinerTool = dynamic(() => import('@/components/tools/PhotoSignatureJoinerTool'), { ssr: false })
const CertificateIdMergerA4Tool = dynamic(() => import('@/components/tools/CertificateIdMergerA4Tool'), { ssr: false })
const ThumbImpressionResizerTool = dynamic(() => import('@/components/tools/ThumbImpressionResizerTool'), { ssr: false })
const PdfPageNumbererTool = dynamic(() => import('@/components/tools/PdfPageNumbererTool'), { ssr: false })
const SelfAttestationTool = dynamic(() => import('@/components/tools/SelfAttestationTool'), { ssr: false })
const DocumentGrayscaleTool = dynamic(() => import('@/components/tools/DocumentGrayscaleTool'), { ssr: false })

import { useEffect, useRef } from 'react'

export default function ToolWrapper({ toolSlug, config }: { toolSlug: string; config: any }) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically load analytics to ensure zero impact on initial page load size
    import('@/lib/analytics').then(({ trackEvent }) => {
      // 1. Track tool open event asynchronously
      trackEvent('tool_open', { toolSlug, toolName: config?.title || toolSlug })

      // 2. Add an isolated non-blocking click listener to infer successful downloads
      const handleGlobalClick = (e: MouseEvent) => {
        try {
          const target = e.target as HTMLElement
          // If they click anything inside this tool containing the text "Download" or "Save"
          if (
            target &&
            wrapperRef.current?.contains(target) &&
            (target.tagName === 'A' || target.tagName === 'BUTTON') &&
            (target.innerText?.toLowerCase().includes('download') || target.innerText?.toLowerCase().includes('save'))
          ) {
            trackEvent('tool_download', { toolSlug, toolName: config?.title || toolSlug })
          }
        } catch (err) {
          // Silently fail to protect UI
        }
      }

      document.addEventListener('click', handleGlobalClick, { capture: true, passive: true })
      
      return () => {
        document.removeEventListener('click', handleGlobalClick, { capture: true })
      }
    }).catch(() => {})
  }, [toolSlug, config?.title])

  let toolComponent = null
  if (toolSlug === 'resize-image') toolComponent = <ImageResizeTool config={config} />
  else if (toolSlug === 'compress-image') toolComponent = <ImageCompressTool config={config} />
  else if (toolSlug === 'compress-pdf') toolComponent = <PdfCompressTool config={config} />
  else if (toolSlug === 'convert-image') toolComponent = <ConvertImageTool config={config} />
  else if (toolSlug === 'image-to-pdf') toolComponent = <ImageToPdfTool config={config} />
  else if (toolSlug === 'merge-pdf') toolComponent = <MergePdfTool config={config} />
  else if (toolSlug === 'passport-photo') toolComponent = <PassportPhotoTool config={config} />
  else if (toolSlug === 'signature-resize') toolComponent = <SignatureResizeTool config={config} />
  else if (toolSlug === 'heic-to-jpg') toolComponent = <HeicToJpgTool config={config} />
  else if (toolSlug === 'bulk-image-compress') toolComponent = <BulkImageCompressTool config={config} />
  else if (toolSlug === 'pdf-to-jpg') toolComponent = <PdfToJpgTool config={config} />
  else if (toolSlug === 'document-scanner') toolComponent = <DocumentScannerTool config={config} />
  else if (toolSlug === 'watermark-image') toolComponent = <WatermarkImageTool config={config} />
  else if (toolSlug === 'whatsapp-dp') toolComponent = <WhatsAppDpTool config={config} />
  else if (toolSlug === 'word-to-pdf') toolComponent = <WordToPdfTool config={config} />
  else if (toolSlug === 'dpi-converter') toolComponent = <DpiConverterTool config={config} />
  else if (toolSlug === 'card-joiner') toolComponent = <CardJoinerTool config={config} />
  else if (toolSlug === 'postcard-photo') toolComponent = <PassportPhotoTool config={config} />
  else if (toolSlug === 'document-enhancer') toolComponent = <DocumentEnhancerTool config={config} />
  else if (toolSlug === 'split-pdf') toolComponent = <SplitPdfTool />
  else if (toolSlug === 'background-changer' || toolSlug === 'ai-background-remover') {
    toolComponent = <AiBackgroundRemoverTool config={config} />
  } else if (toolSlug === 'ocr-text-extractor' || toolSlug === 'image-to-text') {
    toolComponent = <OcrTextExtractorTool config={config} />
  } else if (toolSlug === 'pdf-protect' || toolSlug === 'protect-pdf') {
    toolComponent = <PdfProtectTool config={config} />
  } else if (toolSlug === 'pdf-unlock' || toolSlug === 'unlock-pdf') {
    toolComponent = <PdfUnlockTool config={config} />
  } else if (toolSlug === 'pdf-rotate' || toolSlug === 'rotate-pdf') {
    toolComponent = <PdfRotateTool />
  } else if (toolSlug === 'crop-image' || toolSlug === 'circle-crop') {
    toolComponent = <CropImageTool config={config} />
  } else if (toolSlug === 'exam-pack-generator' || toolSlug === 'sarkari-exam-pack') {
    toolComponent = <ExamPackGeneratorTool config={config} />
  } else if (toolSlug === 'passport-print-sheet' || toolSlug === 'passport-sheet-maker') {
    toolComponent = <PassportPrintSheetTool />
  } else if (toolSlug === 'photo-compliance-checker' || toolSlug === 'photo-validator') {
    toolComponent = <PhotoComplianceCheckerTool />
  } else if (toolSlug === 'age-calculator' || toolSlug === 'sarkari-age-calculator') {
    toolComponent = <AgeCalculatorTool config={config} />
  } else if (toolSlug === 'dimension-resizer' || toolSlug === 'cm-resizer') {
    toolComponent = <DimensionResizerTool config={config} />
  } else if (toolSlug === 'photo-clarifier' || toolSlug === 'unblur-photo' || toolSlug === 'enhance-document') {
    toolComponent = <PhotoClarifierTool config={config} />
  } else if (toolSlug === 'signature-extractor' || toolSlug === 'transparent-signature') {
    toolComponent = <SignatureExtractorTool config={config} />
  } else if (toolSlug === 'photo-name-date' || toolSlug === 'add-name-date-stamp') {
    toolComponent = <PhotoNameDateStamperTool config={config} />
  } else if (toolSlug === 'photo-signature-joiner' || toolSlug === 'photo-sign-joint') {
    toolComponent = <PhotoSignatureJoinerTool config={config} />
  } else if (toolSlug === 'marksheet-id-merger' || toolSlug === 'combine-documents-a4') {
    toolComponent = <CertificateIdMergerA4Tool config={config} />
  } else if (toolSlug === 'thumb-resizer' || toolSlug === 'thumb-impression-resizer') {
    toolComponent = <ThumbImpressionResizerTool config={config} />
  } else if (toolSlug === 'pdf-page-numberer' || toolSlug === 'add-page-numbers-to-pdf') {
    toolComponent = <PdfPageNumbererTool config={config} />
  } else if (toolSlug === 'self-attestation' || toolSlug === 'self-attested-document') {
    toolComponent = <SelfAttestationTool config={config} />
  } else if (toolSlug === 'document-grayscale' || toolSlug === 'black-and-white-document') {
    toolComponent = <DocumentGrayscaleTool config={config} />
  } else if (toolSlug === 'live-document-scanner' || toolSlug === 'camscanner-clone') {
    toolComponent = <LiveDocumentScannerTool config={config} />
  } else if (toolSlug === 'smart-aadhar-print' || toolSlug === 'aadhar-pan-card-print-maker') {
    toolComponent = <SmartAadharPrintTool config={config} />
  } else if (toolSlug === 'formal-passport-suit-maker') {
    toolComponent = <PassportSuitTool config={config} />
  }

  if (!toolComponent) return null

  return (
    <div ref={wrapperRef} className="relative group/tool">
      {/* Dynamic neon gradient backdrop glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur-md opacity-20 group-hover/tool:opacity-35 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        <div className="mb-6 md:mb-8">
          {toolComponent}
        </div>

        {/* Strategic SEO Internal Linking for Stuck Keywords */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>Also Try:</span>
          <Link href="/passport-size-photo-maker" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Passport Size Photo Maker
          </Link>
          <span>•</span>
          <Link href="/resize-image-to-100kb" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Resize Image to 100KB
          </Link>
          <span>•</span>
          <Link href="/merge-pdf-online" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Merge PDF Online
          </Link>
        </div>

        <div className="mt-8">
            <FeedbackWidget />
        </div>
      </div>
    </div>
  )
}
