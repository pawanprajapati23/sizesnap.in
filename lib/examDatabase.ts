export interface ExamSpec {
  slug: string
  name: string
  shortName: string
  category: 'SSC' | 'UPSC' | 'Banking' | 'Railways' | 'Defence' | 'Teaching' | 'State PSC' | 'National Entrance' | 'Identity'
  conductingBody: string
  officialWebsite: string
  updatedYear: string
  overview: string
  photo: {
    dimensions: string
    fileSizeRange: string
    format: string
    background: string
    dopRequired: boolean
    dopRules?: string
    aspectRatio: string
    dpi: number
    toolActionUrl: string
  }
  signature: {
    dimensions: string
    fileSizeRange: string
    format: string
    inkColor: string
    aspectRatio: string
    toolActionUrl: string
  }
  thumb?: {
    required: boolean
    whichThumb: string
    fileSizeRange: string
    format: string
    inkColor: string
    toolActionUrl: string
  }
  documents?: {
    marksheetSize: string
    format: string
    categoryCertSize?: string
  }
  commonMistakes: string[]
  faqs: { question: string; answer: string }[]
}

export const examDatabase: ExamSpec[] = [
  {
    slug: 'ssc-cgl',
    name: 'SSC CGL (Combined Graduate Level) Exam',
    shortName: 'SSC CGL',
    category: 'SSC',
    conductingBody: 'Staff Selection Commission (SSC)',
    officialWebsite: 'https://ssc.gov.in',
    updatedYear: '2026',
    overview: 'Staff Selection Commission (SSC) mandates strict live webcam capture / passport photo specifications and scanned signature limits for CGL application forms.',
    photo: {
      dimensions: '3.5 cm x 4.5 cm (or 350 x 450 px)',
      fileSizeRange: '20 KB to 50 KB',
      format: 'JPG / JPEG',
      background: 'Plain White or Light Gray',
      dopRequired: false,
      aspectRatio: '3.5:4.5',
      dpi: 200,
      toolActionUrl: '/image-size-for-ssc-form'
    },
    signature: {
      dimensions: '4.0 cm x 2.0 cm (or 400 x 200 px)',
      fileSizeRange: '10 KB to 20 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black Ink on Plain White Paper',
      aspectRatio: '2:1',
      toolActionUrl: '/resize-signature-for-ssc'
    },
    thumb: {
      required: false,
      whichThumb: 'Not required at form filling stage',
      fileSizeRange: 'N/A',
      format: 'JPG',
      inkColor: 'N/A',
      toolActionUrl: '/thumb-impression-resizer-for-ssc-and-neet'
    },
    documents: {
      marksheetSize: '100 KB to 300 KB',
      format: 'PDF / JPEG'
    },
    commonMistakes: [
      'Uploading signature above 20KB (instant upload rejection)',
      'Wearing cap, dark spectacles, or mask in webcam/photo upload',
      'Blurry signature with yellow or shaded paper background'
    ],
    faqs: [
      { question: 'What is the photo size limit for SSC CGL?', answer: 'SSC CGL photo must be between 20KB to 50KB in JPG/JPEG format with 3.5cm x 4.5cm dimensions.' },
      { question: 'What is the signature size for SSC CGL 2026?', answer: 'Signature must be strictly between 10KB to 20KB in JPG format with 4.0cm x 2.0cm aspect ratio.' }
    ]
  },
  {
    slug: 'ssc-chsl',
    name: 'SSC CHSL (10+2 Combined Higher Secondary Level) Exam',
    shortName: 'SSC CHSL',
    category: 'SSC',
    conductingBody: 'Staff Selection Commission (SSC)',
    officialWebsite: 'https://ssc.gov.in',
    updatedYear: '2026',
    overview: 'SSC CHSL application form requires candidates to submit live webcam capture / passport photo under 50KB and signature between 10KB to 20KB.',
    photo: {
      dimensions: '3.5 cm x 4.5 cm',
      fileSizeRange: '20 KB to 50 KB',
      format: 'JPG / JPEG',
      background: 'Clean White Background',
      dopRequired: false,
      aspectRatio: '3.5:4.5',
      dpi: 200,
      toolActionUrl: '/image-size-for-ssc-form'
    },
    signature: {
      dimensions: '4.0 cm x 2.0 cm',
      fileSizeRange: '10 KB to 20 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black Ink on White Paper',
      aspectRatio: '2:1',
      toolActionUrl: '/resize-signature-for-ssc'
    },
    commonMistakes: [
      'Signature image exceeding 20KB limit',
      'Improper lighting or selfie angle in live photo'
    ],
    faqs: [
      { question: 'What is the CHSL signature size?', answer: 'Scanned signature must be between 10KB to 20KB in JPG format.' }
    ]
  },
  {
    slug: 'ssc-gd',
    name: 'SSC GD Constable (General Duty) Exam',
    shortName: 'SSC GD',
    category: 'SSC',
    conductingBody: 'Staff Selection Commission (SSC)',
    officialWebsite: 'https://ssc.gov.in',
    updatedYear: '2026',
    overview: 'SSC GD Constable recruitment guidelines demand exact 20-50KB passport photograph and 10-20KB scanned signature.',
    photo: {
      dimensions: '3.5 cm x 4.5 cm',
      fileSizeRange: '20 KB to 50 KB',
      format: 'JPG / JPEG',
      background: 'White or Light Colored',
      dopRequired: false,
      aspectRatio: '3.5:4.5',
      dpi: 200,
      toolActionUrl: '/image-size-for-ssc-gd'
    },
    signature: {
      dimensions: '4.0 cm x 2.0 cm',
      fileSizeRange: '10 KB to 20 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black or Blue Ink',
      aspectRatio: '2:1',
      toolActionUrl: '/resize-signature-for-ssc-gd'
    },
    commonMistakes: [
      'Cropping signature too close to borders',
      'Uploading marksheet PDF over 300KB'
    ],
    faqs: [
      { question: 'What is the photo size for SSC GD 2026?', answer: 'Photo must be 20KB to 50KB with clear facial view and white background.' }
    ]
  },
  {
    slug: 'neet-ug',
    name: 'NTA NEET UG (National Eligibility cum Entrance Test)',
    shortName: 'NEET UG',
    category: 'National Entrance',
    conductingBody: 'National Testing Agency (NTA)',
    officialWebsite: 'https://neet.nta.nic.in',
    updatedYear: '2026',
    overview: 'NTA NEET UG enforces strict document uploads including Passport Photo, Postcard Photo (4x6 inch), Left & Right Thumb Impressions, and Signature.',
    photo: {
      dimensions: '3.5 cm x 4.5 cm (Passport) & 4 x 6 inch (Postcard)',
      fileSizeRange: '10 KB to 200 KB (Passport) & 10 KB to 200 KB (Postcard)',
      format: 'JPG / JPEG',
      background: 'Pure White Background (80% face coverage)',
      dopRequired: true,
      dopRules: 'Candidate Name and Date of Taking Photo (DOP) printed at bottom',
      aspectRatio: '3.5:4.5',
      dpi: 300,
      toolActionUrl: '/image-size-for-neet-form'
    },
    signature: {
      dimensions: '3.5 cm x 1.5 cm',
      fileSizeRange: '4 KB to 30 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black Ink with Running Handwriting',
      aspectRatio: '7:3',
      toolActionUrl: '/resize-signature-for-neet'
    },
    thumb: {
      required: true,
      whichThumb: 'Left and Right Hand Fingers and Thumb Impressions',
      fileSizeRange: '10 KB to 200 KB',
      format: 'JPG / JPEG',
      inkColor: 'Blue Stamp Pad Ink',
      toolActionUrl: '/thumb-impression-resizer-for-ssc-and-neet'
    },
    documents: {
      marksheetSize: '50 KB to 300 KB',
      format: 'PDF'
    },
    commonMistakes: [
      'Missing candidate name and date stamp on passport/postcard photo',
      'Uploading signature in CAPITAL letters (NTA will reject capital signatures)',
      'Blurry thumb impression without visible ridge loops'
    ],
    faqs: [
      { question: 'Is Name and Date mandatory on NEET photo?', answer: 'Yes, NTA NEET mandates candidate name and date of photo printed at the bottom of both passport and 4x6 postcard photos.' },
      { question: 'Can NEET signature be in capital letters?', answer: 'No! NTA strictly prohibits signature in capital letters. It must be in running handwriting.' }
    ]
  },
  {
    slug: 'upsc-ias',
    name: 'UPSC Civil Services (IAS / IPS / IFS) Exam',
    shortName: 'UPSC IAS',
    category: 'UPSC',
    conductingBody: 'Union Public Service Commission',
    officialWebsite: 'https://upsconline.nic.in',
    updatedYear: '2026',
    overview: 'UPSC OTR (One Time Registration) and Civil Services Application forms require square or proportional 20KB-300KB photo & signature uploads with Name and Date stamp.',
    photo: {
      dimensions: '350 x 350 px minimum (up to 1000 x 1000 px)',
      fileSizeRange: '20 KB to 300 KB',
      format: 'JPG / JPEG',
      background: 'Plain White Background (3/4th face visibility)',
      dopRequired: true,
      dopRules: 'Name of Candidate and Date of Photo (not older than 10 days) at bottom',
      aspectRatio: '1:1',
      dpi: 300,
      toolActionUrl: '/photo-size-for-upsc-form'
    },
    signature: {
      dimensions: '350 x 350 px minimum',
      fileSizeRange: '20 KB to 300 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black Ink on White Paper',
      aspectRatio: '1:1',
      toolActionUrl: '/resize-signature-for-upsc'
    },
    documents: {
      marksheetSize: '100 KB to 300 KB',
      format: 'PDF'
    },
    commonMistakes: [
      'Photo older than 10 days from the date of application start',
      'Pixel dimensions below 350x350 px',
      'Missing printed name and date bar on photo'
    ],
    faqs: [
      { question: 'What is UPSC photo and signature pixel dimension?', answer: 'UPSC requires minimum 350x350 pixels and maximum 1000x1000 pixels with file size between 20KB to 300KB.' },
      { question: 'How old can UPSC photo be?', answer: 'UPSC rules state the photograph must not be more than 10 days old from the commencement of application.' }
    ]
  },
  {
    slug: 'ibps-po',
    name: 'IBPS PO (Probationary Officers) Recruitment',
    shortName: 'IBPS PO',
    category: 'Banking',
    conductingBody: 'Institute of Banking Personnel Selection',
    officialWebsite: 'https://ibps.in',
    updatedYear: '2026',
    overview: 'IBPS PO, Clerk, and RRB banking exams require four standard uploads: Passport Photo (20-50KB), Signature (10-20KB), Left Thumb Impression (20-50KB), and Hand-Written Declaration (50-100KB).',
    photo: {
      dimensions: '4.5 cm x 3.5 cm (or 200 x 230 px)',
      fileSizeRange: '20 KB to 50 KB',
      format: 'JPG / JPEG',
      background: 'Light Colored or White Background',
      dopRequired: false,
      aspectRatio: '3.5:4.5',
      dpi: 200,
      toolActionUrl: '/image-size-for-ibps-exam'
    },
    signature: {
      dimensions: '140 x 60 px',
      fileSizeRange: '10 KB to 20 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black Ink on White Paper',
      aspectRatio: '14:6',
      toolActionUrl: '/resize-signature-for-ibps-exam'
    },
    thumb: {
      required: true,
      whichThumb: 'Left Hand Thumb Impression (LTI)',
      fileSizeRange: '20 KB to 50 KB (or 10-20KB)',
      format: 'JPG / JPEG',
      inkColor: 'Blue or Black Ink',
      toolActionUrl: '/thumb-impression-resizer-for-ssc-and-neet'
    },
    documents: {
      marksheetSize: '50 KB to 100 KB (Hand-written declaration)',
      format: 'JPG / JPEG'
    },
    commonMistakes: [
      'Signing in CAPITAL / BLOCK letters (causes disqualification in IBPS)',
      'Thumb impression smudged without sharp ridge clarity'
    ],
    faqs: [
      { question: 'What is IBPS thumb impression size?', answer: 'IBPS Left Thumb Impression must be 20KB to 50KB in JPG format with 240x240 pixels (3x3 cm).' }
    ]
  },
  {
    slug: 'rrb-ntpc',
    name: 'RRB NTPC (Non-Technical Popular Categories) Exam',
    shortName: 'RRB NTPC',
    category: 'Railways',
    conductingBody: 'Railway Recruitment Boards (RRB)',
    officialWebsite: 'https://rrbapply.gov.in',
    updatedYear: '2026',
    overview: 'Railway Recruitment Boards enforce strict 30-70KB photo specifications and 30-70KB signature specifications on blue/white background.',
    photo: {
      dimensions: '35 mm x 45 mm (or 320 x 240 px)',
      fileSizeRange: '30 KB to 70 KB',
      format: 'JPG / JPEG',
      background: 'Plain White Background',
      dopRequired: false,
      aspectRatio: '3.5:4.5',
      dpi: 200,
      toolActionUrl: '/image-size-for-rrb-exam'
    },
    signature: {
      dimensions: '50 mm x 20 mm',
      fileSizeRange: '30 KB to 70 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black Ink on White Paper in Running Hand',
      aspectRatio: '5:2',
      toolActionUrl: '/resize-signature-for-rrb'
    },
    documents: {
      marksheetSize: '100 KB to 300 KB',
      format: 'PDF'
    },
    commonMistakes: [
      'Uploading photo below 30KB or above 70KB',
      'Wearing sunglasses, tinted glasses or hats'
    ],
    faqs: [
      { question: 'What is RRB NTPC photo size range?', answer: 'RRB NTPC photo must be between 30KB to 70KB in JPG format.' }
    ]
  },
  {
    slug: 'ctet',
    name: 'CTET (Central Teacher Eligibility Test)',
    shortName: 'CTET',
    category: 'Teaching',
    conductingBody: 'Central Board of Secondary Education (CBSE)',
    officialWebsite: 'https://ctet.nic.in',
    updatedYear: '2026',
    overview: 'CBSE CTET exam mandates photograph between 10KB to 100KB and scanned signature between 4KB to 30KB.',
    photo: {
      dimensions: '3.5 cm x 4.5 cm',
      fileSizeRange: '10 KB to 100 KB',
      format: 'JPG / JPEG',
      background: 'White Background',
      dopRequired: false,
      aspectRatio: '3.5:4.5',
      dpi: 200,
      toolActionUrl: '/image-size-for-ctet-form'
    },
    signature: {
      dimensions: '3.5 cm x 1.5 cm',
      fileSizeRange: '4 KB to 30 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black / Blue Ink',
      aspectRatio: '7:3',
      toolActionUrl: '/resize-signature-for-ctet'
    },
    commonMistakes: [
      'Blurry signature with size below 4KB',
      'Uploading photo in PNG instead of JPG'
    ],
    faqs: [
      { question: 'What is CTET photo size?', answer: 'CTET photo size is 10KB to 100KB in JPG format.' }
    ]
  },
  {
    slug: 'up-police',
    name: 'UP Police Constable & SI Recruitment',
    shortName: 'UP Police',
    category: 'State PSC',
    conductingBody: 'UPPRPB (Uttar Pradesh Police Recruitment & Promotion Board)',
    officialWebsite: 'https://uppbpb.gov.in',
    updatedYear: '2026',
    overview: 'UPPRPB requires candidates to upload 20KB to 50KB colored photograph and 5KB to 20KB signature signed in black ink.',
    photo: {
      dimensions: '35 mm x 45 mm',
      fileSizeRange: '20 KB to 50 KB',
      format: 'JPG / JPEG',
      background: 'Plain White or Light Gray Background (70% face)',
      dopRequired: false,
      aspectRatio: '3.5:4.5',
      dpi: 200,
      toolActionUrl: '/photo-size-for-up-police-form'
    },
    signature: {
      dimensions: '3.5 cm x 1.5 cm',
      fileSizeRange: '5 KB to 20 KB',
      format: 'JPG / JPEG',
      inkColor: 'Black Ink on Plain White Paper',
      aspectRatio: '7:3',
      toolActionUrl: '/resize-signature-for-ssc'
    },
    documents: {
      marksheetSize: '50 KB to 100 KB (B&W Grayscale preferred)',
      format: 'PDF / JPG'
    },
    commonMistakes: [
      'Signing with blue ink instead of required black ink',
      'Photo with colored/busy outdoor background'
    ],
    faqs: [
      { question: 'What is UP Police signature size limit?', answer: 'UP Police signature must be 5KB to 20KB in black ink on white paper.' }
    ]
  }
]

export function getExamBySlug(slug: string): ExamSpec | undefined {
  return examDatabase.find(e => e.slug === slug)
}

export function getAllExamSlugs(): string[] {
  return examDatabase.map(e => e.slug)
}
