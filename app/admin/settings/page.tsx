'use client'

export default function GeneralSettings() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Configure your platform settings here.</p>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-10 text-center">
        <p className="text-zinc-500 text-sm">No settings configured yet.</p>
      </div>
    </div>
  )
}
