import { db } from './firebase';
import { ref, get, set, remove, push } from 'firebase/database';
import { Article, BUILTIN_ARTICLES } from '@/data/blog';

// Helper to remove any undefined properties so Firebase Realtime Database set() doesn't throw
const sanitizeForFirebase = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Generate a random slug-friendly ID if not using a push ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Fetch all articles
export const getArticles = async (): Promise<Article[]> => {
  try {
    const articlesRef = ref(db, 'blog/articles');
    const snapshot = await get(articlesRef);
    let dbArticles: (Article & { isDeleted?: boolean })[] = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      dbArticles = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }

    const deletedSlugs = new Set(
      dbArticles.filter(a => a.isDeleted).map(a => a.slug || a.id)
    );
    const dbSlugs = new Set(dbArticles.map(a => a.slug));
    const dbIds = new Set(dbArticles.map(a => a.id));

    const activeDbArticles = dbArticles.filter(a => !a.isDeleted);

    const mergedArticles = [
      ...activeDbArticles,
      ...BUILTIN_ARTICLES.filter(b => !dbSlugs.has(b.slug) && !dbIds.has(b.id) && !deletedSlugs.has(b.slug) && !deletedSlugs.has(b.id))
    ];

    return mergedArticles.sort((a: Article, b: Article) => (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt));
  } catch (error) {
    console.error('Error fetching articles from Firebase:', error);
    return BUILTIN_ARTICLES;
  }
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

  const sanitized = sanitizeForFirebase(article);
  await set(newArticleRef, sanitized);
  return id;
};

// Update an article
export const updateArticle = async (id: string, updates: Partial<Omit<Article, 'id'>>): Promise<void> => {
  const articleRef = ref(db, `blog/articles/${id}`);
  const snapshot = await get(articleRef);

  let currentData: any = null;
  if (snapshot.exists()) {
    currentData = snapshot.val();
  } else {
    // If it's a built-in article being edited for the first time, load its default data
    const builtin = BUILTIN_ARTICLES.find(b => b.id === id || b.slug === id);
    if (builtin) {
      currentData = { ...builtin };
    } else {
      throw new Error(`Article "${id}" not found`);
    }
  }

  const merged = {
    ...currentData,
    ...updates,
    id: currentData.id || id,
    isDeleted: false,
    updatedAt: Date.now()
  };

  const sanitized = sanitizeForFirebase(merged);
  await set(articleRef, sanitized);
};

// Delete an article
export const deleteArticle = async (id: string): Promise<void> => {
  const articleRef = ref(db, `blog/articles/${id}`);
  const snapshot = await get(articleRef);
  if (snapshot.exists()) {
    await remove(articleRef);
  } else {
    // If it's a built-in article, mark isDeleted: true in DB so it doesn't show up again
    const builtin = BUILTIN_ARTICLES.find(b => b.id === id || b.slug === id);
    if (builtin) {
      await set(articleRef, {
        ...builtin,
        id,
        isDeleted: true,
        updatedAt: Date.now()
      });
    }
  }
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
