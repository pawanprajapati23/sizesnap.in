import { db } from './firebase';
import { ref, get, set, remove, push } from 'firebase/database';
import { Article } from '@/data/blog';

// Generate a random slug-friendly ID if not using a push ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Fetch all articles
export const getArticles = async (): Promise<Article[]> => {
  const articlesRef = ref(db, 'blog/articles');
  const snapshot = await get(articlesRef);
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.keys(data).map(key => ({
    id: key,
    ...data[key]
  })).sort((a: Article, b: Article) => (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt));
};

// Fetch published articles only
export const getPublishedArticles = async (): Promise<Article[]> => {
  const articles = await getArticles();
  return articles.filter((a: Article) => a.status === 'PUBLISHED');
};

// Fetch article by slug
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  const articles = await getArticles();
  return articles.find((a: Article) => a.slug === slug) || null;
};

// Fetch published article by slug
export const getPublishedArticleBySlug = async (slug: string): Promise<Article | null> => {
  const article = await getArticleBySlug(slug);
  return article?.status === 'PUBLISHED' ? article : null;
};

// Fetch articles by category
export const getArticlesByCategory = async (categorySlug: string): Promise<Article[]> => {
  const articles = await getPublishedArticles();
  return articles.filter((a: Article) => a.category === categorySlug);
};

// Fetch featured article
export const getFeaturedArticle = async (): Promise<Article | null> => {
  const articles = await getPublishedArticles();
  return articles.find((a: Article) => a.featured) || null;
};

// Create a new article
export const createArticle = async (articleData: Omit<Article, 'id' | 'createdAt'>): Promise<string> => {
  const articlesRef = ref(db, 'blog/articles');
  const newArticleRef = push(articlesRef);
  const id = newArticleRef.key!;

  const article: Article = {
    ...articleData,
    id,
    createdAt: Date.now(),
  };

  await set(newArticleRef, article);
  return id;
};

// Update an article
export const updateArticle = async (id: string, updates: Partial<Omit<Article, 'id'>>): Promise<void> => {
  const articleRef = ref(db, `blog/articles/${id}`);
  const snapshot = await get(articleRef);
  if (!snapshot.exists()) throw new Error('Article not found');

  const currentData = snapshot.val();
  await set(articleRef, {
    ...currentData,
    ...updates,
    updatedAt: Date.now()
  });
};

// Delete an article
export const deleteArticle = async (id: string): Promise<void> => {
  const articleRef = ref(db, `blog/articles/${id}`);
  await remove(articleRef);
};

// Search articles
export const searchArticles = async (searchTerm: string): Promise<Article[]> => {
  const articles = await getPublishedArticles();
  const term = searchTerm.toLowerCase();

  return articles.filter((a: Article) =>
    a.title.toLowerCase().includes(term) ||
    a.excerpt.toLowerCase().includes(term) ||
    a.category.toLowerCase().includes(term) ||
    (a.tags && a.tags.some(t => t.toLowerCase().includes(term)))
  );
};
