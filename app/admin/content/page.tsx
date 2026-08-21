import Link from 'next/link'
import { BookOpen, FileText } from 'lucide-react'

export default function ContentManager() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Content Management</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage blog articles and exam profiles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/blog" className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Blog Manager</h2>
            <p className="text-sm text-zinc-500 mt-1">Write, edit, and publish blog posts and guides.</p>
          </div>
        </Link>
        
        <Link href="/admin/exams" className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Exam Profiles</h2>
            <p className="text-sm text-zinc-500 mt-1">Manage exam details, dates, and specifications.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
