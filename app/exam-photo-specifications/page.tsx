import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdUnit from '@/components/AdUnit'

export const metadata: Metadata = {
  title: 'Exam Photo & Signature Specifications Calendar 2026 | SizeSnap',
  description: 'Check official photo dimensions, signature sizes, background rules, and last dates to apply for Railway, SSC, UPSC, Bank, and State exams in India.',
  alternates: {
    canonical: 'https://sizesnap.in/exam-photo-specifications',
  },
}

interface ExamSpec {
  name: string
  category: string
  status: 'Live' | 'Upcoming' | 'Active'
  statusColor: string
  lastDate: string
  photoSpec: string
  photoKb: string
  signSpec: string
  signKb: string
  photoLink: string
  signLink: string
}

const EXAM_SPECS: ExamSpec[] = [
  {
    name: 'Railway RRB NTPC 2026',
    category: 'Railways',
    status: 'Live',
    statusColor: 'bg-red-500 text-white',
    lastDate: 'Active Recruitment',
    photoSpec: '3.5 x 4.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    signSpec: 'Black ink on white paper',
    signKb: '10 KB - 20 KB',
    photoLink: '/image-size-for-rrb-exam',
    signLink: '/resize-signature-for-rrb',
  },
  {
    name: 'Railway RRB ALP 2026',
    category: 'Railways',
    status: 'Live',
    statusColor: 'bg-red-500 text-white',
    lastDate: 'Active Recruitment',
    photoSpec: '3.5 x 4.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    signSpec: 'Black ink scan signature',
    signKb: '10 KB - 20 KB',
    photoLink: '/image-size-for-rrb-alp-exam',
    signLink: '/resize-signature-for-rrb-alp',
  },
  {
    name: 'Railway RRB Group D 2026',
    category: 'Railways',
    status: 'Upcoming',
    statusColor: 'bg-blue-600 text-white',
    lastDate: 'To be announced',
    photoSpec: '3.5 x 4.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    signSpec: 'Black ink signature scan',
    signKb: '10 KB - 20 KB',
    photoLink: '/image-size-for-rrb-group-d',
    signLink: '/resize-signature-for-rrb-group-d',
  },
  {
    name: 'SSC MTS 2026',
    category: 'SSC',
    status: 'Live',
    statusColor: 'bg-red-500 text-white',
    lastDate: 'Check Official Portal',
    photoSpec: '3.5 x 4.5 cm (No spectacles/cap)',
    photoKb: '20 KB - 50 KB',
    signSpec: '4.0 x 2.0 cm (Clear scan)',
    signKb: '10 KB - 20 KB',
    photoLink: '/image-size-for-ssc-mts-exam',
    signLink: '/resize-signature-for-ssc-mts',
  },
  {
    name: 'SSC GD Constable',
    category: 'SSC',
    status: 'Active',
    statusColor: 'bg-green-600 text-white',
    lastDate: 'Ongoing / Upcoming',
    photoSpec: '3.5 x 4.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    signSpec: '4.0 x 2.0 cm',
    signKb: '10 KB - 20 KB',
    photoLink: '/image-size-for-ssc-gd',
    signLink: '/resize-signature-for-ssc-gd',
  },
  {
    name: 'UPSSSC PET 2026',
    category: 'State PSC',
    status: 'Active',
    statusColor: 'bg-green-600 text-white',
    lastDate: 'Check Notification',
    photoSpec: '3.5 x 4.5 cm (Light BG)',
    photoKb: '20 KB - 50 KB',
    signSpec: 'Name in Hindi under sign',
    signKb: 'Under 20 KB',
    photoLink: '/photo-size-for-upsssc-pet',
    signLink: '/resize-signature-for-upsssc',
  },
  {
    name: 'UPSC Civil Services (IAS/IPS)',
    category: 'UPSC',
    status: 'Active',
    statusColor: 'bg-green-600 text-white',
    lastDate: 'Annually announced',
    photoSpec: 'Min 350x350 to Max 1000x1000 px',
    photoKb: '20 KB - 300 KB',
    signSpec: 'Square aspect ratio scan',
    signKb: '20 KB - 300 KB',
    photoLink: '/photo-size-for-upsc-form',
    signLink: '/resize-signature-for-upsc',
  },
  {
    name: 'IBPS PO & Clerk 2026',
    category: 'Banking',
    status: 'Live',
    statusColor: 'bg-red-500 text-white',
    lastDate: 'Check banking calendar',
    photoSpec: '4.5 x 3.5 cm (White Background)',
    photoKb: '20 KB - 50 KB',
    signSpec: '140 x 60 px (Black ink only)',
    signKb: '10 KB - 20 KB',
    photoLink: '/image-size-for-ibps-exam',
    signLink: '/resize-signature-for-ibps-exam',
  },
  {
    name: 'SBI PO & Clerk 2026',
    category: 'Banking',
    status: 'Upcoming',
    statusColor: 'bg-blue-600 text-white',
    lastDate: 'To be announced',
    photoSpec: '4.5 x 3.5 cm (White background)',
    photoKb: '20 KB - 50 KB',
    signSpec: 'Black ink scan signature',
    signKb: '10 KB - 20 KB',
    photoLink: '/photo-size-for-sbi-form',
    signLink: '/resize-signature-for-sbi',
  },
  {
    name: 'CTET Teacher Eligibility',
    category: 'Teaching',
    status: 'Active',
    statusColor: 'bg-green-600 text-white',
    lastDate: 'Bi-annually scheduled',
    photoSpec: '3.5 x 4.5 cm (Clear face)',
    photoKb: '10 KB - 100 KB',
    signSpec: '3.5 x 1.5 cm scan size',
    signKb: '3 KB - 30 KB',
    photoLink: '/image-size-for-ctet-form',
    signLink: '/resize-signature-for-ctet',
  },
  {
    name: 'NEET UG 2026',
    category: 'Medical',
    status: 'Upcoming',
    statusColor: 'bg-blue-600 text-white',
    lastDate: 'Annually in Spring',
    photoSpec: 'Passport & Postcard (4x6 inch)',
    photoKb: '10 KB - 200 KB',
    signSpec: 'White background, clear scan',
    signKb: '4 KB - 30 KB',
    photoLink: '/image-size-for-neet-form',
    signLink: '/resize-signature-for-neet',
  },
  {
    name: 'JEE Main 2026',
    category: 'Engineering',
    status: 'Upcoming',
    statusColor: 'bg-blue-600 text-white',
    lastDate: 'Annually (Session 1 & 2)',
    photoSpec: '3.5 x 4.5 cm (White background)',
    photoKb: '10 KB - 200 KB',
    signSpec: 'Clear signatures on white paper',
    signKb: '4 KB - 30 KB',
    photoLink: '/image-size-for-jee-main',
    signLink: '/resize-signature-for-jee',
  },
  {
    name: 'UP Police Constable & SI',
    category: 'State Police',
    status: 'Active',
    statusColor: 'bg-green-600 text-white',
    lastDate: 'Ongoing / Fresh recruitment',
    photoSpec: '3.5 x 4.5 cm (Light BG)',
    photoKb: '20 KB - 50 KB',
    signSpec: 'Clear sign under 20KB',
    signKb: '5 KB - 20 KB',
    photoLink: '/photo-size-for-up-police-form',
    signLink: '/resize-signature-for-up-police',
  },
  {
    name: 'PAN Card (NSDL/UTI)',
    category: 'Government ID',
    status: 'Active',
    statusColor: 'bg-green-600 text-white',
    lastDate: 'Anytime',
    photoSpec: '213 x 213 px (NSDL Portal)',
    photoKb: 'Under 30 KB',
    signSpec: '400 x 200 px equivalent',
    signKb: 'Under 10 KB',
    photoLink: '/pan-card-photo-size',
    signLink: '/resize-signature-for-pan-card',
  }
]

