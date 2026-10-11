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
  <p style="margin: 6px 0 0 0; color: #1F2937;">You can generate a compliant 3.5 × 4.5 cm passport photo with your <strong>Name & Date strip</strong> and auto-compress it directly to <strong>20KB – 50KB</strong> using our free <a href="/tools/passport-photo-maker" style="color: #414FA8; text-decoration: underline; font-weight: bold;">SizeSnap Passport Photo Maker Online</a>.</p>
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
<p>Need to resize or clean your signature? Use our <a href="/tools/generate-signature">Online Signature Tool</a> to crop and format signatures in seconds.</p>

<h2>Top Mistakes That Lead to SSC Form Rejection</h2>
<ul>
  <li><strong>Wearing Glasses / Spectacles:</strong> Even regular reading glasses cause reflections and will result in instant rejection. Always remove glasses before taking the photo.</li>
  <li><strong>Selfies & Tilted Angles:</strong> Photos taken from an angle, selfies with distorted focal lengths, or photos looking away from the camera are strictly invalid.</li>
  <li><strong>File Size Exceeding 50KB:</strong> If your photo is 51 KB, the portal will reject it with an error. Ensure your image is strictly between 20 KB and 50 KB.</li>
  <li><strong>Old Childhood or College Photos:</strong> Your photo must match your present facial biometric appearance on the day of the Tier-1 exam.</li>
</ul>

<h2>Conclusion</h2>
<p>Do not let minor technical errors compromise months of hard preparation for SSC CGL 2026. Use free, client-side tools like <a href="/tools/passport-photo-maker">SizeSnap Passport Photo Maker</a> to prepare your documents cleanly, securely, and within exact notification specifications.</p>
`,
  },
];

