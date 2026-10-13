export interface Author {
  name: string;
  profileImage?: string;
  bio?: string;
  role?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export type ArticleStatus = 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  coverImage?: string;
  author: Author;
  category: string;
  tags: string[];
  status: ArticleStatus;
  featured: boolean;
  priority: number;
  publishedAt?: number;
  updatedAt?: number;
  scheduledAt?: number;
  readingTime?: number; // In minutes
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
  officialSources?: { name: string; url: string }[];
  relatedTools?: string[];
  relatedArticles?: string[];
  lastVerifiedAt?: number;
  examYear?: string;
  examName?: string;
  createdAt: number;
}

export interface BlogCategory {
  slug: string;
  title: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: 'exam-guides', title: 'Exam Guides', description: 'Exam-specific photo/signature/document requirements.' },
  { slug: 'how-to', title: 'How-To Guides', description: 'Practical step-by-step tutorials.' },
  { slug: 'privacy-security', title: 'Privacy & Security', description: 'Learn about file privacy, client-side processing, and document safety.' },
  { slug: 'comparisons', title: 'Comparisons', description: 'Tool comparisons and alternatives.' },
  { slug: 'student-tips', title: 'Student Tips', description: 'Study, exam and document-related practical help.' },
  { slug: 'tool-guides', title: 'Tool Guides', description: 'Detailed guides explaining how to use SizeSnap tools.' },
  { slug: 'exam-updates', title: 'Exam Updates', description: 'Time-sensitive exam and document requirement updates.' },
  { slug: 'resources', title: 'Resources', description: 'Evergreen educational resources.' },
];

