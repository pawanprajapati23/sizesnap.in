import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSarkariJobs, getSarkariJobBySlug } from '@/lib/sarkariJobs'
import { Calendar, Briefcase, ExternalLink, Image as ImageIcon, PenTool } from 'lucide-react'

// Generate static params for all jobs at build time
export async function generateStaticParams() {
  const jobs = getAllSarkariJobs()
  return jobs.map(job => ({ slug: job.slug }))
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = getSarkariJobBySlug(params.slug)
  if (!job) return {}

  return {
    title: `${job.title} - Eligibility, Age Limit, Photo Size | SizeSnap`,
    description: job.shortDescription,
    alternates: {
      canonical: `https://sizesnap.in/sarkarinaukari/${job.slug}`,
    }
  }
}

export default function JobArticlePage({ params }: { params: { slug: string } }) {
  const job = getSarkariJobBySlug(params.slug)
  if (!job) notFound()

  // Generate JSON-LD JobPosting schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.examName,
    'description': job.shortDescription,
    'datePosted': job.publishedAt,
    'validThrough': new Date(new Date(job.publishedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Roughly 30 days
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.examName.split(' ')[0] || 'Government',
    },
    'employmentType': 'FULL_TIME',
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'IN'
      }
    }
  }

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 md:px-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Link href="/sarkarinaukari" className="hover:text-blue-600">Sarkari Naukri</Link>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> 
            {new Date(job.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {job.title}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed font-medium">
          {job.shortDescription}
        </p>
      </div>

      {/* Action Banner for SizeSnap */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-bold text-blue-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" /> Form Photo Maker
          </h3>
          <p className="text-sm text-blue-800">
            Compress your photo to {job.photoSize || '20KB-50KB'} & sign to {job.signatureSize || '10KB-20KB'} directly from your phone.
          </p>
        </div>
        <Link 
          href="/resize-image/to-50kb" 
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors w-full sm:w-auto text-center"
        >
          Resize Photo Now
        </Link>
      </div>

      {/* Main Content */}
      <div 
        className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: job.content }}
      />

      {/* Apply Now Button */}
      {job.applyLink && (
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <a 
            href={job.applyLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20"
          >
            Apply Online (Official Link) <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      )}
    </article>
  )
}