export default function ExamPhotoSpecifications() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Ad */}
      <AdUnit slot="1234567890" format="horizontal" className="min-h-[90px]" />

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Exam Photo &amp; Signature Specifications Calendar 2026
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          Struggling with form rejections? Check the official photo dimensions, signature sizes, 
          and file weight limits for competitive government and entrance exams in India. 
          Use the quick links to resize your files instantly.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          Updated for 2026 Notification Specifications
        </div>
      </div>

      {/* Main Spec Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Official Photo &amp; Sign Dimensions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Filter and find the exact target requirements for your applications.</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="p-4">Exam Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Passport Photo Specs</th>
                <th className="p-4">Signature Specs</th>
                <th className="p-4 text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {EXAM_SPECS.map((exam) => (
                <tr key={exam.name} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{exam.name}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200/50 text-[11px] font-medium text-gray-600">
                      {exam.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${exam.statusColor}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="font-semibold text-gray-900">{exam.photoKb}</div>
                    <div className="text-xs text-gray-500">{exam.photoSpec}</div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="font-semibold text-gray-900">{exam.signKb}</div>
                    <div className="text-xs text-gray-500">{exam.signSpec}</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Link 
                        href={exam.photoLink} 
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-100 transition-all"
                      >
                        Resize Photo
                      </Link>
                      <Link 
                        href={exam.signLink} 
                        className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200 transition-all"
                      >
                        Resize Sign
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ad Break */}
      <AdUnit slot="0987654321" format="rectangle" className="min-h-[250px]" />

      {/* Bilingual Pro Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
            <span>⚠️</span> Photo Rejection Checklist
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span><strong>Glasses &amp; Caps:</strong> Photos wearing sunglasses, caps, or hats are flagged automatically by AI scanners on SSC and Bank portals.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span><strong>Red-Eye &amp; Flash Glare:</strong> Ensure there is no flash reflection on your spectacles. Best is to upload without spectacles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span><strong>Background Color:</strong> Plain white or very light grey/blue backgrounds are standard. Avoid dark or busy wallpaper patterns.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span><strong>Unclear Signature Scans:</strong> Signatures on ruled sheets (with lines) or shadows around the signature lead to rejection. Always sign on a plain white paper.</span>
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-6 space-y-4 text-gray-800">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🇮🇳</span> हिंदी निर्देश (Form Photo Rules)
          </h3>
          <p className="text-sm">
            सरकारी नौकरी के आवेदन फॉर्म भरते समय <strong>80% Form Rejections</strong> केवल गलत तरीके से पासपोर्ट फोटो या सिग्नेचर अपलोड करने की वजह से होते हैं। इन नियमों का पालन करें:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li><strong>लेटेस्ट फोटो का प्रयोग करें:</strong> फोटो हमेशा 3 महीने से ज्यादा पुरानी नहीं होनी चाहिए।</li>
            <li><strong>सिग्नेचर की सही स्याही:</strong> हमेशा सफेद कागज पर <strong>काली स्याही (Black Ink Pen)</strong> से साफ हस्ताक्षर करें।</li>
            <li><strong>चेहरा साफ़ रखें:</strong> मोबाइल कैमरे से फोटो लेते वक्त चेहरे पर छाया (shadow) न आने दें और दोनों कान स्पष्ट दिखने चाहिए।</li>
          </ul>
        </div>
      </div>

      {/* Detailed SEO FAQs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">
          Frequently Asked Questions (FAQs) - Exam Form Guidelines
        </h3>
        <div className="space-y-4 divide-y divide-gray-100">
          <div className="pt-4 first:pt-0 space-y-2">
            <h4 className="font-bold text-gray-900 text-base">Q. Is a live photo capture mandatory now for government exams?</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Yes, boards like UPSC and SSC have introduced live photograph capturing during the registration process to match biometric records. However, you still need to upload a standard pre-clicked passport photo conforming to size guidelines (20KB - 50KB) on the main registration portal.
            </p>
          </div>
          <div className="pt-4 space-y-2">
            <h4 className="font-bold text-gray-900 text-base">Q. What happens if I upload my signature in blue ink?</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              While some portals accept blue ink, boards like IBPS, SBI, and NTA strictly advise candidates to use a black ink pen for signatures. Black ink provides maximum contrast during document scanning, preventing biometric reader failures.
            </p>
          </div>
          <div className="pt-4 space-y-2">
            <h4 className="font-bold text-gray-900 text-base">Q. Can I use SizeSnap on my mobile device to format my photo?</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Yes! SizeSnap is fully optimized for mobile devices. You can click a photo using your smartphone camera, crop it to the required dimensions, and compress it under 20KB/50KB directly in your mobile browser without installing any apps.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Ad */}
      <AdUnit slot="1122334455" format="horizontal" />
    </div>
  )
}
