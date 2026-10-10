export interface Author {
  name: string;
  profileImage?: string;
  bio?: string;
  role?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export type ArticleStatus = 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  coverImage?: string;
  author: Author;
  category: string;
  tags: string[];
  status: ArticleStatus;
  featured: boolean;
  priority: number;
  publishedAt?: number;
  updatedAt?: number;
  scheduledAt?: number;
  readingTime?: number; // In minutes
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
  officialSources?: { name: string; url: string }[];
  relatedTools?: string[];
  relatedArticles?: string[];
  lastVerifiedAt?: number;
  examYear?: string;
  examName?: string;
  createdAt: number;
}

export interface BlogCategory {
  slug: string;
  title: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: 'exam-guides', title: 'Exam Guides', description: 'Exam-specific photo/signature/document requirements.' },
  { slug: 'how-to', title: 'How-To Guides', description: 'Practical step-by-step tutorials.' },
  { slug: 'privacy-security', title: 'Privacy & Security', description: 'Learn about file privacy, client-side processing, and document safety.' },
  { slug: 'comparisons', title: 'Comparisons', description: 'Tool comparisons and alternatives.' },
  { slug: 'student-tips', title: 'Student Tips', description: 'Study, exam and document-related practical help.' },
  { slug: 'tool-guides', title: 'Tool Guides', description: 'Detailed guides explaining how to use SizeSnap tools.' },
  { slug: 'exam-updates', title: 'Exam Updates', description: 'Time-sensitive exam and document requirement updates.' },
  { slug: 'resources', title: 'Resources', description: 'Evergreen educational resources.' },
];
