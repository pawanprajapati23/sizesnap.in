import { Metadata } from 'next'
import Link from 'next/link'
import { getAllSarkariJobs } from '@/lib/sarkariJobs'
import { Briefcase, Calendar, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sarkari Naukri Updates & Exam Forms | SizeSnap',
  description: 'Latest Sarkari Naukri notifications, eligibility, syllabus, and correct photo/signature size requirements for online application forms.',
  alternates: {
    canonical: 'https://sizesnap.in/sarkarinaukari',
  }
}

export default function SarkariNaukriIndex() {
  const jobs = getAllSarkariJobs()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 animate-fadeIn">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Sarkari Naukri <span className="text-blue-600">Updates</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Latest government job notifications, eligibility criteria, and exact photo & signature sizes required for the forms.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {jobs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
            No active jobs found right now. Check back later!
          </div>
        ) : (
          jobs.map(job => (
            <Link 
              key={job.slug} 
              href={`/sarkarinaukari/${job.slug}`}
              className="group block bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                      <Briefcase className="w-3.5 h-3.5" /> Latest Job
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {new Date(job.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h2>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {job.shortDescription}
                  </p>
                  
                  {(job.photoSize || job.signatureSize) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.photoSize && (
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium border border-slate-200">
                          Photo: {job.photoSize}
                        </span>
                      )}
                      {job.signatureSize && (
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium border border-slate-200">
                          Sign: {job.signatureSize}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 transition-colors mt-2 md:mt-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
