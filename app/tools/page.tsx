import { Metadata } from 'next'
import Link from 'next/link'
import { tools } from '@/lib/toolConfigs'
import { Layers, Image as ImageIcon, FileText, Settings, ShieldCheck, Zap } from 'lucide-react'
import FaqSection from '@/components/FaqSection'

export const metadata: Metadata = {
  title: 'All Free Tools - Image, PDF & Sarkari Exam Utilites | SizeSnap',
  description: 'Explore our complete collection of 100% free client-side tools. From resizing passport photos for exams to merging PDFs and smart document scanning.',
  alternates: {
    canonical: 'https://sizesnap.in/tools',
  }
}

export default function AllToolsPage() {
  const categoryMap = {
    image: {
      title: 'Image & Photo Tools',
      icon: <ImageIcon className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    pdf: {
      title: 'PDF & Document Utilities',
      icon: <FileText className="w-6 h-6 text-red-600" />,
      color: 'bg-red-50 border-red-200'
    },
    form: {
      title: 'Sarkari Exam & Form Tools',
      icon: <Settings className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    }
  }

  // Generate basic FAQs for the tools hub
  const faqs = [
    {
      question: 'Are all these tools completely free to use?',
      answer: 'Yes, every single tool listed on SizeSnap is 100% free to use. There are no hidden charges, no premium subscriptions, and no watermarks added to your downloaded files.'
    },
    {
      question: 'Do my files get uploaded to your servers?',
      answer: 'No. We strictly follow a client-side processing architecture. Whether you are compressing a PDF, cropping an image, or generating a Sarkari exam pack, all file processing happens directly inside your web browser using WebAssembly. Your files never leave your device, ensuring total privacy.'
    },
    {
      question: 'Which is the best tool for SSC and UPSC forms?',
      answer: 'We highly recommend the "1-Click Exam Pack Generator" and the "Combine Photo and Signature" tools for Sarkari exams. They automatically handle the specific KB size limits, dimensions, and DPI required by platforms like SSC, UPSC, and IBPS.'
    },
    {
      question: 'Can I use these tools on my mobile phone?',
      answer: 'Absolutely. SizeSnap is optimized as a Progressive Web App (PWA) experience, meaning all tools including the Live Document Scanner and Smart Aadhar Print Maker work seamlessly on Android and iOS devices without needing to download an app from the Play Store.'
    }
  ]

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'All Free Tools Collection',
    'url': 'https://sizesnap.in/tools',
    'description': metadata.description,
    'publisher': {
      '@type': 'Organization',
      'name': 'SizeSnap'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            All SizeSnap Tools
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Browse our complete directory of free, blazing-fast, and secure client-side utilities. Resize images, manipulate PDFs, and prep your Sarkari exam documents instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4" /> 100% Private (No Uploads)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
              <Zap className="w-4 h-4" /> Browser-Powered Speed
            </span>
          </div>
        </section>

        {/* Tools Categorized List */}
        <section className="space-y-16">
          {(Object.keys(categoryMap) as Array<keyof typeof categoryMap>).map((categoryKey) => {
            const categoryTools = tools.filter(t => t.category === categoryKey)
            
            if (categoryTools.length === 0) return null

            const catInfo = categoryMap[categoryKey]

            return (
              <div key={categoryKey} className="space-y-6">
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${catInfo.color}`}>
                  {catInfo.icon}
                  <h2 className="text-2xl font-bold text-gray-900">{catInfo.title}</h2>
                  <span className="ml-auto bg-white px-3 py-1 rounded-full text-sm font-bold text-gray-600 shadow-sm border border-gray-200">
                    {categoryTools.length} Tools
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map(tool => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {tool.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                            {tool.shortName}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                        {tool.description}
                      </p>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">
                          {tool.variants.length} Variants Available
                        </span>
                        <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                          Use Tool &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* SEO Text Content */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-12 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Why Use SizeSnap's Tools Collection?</h2>
          <div className="prose prose-blue max-w-none text-gray-600 leading-loose">
            <p>
              In today's digital age, dealing with strict file size limitations and exact dimension requirements for online portals is a daily hassle. Whether you are a student applying for competitive exams like SSC CGL, RRB NTPC, or UPSC, a professional managing document workflows, or a cyber cafe owner providing services to dozens of customers daily, you need a toolkit that is reliable and fast.
            </p>
            <p>
              <strong>SizeSnap</strong> was built with a singular mission: to provide a comprehensive, 100% free suite of image and PDF tools that operate entirely within your browser. 
            </p>
            <h3>1. The Privacy First Approach</h3>
            <p>
              Most online compression tools require you to upload your highly sensitive documents (like Aadhar cards, PAN cards, Passports, and Signatures) to their remote servers. This poses a massive privacy risk. We have engineered all our tools using modern WebAssembly (WASM) and HTML5 Canvas API. This means when you click "Compress" or "Resize", the math and processing happen directly on your own device's CPU. Your files are never uploaded to the internet, guaranteeing complete data privacy.
            </p>
            <h3>2. Specialized Tools for Cyber Cafes and Students</h3>
            <p>
              Beyond generic resizers, we've developed highly specialized utilities based on real-world Indian use cases. Tools like the <strong>Smart Aadhar Print Maker</strong> allow cyber cafes to perfectly align ID cards on A4 sheets for PVC printing. The <strong>Formal Passport Suit Maker</strong> uses AI-prepared assets to help job seekers instantly professionalize their CV photos. 
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection faqs={faqs} toolName="SizeSnap Tools" />
      </div>
    </>
  )
}
