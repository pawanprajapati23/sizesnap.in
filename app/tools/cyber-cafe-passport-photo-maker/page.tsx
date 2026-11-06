import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { CyberCafePassportPhotoTool } from '@/components/tool-ui/CyberCafePassportPhotoTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Lock,
  Camera,
  Printer,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Scissors,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
  Building2,
  Sliders,
  Calendar,
  User,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { FAQSchema, SoftwareAppSchema } from '@/components/SeoSchemas';
import { KbTargetPills } from '@/components/KbTargetPills';

export const metadata: Metadata = {
  title: 'Cyber Cafe Passport Photo Sheet Maker (4x6 & A4) - Free No Watermark | SizeSnap',
  description:
    'Best online passport photo print sheet maker for Cyber Cafe, CSC Digital Seva, Jan Seva Kendra & Photo Studios. Upload 1 photo, change background to White or Studio Blue, and generate 6, 8, 12, or 32 passport photos on 4x6" or A4 sheet with scissor cutting lines. 100% Free, Zero Watermark, 1-Click Direct Print.',
  keywords: [
    'cyber cafe passport photo maker',
    'passport photo 4x6 sheet 6 photos',
    '6 passport size photo print sheet online free',
    'passport size photo 8 copy 4x6 sheet',
    'csc passport photo print tool',
    'passport photo background change white blue',
    'passport photo sheet 4x6 free no watermark',
    'epson l805 6 passport photo print 4x6',
    'online passport size photo maker without watermark',
    'passport photo sheet maker a4 32 photos',
    'photo ko 6 passport size me kaise banaye',
    'ek click me 6 passport photo kaise banaye',
    'passport size photo print 4x6 paper online',
    'csc digital seva photo resizer tool',
    'jan seva kendra passport photo software online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/cyber-cafe-passport-photo-maker',
  },
  openGraph: {
    title: 'Cyber Cafe Passport Photo Sheet Maker (4x6 & A4) - Free No Watermark | SizeSnap',
    description:
      'Generate 6, 8, 12, or 32 passport photos on 4x6" or A4 glossy paper with cutting lines. Change background to white or studio blue in 1-click. Free, No Watermark, 1-Click Print.',
    url: 'https://www.sizesnap.in/tools/cyber-cafe-passport-photo-maker',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber Cafe Passport Photo Sheet Maker (4x6 & A4) | SizeSnap',
    description:
      'Fastest passport photo sheet creator for Cyber Cafes & CSC Kendras. Line up 6 photos on 4x6" paper with zero watermark and scissor borders.',
  },
};

const RELATED_SLUGS = [
  'passport-photo-maker',
  'white-background-passport-photo',
  'pan-card-photo-resizer',
  'resize-image-3-5cm-4-5cm',
  'add-name-and-date-on-photo',
  'remove-shadow-from-document',
  'compress-image-between-20kb-to-50kb',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
];

const FAQS = [
  {
    q: 'Can Cyber Cafe operators use this sheet commercially for customer prints?',
    a: 'Yes, 100%! SizeSnap Cyber Cafe Passport Photo Maker is completely free for commercial and studio printing. The generated 4x6" and A4 sheets contain ZERO watermark, ZERO branding, and NO website logos. You can print directly (Ctrl+P) and hand the pristine photos to your customers.',
  },
  {
    q: 'How many passport photos fit on standard 4x6 inch (10x15 cm) photo paper?',
    a: 'On standard 4×6" photo paper (101.6 × 152.4 mm), you can print 6 Indian standard (3.5 × 4.5 cm) passport photos in portrait layout (2 columns × 3 rows) with generous cutting margins, or 8 photos in landscape layout (4 columns × 2 rows). This is the most common pack sold in Indian cyber cafes for ₹30 to ₹50.',
  },
  {
    q: 'Photo ka background white ya studio blue kaise karein (फोटो का बैकग्राउंड चेंज कैसे करें)?',
    a: 'Bas photo upload karein aur "Auto Remove Background with AI" par click karein. AI browser ke andar hi 2 second me background cut kar dega. Uske baad "Studio Sky Blue" ya "White" color select karein. Background instant replace ho jayega bina kisi Photoshop ke.',
  },
  {
    q: 'Agar customer ko sirf 6 photo chahiye toh baki page khali rahega?',
    a: 'Haan! Tool me "Exact Count" mode hai. Agar aap 6 photo select karte hain, toh sheet par sirf 6 photo ek ke baad ek line se print hongi aur baki page clean white rahega. Cyber cafe wale photo cut karne ke baad bacha hua paper doosre customer ke liye use kar sakte hain.',
  },
  {
    q: 'Which printer settings should be used on Epson L805 / Canon G570 printers?',
    a: 'Select Paper Size as "4 x 6 in (10 x 15 cm)" or "A4", set Paper Type to "Epson Premium Glossy" or "Photo Paper", set Quality to "High", and choose Scale as "100% (Actual Size / Do not scale)" so the photos print at exact 3.5 × 4.5 cm biometric size.',
  },
  {
    q: 'Can I add Candidate Name and Date of Photo (DOP) for SSC / Police exams?',
    a: 'Yes! Toggle on the "Name & Date on Photo" option, enter the candidate name (e.g. AMIT SHARMA) and the date of photo. The tool automatically stamps a clean white strip with bold typography on every single copy on the sheet.',
  },
  {
    q: 'Are customer photos safe and confidential?',
    a: '100% Secure. All processing, including AI background cutout, photo resizing, and sheet generation, runs entirely on your computer inside your browser (Client-Side HTML5 Canvas & WebAssembly). Zero photos are uploaded or stored on any remote server.',
  },
];

export default function CyberCafePassportPhotoPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create a 6 Passport Photo Print Sheet for 4x6" Paper Online',
    description:
      'Step-by-step guide for Cyber Cafe & CSC operators to create 6 passport photos with white or blue background on 4x6 inch photo paper.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Upload Candidate Photo',
        text: 'Upload any casual photo, selfie, or studio portrait from phone or WhatsApp (JPG, PNG, WEBP).',
      },
      {
        '@type': 'HowToStep',
        name: 'Select Studio Background Color',
        text: 'Click 1-Click AI Cutout and select Pure White (for Passport/Visa/SSC) or Studio Sky Blue (for School/Police/State exams).',
      },
      {
        '@type': 'HowToStep',
        name: 'Choose Photo Count (e.g. 6 Photos on 4x6")',
        text: 'Click "6 Photos" to automatically arrange 2 rows x 3 columns on standard 4x6" glossy photo paper with scissor cutting lines.',
      },
      {
        '@type': 'HowToStep',
        name: 'Direct Print or Download HD Sheet',
        text: 'Press Ctrl+P or click "Direct Print" to print immediately on Epson or Canon photo printers, or download 300 DPI Ultra HD JPG / PDF with zero watermark.',
      },
    ],
  };

  return (
    <>
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="SizeSnap Cyber Cafe Passport Photo Sheet Maker"
        description="Free online passport photo print sheet maker for Cyber Cafe & CSC Kendras. Line up 6, 8, 12, or 32 photos on 4x6 or A4 sheets with cutting lines and zero watermark."
        url="https://www.sizesnap.in/tools/cyber-cafe-passport-photo-maker"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/image-tools" className="hover:text-[#414FA8] font-medium transition-colors">
              Image Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-800 font-semibold">Cyber Cafe Passport Photo Sheet</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Main Tool Content Area (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* Interactive Tool Component */}
              <CyberCafePassportPhotoTool />

              {/* Internal Link Silo Pills for Exact Sizes */}
              <KbTargetPills type="image" className="mt-6" />

              {/* Why Cyber Cafe & CSC Operators Choose SizeSnap */}
              <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#414FA8]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Why Cyber Cafe & CSC Operators Prefer SizeSnap Over Photoshop
                    </h2>
                    <p className="text-xs text-gray-500">
                      Designed specifically for fast-paced CSC VLE Kendras, Jan Seva Kendras, and Cyber Cafes in India.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="w-7 h-7 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Saves 10 Minutes Per Customer</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      No need to open heavy Photoshop actions, manual pen tool tracing, or canvas alignment. Upload photo,
                      click background color, and get a ready-to-print 6-photo sheet in 5 seconds.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-[#414FA8]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">100% Zero Watermark</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      The generated sheet is 100% clean and white-label. No SizeSnap branding, no logos, and no footer
                      text. You can hand the printed photos directly to your customers with professional pride.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="w-7 h-7 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Scissor Cutting Guides</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Every photo features an ultra-fine scissor cutting border line, allowing your operators to cut photos
                      evenly without crooked margins or wasted paper.
                    </p>
                  </div>
                </div>
              </section>

              {/* Cyber Cafe Printing Presets & Specs Table */}
              <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#414FA8]" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Official Cyber Cafe Printing Sheets & Dimension Specs (2026)
                  </h2>
                </div>
                <p className="text-xs text-gray-600">
                  Quick reference guide for paper sizes, photo counts, and printer compatibility used across India:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 font-bold">
                        <th className="p-2.5 border border-gray-200">Sheet Type</th>
                        <th className="p-2.5 border border-gray-200">Physical Size</th>
                        <th className="p-2.5 border border-gray-200">Photo Count</th>
                        <th className="p-2.5 border border-gray-200">Photo Dimensions</th>
                        <th className="p-2.5 border border-gray-200">Recommended Printers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-700">
                      <tr className="hover:bg-blue-50/40 bg-white font-medium">
                        <td className="p-2.5 border border-gray-200 font-bold text-[#414FA8]">
                          4 × 6" Glossy Paper (Portrait)
                        </td>
                        <td className="p-2.5 border border-gray-200">101.6 × 152.4 mm</td>
                        <td className="p-2.5 border border-gray-200 font-bold">6 Photos (2 × 3 Grid)</td>
                        <td className="p-2.5 border border-gray-200">3.5 × 4.5 cm (35 × 45 mm)</td>
                        <td className="p-2.5 border border-gray-200">Epson L805, L8050, Canon G570, Pixma</td>
                      </tr>
                      <tr className="hover:bg-blue-50/40 bg-gray-50">
                        <td className="p-2.5 border border-gray-200 font-bold text-gray-900">
                          4 × 6" Glossy Paper (Landscape)
                        </td>
                        <td className="p-2.5 border border-gray-200">152.4 × 101.6 mm</td>
                        <td className="p-2.5 border border-gray-200 font-bold">8 Photos (4 × 2 Grid)</td>
                        <td className="p-2.5 border border-gray-200">3.5 × 4.5 cm (35 × 45 mm)</td>
                        <td className="p-2.5 border border-gray-200">Epson EcoTank L3110, L3210, HP Smart Tank</td>
                      </tr>
                      <tr className="hover:bg-blue-50/40 bg-white">
                        <td className="p-2.5 border border-gray-200 font-bold text-gray-900">
                          4 × 6" Stamp Size Sheet
                        </td>
                        <td className="p-2.5 border border-gray-200">101.6 × 152.4 mm</td>
                        <td className="p-2.5 border border-gray-200 font-bold">12 Photos (3 × 4 Grid)</td>
                        <td className="p-2.5 border border-gray-200">2.5 × 3.5 cm (Stamp Size)</td>
                        <td className="p-2.5 border border-gray-200">All Inkjet & Photo Tank Printers</td>
                      </tr>
                      <tr className="hover:bg-blue-50/40 bg-gray-50">
                        <td className="p-2.5 border border-gray-200 font-bold text-gray-900">
                          A4 Multi-Photo Sheet
                        </td>
                        <td className="p-2.5 border border-gray-200">210 × 297 mm</td>
                        <td className="p-2.5 border border-gray-200 font-bold">16 to 32 Photos</td>
                        <td className="p-2.5 border border-gray-200">3.5 × 4.5 cm Standard</td>
                        <td className="p-2.5 border border-gray-200">Office Multi-function & A4 Photo Printers</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Frequently Asked Questions (Accordion Style) */}
              <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#414FA8]" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Frequently Asked Questions (Cyber Cafe & CSC Operators)
                  </h2>
                </div>

                <div className="space-y-3 pt-2">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/60 space-y-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-start gap-2">
                        <span className="text-[#414FA8] font-extrabold">Q:</span>
                        <span>{faq.q}</span>
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed pl-5">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              <Sidebar />

              {/* Related Tools Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-gray-500">
                  Related Cyber Cafe Tools
                </h3>
                <div className="space-y-1.5">
                  {relatedTools.map((t) => (
                    <Link
                      key={t.slug}
                      href={t.route || `/tools/${t.slug}`}
                      className="block p-2 rounded-lg hover:bg-blue-50/60 border border-transparent hover:border-blue-200 transition-colors"
                    >
                      <p className="text-xs font-bold text-gray-800">{t.name}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{t.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
