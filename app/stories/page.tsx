import Link from 'next/link'
import { stories } from '@/lib/storyConfigs'

export const metadata = {
  title: 'SizeSnap Stories',
  description: 'Read SizeSnap AMP web stories on SSC photo rejection and application photo tips.',
}

export default function StoriesIndexPage() {
  return (
    <div className="space-y-8 px-6 pt-10 pb-16 max-w-4xl mx-auto">
      <div className="rounded-3xl bg-slate-950/95 border border-slate-800 p-8 shadow-2xl text-white">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">SizeSnap Stories</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold">Web Stories for fast mobile discovery</h1>
        <p className="mt-4 max-w-3xl text-slate-300 text-lg">Browse the latest AMP web stories from SizeSnap and learn how to avoid common SSC photo rejection issues.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {stories.map(story => (
          <Link
            key={story.slug}
            href={`/stories/${story.slug}`}
            className="group block rounded-3xl border border-slate-200/10 bg-white/95 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <p className="text-sm font-semibold text-blue-600">Story</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">{story.title}</h2>
            <p className="mt-3 text-slate-600">{story.description}</p>
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-slate-400">Read story</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
