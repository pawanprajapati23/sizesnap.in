export interface ExamDocumentSpec {
  id: string; // 'photo' | 'signature' | 'thumb' | 'declaration' | 'postcard'
  title: string;
  minKb: number;
  maxKb: number;
  recommendedKb: number;
  widthPx: number;
  heightPx: number;
  widthCm?: number;
  heightCm?: number;
  aspectRatioLabel: string;
  allowedFormats: string[];
  requiresNameDate?: boolean;
  backgroundRequirement: string;
  instructions: string[];
}

export interface ExamPreset {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  authority: string;
  badge: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  popularFor: string[];
  documents: ExamDocumentSpec[];
  generalGuidelines: string[];
  faqs: { q: string; a: string }[];
}

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc',
    slug: 'ssc-photo-signature-resizer',
    name: 'SSC Photo & Signature Resizer',
    shortTitle: 'SSC CGL / CHSL / GD / MTS',
    authority: 'Staff Selection Commission (SSC)',
    badge: 'Most Popular',
    metaTitle: 'SSC Photo and Signature Resizer Online (20KB - 50KB) | SizeSnap',
    metaDescription:
      'Free online photo and signature resizer for SSC CGL, CHSL, GD, MTS, CPO exams. Resize to exact 20KB-50KB photo and 10KB-20KB signature without blur or rejection.',
    summary:
      'Staff Selection Commission requires exact 20KB to 50KB JPEG photo (3.5cm x 4.5cm) and 10KB to 20KB signature (4.0cm x 2.0cm). Forms with blurred photos, wrong dimensions, or caps/spectacles get rejected instantly.',
    popularFor: ['SSC CGL', 'SSC CHSL', 'SSC GD Constable', 'SSC MTS', 'SSC CPO', 'SSC Stenographer'],
    documents: [
      {
        id: 'photo',
        title: 'Passport Photo',
        minKb: 20,
        maxKb: 50,
        recommendedKb: 35,
        widthPx: 350,
        heightPx: 450,
        widthCm: 3.5,
        heightCm: 4.5,
        aspectRatioLabel: '3.5 cm x 4.5 cm (7:9 ratio)',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'Plain white or light grey background',
        instructions: [
          'Frontal face with direct gaze and neutral expression (both ears visible).',
          'Caps, masks, dark sunglasses or tinted spectacles are strictly prohibited.',
          'Face must cover roughly 70% to 80% of the image frame.',
          'File format must strictly be JPEG/JPG between 20 KB and 50 KB.',
        ],
      },
      {
        id: 'signature',
        title: 'Official Signature',
        minKb: 10,
        maxKb: 20,
        recommendedKb: 15,
        widthPx: 280,
        heightPx: 120,
        widthCm: 4.0,
        heightCm: 2.0,
        aspectRatioLabel: '4.0 cm x 2.0 cm (2:1 ratio)',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'Clean white paper with clear black or dark blue ink',
        instructions: [
          'Sign only inside a rectangular box using a running hand (capital/block letters are rejected).',
          'Ensure the white paper background has no shadows, folds, or ink smudges.',
          'Must be sharp, clean, and between 10 KB and 20 KB.',
        ],
      },
    ],
    generalGuidelines: [
      'SSC AI live photo portal compares uploaded pictures against the webcam capture. Keep the background clean.',
      'Never crop an old blurry group photograph; take a fresh photo in good lighting.',
      'Ensure the file extension is strictly .jpg or .jpeg.',
    ],
    faqs: [
      {
        q: 'Why was my SSC application form rejected due to photo reasons?',
        a: 'The top reasons for SSC photo rejection are: spectacles with flash reflection, wearing caps or scarves, tilted head, blurriness, file size below 20KB or above 50KB, and uneven dark shadows.',
      },
      {
        q: 'Does SSC still require Name and Date on the photo (DOP)?',
        a: 'In recent SSC notifications (CGL, CHSL, GD), SSC shifted towards live webcam capture or standard clear passport photo without mandatory text. However, if your specific exam notice mandates DOP, SizeSnap allows 1-click Name & Date stamping.',
      },
      {
        q: 'What is the signature size for SSC in pixels and centimeters?',
        a: 'Dimensions must be 4.0 cm (width) x 2.0 cm (height), which equates to roughly 140x60 px or 280x120 px. File size must be strictly between 10 KB and 20 KB.',
      },
    ],
  },
  {
    id: 'upsc',
    slug: 'upsc-photo-signature-resizer',
    name: 'UPSC Photo & Signature Resizer',
    shortTitle: 'UPSC Civil Services / NDA / CDS / OTR',
    authority: 'Union Public Service Commission (UPSC)',
    badge: 'OTR Compliant',
    metaTitle: 'UPSC Photo and Signature Resizer with Name & Date | SizeSnap',
    metaDescription:
      'Resize photo and signature for UPSC OTR, Civil Services (IAS/IPS), NDA, CDS. Automatic candidate name & date of photo (DOP) stamp generator compliant with UPSC 10-day rule.',
    summary:
      'UPSC mandates that passport photographs must not be older than 10 days from the start of the online application and must clearly display the candidate name and the date the photo was taken at the bottom.',
    popularFor: ['UPSC CSE (IAS/IFS/IPS)', 'NDA / NA', 'CDS Exam', 'UPSC CAPF', 'UPSC EPFO', 'UPSC OTR'],
    documents: [
      {
        id: 'photo',
        title: 'Passport Photo (with Name & Date)',
        minKb: 20,
        maxKb: 300,
        recommendedKb: 80,
        widthPx: 550,
        heightPx: 550,
        aspectRatioLabel: 'Square (1:1 ratio, 350x350 to 1000x1000 px)',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: true,
        backgroundRequirement: 'Plain white or neutral light background',
        instructions: [
          'Photo must show candidate name and date of photo taken at the bottom.',
          'Photo must not be older than 10 days from the release of application form.',
          'Candidate facial appearance must match across prelims, mains, and interview.',
          'Dimensions must range between 350 x 350 px and 1000 x 1000 px.',
        ],
      },
      {
        id: 'signature',
        title: 'Candidate Signature',
        minKb: 20,
        maxKb: 300,
        recommendedKb: 60,
        widthPx: 500,
        heightPx: 300,
        aspectRatioLabel: 'Width between 350px & 1000px',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'Pure white background with dark ink',
        instructions: [
          'Sign clearly on plain white paper using black ballpoint or gel pen.',
          'Crop tightly around the signature to prevent unnecessary white space.',
          'File size must strictly be between 20 KB and 300 KB.',
        ],
      },
    ],
    generalGuidelines: [
      'Candidates must ensure their appearance (e.g. beard, moustache, spectacles) on exam day matches the uploaded photograph.',
      'Dimensions must not exceed 1000 x 1000 px and must not fall below 350 x 350 px.',
      'SizeSnap automatically stamps your Name and Date in standard UPSC OTR format.',
    ],
    faqs: [
      {
        q: 'What is the UPSC 10-Day photo rule?',
        a: 'According to UPSC guidelines, the uploaded photograph must be taken within 10 days of the start of the online application process. The candidate name and the exact date on which the photograph was taken must be clearly inscribed at the bottom.',
      },
      {
        q: 'What are the minimum and maximum dimensions for UPSC photos?',
        a: 'The minimum dimensions are 350 pixels (width) x 350 pixels (height), and maximum is 1000 x 1000 pixels. The file size must be between 20 KB and 300 KB in JPEG format.',
      },
    ],
  },
  {
    id: 'delhi-police',
    slug: 'delhi-police-photo-resizer',
    name: 'Delhi Police Photo & Signature Resizer',
    shortTitle: 'Delhi Police Constable / SI',
    authority: 'Delhi Police Recruitment & SSC',
    badge: 'Police Bharti',
    metaTitle: 'Delhi Police Photo and Signature Resizer (20KB - 50KB) | SizeSnap',
    metaDescription:
      'Online Delhi Police photo and signature resizer for Constable Executive, Head Constable (AWO/TPO, Ministerial) and Sub-Inspector. Exact 20KB-50KB size guarantee.',
    summary:
      'Delhi Police recruitment follows strict physical standards and document verification. Photos must have a clean white background with no caps or dark glasses, compressed strictly between 20KB to 50KB.',
    popularFor: ['Delhi Police Constable (Exec)', 'Head Constable Ministerial', 'Head Constable AWO/TPO', 'Delhi Police SI (via SSC CPO)'],
    documents: [
      {
        id: 'photo',
        title: 'Passport Photo',
        minKb: 20,
        maxKb: 50,
        recommendedKb: 35,
        widthPx: 350,
        heightPx: 450,
        widthCm: 3.5,
        heightCm: 4.5,
        aspectRatioLabel: '3.5 cm x 4.5 cm (7:9 ratio)',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'Clean, shadowless white background',
        instructions: [
          'Full face centered, eyes open and looking straight into the lens.',
          'No caps, hats, uniforms, or sunglasses.',
          'Dimensions: 3.5 cm width x 4.5 cm height (approx 100 x 120 px or 350 x 450 px).',
          'File size: Strictly 20 KB to 50 KB.',
        ],
      },
      {
        id: 'signature',
        title: 'Candidate Signature',
        minKb: 10,
        maxKb: 20,
        recommendedKb: 15,
        widthPx: 280,
        heightPx: 120,
        widthCm: 4.0,
        heightCm: 2.0,
        aspectRatioLabel: '4.0 cm x 2.0 cm',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'Plain white paper with blue/black pen',
        instructions: [
          'Signature must be clearly legible and made without touching the borders.',
          'Do not sign in ALL CAPITAL LETTERS.',
          'File size must be strictly between 10 KB and 20 KB.',
        ],
      },
    ],
    generalGuidelines: [
      'Keep 10-15 physical copies of the identical photo for the Physical Endurance & Measurement Test (PE&MT).',
      'The photo must not be older than 3 months from the application date.',
    ],
    faqs: [
      {
        q: 'What background color is required for Delhi Police Constable photo?',
        a: 'A plain white or very light grey background is strictly mandatory. Colored, patterned, outdoor, or dark backgrounds will cause the application to be rejected.',
      },
      {
        q: 'Can I wear spectacles in the Delhi Police photo?',
        a: 'Spectacles should be removed if there is glare, tinted glass, or thick frames that cover eyes. Clear everyday vision spectacles are allowed only if eyes are 100% visible with zero reflection.',
      },
    ],
  },
  {
    id: 'up-police',
    slug: 'up-police-photo-resizer',
    name: 'UP Police Photo & Signature Resizer',
    shortTitle: 'UP Police Constable / SI Bharti',
    authority: 'UPPRPB (Uttar Pradesh Police Recruitment & Promotion Board)',
    badge: 'UPPRPB Official Specs',
    metaTitle: 'UP Police Photo and Signature Resizer 20KB to 50KB | SizeSnap',
    metaDescription:
      'Free UP Police photo and signature resizer for Constable, Sub-Inspector (SI), Jail Warder, Computer Operator. Resize to 20KB-50KB photo and 5KB-20KB signature.',
    summary:
      'UPPRPB guidelines specify that passport photos must be between 20KB to 50KB (35mm x 45mm) with 70% facial visibility, while signatures must be between 5KB to 20KB (3.5cm x 1.5cm) in black ink.',
    popularFor: ['UP Police Constable (60,000+ Bharti)', 'UP Police Sub Inspector (SI)', 'UP Police Computer Operator', 'UP Fireman & Jail Warder'],
    documents: [
      {
        id: 'photo',
        title: 'Passport Photo (35mm x 45mm)',
        minKb: 20,
        maxKb: 50,
        recommendedKb: 35,
        widthPx: 350,
        heightPx: 450,
        widthCm: 3.5,
        heightCm: 4.5,
        aspectRatioLabel: '35 mm x 45 mm',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'White or light grey background',
        instructions: [
          'Photo must have been taken within the last 6 months.',
          'Face should cover approximately 70% of the photograph.',
          'Neutral facial expression with closed mouth and open eyes.',
          'Both sides of face and both ears must be clearly visible.',
        ],
      },
      {
        id: 'signature',
        title: 'Signature (3.5cm x 1.5cm)',
        minKb: 5,
        maxKb: 20,
        recommendedKb: 12,
        widthPx: 250,
        heightPx: 110,
        widthCm: 3.5,
        heightCm: 1.5,
        aspectRatioLabel: '3.5 cm x 1.5 cm',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'White paper with black ink ballpoint pen',
        instructions: [
          'Sign only with BLACK INK ballpoint pen on plain white paper.',
          'Size must be between 5 KB and 20 KB.',
          'Signatures in capital letters are strictly rejected.',
        ],
      },
    ],
    generalGuidelines: [
      'UPPRPB is very strict about signature ink: strictly use black pen (do not use blue or green ink).',
      'Do not wear red, orange, or patterned clothing that bleeds into the photo frame.',
    ],
    faqs: [
      {
        q: 'What is the signature size for UP Police in KB?',
        a: 'The signature for UP Police recruitment must be between 5 KB and 20 KB, dimensions 3.5 cm width by 1.5 cm height, and signed strictly in black ink.',
      },
      {
        q: 'Can I upload a selfie for UP Police Bharti?',
        a: 'No, selfies or photos cropped from mobile casual shots are strictly rejected by the UPPRPB automated screening portal.',
      },
    ],
  },
  {
    id: 'ibps-bank',
    slug: 'ibps-bank-photo-signature-resizer',
    name: 'Bank Exam Photo, Signature & Thumb Resizer',
    shortTitle: 'IBPS / SBI PO & Clerk',
    authority: 'Institute of Banking Personnel Selection & State Bank of India',
    badge: '4-in-1 Bank Toolkit',
    metaTitle: 'IBPS SBI Photo, Signature, Thumb Impression & Declaration Resizer | SizeSnap',
    metaDescription:
      'All-in-one resizing tool for IBPS PO, Clerk, SO, RRB and SBI bank recruitment. Resize Photo (20-50KB), Signature (10-20KB), Thumb Impression (20-50KB) & Declaration (50-100KB).',
    summary:
      'Banking exam applications require 4 distinct document uploads: Passport Photo (20-50KB), Signature (10-20KB in black ink), Left Thumb Impression (20-50KB), and Handwritten Declaration (50-100KB).',
    popularFor: ['IBPS PO / Clerk / SO', 'IBPS RRB Officer & Office Assistant', 'SBI PO / Clerk', 'RBI Grade B & Assistant'],
    documents: [
      {
        id: 'photo',
        title: 'Passport Photo (200x230 px)',
        minKb: 20,
        maxKb: 50,
        recommendedKb: 35,
        widthPx: 200,
        heightPx: 230,
        aspectRatioLabel: '200 x 230 pixels',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'Light colored, preferably white background',
        instructions: [
          'Dimensions: 200 x 230 pixels (preferred).',
          'File size: 20 KB – 50 KB.',
          'Face looking straight ahead with relaxed expression.',
        ],
      },
      {
        id: 'signature',
        title: 'Signature (140x60 px)',
        minKb: 10,
        maxKb: 20,
        recommendedKb: 15,
        widthPx: 140,
        heightPx: 60,
        aspectRatioLabel: '140 x 60 pixels',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'White paper with BLACK INK pen only',
        instructions: [
          'Applicant must sign with BLACK INK pen on white paper.',
          'Signature in CAPITAL LETTERS will NOT be accepted.',
          'Dimensions: 140 x 60 pixels; File size: 10 KB – 20 KB.',
        ],
      },
      {
        id: 'thumb',
        title: 'Left Thumb Impression (LTI)',
        minKb: 20,
        maxKb: 50,
        recommendedKb: 35,
        widthPx: 240,
        heightPx: 240,
        aspectRatioLabel: '240 x 240 pixels (3cm x 3cm)',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'White paper with blue or black ink stamp pad',
        instructions: [
          'Applicant has to put his/her left thumb impression on white paper with black or blue ink.',
          'Thumb ridges must be clearly visible without excessive ink smudging.',
          'Dimensions: 240 x 240 pixels (3 cm x 3 cm); Size: 20 KB – 50 KB.',
        ],
      },
      {
        id: 'declaration',
        title: 'Hand Written Declaration',
        minKb: 50,
        maxKb: 100,
        recommendedKb: 75,
        widthPx: 800,
        heightPx: 400,
        aspectRatioLabel: '800 x 400 pixels (10cm x 5cm)',
        allowedFormats: ['image/jpeg', 'image/jpg'],
        requiresNameDate: false,
        backgroundRequirement: 'White paper with black ink ballpoint/gel pen',
        instructions: [
          'Text of the declaration must be written in English only, in candidate’s own handwriting.',
          'Do NOT write declaration in capital letters.',
          'Dimensions: 800 x 400 pixels (preferred); Size: 50 KB – 100 KB.',
        ],
      },
    ],
    generalGuidelines: [
      'If a candidate lacks a left thumb, they may use their right thumb and mention it in the application.',
      'Signatures must be identical on the online application and the examination call letter.',
    ],
    faqs: [
      {
        q: 'What is the text for IBPS Handwritten Declaration?',
        a: 'The standard text is: "I, _______ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required."',
      },
      {
        q: 'Can I use blue ink for IBPS Signature or Declaration?',
        a: 'No! IBPS and SBI notifications strictly specify BLACK INK for signatures and handwritten declarations. Blue ink is allowed only for Left Thumb Impression.',
      },
    ],
  },
];

export function getExamBySlug(slug: string): ExamPreset | undefined {
  return EXAM_PRESETS.find((exam) => exam.slug === slug);
}
