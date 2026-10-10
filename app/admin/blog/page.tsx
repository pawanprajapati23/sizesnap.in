'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Article } from '@/data/blog';
import { getArticles, deleteArticle } from '@/lib/blog';
import { PenSquare, Trash2, Plus, RefreshCw, Calendar, CheckCircle, FileEdit, Clock } from 'lucide-react';

export default function AdminBlogDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
        // Trigger cache revalidation
        const { revalidateBlogCache } = await import('@/lib/actions');
        await revalidateBlogCache();
      } catch (error) {
        console.error("Failed to delete article:", error);
        alert('Failed to delete article');
      }
    }
  };

  const filteredArticles = articles.filter(a => filter === 'ALL' || a.status === filter);

  const stats = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const sixMonthsAgo = Date.now() - (180 * 24 * 60 * 60 * 1000);
    return {
      total: articles.length,
      published: articles.filter(a => a.status === 'PUBLISHED').length,
      drafts: articles.filter(a => a.status === 'DRAFT').length,
      scheduled: articles.filter(a => a.status === 'SCHEDULED').length,
      needsUpdate: articles.filter(a => {
        // Check if it's an exam article and needs verification
        if (a.officialSources && a.officialSources.length > 0) {
          return a.lastVerifiedAt && a.lastVerifiedAt < sixMonthsAgo;
        }
        return false;
      }).length,
    };
  }, [articles]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Content Management</h1>
          <p className="text-gray-500 mt-1">Manage articles, categories, and educational content.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticles}
            className="p-2 text-gray-500 hover:text-[#414FA8] hover:bg-[#EEF1FB] rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/blog/edit/new"
            className="flex items-center gap-2 bg-[#414FA8] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#344082] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Link>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium text-sm uppercase tracking-wider">Published</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.published}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <FileEdit className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-sm uppercase tracking-wider">Drafts</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.drafts}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Calendar className="w-5 h-5 text-[#414FA8]" />
            <span className="font-medium text-sm uppercase tracking-wider">Scheduled</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.scheduled}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm bg-amber-50">
          <div className="flex items-center gap-3 mb-2 text-amber-700">
            <Clock className="w-5 h-5" />
            <span className="font-medium text-sm uppercase tracking-wider">Needs Verify</span>
          </div>
          <div className="text-3xl font-bold text-amber-900">{stats.needsUpdate}</div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
          {['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === status
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {status === 'ALL' ? `All (${stats.total})` : `${status.charAt(0) + status.slice(1).toLowerCase()}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading articles...</div>
        ) : filteredArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-semibold">Title & Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Author</th>
                  <th className="p-4 font-semibold hidden lg:table-cell">Dates</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900 mb-1 truncate max-w-xs md:max-w-sm">
                        {article.title}
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-[#414FA8] font-medium">{article.category}</span>
                        {article.featured && (
                          <span className="bg-amber-100 text-amber-800 px-1.5 rounded-sm font-semibold">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        article.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        article.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-gray-600">
                      {article.author.name}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-gray-500">
                      <div>Created: {new Date(article.createdAt).toLocaleDateString()}</div>
                      {article.publishedAt && <div>Published: {new Date(article.publishedAt).toLocaleDateString()}</div>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/edit/${article.id}`}
                          className="p-1.5 text-gray-400 hover:text-[#414FA8] hover:bg-[#EEF1FB] rounded transition-colors"
                          title="Edit"
                        >
                          <PenSquare className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {article.status === 'PUBLISHED' && (
                          <a
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="View Public"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No articles found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
