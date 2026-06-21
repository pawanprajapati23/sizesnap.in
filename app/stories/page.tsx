import Link from 'next/link'
import { stories } from '@/lib/storyConfigs'

export const metadata = {
  title: 'SizeSnap Web Stories - Fast Image Resize Guides',
  description: 'Browse visually rich, interactive AMP web stories about image compressing, SSC CGL application requirements, photo formatting, and size reduction.',
  alternates: {
    canonical: 'https://sizesnap.in/stories',
  }
}

export default function StoriesIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30 selection:text-amber-200">
      <div className="relative overflow-hidden py-20 px-6 sm:px-8 max-w-6xl mx-auto">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/20 to-purple-600/0 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 to-emerald-500/0 rounded-full blur-[120px] pointer-events-none" />

        {/* Header Hero Section */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            SizeSnap Stories
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-none">
            Interactive <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">Web Stories</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
            Quick, visual guides to help you format photos, solve form upload errors, and meet official requirements instantly.
          </p>
        </div>

        {/* Stories Card Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 z-10 relative">
          {stories.map(story => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group relative flex flex-col justify-end overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900 aspect-[3/4] shadow-2xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/5 hover:-translate-y-1.5"
            >
              {/* Card Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dark Vignette Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors duration-300" />
              </div>

              {/* Story Slide Icon Indicator (Top Right) */}
              <div className="absolute top-6 right-6 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>

              {/* Card Footer Text Details */}
              <div className="relative z-10 p-8 space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-amber-400">
                  <span>Web Story</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  <span className="text-slate-400 font-medium normal-case tracking-normal">{story.date}</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight group-hover:text-amber-300 transition-colors duration-300">
                  {story.title}
                </h2>
                
                <p className="text-sm font-medium text-slate-300 line-clamp-2 leading-relaxed">
                  {story.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white group-hover:text-amber-400 transition-colors duration-300">
                  Read Story
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
