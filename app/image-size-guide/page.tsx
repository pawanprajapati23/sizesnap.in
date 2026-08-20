import Link from 'next/link'
import { tools } from '@/lib/toolConfigs'
import { blogs } from '@/lib/blogConfigs'
import type { Metadata } from 'next'
import { ArrowRight, CheckCircle2, Image as ImageIcon, PenLine, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sarkari Exam Photo & Signature Size Guide (Live Hub) | SizeSnap',
  description: '1-Click auto-format tool for SSC, UPSC, Railway, and IBPS exams. Get your passport photo and signature resized to exact official dimensions and KB limits.',
}

const EXAM_DATA = [
  {
    board: 'SSC (Staff Selection Commission)',
    examName: 'CGL, CHSL, MTS, GD Constable',
    theme: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
    slug: 'ssc-cgl-exam-pack',
    photo: '20KB - 50KB (3.5 cm x 4.5 cm)',
    signature: '10KB - 20KB (4.0 cm x 2.0 cm)',
    extra: 'Photo must not have cap or spectacles.',
  },
  {
    board: 'UPSC (Union Public Service Comm.)',
    examName: 'IAS, IPS, NDA, CDS',
    theme: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    slug: 'upsc-ias-exam-pack',
    photo: '20KB - 300KB (350x350 to 1000x1000 px)',
    signature: '20KB - 300KB (350x350 to 1000x1000 px)',
    extra: 'Strictly Square aspect ratio (1:1).',
  },
  {
    board: 'Railway Recruitment Board (RRB)',
    examName: 'NTPC, ALP, Group D',
    theme: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    slug: 'rrb-ntpc-exam-pack',
    photo: '30KB - 70KB (35mm x 45mm)',
    signature: '30KB - 70KB (50mm x 20mm)',
    extra: 'White/Light background mandatory.',
  },
  {
    board: 'IBPS & SBI (Banking)',
    examName: 'PO, Clerk, SO',
    theme: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    slug: 'ibps-po-exam-pack',
    photo: '20KB - 50KB (4.5 cm × 3.5 cm)',
    signature: '10KB - 20KB (140 x 60 pixels)',
    extra: 'Left Thumb (20-50KB) & Declaration (50-100KB) required.',
  },
  {
    board: 'NTA (National Testing Agency)',
    examName: 'NEET UG',
    theme: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
    buttonColor: 'bg-rose-600 hover:bg-rose-700',
    slug: 'neet-ug-exam-pack',
    photo: '10KB - 200KB (Passport & Postcard)',
    signature: '4KB - 30KB (White background)',
    extra: 'Name and Date printed on photo.',
  },
  {
    board: 'UP Police (UPPRPB)',
    examName: 'Constable, SI',
    theme: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    slug: 'up-police-exam-pack',
    photo: '20KB - 50KB (Minimum 300 DPI)',
    signature: '5KB - 20KB (Black Ink only)',
    extra: 'Light grey/white background.',
  }
]

export default function ImageSizeGuide() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12 animate-fadeIn">
      
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-sm mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Live Exam Photo Format Hub
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          1-Click <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sarkari Exam</span> Photo Formatter
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Don't let your application get rejected due to incorrect photo sizes. Select your exam below and our AI will automatically resize your photo and signature to the exact official requirements.
        </p>
      </section>

      {/* Grid of Exams */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXAM_DATA.map((exam, idx) => (
          <div key={idx} className={`rounded-2xl border p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow ${exam.theme}`}>
            <div className="flex-1">
              <h3 className={`font-black text-sm uppercase tracking-wider mb-1 ${exam.iconColor}`}>
                {exam.board}
              </h3>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{exam.examName}</h2>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <ImageIcon className={`w-5 h-5 shrink-0 mt-0.5 ${exam.iconColor}`} />
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase">Photo Limit</p>
                    <p className="text-sm text-gray-900 font-medium">{exam.photo}</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <PenLine className={`w-5 h-5 shrink-0 mt-0.5 ${exam.iconColor}`} />
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase">Signature Limit</p>
                    <p className="text-sm text-gray-900 font-medium">{exam.signature}</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${exam.iconColor}`} />
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase">Special Note</p>
                    <p className="text-sm text-gray-900 font-medium">{exam.extra}</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <Link 
              href={`/exam-pack-generator/${exam.slug}`}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm ${exam.buttonColor}`}
            >
              Auto-Format for {exam.board.split(' ')[0]}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </section>

      {/* Manual Fallbacks & Blogs */}
      <div className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Manual Resizing?</h2>
            <p className="text-gray-600 mb-6">If your specific exam is not listed above, you can manually compress your files to popular targets like 20KB or 50KB using our standalone utilities.</p>
            <div className="flex flex-wrap gap-3">
              {['20KB', '50KB', '100KB', '200KB', '500KB', '1MB'].map(size => (
                <Link 
                  key={size}
                  href={`/resize-image/to-${size.toLowerCase()}`}
                  className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:border-blue-500 hover:text-blue-700 transition-colors shadow-sm"
                >
                  Compress to {size}
                </Link>
              ))}
              <Link href="/compress-pdf/to-100kb" className="bg-gray-900 px-5 py-2.5 rounded-xl border border-gray-900 text-sm font-bold text-white hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Compress PDF
              </Link>
            </div>
          </section>
        </div>

        <aside>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Helpful Exam Guides</h3>
            <div className="space-y-4">
              {blogs.map(blog => (
                <Link 
                  key={blog.slug} 
                  href={`/blog/${blog.slug}`}
                  className="block group"
                >
                  <h4 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 leading-tight mb-1">{blog.title}</h4>
                  <p className="text-gray-500 text-xs line-clamp-2">{blog.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

    </div>
  )
}
