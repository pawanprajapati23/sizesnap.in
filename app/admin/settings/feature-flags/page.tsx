'use client'

import { useState } from 'react'
import { Save, ToggleLeft, ToggleRight } from 'lucide-react'

export default function FeatureFlagsSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [flags, setFlags] = useState({
    betaUI: true,
    newCompressorAlgorithm: false,
    aiEnhancement: true,
    bulkUploads: false
  })

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Feature Flags</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enable or disable experimental features globally.</p>
      </div>

      <div className="space-y-4 max-w-3xl">
        
        <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Beta UI Layout</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Use the new experimental frontend layout for public users.</p>
          </div>
          <button onClick={() => toggleFlag('betaUI')} className="text-indigo-600 dark:text-indigo-400 focus:outline-none">
            {flags.betaUI ? <ToggleRight className="w-10 h-10" strokeWidth={1.5} /> : <ToggleLeft className="w-10 h-10 text-slate-400" strokeWidth={1.5} />}
          </button>
        </div>
        
        <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">WASM Compressor v2</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Use the heavily optimized WebAssembly compression module.</p>
          </div>
          <button onClick={() => toggleFlag('newCompressorAlgorithm')} className="text-indigo-600 dark:text-indigo-400 focus:outline-none">
            {flags.newCompressorAlgorithm ? <ToggleRight className="w-10 h-10" strokeWidth={1.5} /> : <ToggleLeft className="w-10 h-10 text-slate-400" strokeWidth={1.5} />}
          </button>
        </div>
        
        <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">AI Image Upscaler</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Allow premium users to access the experimental AI upscaler tool.</p>
          </div>
          <button onClick={() => toggleFlag('aiEnhancement')} className="text-indigo-600 dark:text-indigo-400 focus:outline-none">
            {flags.aiEnhancement ? <ToggleRight className="w-10 h-10" strokeWidth={1.5} /> : <ToggleLeft className="w-10 h-10 text-slate-400" strokeWidth={1.5} />}
          </button>
        </div>

        <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Bulk Uploads (Max 50)</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Increase the bulk upload limit from 10 to 50 items simultaneously.</p>
          </div>
          <button onClick={() => toggleFlag('bulkUploads')} className="text-indigo-600 dark:text-indigo-400 focus:outline-none">
            {flags.bulkUploads ? <ToggleRight className="w-10 h-10" strokeWidth={1.5} /> : <ToggleLeft className="w-10 h-10 text-slate-400" strokeWidth={1.5} />}
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-xl shadow-sm shadow-indigo-500/20 transition-all"
          >
            {isSaving ? <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Applying...' : 'Apply Flags'}
          </button>
        </div>
      </div>
    </div>
  )
}
