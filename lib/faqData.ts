type FAQ = { question: string; answer: string }

export const faqData: Record<string, FAQ[]> = {
  'resize-image': [
    {
      question: 'Will resizing reduce my image quality?',
      answer: 'Our tool uses smart compression that maintains visual quality while reducing file size. For very small targets like 10KB, some quality reduction is unavoidable, but the result is optimized for the best possible quality at that size.'
    },
    {
      question: 'Is my image uploaded to a server?',
      answer: 'No. All processing happens entirely in your browser using the Canvas API. Your image never leaves your device, making this tool 100% private and secure.'
    },
    {
      question: 'What image formats are supported?',
      answer: 'We support JPG, JPEG, PNG, and WEBP formats. The output will be in JPG format for the smallest file size.'
    },
    {
      question: 'Is there a file size limit for upload?',
      answer: 'You can upload images up to 20MB. The tool will compress them to your target size.'
    },
    {
      question: 'Can I use this on my mobile phone?',
      answer: 'Yes! Our tool is fully mobile-friendly. You can upload from your phone camera or gallery and download the compressed image directly.'
    }
  ],
  'compress-pdf': [
    {
      question: 'How does PDF compression work?',
      answer: 'Our tool uses pdf-lib to optimize your PDF by compressing embedded images and removing unnecessary metadata, reducing the overall file size while keeping content readable.'
    },
    {
      question: 'Is my PDF safe and private?',
      answer: 'Absolutely. The entire compression process happens in your browser. Your PDF is never sent to any server. Your data stays 100% private.'
    },
    {
      question: 'What types of PDFs can be compressed?',
      answer: 'Our tool works on most standard PDFs including scanned documents, text-based PDFs, and mixed-content PDFs. Password-protected PDFs are not supported.'
    },
    {
      question: 'Will the text quality be affected?',
      answer: 'Text in PDFs remains crisp and readable after compression. Only embedded images are compressed, which is usually where most of the file size comes from.'
    },
    {
      question: 'Can I compress multiple PDFs at once?',
      answer: 'Currently the tool processes one PDF at a time. Bulk processing is coming soon in our premium version.'
    }
  ],
  'compress-image': [
    {
      question: 'What is the difference between resize and compress?',
      answer: 'Resizing changes the pixel dimensions of an image (width × height), while compression reduces file size without necessarily changing dimensions by encoding the data more efficiently.'
    },
    {
      question: 'Which format gives the smallest file size?',
      answer: 'For photos, JPG gives the smallest file size. For images with transparency or sharp graphics, PNG or WEBP may be better choices.'
    },
    {
      question: 'Does compression affect image quality?',
      answer: 'Our tool automatically finds the optimal compression level that maintains good visual quality. For very aggressive targets (like 10KB), some quality reduction is expected but minimized.'
    }
  ],
  'convert-image': [
    {
      question: 'Which image formats are supported?',
      answer: 'You can upload JPG, PNG, WEBP, and even GIF images. The tool converts them instantly to the selected target format while optimizing file size.'
    },
    {
      question: 'Does PNG to JPG conversion lose background transparency?',
      answer: 'Yes, because the JPG format does not support transparency. The transparent areas of your PNG image will be replaced with a white background.'
    },
    {
      question: 'Is my photo uploaded for conversion?',
      answer: 'No. The conversion happens strictly within your browser using the Canvas API. No photos are uploaded to any backend server.'
    }
  ],
  'image-to-pdf': [
    {
      question: 'Can I add multiple images to the PDF?',
      answer: 'Currently, this tool converts a single image to a single-page PDF perfectly matched to the image dimensions. Bulk conversion is coming soon!'
    },
    {
      question: 'Are images compressed in the PDF?',
      answer: 'We retain the original quality of your image when wrapping it into the PDF container, so there is no quality loss during conversion.'
    },
    {
      question: 'How long does conversion take?',
      answer: 'Almost instantly in your browser! Just upload your image, and the PDF is generated in a fraction of a second without any server delays.'
    }
  ],
  'merge-pdf': [
    {
      question: 'How many PDF files can I merge at once?',
      answer: 'You can upload and merge up to 10 PDF files at the same time.'
    },
    {
      question: 'Is it completely free and secure?',
      answer: 'Yes! The files are merged locally on your own device. Your important PDF documents are never uploaded or stored anywhere else.'
    },
    {
      question: 'What happens to the page order?',
      answer: 'The pages are merged in the same order you select the files. All pages from the first file will appear first, followed by the second file, and so on.'
    }
  ],
  'passport-photo': [
    {
      question: 'What is the standard Indian passport photo size?',
      answer: 'The standard size is 3.5 cm x 4.5 cm (width x height). Our tool automatically sets these dimensions for you.'
    },
    {
      question: 'Can I resize a selfie for a passport photo?',
      answer: 'Yes, as long as it has a plain background and you are looking directly at the camera. Our tool lets you crop the face area perfectly.'
    },
    {
      question: 'How many KB should a passport photo be for SSC/UPSC?',
      answer: 'Most government portals require the photo to be between 20KB and 50KB. Our tool optimizes the file to hit this exact range.'
    }
  ],
  'signature-resize': [
    {
      question: 'How do I get a clear signature scan?',
      answer: 'Sign on a plain white paper using a dark blue or black pen. Take a photo in good lighting and upload it here.'
    },
    {
      question: 'What is the signature size for SSC exams?',
      answer: 'The signature should be between 10KB and 20KB, and dimensions are typically 4.0 cm x 2.0 cm.'
    },
    {
      question: 'Can I resize a signature for PAN card?',
      answer: 'Yes, our PAN Card Signature tool formats your signature to be under 10KB as required by NSDL.'
    }
  ]
}
