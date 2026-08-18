import { CheckCircle2, AlertTriangle, TrendingUp, Search, Activity, Zap } from 'lucide-react'

export default function SEOGrowthCenter() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-blue-500" /> SEO Growth Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          AI-generated recommendations and SEO audits to improve organic traffic and conversion rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Indexed Pages</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">436</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Position (Est)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12.4</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
            <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Critical Issues</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">3</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> Actionable AI Recommendations
          </h2>
          <p className="text-sm text-slate-500 mt-1">Based on the latest automated codebase audit.</p>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {/* Recommendation 1 */}
          <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Fix E-E-A-T & Schemas on About Us Page</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm leading-relaxed">
                  The <code className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">/about-us</code> page is missing Canonical and OpenGraph metadata. It completely lacks structured data (JSON-LD) for `AboutPage`, `Person` (Founder), and `Organization`. This hurts Google's E-E-A-T rating.
                </p>
                <div className="mt-4 flex gap-3">
                  <span className="text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-2.5 py-1 rounded-full">High Priority</span>
                  <span className="text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full">Technical SEO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation 2 */}
          <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Language Inconsistency on Main Tool Page</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm leading-relaxed">
                  The <code className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">/sizesnap</code> page uses English metadata but the actual FAQ answers are in Hinglish (e.g., "Kya SizeSnap ka use..."). This conflicts with the <code>{"<html lang=\"en\">"}</code> tag and severely penalizes the page for English queries. Additionally, a <code>WebApplication</code> schema is missing.
                </p>
                <div className="mt-4 flex gap-3">
                  <span className="text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 px-2.5 py-1 rounded-full">Medium Priority</span>
                  <span className="text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full">Content & Schema</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation 3 */}
          <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upgrade Blog Content Architecture</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm leading-relaxed">
                  The blog posts lack Table of Contents (TOC) for Google Featured Snippets. The `BlogPosting` schema incorrectly specifies the author as an Organization rather than a Person, and is missing the required `image` property for Rich Results.
                </p>
                <div className="mt-4 flex gap-3">
                  <span className="text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 px-2.5 py-1 rounded-full">Medium Priority</span>
                  <span className="text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full">Blog SEO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