export const BUILTIN_ARTICLES: Article[] = [
  {
    id: 'ssc-cgl-photo-size-name-date-guidelines-2026',
    title: 'SSC CGL 2026: Photo Size, Name & Date (DOP) Guidelines Explained',
    slug: 'ssc-cgl-photo-size-name-date-guidelines-2026',
    excerpt: 'Complete official guide on SSC CGL photo specifications. Learn the exact 3.5×4.5 cm dimensions, 20KB–50KB file size limits, Name & Date rules, and how to create a compliant photo online for free.',
    category: 'exam-guides',
    tags: ['SSC CGL', 'Passport Photo', 'Govt Exam', 'Photo Resizer', 'Name and Date'],
    status: 'PUBLISHED',
    featured: true,
    priority: 10,
    author: {
      name: 'SizeSnap Exam Research Team',
      role: 'Govt Exam Documentation Specialist',
    },
    readingTime: 6,
    publishedAt: 1773000000000,
    createdAt: 1773000000000,
    seoTitle: 'SSC CGL 2026 Photo Size (3.5x4.5 cm), Name & Date Format, 20KB-50KB Guide',
    seoDescription: 'Complete official guide for SSC CGL 2026 photo requirements. Learn exact 3.5×4.5 cm dimensions, 20KB–50KB file size limits, Name & Date (DOP) rules, and avoid form rejection.',
    canonicalUrl: 'https://sizesnap.in/blog/ssc-cgl-photo-size-name-date-guidelines-2026',
    relatedTools: ['passport-photo-maker', 'reduce-image-size-in-kb', 'generate-signature'],
    relatedArticles: ['upsc-photo-signature-size-otr-guidelines-2026', 'how-to-resize-signature-to-10kb-20kb-online', 'delhi-police-photo-signature-size-guidelines-2026'],
    officialSources: [{ name: 'Staff Selection Commission (SSC Official Portal)', url: 'https://ssc.gov.in' }],
    examYear: '2026',
    examName: 'SSC CGL / CHSL / MTS / GD',
    content: `
<h2>Official SSC CGL Photograph Requirements 2026</h2>
<p>Every year, thousands of candidates face application rejection during the Staff Selection Commission (SSC) Combined Graduate Level (CGL) examination scrutiny simply due to incorrect photograph dimensions, blurred biometric details, or invalid file sizes. Following the latest guidelines from the SSC notification is crucial for a smooth application process.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Parameter</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Official SSC Requirement</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Dimensions</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">3.5 cm (width) × 4.5 cm (height)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Pixel Resolution</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">100 × 120 pixels to 200 × 240 pixels (or 413 × 531 px at 300 DPI)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>File Size Limit</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Strictly between <strong>20 KB and 50 KB</strong></td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Format</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPEG / JPG only</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Background</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Light grey, plain white, or off-white background</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Recency</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Must not be older than 3 months from notification date</td>
    </tr>
  </tbody>
</table>

<h2>Do You Need Name and Date of Photo (DOP) on SSC Photos?</h2>
<p>In previous cycles and state police examinations, having the <strong>Candidate Name</strong> and the <strong>Date on which the photograph was taken (DOP)</strong> clearly printed in capital letters on a white strip at the bottom of the photo was mandatory. While live camera capture is used in recent SSC portals, uploaded scanned copies must strictly feature a recent front-facing portrait. Adding your Name and Date of Photo on scanned copies remains standard best practice to prevent identity challenges and scrutiny disputes.</p>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Quick Tool Recommendation:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">You can generate a compliant 3.5 × 4.5 cm passport photo with your <strong>Name & Date strip</strong> and auto-compress it directly to <strong>20KB – 50KB</strong> using our free <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Passport Photo Maker Online</a>. Also explore our dedicated <a href="/exams/ssc-photo-signature-resizer" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SSC Photo & Signature Resizer</a>.</p>
</div>

<h2>How to Make an SSC Compliant Photo Online for Free</h2>
<ol>
  <li><strong>Capture a Clean Portrait:</strong> Stand in front of a white or light-colored wall with even lighting on both sides of your face. Do not wear caps, spectacles, or tinted glasses. Both ears must be visible.</li>
  <li><strong>Open SizeSnap Passport Photo Maker:</strong> Visit <a href="/tools/passport-photo-maker">SizeSnap Passport Photo Maker</a>.</li>
  <li><strong>Select 3.5 × 4.5 cm Preset:</strong> The tool automatically preselects official Indian Passport and SSC dimensions.</li>
  <li><strong>Enable Name & Date (Optional):</strong> Check the box for <em>"Add Name & Date on Photo"</em>, type your full name in uppercase (e.g. <code>RAHUL SHARMA</code>) and the date of taking the photograph.</li>
  <li><strong>Align with Biometric Guides:</strong> Use the interactive framing oval to align your face so it occupies 70% to 80% of the frame.</li>
  <li><strong>Download with 1-Click:</strong> Click <strong>"Download for Govt Exam Portal (20KB - 50KB)"</strong> to get a pre-compressed, portal-ready image instantly.</li>
</ol>

<h2>SSC CGL Signature Specifications (10KB – 20KB)</h2>
<p>Along with the photograph, candidates must upload an official signature. Here are the strict rules for the signature file:</p>
<ul>
  <li><strong>Dimensions:</strong> 4.0 cm (width) × 2.0 cm (height)</li>
  <li><strong>File Size:</strong> Strictly between <strong>10 KB and 20 KB</strong></li>
  <li><strong>Ink Color:</strong> Black ink on white unruled paper is strongly recommended.</li>
  <li><strong>Important:</strong> Sign in running hand script; signatures in all CAPITAL LETTERS are rejected by SSC.</li>
</ul>
<p>Need to resize or clean your signature? Read our full guide on <a href="/blog/how-to-resize-signature-to-10kb-20kb-online">How to Resize Signature to 10KB - 20KB Online</a> or use our instant <a href="/tools/generate-signature">Online Signature Tool</a>.</p>

<h2>Top Mistakes That Lead to SSC Form Rejection</h2>
<ul>
  <li><strong>Wearing Glasses / Spectacles:</strong> Even regular reading glasses cause reflections and will result in instant rejection. Always remove glasses before taking the photo.</li>
  <li><strong>Selfies & Tilted Angles:</strong> Photos taken from an angle, selfies with distorted focal lengths, or photos looking away from the camera are strictly invalid.</li>
  <li><strong>File Size Exceeding 50KB:</strong> If your photo is 51 KB, the portal will reject it with an error. Ensure your image is strictly between 20 KB and 50 KB using our <a href="/tools/compress-image-to-50kb">50KB Photo Compressor</a>.</li>
  <li><strong>Old Childhood or College Photos:</strong> Your photo must match your present facial biometric appearance on the day of the Tier-1 exam.</li>
</ul>

<h2>Conclusion</h2>
<p>Do not let minor technical errors compromise months of hard preparation for SSC CGL 2026. Use free, client-side tools like <a href="/tools/passport-photo-maker">SizeSnap Passport Photo Maker</a> and the <a href="/exams/ssc-photo-signature-resizer">SSC Photo Resizer Tool</a> to prepare your documents cleanly, securely, and within exact notification specifications.</p>
`,
  },
  {
    id: 'upsc-photo-signature-size-otr-guidelines-2026',
    title: 'UPSC CSE & OTR 2026: Photo and Signature Size, Format, Name & Date Guidelines',
    slug: 'upsc-photo-signature-size-otr-guidelines-2026',
    excerpt: 'Complete official guide on UPSC One Time Registration (OTR) and Civil Services 2026 photograph and signature specifications. Learn exact 350x350 to 1000x1000 px dimensions, 20KB–300KB file sizes, Name & Date rules, and avoid OTR application rejection.',
    category: 'exam-guides',
    tags: ['UPSC', 'UPSC OTR', 'Civil Services', 'Photo Resizer', 'Govt Exam', 'Signature Resizer'],
    status: 'PUBLISHED',
    featured: true,
    priority: 9,
    author: {
      name: 'SizeSnap Exam Research Team',
      role: 'Govt Exam Documentation Specialist',
    },
    readingTime: 7,
    publishedAt: 1773100000000,
    createdAt: 1773100000000,
    seoTitle: 'UPSC Photo & Signature Size 2026: OTR Dimensions (350x350 px), Name & Date, 20KB-300KB Guide',
    seoDescription: 'Complete official UPSC 2026 photo and signature specifications. Exact dimensions (350x350 to 1000x1000 px), 20KB-300KB file size limits, Name & Date rules, and free online resizing tools.',
    canonicalUrl: 'https://sizesnap.in/blog/upsc-photo-signature-size-otr-guidelines-2026',
    relatedTools: ['passport-photo-maker', 'generate-signature', 'reduce-image-size-in-kb'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'how-to-resize-signature-to-10kb-20kb-online'],
    officialSources: [{ name: 'Union Public Service Commission (upsconline.nic.in)', url: 'https://upsconline.nic.in' }],
    examYear: '2026',
    examName: 'UPSC Civil Services / NDA / CDS / OTR',
    content: `
<h2>Official UPSC 2026 & OTR Photograph Specifications</h2>
<p>The Union Public Service Commission (UPSC) implements strict photographic and biometric validation rules for the <strong>One Time Registration (OTR)</strong> portal and applications for exams like Civil Services Examination (CSE), NDA, CDS, and CAPF. Any deviation in image dimensions, date stamp recency, or facial clarity leads to application rejection during preliminary scrutiny.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Parameter</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Photograph Requirement</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Signature Requirement</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Pixel Dimensions</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Min: 350 × 350 px | Max: 1000 × 1000 px</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Min: 350 × 350 px | Max: 1000 × 1000 px</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Aspect Ratio</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Square (1:1 aspect ratio)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Square (1:1 aspect ratio)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>File Size Range</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>20 KB to 300 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>20 KB to 300 KB</strong></td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>File Format</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPG / JPEG only</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPG / JPEG only</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Background</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Plain White Background</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Plain White Unruled Paper</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Mandatory Text</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Candidate Name & Date of Photo (DOP) at bottom</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">None (Running hand signature only)</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Direct UPSC Resizer Tool:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Want an exact 350×350 px or 1000×1000 px photo with your <strong>Candidate Name and Date stamp</strong> automatically compressed between 20KB and 300KB? Use our dedicated <a href="/exams/upsc-photo-signature-resizer" style="color: #414FA8; text-decoration: underline; font-weight: bold;">UPSC Photo & Signature Resizer Online</a> or test our general <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Passport Photo Maker</a>.</p>
</div>

<h2>Mandatory Name and Date of Photograph (DOP) Rule for UPSC</h2>
<p>UPSC has introduced a strict guideline for photographs uploaded on the OTR portal:</p>
<ul>
  <li>The photograph must <strong>not be older than 10 days</strong> from the date of online application opening.</li>
  <li>The candidate's <strong>full name</strong> and the <strong>date on which the photograph was taken</strong> must be clearly printed in legible, dark text on a white strip at the bottom of the photograph.</li>
  <li>The candidate's face must occupy at least <strong>75% of the total photograph area</strong>.</li>
  <li>The appearance must match your look in all stages of the examination (Prelims, Mains, and Personality Test/Interview). For instance, if you upload a bearded photograph, you must maintain that appearance during the interview.</li>
</ul>

<h2>Step-by-Step Guide: How to Prepare Your UPSC Photo & Signature</h2>
<ol>
  <li><strong>Take a Bright Frontal Portrait:</strong> Stand in front of a white wall or backdrop in a well-lit room. Look straight into the camera with both ears and eyes visible. Do not wear sunglasses or hats.</li>
  <li><strong>Open SizeSnap UPSC Resizer:</strong> Navigate to <a href="/exams/upsc-photo-signature-resizer">UPSC Photo & Signature Resizer</a>.</li>
  <li><strong>Upload Image & Enter Details:</strong> Input your full registered name (in CAPITAL letters, e.g. <code>VISHAL PATEL</code>) and the date of capture (e.g. <code>12-02-2026</code>).</li>
  <li><strong>Adjust Face Oval:</strong> Ensure your head and shoulders fill 75% of the 1:1 framing box.</li>
  <li><strong>Download Compliant JPG:</strong> Click download. SizeSnap automatically formats the image to 500 × 500 pixels and balances compression so the file size sits comfortably between 40 KB and 150 KB (well within the 20 KB to 300 KB requirement).</li>
</ol>

<h2>UPSC Signature Guidelines (20 KB to 300 KB)</h2>
<p>Signatures on UPSC portals must adhere to strict biometric standards:</p>
<ul>
  <li><strong>Ink:</strong> Sign using a black ink pen on fresh, unlined white paper. Black ink provides superior contrast when scanned.</li>
  <li><strong>No Capital Letters:</strong> UPSC specifically rejects signatures made entirely in BLOCK CAPITAL letters. Only natural, cursive running handwriting is accepted.</li>
  <li><strong>Aspect Ratio:</strong> UPSC expects a square 1:1 frame (minimum 350 × 350 pixels). When uploading a standard rectangular signature, center it within a square canvas with a clean white margin.</li>
  <li>If your scanned signature looks grey or has background shadows, check out our guide on <a href="/blog/how-to-resize-signature-to-10kb-20kb-online">How to Resize Signature for Online Applications</a> or crop it with <a href="/tools/generate-signature">SizeSnap Signature Tool</a>.</li>
</ul>

<h2>Common Reasons UPSC Applications Get Flagged or Rejected</h2>
<div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #991B1B;">⚠️ Watch Out For These Disqualifications:</p>
  <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #7F1D1D;">
    <li><strong>Old Photographs:</strong> Submitting photos older than 10 days violates official UPSC terms.</li>
    <li><strong>Missing Name or Date:</strong> An ordinary passport photo without the printed name and DOP strip will be flagged during document verification.</li>
    <li><strong>Spectacles Reflection:</strong> Glare on spectacle lenses that obscures the pupils will result in immediate rejection. Remove spectacles before taking the picture.</li>
    <li><strong>Distorted Aspect Ratio:</strong> Stretching a portrait into a square manually produces facial distortion. Always crop using an aspect ratio lock.</li>
  </ul>
</div>

<h2>Frequently Asked Questions (FAQs)</h2>
<h3>Can I edit or change my UPSC OTR photo after submission?</h3>
<p>UPSC permits a 7-day correction window after the close of the application period for each respective examination cycle. However, it is always recommended to upload a compliant photo initially to avoid last-minute portal slowdowns.</p>

<h3>What if my signature file is below 20 KB?</h3>
<p>The UPSC portal will throw an error such as <em>"File size is less than 20 KB"</em>. If your file is too small, use our <a href="/tools/reduce-image-size-in-kb">SizeSnap Image Resizer</a> to re-export at high DPI or adjust quality to exceed 25 KB.</p>

<h2>Related Guides</h2>
<p>Preparing for multiple competitive exams? Check our <a href="/blog/ssc-cgl-photo-size-name-date-guidelines-2026">SSC CGL Photo & Date Format Guide</a> to compare SSC and UPSC documentation rules.</p>
`,
  },
  {
    id: 'how-to-resize-signature-to-10kb-20kb-online',
    title: 'How to Resize Signature to 10KB – 20KB for Online Applications (Without Blur)',
    slug: 'how-to-resize-signature-to-10kb-20kb-online',
    excerpt: 'Master the complete technique of photographing, cropping, whitening backgrounds, and resizing digital signatures to exactly 10KB - 20KB for SSC, UPSC, IBPS, and state government portals without pixelation or blur.',
    category: 'how-to',
    tags: ['Signature Resizer', '10KB to 20KB', 'Govt Exam', 'Online Application', 'Image Compressor'],
    status: 'PUBLISHED',
    featured: true,
    priority: 8,
    author: {
      name: 'SizeSnap Technical Team',
      role: 'Digital Imaging & Document Specialist',
    },
    readingTime: 6,
    publishedAt: 1773120000000,
    createdAt: 1773120000000,
    seoTitle: 'How to Resize Signature to 10KB - 20KB Online Free (Clear & Unblurred)',
    seoDescription: 'Step-by-step guide to resizing signatures to 10KB-20KB for SSC, IBPS, UPSC, and state government job forms. Fix blur, remove paper shadows, and pass portal validation instantly.',
    canonicalUrl: 'https://sizesnap.in/blog/how-to-resize-signature-to-10kb-20kb-online',
    relatedTools: ['generate-signature', 'compress-image-to-20kb', 'reduce-image-size-in-kb'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'upsc-photo-signature-size-otr-guidelines-2026', 'ibps-sbi-photo-signature-thumb-declaration-guidelines'],
    content: `
<h2>Why Online Portals Demand Strict 10KB – 20KB Signatures</h2>
<p>When applying for competitive examinations like <strong>SSC (CGL, CHSL, MTS)</strong>, <strong>IBPS (PO, Clerk)</strong>, <strong>State Police recruitments</strong>, or university entrance exams, you will almost universally encounter the rule: <em>"Signature image size must be strictly between 10 KB and 20 KB in JPG format"</em>.</p>

<p>Most candidates photograph their signature with a smartphone camera, which produces a 3 MB to 5 MB file. When they run that file through generic compressors, the signature turns into a blurry, illegible smudge that fails portal validation. This in-depth guide reveals the exact technique to prepare a razor-sharp signature file under 20 KB.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Recruitment Board</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Signature Size Limit</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Allowed Dimensions</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Special Conditions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Staff Selection Commission (SSC)</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">10 KB – 20 KB</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">4.0 cm × 2.0 cm (140 × 60 px)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Black ink, no capital letters</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>IBPS / SBI Banking</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">10 KB – 20 KB</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">140 × 60 px (200 DPI)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Black ink strictly required</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>State Police (UP, Delhi, Bihar)</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">10 KB – 20 KB</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">3.5 cm × 1.5 cm</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Plain white paper only</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>UPSC OTR</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">20 KB – 300 KB</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">350 × 350 px to 1000 × 1000 px</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Square framing required</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Ready-Made Resizer:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Skip manual math and crop directly with our free <a href="/tools/generate-signature" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Online Signature Generator & Resizer</a> or compress an existing photo using <a href="/tools/compress-image-to-20kb" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap 20KB Image Compressor</a>.</p>
</div>

<h2>Step 1: How to Capture a Clear Signature with Your Smartphone</h2>
<ol>
  <li><strong>Use Plain Unruled White Paper:</strong> Never sign on lined notebook paper, dairy sheets, or textured paper. Lined rules confuse OCR scanners and lead to instant disqualification.</li>
  <li><strong>Choose the Right Pen:</strong> Use a dark black gel pen or ballpoint pen with a 0.7mm tip. Avoid faint blue ballpoint pens or markers that bleed through paper.</li>
  <li><strong>Avoid Shadows:</strong> Place the paper near a window or directly under bright ceiling lighting. Hold your smartphone parallel to the paper so your hands do not cast shadows across the ink.</li>
  <li><strong>Fill the Frame:</strong> Don't photograph the entire desk. Zoom in slightly (1.5x optical zoom works best to eliminate perspective distortion).</li>
</ol>

<h2>Step 2: Crop and Whiten the Background</h2>
<p>The #1 reason compressed signatures become blurry is <strong>background noise</strong>. Smartphone cameras capture yellowish or greyish paper textures with millions of subtle color variations. Compressing all that background noise eats up your precious 20 KB limit, forcing the compression algorithm to destroy ink sharpness.</p>

<p>When you use the <a href="/tools/generate-signature">SizeSnap Signature Tool</a>, the browser automatically applies a high-contrast threshold filter:</p>
<ul>
  <li>The paper background turns 100% pure white (RGB 255, 255, 255).</li>
  <li>The ink strokes become deep, uniform black.</li>
  <li>Because pure white pixels compress exceptionally well under JPEG Huffman encoding, 90% of the 15 KB file budget goes directly into preserving crisp stroke outlines!</li>
</ul>

<h2>Step 3: Export Strictly Between 10 KB and 20 KB</h2>
<p>Government portals use automated file checkers with strict boundaries:</p>
<ul>
  <li>If the file is <strong>9.8 KB</strong>: Portal shows <em>"File size too small (Min 10 KB)"</em>.</li>
  <li>If the file is <strong>20.4 KB</strong>: Portal shows <em>"File size exceeded (Max 20 KB)"</em>.</li>
</ul>
<p>On SizeSnap, the target slider is calibrated precisely for government exam portals. Set the target slider to <strong>15 KB</strong> (the golden safe zone) and click export. You get a file that passes both minimum and maximum boundaries on the first try.</p>

<h2>Critical Mistakes to Avoid</h2>
<ul>
  <li><strong>Signing in ALL CAPITAL LETTERS:</strong> Recruitment bodies including SSC and IBPS explicitly state that signatures in all capital letters are invalid. Sign in your natural cursive or running hand.</li>
  <li><strong>Submitting Blurred Signatures:</strong> Scrutiny officers verify signatures against attendance sheets in the examination hall. An unreadable digital signature can cause biometric verification hold-ups on exam day.</li>
  <li><strong>Uploading PNG instead of JPG:</strong> Most exam forms only accept <code>.jpg</code> or <code>.jpeg</code> extensions. SizeSnap exports JPG by default.</li>
</ul>

<h2>Conclusion</h2>
<p>Creating a compliant 10KB to 20KB signature takes less than 30 seconds when you eliminate paper shadows and use client-side compression. Prepare your files privately using our <a href="/tools/generate-signature">Signature Tool</a> or check our <a href="/exams/ssc-photo-signature-resizer">SSC Signature Resizer</a> for preset exam dimensions.</p>
`,
  },
  {
    id: 'how-to-compress-pdf-to-100kb-140kb-for-govt-portals',
    title: 'How to Compress PDF to 100KB – 140KB for Government Portals Without Losing Text Quality',
    slug: 'how-to-compress-pdf-to-100kb-140kb-for-govt-portals',
    excerpt: 'Struggling to upload marksheets, certificates, or identity proofs under 100KB or 140KB? Here is how to compress PDF documents to exact size limits while keeping certificates readable and 100% private.',
    category: 'how-to',
    tags: ['Compress PDF', '140KB PDF', 'Govt Portals', 'PDF Compressor', 'Document Privacy'],
    status: 'PUBLISHED',
    featured: false,
    priority: 7,
    author: {
      name: 'SizeSnap Technical Team',
      role: 'Document Optimization Specialist',
    },
    readingTime: 6,
    publishedAt: 1773140000000,
    createdAt: 1773140000000,
    seoTitle: 'Compress PDF to 100KB - 140KB Online for Govt Portals | Clear Text Guide',
    seoDescription: 'Learn how to compress PDF to 100KB or 140KB for government job and exam portals. Maintain clear certificate text, optimize DPI, and protect privacy with client-side compression.',
    canonicalUrl: 'https://sizesnap.in/blog/how-to-compress-pdf-to-100kb-140kb-for-govt-portals',
    relatedTools: ['compress-pdf', 'reduce-image-size-in-kb', 'passport-photo-maker'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'how-to-reduce-image-size-in-kb-without-losing-quality'],
    content: `
<h2>The 100KB – 140KB PDF Challenge in Indian Online Applications</h2>
<p>State Public Service Commissions (such as UPPSC, BPSC, MPSC), High Court recruitment portals, teacher eligibility portals (CTET/STET), and scholarship schemes regularly require candidates to upload scanned documents — such as 10th class marksheets, caste certificates, income certificates, and domicile certificates — in <strong>PDF format between 100 KB and 140 KB</strong>.</p>

<p>Compressing a certificate scan below 140 KB is tricky. If compressed too aggressively, serial numbers, seal stamps, and signatures blur into unreadable noise, leading to document verification rejection. Here is how to achieve the perfect balance between low file size and crisp readability.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Portal / Application</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Document Type</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Mandatory Size Limit</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Format</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>State PSC Recruitment</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Category & Domicile Certificates</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">100 KB – 140 KB</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">PDF</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>National Scholarship Portal (NSP)</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Income & Fee Receipts</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Max 100 KB to 200 KB</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">PDF</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>High Court & Subordinate Courts</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Experience & Degree Certificates</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Below 140 KB</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">PDF</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Bar Council / State Nursing Portals</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Registration Certificates</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Strictly 100 KB – 150 KB</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">PDF</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ One-Click 140KB PDF Compressor:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Need to hit the exact 140 KB target right now? Use our specialized <a href="/tools/compress-pdf-140kb" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Compress PDF to 140KB Tool</a> or use our versatile <a href="/tools/compress-pdf" style="color: #414FA8; text-decoration: underline; font-weight: bold;">General PDF Compressor</a>.</p>
</div>

<h2>Why Scanning at 300 DPI Blows Up PDF Sizes</h2>
<p>When you scan a certificate on a flatbed scanner or multifunction printer, the default setting is usually <strong>300 DPI Color</strong>. An A4 document at 300 DPI in 24-bit RGB color contains over 8.7 million pixels and creates a file size of 2 MB to 6 MB.</p>

<p>To reduce this file size safely without compromising vital numbers:</p>
<ul>
  <li><strong>Switch from Color to 8-bit Grayscale:</strong> Most certificates are printed on plain paper with black text and a single coloured seal. Switching to grayscale instantly reduces raw uncompressed image data by 66% with zero loss of textual legibility.</li>
  <li><strong>Adjust Resolution to 150 DPI:</strong> At 150 DPI, all fine text, government stamps, and barcode lines remain 100% sharp for human scrutiny and automated OCR readers, but the data volume is reduced by 75%.</li>
</ul>

<h2>Why Client-Side Privacy Matters for Sensitive Certificates</h2>
<div style="background-color: #ECFDF5; border-left: 4px solid #059669; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #065F46;">🔒 100% Privacy Guarantee on SizeSnap:</p>
  <p style="margin: 6px 0 0 0; color: #047857;">Unlike traditional cloud compressors that upload your Aadhaar card, Caste Certificate, or Marksheet to third-party web servers, <strong>SizeSnap processes all files directly in your web browser using HTML5 Canvas and WebAssembly</strong>. Your confidential documents never leave your phone or laptop.</p>
</div>

<h2>Step-by-Step: Compressing PDF to 100KB – 140KB on SizeSnap</h2>
<ol>
  <li><strong>Open the Tool:</strong> Visit <a href="/tools/compress-pdf-140kb">SizeSnap Compress PDF to 140KB</a>.</li>
  <li><strong>Select Your PDF:</strong> Drag and drop your scanned marksheet or certificate PDF file.</li>
  <li><strong>Select Compression Mode:</strong> Choose <em>"Portal Optimized (Target 120KB - 135KB)"</em>. This leaves a safe 5KB buffer below the 140KB maximum threshold.</li>
  <li><strong>Preview Document:</strong> Zoom into the registration number and issuing authority signature to confirm text crispness.</li>
  <li><strong>Download Instantly:</strong> Save the compressed PDF ready for portal submission.</li>
</ol>

<h2>Need JPG to PDF Under 140KB?</h2>
<p>If your certificate is saved as a JPG or smartphone photo, use our <a href="/tools/image-to-pdf">Image to PDF Converter</a>. It converts your image into a standardized A4 PDF and applies compression in a single operation.</p>

<h2>Conclusion</h2>
<p>Never risk portal rejections or security leaks with unverified cloud converters. Use <a href="/tools/compress-pdf">SizeSnap PDF Tools</a> to optimize your application documents quickly, cleanly, and privately.</p>
`,
  },
  {
    id: 'aktu-cgpa-to-percentage-formula-conversion-guide',
    title: 'AKTU CGPA to Percentage Formula 2026: Official Conversion Rules & Calculator Guide',
    slug: 'aktu-cgpa-to-percentage-formula-conversion-guide',
    excerpt: 'Official Dr. A.P.J. Abdul Kalam Technical University (AKTU) CGPA to percentage conversion formula explained. Learn how to convert SGPA and CGPA into percentage marks for campus placements, GATE, and govt jobs.',
    category: 'student-tips',
    tags: ['AKTU', 'CGPA to Percentage', 'BTech Marks', 'Engineering Calculator', 'SGPA to Percentage'],
    status: 'PUBLISHED',
    featured: false,
    priority: 6,
    author: {
      name: 'SizeSnap Academic Research',
      role: 'University Academic Coordinator',
    },
    readingTime: 5,
    publishedAt: 1773160000000,
    createdAt: 1773160000000,
    seoTitle: 'AKTU CGPA to Percentage Formula 2026: Official Circular & Conversion Guide',
    seoDescription: 'Convert AKTU CGPA to percentage with official university formulas. Complete guide for B.Tech, MBA, MCA students with division classification, examples, and free online calculator.',
    canonicalUrl: 'https://sizesnap.in/blog/aktu-cgpa-to-percentage-formula-conversion-guide',
    relatedTools: ['cgpa-to-percentage', 'marks-percentage-calculator', 'attendance-calculator'],
    relatedArticles: ['cbse-cgpa-to-percentage-formula-conversion-guide', 'college-attendance-calculator-75-percent-rule-guide'],
    content: `
<h2>The Official AKTU CGPA to Percentage Formula Explained</h2>
<p>Every year, engineering, management, and pharmacy students graduating from <strong>Dr. A.P.J. Abdul Kalam Technical University (AKTU / UPTU)</strong> face a recurring question during campus placements, TCS/Infosys onboarding, GATE applications, and UPSC/SSC forms: <em>"How do I convert my AKTU CGPA into aggregate percentage marks?"</em></p>

<p>Because AKTU marksheet transcripts display <strong>SGPA (Semester Grade Point Average)</strong> and <strong>CGPA (Cumulative Grade Point Average)</strong> on a 10-point scale without printing an overall percentage, students must use the university's official conversion formula.</p>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 20px; margin: 24px 0; border-radius: 6px;">
  <h3 style="margin: 0 0 8px 0; color: #414FA8; font-size: 1.25rem;">📐 Official AKTU Formula (Current Ordinances):</h3>
  <p style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #1F2937;">Percentage (%) = CGPA × 10</p>
  <p style="margin: 8px 0 0 0; color: #4B5563; font-size: 0.95rem;">For example: If your final Cumulative Grade Point Average is <strong>7.85</strong>, your official university percentage is <code>7.85 × 10 = 78.50%</code>.</p>
</div>

<p>Need an instant calculation? Use our free <a href="/cgpa-to-percentage" style="color: #414FA8; text-decoration: underline; font-weight: bold;">AKTU CGPA to Percentage Calculator</a> to compute your percentage with breakdown for all semesters.</p>

<h2>Historical Formula vs Current Formula: Which One Applies to You?</h2>
<p>Over the years, AKTU has issued multiple academic circulars regarding credit-based grading systems:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Batch / Academic Cycle</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Applicable Formula</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Example (7.5 CGPA)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Current Batches (CBCS Pattern)</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Percentage = CGPA × 10</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">7.5 × 10 = <strong>75.00%</strong></td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Older Batches (Legacy Ordinances)</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Percentage = (CGPA - 0.75) × 10</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">(7.5 - 0.75) × 10 = <strong>67.50%</strong></td>
    </tr>
  </tbody>
</table>

<p>For all current batches graduating under the <strong>Choice Based Credit System (CBCS)</strong>, the university transcript backside instructions explicitly specify multiplying CGPA by 10.</p>

<h2>AKTU Division & Honours Classification Criteria</h2>
<p>AKTU classifies graduating students into academic divisions based on their final CGPA score and clearance record:</p>
<ul>
  <li><strong>First Division with Honours:</strong> CGPA of <strong>7.50 or higher</strong> (75%+) AND the student must have passed all semester theory and practical subjects in the <em>first attempt without any back papers (carryover papers)</em>.</li>
  <li><strong>First Division:</strong> CGPA of <strong>6.50 to 7.49</strong> (or ≥ 7.50 with a cleared back paper in past semesters).</li>
  <li><strong>Second Division:</strong> CGPA between <strong>5.00 and 6.49</strong>.</li>
  <li><strong>Pass Division:</strong> Minimum passing CGPA specified by the department ordinance (usually 5.00).</li>
</ul>

<h2>Quick Conversion Reference Table</h2>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">CGPA (Scale of 10)</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Equivalent Percentage</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Standard Division</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">9.00</td><td style="padding: 10px; border: 1px solid #E5E7EB;">90.00%</td><td style="padding: 10px; border: 1px solid #E5E7EB;">First Division with Honours</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">8.50</td><td style="padding: 10px; border: 1px solid #E5E7EB;">85.00%</td><td style="padding: 10px; border: 1px solid #E5E7EB;">First Division with Honours</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">8.00</td><td style="padding: 10px; border: 1px solid #E5E7EB;">80.00%</td><td style="padding: 10px; border: 1px solid #E5E7EB;">First Division with Honours</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">7.50</td><td style="padding: 10px; border: 1px solid #E5E7EB;">75.00%</td><td style="padding: 10px; border: 1px solid #E5E7EB;">First Division with Honours</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">7.00</td><td style="padding: 10px; border: 1px solid #E5E7EB;">70.00%</td><td style="padding: 10px; border: 1px solid #E5E7EB;">First Division</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">6.75</td><td style="padding: 10px; border: 1px solid #E5E7EB;">67.50%</td><td style="padding: 10px; border: 1px solid #E5E7EB;">First Division</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">6.50</td><td style="padding: 10px; border: 1px solid #E5E7EB;">65.00%</td><td style="padding: 10px; border: 1px solid #E5E7EB;">First Division</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">6.00</td><td style="padding: 10px; border: 1px solid #E5E7EB;">60.00%</td><td style="padding: 10px; border: 1px solid #E5E7EB;">Second Division</td></tr>
  </tbody>
</table>

<h2>Explore More Student Tools on SizeSnap</h2>
<ul>
  <li>Convert individual semester SGPA scores using our <a href="/sgpa-to-percentage">SGPA to Percentage Calculator</a>.</li>
  <li>Calculate overall semester marks using our <a href="/marks-percentage-calculator">Marks Percentage Calculator</a>.</li>
  <li>Worried about exam eligibility? Use our <a href="/attendance-calculator">75% Attendance Calculator</a> to see how many classes you can afford to miss safely.</li>
  <li>Convert general ratios and scores with our <a href="/percentage-calculator">All-in-One Percentage Calculator</a>.</li>
</ul>

<h2>Conclusion</h2>
<p>Calculating your official AKTU percentage is straightforward once you know the exact ordinance that applies to your batch. Bookmark this guide and use <a href="/cgpa-to-percentage">SizeSnap CGPA Calculator</a> for fast, accurate conversions.</p>
`,
  },
  {
    id: 'ibps-sbi-photo-signature-thumb-declaration-guidelines',
    title: 'IBPS & SBI Banking Exam Upload: Photo, Signature, Left Thumb & Handwritten Declaration Rules',
    slug: 'ibps-sbi-photo-signature-thumb-declaration-guidelines',
    excerpt: 'Complete official guidelines for IBPS PO/Clerk and SBI recruitment uploads. Master the 4 mandatory documents: Photograph (20-50KB), Signature (10-20KB), Left Thumb Impression (20-50KB), and Handwritten Declaration (50-100KB).',
    category: 'exam-guides',
    tags: ['IBPS', 'SBI PO', 'Banking Exam', 'Handwritten Declaration', 'Thumb Impression', 'Signature Resizer'],
    status: 'PUBLISHED',
    featured: true,
    priority: 8,
    author: {
      name: 'SizeSnap Exam Research Team',
      role: 'Banking Exam Documentation Specialist',
    },
    readingTime: 7,
    publishedAt: 1773180000000,
    createdAt: 1773180000000,
    seoTitle: 'IBPS & SBI Photo, Signature, Thumb & Declaration Size Guide 2026',
    seoDescription: 'Official document upload specifications for IBPS and SBI exams. Exact KB limits, dimensions, verbatim handwritten declaration text, and free instant resizing tools.',
    canonicalUrl: 'https://sizesnap.in/blog/ibps-sbi-photo-signature-thumb-declaration-guidelines',
    relatedTools: ['generate-signature', 'passport-photo-maker', 'compress-image-to-50kb'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'how-to-resize-signature-to-10kb-20kb-online'],
    officialSources: [{ name: 'Institute of Banking Personnel Selection (IBPS Official)', url: 'https://ibps.in' }],
    examYear: '2026',
    examName: 'IBPS PO / Clerk / RRB / SBI PO',
    content: `
<h2>The 4 Mandatory Uploads for IBPS and SBI Banking Portals</h2>
<p>Unlike exams that require only a photo and signature, banking recruitment portals managed by the <strong>Institute of Banking Personnel Selection (IBPS)</strong> and the <strong>State Bank of India (SBI)</strong> require candidates to upload <strong>four distinct biometric documents</strong>. A single formatting mistake in your handwritten declaration or signature can invalidate your application during provisional allotment.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Document</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Dimensions (px)</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">File Size (KB)</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Ink / Medium Requirements</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Passport Photograph</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">200 × 230 px (preferred)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>20 KB – 50 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Light colored or plain white background</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Signature</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">140 × 60 px</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>10 KB – 20 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Strictly <strong>Black Ink</strong> on white unruled paper</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Left Thumb Impression (LTI)</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">240 × 240 px (3 × 3 cm)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>20 KB – 50 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Blue or Black ink stamp pad</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Handwritten Declaration</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">800 × 400 px</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>50 KB – 100 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Written in English by applicant only, <strong>Black ink</strong></td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Bank Exam Resizer Kit:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Format all 4 banking files in 2 minutes using our dedicated <a href="/exams/ibps-bank-photo-signature-resizer" style="color: #414FA8; text-decoration: underline; font-weight: bold;">IBPS & SBI Photo, Signature & Thumb Resizer</a> or crop your signature with <a href="/tools/generate-signature" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Signature Maker</a>.</p>
</div>

<h2>Official Handwritten Declaration Text (Verbatim Format)</h2>
<p>The text for the handwritten declaration must strictly follow the official IBPS notification wording. Any deviation or typing will result in cancellation:</p>

<div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; padding: 18px; margin: 20px 0; border-radius: 6px; font-style: italic; color: #1E293B;">
  <p style="margin: 0; line-height: 1.6;">
    "I, _______________ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required."
  </p>
</div>

<h3>Strict Rules for the Handwritten Declaration:</h3>
<ul>
  <li><strong>Black Ink Pen Only:</strong> Writing the declaration in blue ink or pencil is strictly forbidden.</li>
  <li><strong>Candidate's Own Handwriting:</strong> It must be penned by the applicant themselves. If written by someone else, candidature will be cancelled.</li>
  <li><strong>NO CAPITAL LETTERS:</strong> The declaration must be written in normal running cursive script. A declaration written in ALL CAPITAL LETTERS is deemed invalid.</li>
  <li><strong>English Language Only:</strong> Declarations in regional languages or Hindi are not accepted for central IBPS/SBI applications.</li>
</ul>

<h2>Left Thumb Impression (LTI) Guidelines (20 KB – 50 KB)</h2>
<ol>
  <li>Press your left thumb gently onto a fresh blue or black stamp pad. Do not apply excessive ink to prevent smearing.</li>
  <li>Make a clean, firm impression on a blank white sheet of unruled paper. Ridge patterns must be clearly distinguishable.</li>
  <li>If a candidate has no left thumb, the right thumb may be used, and this fact must be clearly indicated in the online application form.</li>
  <li>Photograph the impression in bright daylight and compress it between <strong>20 KB and 50 KB</strong> using <a href="/tools/compress-image-to-50kb">SizeSnap 50KB Compressor</a>.</li>
</ol>

<h2>Signature Rules for Banking Aspirants (10 KB – 20 KB)</h2>
<p>The signature must be signed on white paper with a <strong>black ink pen</strong>. Ensure the file size remains strictly within 10 KB to 20 KB. Learn our foolproof method in <a href="/blog/how-to-resize-signature-to-10kb-20kb-online">How to Resize Signature for Online Applications</a>.</p>

<h2>Conclusion</h2>
<p>Preparing compliant documents for IBPS and SBI forms ensures you focus entirely on your Prelims and Mains preparation. Use <a href="/exams/ibps-bank-photo-signature-resizer">SizeSnap Banking Document Resizer</a> for fast, guaranteed-compliant document uploads.</p>
`,
  },
  {
    id: 'neet-ug-photo-size-postcard-passport-thumb-guidelines-2026',
    title: 'NEET UG 2026: Postcard Size (4x6 Inch) Photo, Passport Photo & Finger Impressions Guide',
    slug: 'neet-ug-photo-size-postcard-passport-thumb-guidelines-2026',
    excerpt: 'Comprehensive National Testing Agency (NTA) NEET UG 2026 documentation manual. Exact specifications for 4x6 Postcard photo, Passport photo with Name and Date, and Left/Right hand finger impressions.',
    category: 'exam-guides',
    tags: ['NEET UG', 'Postcard Photo 4x6', 'Passport Photo', 'NTA Guidelines', 'Medical Entrance', 'Photo Resizer'],
    status: 'PUBLISHED',
    featured: true,
    priority: 8,
    author: {
      name: 'SizeSnap Exam Research Team',
      role: 'Medical Entrance Documentation Specialist',
    },
    readingTime: 7,
    publishedAt: 1773200000000,
    createdAt: 1773200000000,
    seoTitle: 'NEET UG 2026 Photo Size: 4x6 Postcard, Passport, Thumb Impression Guide',
    seoDescription: 'Official NTA NEET 2026 photo specifications: 4x6 inch Postcard photo (10KB-200KB), Passport photo with Name & Date, Fingerprints & Signature rules explained.',
    canonicalUrl: 'https://sizesnap.in/blog/neet-ug-photo-size-postcard-passport-thumb-guidelines-2026',
    relatedTools: ['passport-photo-maker', 'compress-image-to-100kb', 'compress-image-to-200kb'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'how-to-resize-signature-to-10kb-20kb-online'],
    officialSources: [{ name: 'National Testing Agency (NTA NEET Official)', url: 'https://neet.nta.nic.in' }],
    examYear: '2026',
    examName: 'NEET UG Medical Entrance',
    content: `
<h2>Official NTA NEET UG 2026 Photograph & Document Guidelines</h2>
<p>The <strong>National Testing Agency (NTA)</strong> conducts the National Eligibility cum Entrance Test (NEET UG) for over 20 lakh MBBS/BDS aspirants annually. NTA enforces the strictest image uploading protocol in India, requiring both a standard <strong>Passport Size Photograph</strong> and an enlarged <strong>Postcard Size (4" × 6") Photograph</strong>, plus impressions of all fingers and thumbs of both hands.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Document</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Required Dimensions</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">File Size Range</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Mandatory Conditions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Passport Photograph</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">2.5 × 3.5 inches (3.5 × 4.5 cm)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>10 KB – 200 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">White background, 80% face coverage, Name & Date printed</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Postcard Size Photo</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>4 × 6 inches</strong> (10 × 15 cm)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>10 KB – 200 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Identical portrait as passport photo with Name & Date</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Fingers & Thumb Impressions</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Horizontal landscape template</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>10 KB – 200 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">All fingers & thumbs of both left and right hands</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Candidate Signature</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Running hand script</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>4 KB – 30 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Black ink pen on white paper</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Category / PwBD Certificate</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Standard A4 PDF</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>50 KB – 300 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Clear official seal and authority signatures</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Instant NEET Photo Creator:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Make both Passport and 4×6 Postcard photos with candidate Name & Date in 60 seconds with our free <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Passport Photo Maker</a>.</p>
</div>

<h2>The 4x6 Postcard Size Photo: Crucial Details</h2>
<p>Many candidates visit commercial photo studios and struggle to get the digital 4×6 format below 200 KB. Keep these NTA rules in mind:</p>
<ul>
  <li><strong>Exact Aspect Ratio:</strong> 4 inches wide by 6 inches tall (aspect ratio 2:3). At 300 DPI, this corresponds to <strong>1200 × 1800 pixels</strong>.</li>
  <li><strong>80% Face Coverage:</strong> The face must clearly occupy 80% of the photograph, showing forehead, eyes, nose, mouth, and chin without shadows. Ears must be visible.</li>
  <li><strong>Candidate Name and Date:</strong> A white strip at the bottom must display the candidate's full legal name and the date of taking the photograph (e.g. <code>ANANYA VERMA 14/03/2026</code>).</li>
  <li><strong>Spectacles:</strong> Spectacles are allowed only if worn regularly. Tinted, shaded, or sunglasses are strictly prohibited.</li>
</ul>

<h2>Both Hands Fingers and Thumb Impressions Rule</h2>
<p>NTA mandates uploading impressions of <strong>all four fingers and thumb of both left and right hands</strong> on a single sheet of plain paper:</p>
<ol>
  <li>Take a white unlined A4 paper.</li>
  <li>Using a blue ink stamp pad, press the five digits of your left hand (Thumb, Index, Middle, Ring, Little) neatly in a row on the left side.</li>
  <li>Repeat for your right hand digits on the right side.</li>
  <li>Capture the paper in bright light and compress between 10 KB and 200 KB using <a href="/tools/compress-image-to-100kb">SizeSnap 100KB Compressor</a>.</li>
</ol>

<h2>Conclusion</h2>
<p>Ensure you keep 6 to 8 hard copies of identical passport photos and 4 copies of the 4×6 postcard photo, as the exact same photos will be verified inside the examination hall and during medical counseling. Prepare your digital copies with <a href="/tools/passport-photo-maker">SizeSnap Photo Maker</a>.</p>
`,
  },
  {
    id: 'up-police-photo-signature-size-guidelines-2026',
    title: 'UP Police Constable & SI 2026: Photo & Signature Size, DigiLocker & Upload Guidelines',
    slug: 'up-police-photo-signature-size-guidelines-2026',
    excerpt: 'Official Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) document specifications. Learn exact 20KB-50KB photo rules, 5KB-20KB signature guidelines, and DigiLocker integration.',
    category: 'exam-guides',
    tags: ['UP Police', 'Constable', 'Sub Inspector', 'UPPRPB', 'Photo Resizer', 'Signature Resizer'],
    status: 'PUBLISHED',
    featured: false,
    priority: 7,
    author: {
      name: 'SizeSnap Exam Research Team',
      role: 'State Police Documentation Specialist',
    },
    readingTime: 6,
    publishedAt: 1773220000000,
    createdAt: 1773220000000,
    seoTitle: 'UP Police Photo & Signature Size 2026: 20KB-50KB UPPRPB Guidelines',
    seoDescription: 'Complete guide for UP Police Constable & SI document upload. Photo size (20KB-50KB, 35x45mm), Signature (5KB-20KB), background specifications, and instant resizer tools.',
    canonicalUrl: 'https://sizesnap.in/blog/up-police-photo-signature-size-guidelines-2026',
    relatedTools: ['passport-photo-maker', 'generate-signature', 'compress-image-to-20kb'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'how-to-resize-signature-to-10kb-20kb-online'],
    officialSources: [{ name: 'Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB)', url: 'https://uppbpb.gov.in' }],
    examYear: '2026',
    examName: 'UP Police Constable / SI / Fireman',
    content: `
<h2>Official UP Police (UPPRPB) Photo & Signature Requirements 2026</h2>
<p>The <strong>Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)</strong> conducts recruitment for Constable, Sub-Inspector (SI), Jail Warder, and Computer Operator positions. With millions of candidates competing, the automated scrutiny system rejects forms with incorrect background colors, improper dimensions, or blurred facial features.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Document</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Allowed Dimensions</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">File Size Range</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Special Board Criteria</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Color Photograph</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">35 mm (width) × 45 mm (height)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>20 KB to 50 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Plain white or light grey background (70% face)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Signature</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">3.5 cm (width) × 1.5 cm (height)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>5 KB to 20 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Black ink pen on unruled white paper</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Direct UP Police Resizer:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Format your photo to 35×45 mm and signature under 20 KB instantly with our dedicated <a href="/exams/up-police-photo-resizer" style="color: #414FA8; text-decoration: underline; font-weight: bold;">UP Police Photo & Signature Resizer Tool</a>.</p>
</div>

<h2>Key Rules for UPPRPB Photographs</h2>
<ul>
  <li><strong>Background Rule:</strong> The background must be strictly <strong>plain white or very light grey</strong>. Dark blue, red, green, or decorative backgrounds will lead to immediate rejection.</li>
  <li><strong>Facial Biometrics:</strong> The face must cover approximately 70% of the total frame. Both ears and eyes must be clearly visible.</li>
  <li><strong>Neutral Expression:</strong> Lips closed, neutral facial expression, looking straight into the camera lens.</li>
  <li><strong>No Caps or Spectacles:</strong> Caps, hats, scarfs (mufflers), or sunglasses are completely prohibited. Regular prescription spectacles must not have tinted lenses or flash reflection.</li>
  <li><strong>Recency:</strong> The photo must not be older than 6 months from the date of advertisement.</li>
</ul>

<h2>Signature Specifications (5 KB – 20 KB)</h2>
<p>The signature must be signed with a black ink pen on clean, white paper. Sign in running hand script without enclosing it in a box or writing in capital letters. Use our <a href="/tools/generate-signature">SizeSnap Signature Tool</a> or compress your image with <a href="/tools/compress-image-to-20kb">SizeSnap 20KB Resizer</a>.</p>

<h2>Conclusion</h2>
<p>Get your UP Police application approved on the first submission by using <a href="/exams/up-police-photo-resizer">SizeSnap UP Police Resizer</a> to meet exact board requirements.</p>
`,
  },
  {
    id: 'delhi-police-photo-signature-size-guidelines-2026',
    title: 'Delhi Police Constable & Head Constable 2026: Photo & Signature Size Guide',
    slug: 'delhi-police-photo-signature-size-guidelines-2026',
    excerpt: 'Complete official guide for Delhi Police Constable (Executive) and Head Constable applications conducted via SSC. Exact dimensions, 20KB-50KB photo rules, and signature specifications.',
    category: 'exam-guides',
    tags: ['Delhi Police', 'Constable', 'SSC Portal', 'Photo Resizer', 'Signature Resizer'],
    status: 'PUBLISHED',
    featured: false,
    priority: 6,
    author: {
      name: 'SizeSnap Exam Research Team',
      role: 'Govt Exam Documentation Specialist',
    },
    readingTime: 6,
    publishedAt: 1773240000000,
    createdAt: 1773240000000,
    seoTitle: 'Delhi Police Photo & Signature Size 2026: SSC Portal Upload Guidelines',
    seoDescription: 'Official photo and signature specifications for Delhi Police Constable and Head Constable recruitment. Exact dimensions (3.5x4.5 cm), 20KB-50KB limits, and rejection fixes.',
    canonicalUrl: 'https://sizesnap.in/blog/delhi-police-photo-signature-size-guidelines-2026',
    relatedTools: ['passport-photo-maker', 'generate-signature', 'compress-image-to-50kb'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'how-to-resize-signature-to-10kb-20kb-online'],
    officialSources: [{ name: 'Staff Selection Commission (SSC Delhi Police Portal)', url: 'https://ssc.gov.in' }],
    examYear: '2026',
    examName: 'Delhi Police Constable / Head Constable',
    content: `
<h2>Delhi Police Recruitment Document Guidelines 2026</h2>
<p>Recruitment for <strong>Delhi Police Constable (Executive)</strong> and <strong>Head Constable (Ministerial / AWO / TPO)</strong> is conducted directly through the Staff Selection Commission (SSC) portal. Consequently, candidates must strictly adhere to SSC photograph and signature guidelines.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Specification</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Photograph</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Signature</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Dimensions</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">3.5 cm (width) × 4.5 cm (height)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">4.0 cm (width) × 2.0 cm (height)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>File Size Limit</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>20 KB to 50 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>10 KB to 20 KB</strong></td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Resolution</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">100 × 120 px to 200 × 240 px</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">140 × 60 px</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Format</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPEG / JPG</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPEG / JPG</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Instant Tool:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Use our free <a href="/exams/delhi-police-photo-resizer" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Delhi Police Photo & Signature Resizer</a> or crop with our general <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Passport Photo Maker</a>.</p>
</div>

<h2>Live Photo Capture vs Scanned Photo Upload</h2>
<p>Recent SSC portals incorporate live webcam photo capture alongside scanned signature upload. If you are uploading a scanned photo or checking your live image capture quality:</p>
<ul>
  <li>Ensure bright, balanced lighting directly in front of your face with no dark background shadows.</li>
  <li>Both ears must be clearly visible and uncovered by hair.</li>
  <li>Do not wear caps or sunglasses during live capture or scanning.</li>
  <li>Check our detailed guide on <a href="/blog/ssc-cgl-photo-size-name-date-guidelines-2026">SSC Photo Rules and Specifications</a>.</li>
</ul>

<h2>Conclusion</h2>
<p>Save time and avoid scrutiny delays for Delhi Police recruitment by formatting your files with <a href="/exams/delhi-police-photo-resizer">SizeSnap Delhi Police Resizer</a>.</p>
`,
  },
  {
    id: 'cbse-cgpa-to-percentage-formula-conversion-guide',
    title: 'CBSE Class 10th & 12th CGPA to Percentage Conversion: Official 9.5 Formula Explained',
    slug: 'cbse-cgpa-to-percentage-formula-conversion-guide',
    excerpt: 'Understand why the Central Board of Secondary Education (CBSE) multiplies CGPA by 9.5 to calculate percentage. Complete guide with subject-wise conversion, examples, and free online calculator.',
    category: 'student-tips',
    tags: ['CBSE', 'CGPA to Percentage', 'Class 10', 'Board Exam', 'Marks Calculator', 'Grade Conversion'],
    status: 'PUBLISHED',
    featured: false,
    priority: 6,
    author: {
      name: 'SizeSnap Academic Research',
      role: 'Curriculum & Academic Specialist',
    },
    readingTime: 6,
    publishedAt: 1773260000000,
    createdAt: 1773260000000,
    seoTitle: 'CBSE CGPA to Percentage Formula (Why 9.5?): Conversion Guide 2026',
    seoDescription: 'How to convert CBSE CGPA to percentage using official 9.5 multiplier. Examples for Class 10 & 12, subject-wise GP calculation, and free instant calculator.',
    canonicalUrl: 'https://sizesnap.in/blog/cbse-cgpa-to-percentage-formula-conversion-guide',
    relatedTools: ['cgpa-to-percentage', 'marks-percentage-calculator', 'percentage-calculator'],
    relatedArticles: ['aktu-cgpa-to-percentage-formula-conversion-guide', 'college-attendance-calculator-75-percent-rule-guide'],
    content: `
<h2>The Official CBSE CGPA to Percentage Conversion Formula</h2>
<p>When applying for 11th class admissions, polytechnic colleges, government scholarships, or foreign study visas, students passing through the <strong>Central Board of Secondary Education (CBSE)</strong> grading system are frequently asked to present an aggregate percentage rather than a Cumulative Grade Point Average (CGPA).</p>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 20px; margin: 24px 0; border-radius: 6px;">
  <h3 style="margin: 0 0 8px 0; color: #414FA8; font-size: 1.25rem;">📐 Official CBSE Formula:</h3>
  <p style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #1F2937;">Overall Percentage (%) = CGPA × 9.5</p>
  <p style="margin: 8px 0 0 0; color: #4B5563;">For single subjects: <strong>Subject Percentage = Grade Point (GP) × 9.5</strong></p>
</div>

<p>Compute your score in seconds using our free <a href="/cgpa-to-percentage" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap CGPA to Percentage Calculator</a>.</p>

<h2>Why Does CBSE Multiply by 9.5 (and Not 10)?</h2>
<p>A common question asked by students and parents is: <em>"If CGPA is scored out of 10, why multiply by 9.5 instead of 10?"</em></p>
<p>The Central Board analyzed previous mark distributions and noticed that the highest percentage of marks scored by the top 1% of candidates over a 5-year sample was roughly <strong>95%</strong> (not 100%). To map a Grade Point of 10 reasonably to the statistical mean of 95 marks, the board established the scientific multiplier of <strong>9.5</strong>:</p>
<p style="text-align: center; font-weight: bold; font-size: 1.1rem; color: #374151;">95 ÷ 10 = 9.5</p>

<h2>Step-by-Step Calculation Examples</h2>

<h3>Example 1: Calculating Overall Percentage from CGPA</h3>
<p>Suppose a student's grade points across the 5 main subjects are:</p>
<ul>
  <li>English: 9</li>
  <li>Hindi: 8</li>
  <li>Mathematics: 10</li>
  <li>Science: 9</li>
  <li>Social Science: 9</li>
</ul>
<p><strong>Total Grade Points:</strong> 9 + 8 + 10 + 9 + 9 = 45<br>
<strong>CGPA:</strong> 45 ÷ 5 = <strong>9.0</strong><br>
<strong>Overall Percentage:</strong> 9.0 × 9.5 = <strong>85.50%</strong></p>

<h3>Example 2: Calculating Subject-Wise Percentage</h3>
<p>To find the estimated percentage in Mathematics where the Grade Point is 10:<br>
<code>10 × 9.5 = 95.0%</code></p>

<h2>CBSE Grading Scale Reference Table</h2>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Marks Range</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Grade</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Grade Point (GP)</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Approx. Equivalent % (GP × 9.5)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">91 – 100</td><td style="padding: 10px; border: 1px solid #E5E7EB;">A1</td><td style="padding: 10px; border: 1px solid #E5E7EB;">10.0</td><td style="padding: 10px; border: 1px solid #E5E7EB;">95.0%</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">81 – 90</td><td style="padding: 10px; border: 1px solid #E5E7EB;">A2</td><td style="padding: 10px; border: 1px solid #E5E7EB;">9.0</td><td style="padding: 10px; border: 1px solid #E5E7EB;">85.5%</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">71 – 80</td><td style="padding: 10px; border: 1px solid #E5E7EB;">B1</td><td style="padding: 10px; border: 1px solid #E5E7EB;">8.0</td><td style="padding: 10px; border: 1px solid #E5E7EB;">76.0%</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">61 – 70</td><td style="padding: 10px; border: 1px solid #E5E7EB;">B2</td><td style="padding: 10px; border: 1px solid #E5E7EB;">7.0</td><td style="padding: 10px; border: 1px solid #E5E7EB;">66.5%</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">51 – 60</td><td style="padding: 10px; border: 1px solid #E5E7EB;">C1</td><td style="padding: 10px; border: 1px solid #E5E7EB;">6.0</td><td style="padding: 10px; border: 1px solid #E5E7EB;">57.0%</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">41 – 50</td><td style="padding: 10px; border: 1px solid #E5E7EB;">C2</td><td style="padding: 10px; border: 1px solid #E5E7EB;">5.0</td><td style="padding: 10px; border: 1px solid #E5E7EB;">47.5%</td></tr>
    <tr><td style="padding: 10px; border: 1px solid #E5E7EB;">33 – 40</td><td style="padding: 10px; border: 1px solid #E5E7EB;">D</td><td style="padding: 10px; border: 1px solid #E5E7EB;">4.0</td><td style="padding: 10px; border: 1px solid #E5E7EB;">38.0%</td></tr>
  </tbody>
</table>

<h2>Explore Related Calculators</h2>
<ul>
  <li>Engineering student? Read our <a href="/blog/aktu-cgpa-to-percentage-formula-conversion-guide">AKTU CGPA Conversion Guide</a>.</li>
  <li>Calculate aggregate semester percentages using our <a href="/marks-percentage-calculator">Marks Percentage Calculator</a>.</li>
  <li>Plan study schedules with our <a href="/study-hours-calculator">Study Hours Planner</a>.</li>
</ul>

<h2>Conclusion</h2>
<p>The 9.5 multiplier is the universally recognized CBSE standard accepted by all colleges and universities in India. Use our <a href="/cgpa-to-percentage">SizeSnap CGPA Calculator</a> for fast and accurate calculations.</p>
`,
  },
  {
    id: 'college-attendance-calculator-75-percent-rule-guide',
    title: 'College Attendance Policy: How to Calculate 75% Attendance & Medical Leaves',
    slug: 'college-attendance-calculator-75-percent-rule-guide',
    excerpt: 'Understand the University Grants Commission (UGC) mandatory 75% attendance rule. Learn the mathematical formula to calculate how many classes you can afford to miss safely, and how medical condonation works.',
    category: 'student-tips',
    tags: ['Attendance Calculator', '75 Percent Rule', 'College Life', 'UGC Rules', 'Semester Exams', 'Bunk Calculator'],
    status: 'PUBLISHED',
    featured: false,
    priority: 6,
    author: {
      name: 'SizeSnap Academic Research',
      role: 'Student Academic Life Specialist',
    },
    readingTime: 6,
    publishedAt: 1773280000000,
    createdAt: 1773280000000,
    seoTitle: '75% Attendance Rule Explained: How Many Classes Can You Bunk Safely?',
    seoDescription: 'Learn how to calculate college attendance percentage, understand UGC 75% rules, medical condonation up to 65%, and calculate classes needed with free calculator.',
    canonicalUrl: 'https://sizesnap.in/blog/college-attendance-calculator-75-percent-rule-guide',
    relatedTools: ['attendance-calculator', 'percentage-calculator', 'study-hours-calculator'],
    relatedArticles: ['aktu-cgpa-to-percentage-formula-conversion-guide', 'cbse-cgpa-to-percentage-formula-conversion-guide'],
    content: `
<h2>The UGC 75% Mandatory Attendance Rule Explained</h2>
<p>Under the guidelines established by the <strong>University Grants Commission (UGC)</strong> and regulatory bodies such as the All India Council for Technical Education (AICTE) and Medical Council of India (NMC), undergraduate and postgraduate students must maintain a minimum of <strong>75% attendance</strong> across lectures, practicals, and tutorials to be eligible to appear for end-semester university examinations.</p>

<p>Falling below this threshold leads to being <em>debarred</em> or placed on the exam detain list. However, with clear mathematical tracking, students can budget leaves, project work, and medical absences with confidence.</p>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 20px; margin: 24px 0; border-radius: 6px;">
  <h3 style="margin: 0 0 8px 0; color: #414FA8; font-size: 1.25rem;">⚡ Instant Attendance Calculator:</h3>
  <p style="margin: 0; color: #1F2937;">Want to know exactly how many classes you can skip right now without dropping below 75%? Or how many consecutive classes you must attend to recover from a shortage? Use our free <a href="/attendance-calculator" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap College Attendance Calculator</a>.</p>
</div>

<h2>The Mathematical Formula for Attendance</h2>
<p>Your current attendance percentage is calculated using:</p>
<p style="text-align: center; font-size: 1.15rem; font-weight: bold; background: #F3F4F6; padding: 12px; border-radius: 6px;">
  Attendance Percentage (%) = (Classes Attended ÷ Total Classes Held) × 100
</p>

<h3>Formula 1: How Many Classes Can You Miss (Bunk)?</h3>
<p>If your current attendance is <strong>above 75%</strong>, the maximum number of upcoming classes (<code>M</code>) you can miss while staying at or above 75% is:</p>
<p style="text-align: center; font-size: 1.1rem; font-weight: bold; background: #F3F4F6; padding: 12px; border-radius: 6px;">
  M = ⌊ (4 × Classes Attended - 3 × Total Classes Held) ÷ 3 ⌋
</p>
<p><em>Example:</em> If you have attended <strong>40 out of 45 classes</strong> (88.8%):<br>
<code>M = (4 × 40 - 3 × 45) ÷ 3 = (160 - 135) ÷ 3 = 25 ÷ 3 = 8 classes</code>.<br>
You can miss the next <strong>8 classes consecutively</strong> and your attendance will still be 75.4%!</p>

<h3>Formula 2: How Many Consecutive Classes Must You Attend to Recover?</h3>
<p>If your attendance has dropped <strong>below 75%</strong>, the number of future consecutive classes (<code>R</code>) you must attend without missing a single lecture is:</p>
<p style="text-align: center; font-size: 1.1rem; font-weight: bold; background: #F3F4F6; padding: 12px; border-radius: 6px;">
  R = 3 × Total Classes Held - 4 × Classes Attended
</p>
<p><em>Example:</em> If you have attended <strong>20 out of 35 classes</strong> (57.1%):<br>
<code>R = 3 × 35 - 4 × 20 = 105 - 80 = 25 classes</code>.<br>
You must attend the next <strong>25 classes in a row</strong> to climb back to 75.0%!</p>

<h2>Medical Leave & Condonation Criteria (Up to 60% or 65%)</h2>
<p>Most universities allow <strong>condonation of attendance shortage</strong> for genuine medical emergencies or authorized extracurricular representations:</p>
<ul>
  <li><strong>Medical Relaxations:</strong> With an authentic medical certificate issued by a registered medical practitioner, Vice Chancellors or Principals can condone shortages up to <strong>10% to 15%</strong> (relaxing the cutoff from 75% to 60% or 65%).</li>
  <li><strong>Sports & Cultural Representation:</strong> Students representing their university in inter-collegiate competitions, NCC camps, or NSS activities receive "On Duty" (OD) attendance credit for missed days.</li>
  <li><strong>Notice Period:</strong> Medical fitness certificates must typically be submitted within 3 to 7 working days of returning to campus; retrospective certificates submitted at the semester's end are frequently rejected.</li>
</ul>

<h2>Smart Tips to Maintain 75% Attendance</h2>
<ol>
  <li><strong>Keep a Safety Buffer:</strong> Aim for 80% attendance in the first half of the semester. This protects you against viral fevers or unavoidable personal travel during festive periods.</li>
  <li><strong>Attend High-Credit Lab Sessions:</strong> Lab practicals often carry 2 to 3 attendance hours in a single session. Missing one lab hurts your percentage twice as much as missing a single lecture.</li>
  <li><strong>Check Portal Discrepancies Weekly:</strong> Automated ERP systems (like TCS iON or CollPoll) occasionally misrecord teacher entries. Flag errors within the same week.</li>
</ol>

<h2>Conclusion</h2>
<p>Never let attendance stress jeopardize your final grades. Keep track of your numbers with our <a href="/attendance-calculator">75% Attendance Calculator</a> and balance your academic life effectively.</p>
`,
  },
  {
    id: 'how-to-crop-meesho-shipping-labels-a4-sheet-guide',
    title: 'How to Crop and Print Meesho Shipping Labels on A4 Paper (Single & Bulk Guide)',
    slug: 'how-to-crop-meesho-shipping-labels-a4-sheet-guide',
    excerpt: 'Save money on expensive thermal printers. Learn how e-commerce sellers crop Meesho, Flipkart, and Amazon shipping labels to print 2 or 4 labels per A4 page without distorted barcodes.',
    category: 'how-to',
    tags: ['Meesho Seller', 'Shipping Label', 'A4 Printing', 'E-commerce Tools', 'PDF Cropper', 'Barcode Scanner'],
    status: 'PUBLISHED',
    featured: false,
    priority: 7,
    author: {
      name: 'SizeSnap E-commerce Solutions',
      role: 'E-commerce Seller Operations Specialist',
    },
    readingTime: 6,
    publishedAt: 1773300000000,
    createdAt: 1773300000000,
    seoTitle: 'How to Crop Meesho Shipping Labels to A4 Sheet (Print 2 or 4 Per Page)',
    seoDescription: 'Step-by-step guide for Meesho sellers to crop shipping labels and tax invoices for A4 paper printing. Save paper, avoid barcode scan errors, and use free online tool.',
    canonicalUrl: 'https://sizesnap.in/blog/how-to-crop-meesho-shipping-labels-a4-sheet-guide',
    relatedTools: ['meesho-shipping-label-to-a4', 'compress-pdf', 'image-to-pdf'],
    relatedArticles: ['how-to-compress-pdf-to-100kb-140kb-for-govt-portals'],
    content: `
<h2>The Meesho Shipping Label Printing Challenge</h2>
<p>For thousands of budding e-commerce entrepreneurs selling on <strong>Meesho</strong>, investment in a dedicated thermal label printer (such as TVS or TSC thermal printers costing ₹5,000–₹9,000) is often too expensive when starting out. Most small sellers rely on standard inkjet or laser printers with standard <strong>A4 size copier paper</strong> or self-adhesive A4 sticker sheets.</p>

<p>However, when Meesho generates an order manifest, it downloads as a PDF containing both the <strong>tax invoice</strong> and the <strong>shipping label with courier barcode</strong> on the same page. Printing this directly wastes an entire A4 sheet per order or shrinks the barcode so small that delivery executives cannot scan it at pickup.</p>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Free Meesho Label Cropper:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Want to crop and tile single or multiple Meesho orders into crisp, 2-per-page or 4-per-page A4 printouts instantly? Use our free <a href="/tools/meesho-shipping-label-to-a4" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Meesho Shipping Label to A4 Tool</a>.</p>
</div>

<h2>Why Cropping Matters: Thermal (4×6) vs A4 Layout</h2>
<p>Standard logistics couriers (Delhivery, Shadowfax, XpressBees, Ecom Express) utilize optical 1D and 2D barcode scanners calibrated for <strong>4 × 6 inch labels</strong>. If a label is printed without maintaining the proper aspect ratio:</p>
<ul>
  <li>The barcode lines become compressed or pixelated.</li>
  <li>Pickup boys report <em>"Barcode unreadable / Scan Failed"</em>, delaying order dispatch.</li>
  <li>By cropping only the shipping label portion (ignoring the customer tax invoice section) and arranging 2 to 4 labels on a single A4 page, you cut printing paper costs by <strong>50% to 75%</strong>!</li>
</ul>

<h2>How to Crop Meesho Labels Step-by-Step</h2>
<ol>
  <li><strong>Download Official Meesho PDF:</strong> Log into the Meesho Supplier Panel, navigate to <em>Orders &gt; Ready to Ship</em>, and click <em>Download Labels</em>.</li>
  <li><strong>Open SizeSnap Label Tool:</strong> Head to <a href="/tools/meesho-shipping-label-to-a4">Meesho Shipping Label to A4 Cropper</a>.</li>
  <li><strong>Upload Your Orders PDF:</strong> Drag and drop your multi-order PDF file.</li>
  <li><strong>Select Layout:</strong>
    <ul>
      <li><strong>2 Labels per A4 Page (Recommended for standard paper):</strong> Produces large, high-clarity labels that fit standard packing envelopes.</li>
      <li><strong>4 Labels per A4 Page (For adhesive sticker sheets):</strong> Maximum paper saving for high-volume dispatches.</li>
    </ul>
  </li>
  <li><strong>Download Ready-to-Print PDF:</strong> Click download. SizeSnap strips away redundant margins and outputs a laser-sharp, printable A4 document.</li>
</ol>

<h2>Barcode Readability Best Practices</h2>
<ul>
  <li><strong>Print in 100% Scale:</strong> In your printer dialog (Ctrl + P), ensure the page scaling is set to <strong>"Actual Size" (100%)</strong> rather than "Fit to Printable Area", which alters barcode bar spacing.</li>
  <li><strong>Protect with Clear Tape:</strong> If printing on regular paper, cover the entire label with wide transparent packaging tape to protect the barcode against rain or abrasion during transit.</li>
</ul>

<h2>Conclusion</h2>
<p>Streamline your packaging workflow and cut packaging expenses with <a href="/tools/meesho-shipping-label-to-a4">SizeSnap Meesho Shipping Label to A4 Tool</a>.</p>
`,
  },
  {
    id: 'how-to-reduce-image-size-in-kb-without-losing-quality',
    title: 'How to Reduce Image Size in KB Without Losing Quality: Comprehensive Guide',
    slug: 'how-to-reduce-image-size-in-kb-without-losing-quality',
    excerpt: 'Deep-dive guide into digital image compression. Learn the difference between lossy and lossless algorithms, JPEG chroma subsampling, WebP benefits, and how to reduce file sizes in KB with razor-sharp clarity.',
    category: 'tool-guides',
    tags: ['Image Compression', 'Reduce KB', 'Lossless Compression', 'WebP', 'Photo Resizer', 'Performance'],
    status: 'PUBLISHED',
    featured: false,
    priority: 7,
    author: {
      name: 'SizeSnap Technical Team',
      role: 'Digital Imaging & Performance Specialist',
    },
    readingTime: 7,
    publishedAt: 1773320000000,
    createdAt: 1773320000000,
    seoTitle: 'Reduce Image Size in KB Without Losing Quality | Expert Guide',
    seoDescription: 'Master how to compress photos to 20KB, 50KB, or 100KB without blur. Explains JPEG compression algorithms, DPI vs pixels, and free browser-based tools.',
    canonicalUrl: 'https://sizesnap.in/blog/how-to-reduce-image-size-in-kb-without-losing-quality',
    relatedTools: ['reduce-image-size-in-kb', 'compress-image-to-50kb', 'compress-image-to-20kb', 'compress-image-to-100kb'],
    relatedArticles: ['how-to-resize-signature-to-10kb-20kb-online', 'how-to-compress-pdf-to-100kb-140kb-for-govt-portals'],
    content: `
<h2>The Fundamentals of Image Compression in KB</h2>
<p>Whether you are optimizing images for web page speed (Core Web Vitals), preparing passport photos for a government exam portal, or sending email attachments, you frequently need to <strong>reduce image file size in KB without noticeably degrading visual quality</strong>.</p>

<p>Every digital photograph is made of millions of color points called pixels. A standard 12-megapixel smartphone photo (4000 × 3000 pixels) in raw uncompressed format occupies roughly <strong>36 Megabytes</strong> of memory! When your smartphone saves that image as a 3 MB JPEG, it has already applied aggressive compression. Understanding how this compression works allows you to reduce files down to 20 KB or 50 KB while keeping text and facial details razor-sharp.</p>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Instant Client-Side Compressor:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Need to compress an image right now to an exact file size? Use our free <a href="/tools/reduce-image-size-in-kb" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Reduce Image Size in KB Tool</a> or target exact presets like <a href="/tools/compress-image-to-50kb" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Compress to 50KB</a> and <a href="/tools/compress-image-to-20kb" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Compress to 20KB</a>.</p>
</div>

<h2>Lossy vs Lossless Compression: What Is the Difference?</h2>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Feature</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Lossless Compression</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Lossy Compression</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Data Preservation</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">100% exact original data preserved</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Discards subtle color data imperceptible to human eyes</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>File Size Reduction</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Modest (typically 10% to 30%)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Massive (up to 80% to 95%)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Common Formats</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">PNG, GIF, RAW, TIFF</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPEG, WebP, AVIF</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Best Used For</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Logos, screenshots with text, digital line art</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Photographs, portraits, exam uploads, e-commerce products</td>
    </tr>
  </tbody>
</table>

<h2>How JPEG Compression Works Under the Hood</h2>
<p>The JPEG algorithm exploits limitations of the human visual system:</p>
<ol>
  <li><strong>Color Space Transformation (RGB to YCbCr):</strong> Human eyes are far more sensitive to brightness (Luminance, <code>Y</code>) than to color tint (Chrominance, <code>Cb</code> and <code>Cr</code>). JPEG converts the image into brightness and color components.</li>
  <li><strong>Chroma Subsampling (4:2:0):</strong> The compressor discards half or three-quarters of the subtle color information while retaining 100% of the sharpness in luminance. This cuts file size in half without any noticeable blur.</li>
  <li><strong>Discrete Cosine Transform (DCT):</strong> The image is split into 8×8 pixel blocks and transformed into frequency domains, eliminating imperceptible high-frequency visual noise.</li>
</ol>

<h2>Why Client-Side In-Browser Processing is Faster and Safer</h2>
<p>Most legacy online compressors upload your images to cloud servers in remote data centers. This has two big drawbacks:</p>
<ul>
  <li><strong>Slow upload and download times:</strong> On mobile connections, uploading a 10 MB photo just to compress it takes time.</li>
  <li><strong>Privacy risks:</strong> Personal photos, signatures, and IDs can be retained in third-party server cache logs.</li>
</ul>
<p>SizeSnap performs all compression directly in your browser using <strong>HTML5 Canvas API and WebAssembly</strong>. Your files are processed locally on your device hardware with zero server uploads.</p>

<h2>Conclusion</h2>
<p>Compressing images smartly is about selecting the right pixel dimensions and quality threshold rather than blind crushing. Try <a href="/tools/reduce-image-size-in-kb">SizeSnap Image Resizer</a> for instant, private compression.</p>
`,
  },
  {
    id: 'gate-exam-photo-signature-dimensions-guidelines-2026',
    title: 'GATE 2026: Official Photo & Signature Dimensions, GOAPS Upload Rules',
    slug: 'gate-exam-photo-signature-dimensions-guidelines-2026',
    excerpt: 'Comprehensive guide for GATE 2026 (GOAPS) photo and signature requirements. Master the 240x320 to 480x640 px passport dimensions, 5KB–200KB limits, 1:3 to 1:4 signature ratio, and prevent application scrutiny defects.',
    category: 'exam-guides',
    tags: ['GATE 2026', 'GOAPS', 'IIT GATE', 'Passport Photo', 'Signature Resizer', 'Engineering Exam'],
    status: 'PUBLISHED',
    featured: false,
    priority: 8,
    author: {
      name: 'SizeSnap Academic Research',
      role: 'GATE & Engineering Documentation Specialist',
    },
    readingTime: 7,
    publishedAt: 1773340000000,
    createdAt: 1773340000000,
    seoTitle: 'GATE 2026 Photo & Signature Size: GOAPS Dimensions, 5KB-200KB Rules',
    seoDescription: 'Official GATE 2026 photograph and signature specifications for GOAPS. Exact pixel dimensions (240x320 to 480x640), 5KB-200KB file sizes, aspect ratios, and free online resizing.',
    canonicalUrl: 'https://sizesnap.in/blog/gate-exam-photo-signature-dimensions-guidelines-2026',
    relatedTools: ['passport-photo-maker', 'generate-signature', 'reduce-image-size-in-kb'],
    relatedArticles: ['aktu-cgpa-to-percentage-formula-conversion-guide', 'how-to-resize-signature-to-10kb-20kb-online'],
    officialSources: [{ name: 'GATE Official Portal (GOAPS)', url: 'https://gate2026.iit.ac.in' }],
    examYear: '2026',
    examName: 'GATE / JAM Examination (IIT)',
    content: `
<h2>Official GATE 2026 (GOAPS) Biometric Photograph Guidelines</h2>
<p>The <strong>Graduate Aptitude Test in Engineering (GATE)</strong>, conducted rotationally by the Indian Institutes of Technology (IITs) and IISc Bangalore, enforces an exceptionally strict automated scrutiny system on the <strong>GOAPS (GATE Online Application Processing System)</strong> portal. Over 10% of initial applications receive "Defect Detected" scrutiny notices annually due to sub-standard photographs or cropped signatures.</p>

<p>Following the official GATE information brochure, here are the exact parameters required for photograph and signature files:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Parameter</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Photograph Requirement</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Signature Requirement</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Pixel Dimensions</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Min: 240 × 320 px | Max: 480 × 640 px</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Min: 80 × 280 px | Max: 160 × 560 px</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Aspect Ratio</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">0.75 (Width : Height = 3 : 4)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Between 1 : 3 and 1 : 4 (Rectangular)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>File Size Limit</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>5 KB to 200 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>3 KB to 100 KB</strong></td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Allowed Format</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPEG / JPG only</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPEG / JPG only</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Background</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Strictly <strong>White Background</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Clean Unruled White Paper</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Face Coverage</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">60% to 70% of total image area</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Centered, occupying 70%+ of rectangular frame</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Instant Tool Solution:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Generate a compliant 240×320 to 480×640 px portrait with a clean white background using our free <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Passport Photo Maker</a>. For your signature, use our <a href="/tools/generate-signature" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Signature Resizer Tool</a>.</p>
</div>

<h2>Strict GOAPS Photo Rules to Avoid "Defect" Markings</h2>
<ul>
  <li><strong>Recency:</strong> The photograph must be taken after the notification release date (must not be an old undergraduate freshman ID photo).</li>
  <li><strong>White Background Only:</strong> Light blue, grey, or textured backgrounds will trigger an automated defect rejection. Ensure your backdrop is pure white.</li>
  <li><strong>Spectacles and Glare:</strong> If you wear spectacles, the camera flash must not cause reflections on the lenses. Sunglasses or tinted glasses are strictly forbidden.</li>
  <li><strong>Facial Biometrics:</strong> Both ears, forehead, and chin must be clearly visible. Caps, hats, or heavy hair covering the forehead are prohibited.</li>
  <li><strong>No Mobile Selfies:</strong> Selfies captured from a close distance distort facial perspective (making the nose appear enlarged). Take a portrait from at least 1.5 meters away with optical zoom.</li>
</ul>

<h2>GOAPS Signature Guidelines (1:3 to 1:4 Aspect Ratio)</h2>
<p>IIT scrutiny committees reject signatures that appear square or are overly cropped:</p>
<ul>
  <li><strong>Ink:</strong> Sign using a dark black or dark blue ink pen on unlined white paper. Black gel ink offers the crispest scanning contrast.</li>
  <li><strong>Aspect Ratio:</strong> The signature box must have a rectangular width-to-height ratio between 3:1 and 4:1 (e.g. 120 pixels tall by 400 pixels wide).</li>
  <li><strong>No Capital Letters:</strong> Signatures written exclusively in capital letters (e.g. <code>RAVI KUMAR</code>) are invalid. Sign in your genuine running handwriting.</li>
</ul>

<h2>Need CGPA Conversion for GATE Form?</h2>
<p>When filling out your qualifying degree marks, check our <a href="/blog/aktu-cgpa-to-percentage-formula-conversion-guide">AKTU CGPA to Percentage Conversion Guide</a> or calculate semester scores with our <a href="/cgpa-to-percentage">CGPA Calculator</a>.</p>

<h2>Conclusion</h2>
<p>Do not let documentation defects distract you during critical GATE preparation months. Prepare your GOAPS files in under 60 seconds with <a href="/tools/passport-photo-maker">SizeSnap Photo Maker</a>.</p>
`,
  },
  {
    id: 'pan-card-photo-signature-size-nsdl-utiitsl-guidelines',
    title: 'PAN Card Photo & Signature Size: NSDL & UTIITSL Online Upload Rules',
    slug: 'pan-card-photo-signature-size-nsdl-utiitsl-guidelines',
    excerpt: 'Official photo and signature specifications for online PAN Card applications on Protean (NSDL) and UTIITSL portals. Learn exact 3.5x2.5 cm dimensions, 200 DPI resolution, max 50KB limits, and PDF supporting document guidelines.',
    category: 'exam-guides',
    tags: ['PAN Card', 'NSDL', 'UTIITSL', 'Protean', 'Photo Resizer', 'Signature Resizer', 'Income Tax'],
    status: 'PUBLISHED',
    featured: false,
    priority: 8,
    author: {
      name: 'SizeSnap Technical Team',
      role: 'Taxation & Identity Document Specialist',
    },
    readingTime: 6,
    publishedAt: 1773360000000,
    createdAt: 1773360000000,
    seoTitle: 'PAN Card Photo & Signature Size: NSDL & UTIITSL 200 DPI Guide',
    seoDescription: 'Official PAN card photo (3.5x2.5 cm) and signature dimensions for NSDL/Protean and UTIITSL. Learn 200 DPI requirements, 50KB limits, and free online resizing.',
    canonicalUrl: 'https://sizesnap.in/blog/pan-card-photo-signature-size-nsdl-utiitsl-guidelines',
    relatedTools: ['passport-photo-maker', 'generate-signature', 'compress-image-to-50kb', 'compress-pdf'],
    relatedArticles: ['how-to-resize-signature-to-10kb-20kb-online', 'how-to-compress-pdf-to-100kb-140kb-for-govt-portals'],
    officialSources: [{ name: 'Protean / NSDL PAN Portal', url: 'https://onlineservices.tin.egov-nsdl.com' }, { name: 'UTIITSL PAN Online', url: 'https://pan.utiitsl.com' }],
    content: `
<h2>Official NSDL & UTIITSL PAN Card Upload Specifications</h2>
<p>When applying for a new Permanent Account Number (PAN Card Form 49A) or requesting corrections on either the <strong>Protean (NSDL)</strong> or <strong>UTIITSL</strong> portal, applicants must upload scanned biometrics that meet strict resolution and DPI standards. Because PAN cards are physical laminated cards with laser-printed images, the Income Tax Department strictly enforces <strong>200 DPI resolution</strong>.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Document</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Physical Dimensions</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">DPI / Pixel Dimensions</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">File Size Limit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Color Photograph</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">3.5 cm (height) × 2.5 cm (width)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>200 DPI</strong> (213 × 295 pixels)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Strictly <strong>under 50 KB</strong> (JPG)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Signature</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">2.0 cm (height) × 4.5 cm (width)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>200 DPI</strong> (400 × 177 pixels)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Strictly <strong>under 50 KB</strong> (JPG)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Supporting Proofs (Aadhaar / ID)</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Standard A4 Page</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">200 DPI Grayscale / Color</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Strictly <strong>under 300 KB</strong> (PDF)</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ One-Click PAN Resizer:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Easily format your photo to 3.5×2.5 cm and signature to 4.5×2.0 cm under 50KB with our free <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Passport Photo Maker</a> and <a href="/tools/generate-signature" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Signature Tool</a>.</p>
</div>

<h2>Common Reasons PAN Applications Get Rejected or Delayed</h2>
<ul>
  <li><strong>Wrong Signature Color:</strong> NSDL and UTIITSL strongly recommend a <strong>black ink pen</strong> for signatures. Faint blue ballpoint pens fail OCR scanning during physical card printing.</li>
  <li><strong>Resolution Below 200 DPI:</strong> Uploading a compressed 72 DPI smartphone image results in pixelation on the physical PVC PAN card.</li>
  <li><strong>Background Noise:</strong> The photo must have a clean, light-colored or white background. Dark backgrounds obscure the facial boundary.</li>
  <li><strong>Supporting PDF Exceeding 300 KB:</strong> Scanned Aadhaar copies often exceed 1 MB. Use our <a href="/tools/compress-pdf">PDF Compressor</a> to reduce your file below 300 KB while keeping numbers readable.</li>
</ul>

<h2>How to Resize Supporting Documents (PDF under 300 KB)</h2>
<ol>
  <li>Scan both sides of your Aadhaar Card or Identity Proof.</li>
  <li>Use our <a href="/tools/compress-pdf">Free PDF Compressor</a> or check our guide on <a href="/blog/how-to-compress-pdf-to-100kb-140kb-for-govt-portals">How to Compress PDFs for Government Portals</a>.</li>
  <li>Ensure all 12 digits of your Aadhaar number and your date of birth are razor-sharp before uploading to the NSDL portal.</li>
</ol>

<h2>Conclusion</h2>
<p>Get your physical PAN card dispatched without delays by formatting your images precisely to 200 DPI and under 50 KB using <a href="/tools/passport-photo-maker">SizeSnap Photo Maker</a>.</p>
`,
  },
  {
    id: 'rrb-railway-photo-signature-size-guidelines-2026',
    title: 'RRB Railway 2026: ALP, Technician & NTPC Photo and Signature Upload Guidelines',
    slug: 'rrb-railway-photo-signature-size-guidelines-2026',
    excerpt: 'Complete official guide for Railway Recruitment Board (RRB) applications for ALP, Technician, and NTPC posts. Master the 35mm x 45mm photo rules, 30KB–70KB size limits, and signature guidelines to prevent rejection.',
    category: 'exam-guides',
    tags: ['RRB Railway', 'ALP', 'Technician', 'RRB NTPC', 'Railway Recruitment', 'Photo Resizer'],
    status: 'PUBLISHED',
    featured: false,
    priority: 8,
    author: {
      name: 'SizeSnap Exam Research Team',
      role: 'Railway Recruitment Documentation Specialist',
    },
    readingTime: 6,
    publishedAt: 1773380000000,
    createdAt: 1773380000000,
    seoTitle: 'RRB Railway Photo & Signature Size 2026: ALP, NTPC 30KB-70KB Guide',
    seoDescription: 'Official RRB Railway photo and signature upload rules for ALP, Technician, and NTPC. Exact 35x45mm dimensions, 30KB-70KB limits, white background rules, and free tools.',
    canonicalUrl: 'https://sizesnap.in/blog/rrb-railway-photo-signature-size-guidelines-2026',
    relatedTools: ['passport-photo-maker', 'generate-signature', 'compress-image-to-50kb'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'how-to-resize-signature-to-10kb-20kb-online'],
    officialSources: [{ name: 'Railway Recruitment Boards (RRB Central Official)', url: 'https://rrbapply.gov.in' }],
    examYear: '2026',
    examName: 'RRB ALP / Technician / NTPC / Group D',
    content: `
<h2>Official RRB 2026 Photograph & Signature Specifications</h2>
<p>With over 1 crore candidates applying for positions conducted by the <strong>Railway Recruitment Boards (RRB)</strong> — including Assistant Loco Pilot (ALP), Technician Grade 1 &amp; 3, Junior Engineer (JE), and Non-Technical Popular Categories (NTPC) — the centralized portal (<code>rrbapply.gov.in</code>) utilizes automated facial matching and dimension filters.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Document</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Dimensions</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">File Size Range</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Official Conditions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Color Passport Photograph</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">35 mm × 45 mm (320 × 240 px)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>30 KB to 70 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Plain white background, taken within 1 month</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Scanned Signature</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">50 mm × 20 mm (140 × 60 px)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>30 KB to 70 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Black ink pen on white paper, running script</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>SC/ST Travel Pass Certificate</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Standard A4 Page</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Max 500 KB</strong> (PDF)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">Legible state authority seal</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ RRB Tool Preset:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Resize and compress your photo and signature to the 30KB–70KB range effortlessly using our <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Passport Photo Maker</a> and <a href="/tools/compress-image-to-50kb" style="color: #414FA8; text-decoration: underline; font-weight: bold;">50KB Photo Compressor</a>.</p>
</div>

<h2>Critical Railway Guidelines (CEN Notification Rules)</h2>
<ul>
  <li><strong>Keep 12 Identical Physical Copies:</strong> RRB explicitly mandates that candidates must retain at least 12 identical copies of the uploaded photograph for use throughout CBT-1, CBT-2, Computer Based Aptitude Test (CBAT), Document Verification, and Medical Examination.</li>
  <li><strong>No Headgear or Caps:</strong> Sikh candidates wearing turbans are exempt, but caps, hoods, and decorative headgear are strictly prohibited.</li>
  <li><strong>Black Ink Signature Only:</strong> Signatures in blue ink or pencil are subject to automated disqualification.</li>
  <li><strong>No Block Letters:</strong> Sign in running cursive hand. A signature in capital letters is rejected outright.</li>
</ul>

<h2>Conclusion</h2>
<p>Railway examinations are a gateway to prestigious public sector careers. Make sure your application passes portal verification on the first attempt with <a href="/tools/passport-photo-maker">SizeSnap Photo Tools</a>.</p>
`,
  },
  {
    id: 'ctet-exam-photo-signature-size-guidelines-2026',
    title: 'CTET 2026: Photo and Signature Size, Format & Upload Guidelines Explained',
    slug: 'ctet-exam-photo-signature-size-guidelines-2026',
    excerpt: 'Detailed official guidelines for Central Teacher Eligibility Test (CTET 2026) conducted by CBSE. Exact dimensions for passport photo (10KB–100KB, 3.5x4.5 cm) and signature (3KB–30KB, 3.5x1.5 cm) explained.',
    category: 'exam-guides',
    tags: ['CTET', 'Teacher Eligibility Test', 'CBSE CTET', 'Photo Resizer', 'Signature Resizer'],
    status: 'PUBLISHED',
    featured: false,
    priority: 7,
    author: {
      name: 'SizeSnap Exam Research Team',
      role: 'Teaching Entrance Documentation Specialist',
    },
    readingTime: 6,
    publishedAt: 1773400000000,
    createdAt: 1773400000000,
    seoTitle: 'CTET 2026 Photo & Signature Size: CBSE Guidelines, 10KB-100KB Format',
    seoDescription: 'Official CTET 2026 photograph and signature specifications. Exact 3.5x4.5cm photo (10KB-100KB), signature (3KB-30KB), and free instant online resizing tools.',
    canonicalUrl: 'https://sizesnap.in/blog/ctet-exam-photo-signature-size-guidelines-2026',
    relatedTools: ['passport-photo-maker', 'generate-signature', 'compress-image-to-50kb', 'compress-image-to-20kb'],
    relatedArticles: ['ssc-cgl-photo-size-name-date-guidelines-2026', 'how-to-resize-signature-to-10kb-20kb-online'],
    officialSources: [{ name: 'Central Teacher Eligibility Test (CTET Official)', url: 'https://ctet.nic.in' }],
    examYear: '2026',
    examName: 'CTET (Paper 1 & Paper 2)',
    content: `
<h2>Official CBSE CTET 2026 Document Requirements</h2>
<p>The <strong>Central Board of Secondary Education (CBSE)</strong> conducts the Central Teacher Eligibility Test (CTET) twice a year for prospective primary (Paper-I) and upper primary (Paper-II) teachers. The official CTET information bulletin sets clear bounds for uploaded digital images.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #E5E7EB;">
  <thead>
    <tr style="background-color: #F3F4F6; text-align: left;">
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Document</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Physical Dimensions</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">File Size Range</th>
      <th style="padding: 10px; border: 1px solid #E5E7EB;">Format</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Candidate Photograph</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">3.5 cm (width) × 4.5 cm (height)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>10 KB to 100 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPG / JPEG only</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>Candidate Signature</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">3.5 cm (width) × 1.5 cm (height)</td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>3 KB to 30 KB</strong></td>
      <td style="padding: 10px; border: 1px solid #E5E7EB;">JPG / JPEG only</td>
    </tr>
  </tbody>
</table>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Instant CTET Resizer:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Make your 3.5×4.5 cm photo and 3.5×1.5 cm signature ready in seconds with our free <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Passport Photo Maker</a> and <a href="/tools/generate-signature" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Signature Tool</a>.</p>
</div>

<h2>Step-by-Step Instructions for CTET Uploads</h2>
<ol>
  <li><strong>Photograph Setup:</strong> Stand against a plain white or light-toned wall. Maintain a straight eye-level gaze with both ears visible and a natural expression.</li>
  <li><strong>Signature Setup:</strong> Sign on white unruled paper using a dark black or blue pen. Ensure the line is unbroken and legible.</li>
  <li><strong>Crop and Compress:</strong> Set the target size slider on SizeSnap between 30 KB and 50 KB for the photo, and around 15 KB for the signature (comfortably within the 3KB to 30KB requirement).</li>
</ol>

<h2>Conclusion</h2>
<p>Prevent last-minute application discrepancies by verifying your CTET files with <a href="/tools/passport-photo-maker">SizeSnap Photo Maker</a>.</p>
`,
  },
  {
    id: 'how-to-merge-pdf-files-online-free-guide',
    title: 'How to Merge PDF Files Online for Free (Combine Certificates Privately)',
    slug: 'how-to-merge-pdf-files-online-free-guide',
    excerpt: 'Step-by-step guide on combining multiple educational certificates, marksheets, and identity proofs into a single consolidated PDF for job applications without losing clarity or uploading to cloud servers.',
    category: 'how-to',
    tags: ['Merge PDF', 'Combine PDF', 'PDF Tools', 'Document Privacy', 'Govt Exam Documents', 'Free PDF Joiner'],
    status: 'PUBLISHED',
    featured: false,
    priority: 7,
    author: {
      name: 'SizeSnap Technical Team',
      role: 'Document Management Specialist',
    },
    readingTime: 6,
    publishedAt: 1773420000000,
    createdAt: 1773420000000,
    seoTitle: 'How to Merge PDF Files Online for Free | Combine Documents Securely',
    seoDescription: 'Learn how to merge multiple PDF files into one document for job applications. 100% private, client-side processing, no file limits, and instant free download.',
    canonicalUrl: 'https://sizesnap.in/blog/how-to-merge-pdf-files-online-free-guide',
    relatedTools: ['compress-pdf', 'reduce-image-size-in-kb', 'passport-photo-maker'],
    relatedArticles: ['how-to-compress-pdf-to-100kb-140kb-for-govt-portals'],
    content: `
<h2>Why Government & Job Portals Require a Single Consolidated PDF</h2>
<p>When applying for positions through state Public Service Commissions, banking recruitment, or corporate hiring, you are frequently presented with a single file upload field: <em>"Upload Consolidated Educational Documents (Class 10th, 12th, Graduation Marksheets &amp; Degree in a Single PDF under 2 MB / 5 MB)"</em>.</p>

<p>Applicants often struggle with combining separate scans of their degrees, semester grade cards, and caste certificates into a single ordered document without exceeding upload limits or blurring text.</p>

<div style="background-color: #EEF1FB; border-left: 4px solid #414FA8; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #414FA8;">⚡ Free PDF Tools on SizeSnap:</p>
  <p style="margin: 6px 0 0 0; color: #1F2937;">Need to combine or compress PDFs right now? Use our free <a href="/tools/compress-pdf" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap PDF Compressor</a> or turn smartphone photos into PDFs using <a href="/tools/image-to-pdf" style="color: #414FA8; text-decoration: underline; font-weight: bold;">Image to PDF Converter</a>.</p>
</div>

<h2>The Critical Privacy Risk of Public Cloud PDF Merge Tools</h2>
<p>When you merge PDFs using traditional online tools, your documents (containing sensitive data like your Aadhaar number, PAN, address, father's name, and academic credentials) are transmitted over the internet to remote third-party cloud servers. This exposes your confidential records to server data breaches and unauthorized scraping.</p>

<div style="background-color: #ECFDF5; border-left: 4px solid #059669; padding: 16px; margin: 24px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #065F46;">🔒 The SizeSnap Difference: 100% Client-Side Privacy</p>
  <p style="margin: 6px 0 0 0; color: #047857;">On SizeSnap, all PDF manipulation and compression runs <strong>locally in your browser using WebAssembly</strong>. Your files are processed entirely in your device's memory and are never uploaded to any cloud server.</p>
</div>

<h2>Step-by-Step Guide: Preparing a Consolidated PDF for Applications</h2>
<ol>
  <li><strong>Gather Scans in Chronological Order:</strong> Arrange your certificates in the standard sequence expected by scrutiny officers:
    <ul>
      <li>Page 1: 10th Class Marksheet / Passing Certificate (Date of Birth Proof)</li>
      <li>Page 2: 12th Class Marksheet</li>
      <li>Pages 3 to N: Semester Grade Cards in chronological order</li>
      <li>Final Page: Category / EWS / Domicile Certificate</li>
    </ul>
  </li>
  <li><strong>Check Orientation:</strong> Ensure all pages are rotated to portrait orientation. Documents scanned sideways slow down scrutiny verification.</li>
  <li><strong>Compress to Portal Limit:</strong> If the merged PDF exceeds portal limits (e.g., 2 MB), use our <a href="/tools/compress-pdf">PDF Compressor</a> or read our specialized guide on <a href="/blog/how-to-compress-pdf-to-100kb-140kb-for-govt-portals">Compressing PDFs to 100KB–140KB</a>.</li>
</ol>

<h2>Conclusion</h2>
<p>Keep your application documents clean, consolidated, and 100% private with <a href="/tools/compress-pdf">SizeSnap Free PDF Tools</a>.</p>
`,
  },

];
