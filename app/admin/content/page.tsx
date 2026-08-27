import { UgcBlogApprover } from '@/components/admin/UgcBlogApprover'

export default function ContentManager() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Content Management</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Review and manage User Generated Content (UGC) blogs.</p>
      </div>

      <UgcBlogApprover />
    </div>
  )
}
