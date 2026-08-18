import { Settings, Plus, Wrench, Edit3, Trash2 } from 'lucide-react'

export default function ToolManagement() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-8 h-8 text-blue-500" /> Tool Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your sizesnap tools, edit configurations, and toggle visibility.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500/20">
          <Plus className="w-4 h-4" /> Add New Tool
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Tool Name & Path</th>
                <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">Image Compressor</p>
                  <p className="text-xs text-slate-500">/compress-image</p>
                </td>
                <td className="px-6 py-4">Image Tools</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-500 transition-colors p-2"><Edit3 className="w-4 h-4" /></button>
                  <button className="text-slate-400 hover:text-red-500 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">Image Resizer</p>
                  <p className="text-xs text-slate-500">/resize-image</p>
                </td>
                <td className="px-6 py-4">Image Tools</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-500 transition-colors p-2"><Edit3 className="w-4 h-4" /></button>
                  <button className="text-slate-400 hover:text-red-500 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">PDF Compressor</p>
                  <p className="text-xs text-slate-500">/compress-pdf</p>
                </td>
                <td className="px-6 py-4">PDF Tools</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Beta
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-500 transition-colors p-2"><Edit3 className="w-4 h-4" /></button>
                  <button className="text-slate-400 hover:text-red-500 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
