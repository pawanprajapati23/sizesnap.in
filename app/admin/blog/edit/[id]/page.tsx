'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Article, BLOG_CATEGORIES, ArticleStatus } from '@/data/blog';
import { getArticleBySlug, getArticles, createArticle, updateArticle, generateId } from '@/lib/blog';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUpload from '@/components/admin/ImageUpload';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: BLOG_CATEGORIES[0].slug,
    tags: [],
    status: 'PUBLISHED',
    featured: false,
    priority: 0,
    author: {
      name: 'SizeSnap Team',
      role: 'Content Team'
    },
    readingTime: 5,
    officialSources: [],
    relatedTools: [],
    relatedArticles: []
  });

  // Load existing article if editing
  useEffect(() => {
    const init = async () => {
      try {
        const all = await getArticles();
        setArticles(all);

        if (!isNew) {
          const article = all.find(a => a.id === resolvedParams.id);
          if (article) {
            setFormData(article);
          } else {
            alert("Article not found!");
            router.push('/admin/blog');
          }
        }
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [resolvedParams.id, isNew, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };



  const validate = (): string[] => {
    const errors: string[] = [];
    if (!formData.title?.trim()) errors.push("Title is required");
    if (!formData.slug?.trim()) errors.push("Slug is required");
    if (!formData.excerpt?.trim()) errors.push("Excerpt is required");
    if (!formData.content?.trim()) errors.push("Content is required");
    if (!formData.category) errors.push("Category is required");
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    if (errors.length > 0) {
      alert("Please fix the following errors:\n\n" + errors.join('\n'));
      return;
    }

    setSaving(true);
    
    const finalData = { ...formData };
    
    try {
      if (isNew) {
        await createArticle(finalData as Omit<Article, 'id' | 'createdAt'>);
      } else {
        await updateArticle(resolvedParams.id, finalData);
      }
      // Trigger cache revalidation
      const { revalidateBlogCache } = await import('@/lib/actions');
      await revalidateBlogCache();
      router.push('/admin/blog');
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(`Failed to save article: ${error?.message || 'Check console for details.'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading editor...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Create New Article' : 'Edit Article'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#414FA8] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#344082] transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]/20 focus:border-[#414FA8] transition-colors text-lg font-medium"
                placeholder="Article title..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">URL Slug</label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm">/blog/</span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]/20 focus:border-[#414FA8] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Short Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]/20 focus:border-[#414FA8] transition-colors resize-none"
                placeholder="A brief summary for cards and SEO..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-900">Content (Rich Text)</label>
              </div>
              <RichTextEditor
                content={formData.content || ''}
                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
              />
              <p className="text-xs text-gray-500 mt-2">Wrap headings in Heading 2 or Heading 3 for automatic Table of Contents.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-gray-900 text-lg">SEO & Meta</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">SEO Title (Optional)</label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]/20 focus:border-[#414FA8] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">SEO Description (Optional)</label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription || ''}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]/20 focus:border-[#414FA8] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Publishing</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status || 'PUBLISHED'}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]/20 focus:border-[#414FA8] transition-colors"
              >
                <option value="DRAFT">Draft</option>
                <option value="REVIEW">Review</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category (Custom)</label>
              <input
                type="text"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                placeholder="e.g. tech-updates or seo-tips"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]/20 focus:border-[#414FA8] transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Type any category slug you want. No spaces.</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckbox}
                className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
              />
              <span className="text-sm font-medium text-gray-700">Set as Featured Article</span>
            </label>

            {formData.status === 'PUBLISHED' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="noIndex"
                  checked={formData.noIndex || false}
                  onChange={handleCheckbox}
                  className="w-4 h-4 text-gray-500 rounded border-gray-300 focus:ring-gray-500"
                />
                <span className="text-sm font-medium text-gray-700">No Index (Hide from Google)</span>
              </label>
            )}

            {(formData.status === 'PUBLISHED' || formData.status === 'SCHEDULED') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish Date</label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt ? new Date(formData.publishedAt - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    if (!isNaN(d.getTime())) setFormData(prev => ({ ...prev, publishedAt: d.getTime() }));
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Media</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
              <ImageUpload
                value={formData.coverImage || ''}
                onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                folder="blog-covers"
              />
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}
