'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { Plus, Trash2, FileText } from 'lucide-react'

export default function ExamProfiles() {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newExam, setNewExam] = useState({ name: '', slug: '', width: 350, height: 450, maxKb: 50 })

  const fetchExams = async () => {
    if (!db) return
    try {
      setLoading(true)
      const q = query(collection(db, 'exam_profiles'), orderBy('timestamp', 'desc'))
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching data')), 5000))
      const snap = await Promise.race([getDocs(q), timeout]) as any
      const data: any[] = []
      snap.forEach((d: any) => data.push({ id: d.id, ...d.data() }))
      setExams(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) return
    try {
      setIsAdding(true)
      await addDoc(collection(db, 'exam_profiles'), {
        ...newExam,
        timestamp: serverTimestamp()
      })
      setNewExam({ name: '', slug: '', width: 350, height: 450, maxKb: 50 })
      await fetchExams()
    } catch (err) {
      alert('Error adding exam. Check permissions.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!db || !confirm('Delete this exam profile?')) return
    try {
      await deleteDoc(doc(db, 'exam_profiles', id))
      setExams(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      alert('Error deleting. Check permissions.')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Exam Profiles Generator</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Create dynamic resizing tool pages for new government exams instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="bg-white dark:bg-[#0A0A0A] p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4" /> Add New Exam
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Exam Name</label>
              <input required type="text" value={newExam.name} onChange={e => setNewExam({...newExam, name: e.target.value})} placeholder="e.g. RRB ALP 2026" className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-sm text-zinc-900 dark:text-zinc-100" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">URL Slug</label>
              <input required type="text" value={newExam.slug} onChange={e => setNewExam({...newExam, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="e.g. rrb-alp-2026" className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-sm text-zinc-900 dark:text-zinc-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Width (px)</label>
                <input required type="number" value={newExam.width} onChange={e => setNewExam({...newExam, width: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-sm text-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Height (px)</label>
                <input required type="number" value={newExam.height} onChange={e => setNewExam({...newExam, height: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-sm text-zinc-900 dark:text-zinc-100" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Max Size (KB)</label>
              <input required type="number" value={newExam.maxKb} onChange={e => setNewExam({...newExam, maxKb: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-sm text-zinc-900 dark:text-zinc-100" />
            </div>

            <button disabled={isAdding} type="submit" className="w-full mt-2 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-md transition-colors disabled:opacity-70">
              {isAdding ? 'Adding...' : 'Generate Profile'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Active Exam Profiles
            </h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
          ) : exams.length === 0 ? (
            <div className="text-center text-zinc-500 text-sm py-20">No profiles generated yet.</div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 max-h-[500px] overflow-y-auto">
              {exams.map(ex => (
                <div key={ex.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{ex.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">/exam/{ex.slug} &bull; {ex.width}x{ex.height}px &bull; {ex.maxKb}KB Max</p>
                  </div>
                  <button onClick={() => handleDelete(ex.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
