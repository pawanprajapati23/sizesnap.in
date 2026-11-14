'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Article } from '@/data/blog';
import { getArticles, deleteArticle } from '@/lib/blog';
import {
  PenSquare,
  Trash2,
  Plus,
  RefreshCw,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';

export default function AdminBlogDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
      setErrorMsg(null);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setErrorMsg('Failed to load articles from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setErrorMsg(null);
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setConfirmDeleteId(null);
      const { revalidateBlogCache } = await import('@/lib/actions');
      await revalidateBlogCache();
    } catch (error) {
      console.error('Failed to delete article:', error);
      setErrorMsg('Could not delete article. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredArticles = articles.filter((a) => filter === 'ALL' || a.status === filter);

  const stats = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const sixMonthsAgo = Date.now() - 180 * 24 * 60 * 60 * 1000;
    return {
      total: articles.length,
      published: articles.filter((a) => a.status === 'PUBLISHED').length,
      drafts: articles.filter((a) => a.status === 'DRAFT').length,
      scheduled: articles.filter((a) => a.status === 'SCHEDULED').length,
      needsUpdate: articles.filter((a) => {
        if (a.officialSources && a.officialSources.length > 0) {
          return a.lastVerifiedAt && a.lastVerifiedAt < sixMonthsAgo;
        }
        return false;
      }).length,
    };
  }, [articles]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Blog Content Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish and update SEO articles, exam photo guides, and tutorials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setErrorMsg(null);
              fetchArticles();
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/blog/edit/new"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="font-semibold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Published</span>
          <div className="font-mono text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.published}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Drafts</span>
          <div className="font-mono text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.drafts}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Scheduled</span>
          <div className="font-mono text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.scheduled}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Needs Verification</span>
          <div className="font-mono text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {stats.needsUpdate}
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60">
          <div className="inline-flex p-1 rounded-lg bg-slate-200/70">
            {(['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  filter === status
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'ALL'
                  ? `All (${stats.total})`
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading articles...</div>
        ) : filteredArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="px-5 py-3">Title &amp; Metadata</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden md:table-cell">Author</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Published</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 truncate max-w-md">
                        {article.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{article.category}</span>
                        {article.featured && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-700 font-medium">Featured</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium">
                      <span
                        className={
                          article.status === 'PUBLISHED'
                            ? 'text-emerald-700'
                            : article.status === 'DRAFT'
                            ? 'text-slate-500'
                            : 'text-indigo-600'
                        }
                      >
                        {article.status.charAt(0) + article.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-slate-600">
                      {article.author.name}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell font-mono text-slate-500 tabular-nums">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {confirmDeleteId === article.id ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={deletingId === article.id}
                            onClick={() => handleDelete(article.id)}
                            className="px-2.5 py-1 rounded bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-700 cursor-pointer"
                          >
                            {deletingId === article.id ? 'Deleting...' : 'Confirm Delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded border border-slate-200 text-slate-600 text-[11px] hover:bg-slate-100 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/blog/edit/${article.id}`}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="Edit Article"
                          >
                            <PenSquare className="w-4 h-4" />
                          </Link>
                          {article.status === 'PUBLISHED' && (
                            <Link
                              href={`/blog/${article.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                              title="View Live Article"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(article.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500">
            No articles found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
