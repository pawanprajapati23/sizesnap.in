import type { Tool, ToolVariant } from '@/lib/toolConfigs'

type FAQ = { question: string; answer: string }

function targetLabel(variant: ToolVariant) {
  if (variant.config.maxKB) return `${variant.config.maxKB}KB`
  return variant.label
}

function pageIntent(variant: ToolVariant) {
  if (variant.slug.includes('whatsapp')) return 'whatsapp'
  if (variant.slug.includes('email')) return 'email'
  if (variant.slug.includes('govt')) return 'govt'
  if (variant.slug.includes('instagram')) return 'instagram'
  if (variant.slug.includes('linkedin')) return 'linkedin'
  if (variant.slug.includes('resume')) return 'resume'
  if (variant.slug.includes('quality')) return 'quality'
  if (variant.slug.includes('kb') || variant.slug.includes('mb')) return 'size'
  return 'specific'
}

export function getVariantFaqs(tool: Tool, variant: ToolVariant): FAQ[] {
  const target = targetLabel(variant)
  const intent = pageIntent(variant)
  const fileType = tool.category === 'pdf' ? 'PDF' : 'image'
  const action = tool.shortName.toLowerCase()

  if (tool.slug === 'passport-photo') {
    return [
      {
        question: `Is this ${variant.label} photo size suitable for online forms?`,
        answer: `${variant.h1} is configured for the dimensions and size target shown on this page. Always compare the final file with the latest instruction on the application portal before submitting.`,
      },
      {
        question: 'Can I crop a normal phone photo into this format?',
        answer: 'Yes. Upload a clear front-facing photo, adjust the crop around the face, and download the resized version for the selected passport, visa, or exam use case.',
      },
      {
        question: 'Will my passport photo be uploaded to SizeSnap servers?',
        answer: 'No. The photo is processed in your browser, so it does not leave your device during resizing or cropping.',
      },
      {
        question: 'What should I check before submitting the final photo?',
        answer: 'Check face visibility, background, file size, dimensions, and whether the portal asks for JPG, JPEG, or another specific format.',
      },
    ]
  }

  if (tool.slug === 'signature-resize') {
    return [
      {
        question: `How do I make a clear ${variant.label} signature file?`,
        answer: `Sign on plain white paper with dark ink, take a well-lit photo, and use this page to compress the signature to the ${target} target.`,
      },
      {
        question: 'Can I use a phone camera photo of my signature?',
        answer: 'Yes. Crop close to the signature area first so the final file keeps the signature readable after compression.',
      },
      {
        question: 'Is the signature uploaded anywhere?',
        answer: 'No. SizeSnap processes the signature locally inside your browser for better privacy.',
      },
      {
        question: 'Why does a signature become blurry after heavy compression?',
        answer: 'Very small limits remove image detail. Start with a clean, bright source image to keep strokes sharp at low KB sizes.',
      },
    ]
  }

  if (intent === 'whatsapp') {
    return [
      {
        question: `Why use ${variant.h1.toLowerCase()}?`,
        answer: `This page keeps the ${fileType.toLowerCase()} light enough for quick WhatsApp sharing while preserving enough clarity for mobile viewing.`,
      },
      {
        question: 'Will the file remain private?',
        answer: `Yes. The ${fileType.toLowerCase()} is processed in your browser and is not uploaded to SizeSnap servers.`,
      },
      {
        question: 'Can I use this on Android or iPhone?',
        answer: 'Yes. Open the page on your phone, pick the file from gallery or files, preview the output, and download it instantly.',
      },
      {
        question: 'Should I choose JPG or PNG for WhatsApp?',
        answer: 'For photos, JPG usually gives the smallest size. PNG is better only when the image has text, transparency, or sharp graphics.',
      },
    ]
  }

  if (intent === 'email') {
    return [
      {
        question: `How does this help with email attachments?`,
        answer: `It reduces the ${fileType.toLowerCase()} so it is easier to attach, send, and download on slower connections.`,
      },
      {
        question: 'Can I compress files without installing software?',
        answer: 'Yes. The tool runs in the browser, so no desktop editor or mobile app is required.',
      },
      {
        question: 'Will email recipients see a watermark?',
        answer: 'No. SizeSnap does not add watermarks, logos, or branding to your downloaded file.',
      },
      {
        question: 'What if the compressed file is still too large?',
        answer: `Try a lower target size such as 200KB, 100KB, or 50KB from the popular size links on this page.`,
      },
    ]
  }

  if (intent === 'govt') {
    return [
      {
        question: `Can I use this for government form uploads?`,
        answer: `Yes. This page is designed for strict portal upload limits, but you should still match the final ${fileType.toLowerCase()} with the exact requirement shown on the form.`,
      },
      {
        question: 'What should I verify before uploading?',
        answer: 'Check file size, format, readability, dimensions if required, and whether the portal asks for a minimum as well as maximum size.',
      },
      {
        question: 'Does the tool work for exam forms?',
        answer: 'Yes. It is useful for SSC, UPSC, railway, banking, state recruitment, admission, and similar form uploads.',
      },
      {
        question: 'Is this safer than uploading documents to a server tool?',
        answer: 'Yes. Processing happens in your browser, so sensitive documents and photos stay on your device.',
      },
    ]
  }

  if (intent === 'quality') {
    return [
      {
        question: `Can I ${action} without visible quality loss?`,
        answer: `The tool tries to reduce file size while preserving readable text, sharp edges, and natural-looking photos. Extremely small targets may still require some quality tradeoff.`,
      },
      {
        question: 'What source file gives the best result?',
        answer: `Use a clear original ${fileType.toLowerCase()} with good lighting and avoid repeatedly compressing the same file before uploading it here.`,
      },
      {
        question: 'Should I choose a larger target size for better quality?',
        answer: 'Yes. If a portal allows 200KB or 500KB, choose that instead of forcing the file down to 20KB or 50KB.',
      },
      {
        question: 'Is quality optimization done on SizeSnap servers?',
        answer: `No. Your ${fileType.toLowerCase()} stays on your device and is processed in the browser.`,
      },
    ]
  }

  if (intent === 'size') {
    return [
      {
        question: `Can I ${action} to exactly ${target}?`,
        answer: `The tool targets ${target} or below. If the original file is very complex, the output may reduce resolution or quality to stay within the selected limit.`,
      },
      {
        question: `What is the best use case for a ${target} ${fileType.toLowerCase()}?`,
        answer: `${target} files are commonly used for online forms, application portals, email attachments, and websites that reject larger uploads.`,
      },
      {
        question: `Will ${target} compression reduce quality?`,
        answer: `Some quality reduction can happen at strict limits, but the tool balances resolution and compression to keep the final ${fileType.toLowerCase()} usable.`,
      },
      {
        question: 'Are my files uploaded during processing?',
        answer: `No. Your ${fileType.toLowerCase()} is processed locally in the browser and is not uploaded to SizeSnap servers.`,
      },
    ]
  }

  return [
    {
      question: `What is ${variant.h1} used for?`,
      answer: `${variant.h1} is meant for users who need a fast, browser-based way to prepare files for uploads, sharing, or document workflows.`,
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No. The tool works without signup, login, or payment.',
    },
    {
      question: 'Does SizeSnap store my files?',
      answer: 'No. Files are handled inside your browser and are not saved on SizeSnap servers.',
    },
    {
      question: 'Can I use this page on mobile?',
      answer: 'Yes. The upload, preview, and download flow is designed to work on mobile browsers.',
    },
  ]
}
