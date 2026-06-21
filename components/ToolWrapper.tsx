'use client'
import dynamic from 'next/dynamic'

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
const WatermarkImageTool = dynamic(() => import('@/components/tools/WatermarkImageTool'), { ssr: false })
const WhatsAppDpTool = dynamic(() => import('@/components/tools/WhatsAppDpTool'), { ssr: false })

export default function ToolWrapper({ toolSlug, config }: { toolSlug: string, config: any }) {
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

  if (!toolComponent) return null

  return (
    <div className="relative group/tool">
      {/* Dynamic neon gradient backdrop glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur-md opacity-20 group-hover/tool:opacity-35 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        {toolComponent}
      </div>
    </div>
  )
}
