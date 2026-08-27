import { adminDb } from './firebase-admin'

export interface UgcBlog {
  id?: string;
  slug: string;
  title: string;
  authorName: string;
  excerpt: string;
  content: string; // HTML
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string; // ISO date
  approvedAt?: string; // ISO date
}

const COLLECTION_NAME = 'ugc_blogs';

export async function submitUgcBlog(data: Omit<UgcBlog, 'id' | 'status' | 'submittedAt'>) {
  const newBlog: UgcBlog = {
    ...data,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }
  const docRef = await adminDb.collection(COLLECTION_NAME).add(newBlog);
  return docRef.id;
}

export async function getPendingUgcBlogs(): Promise<UgcBlog[]> {
  const snapshot = await adminDb.collection(COLLECTION_NAME).where('status', '==', 'pending').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UgcBlog));
}

export async function getApprovedUgcBlogs(): Promise<UgcBlog[]> {
  try {
    const snapshot = await adminDb.collection(COLLECTION_NAME).where('status', '==', 'approved').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UgcBlog));
  } catch(e) { console.error(e); return []; }
}

export async function getApprovedUgcBlogBySlug(slug: string): Promise<UgcBlog | null> {
  try {
    const snapshot = await adminDb.collection(COLLECTION_NAME)
      .where('status', '==', 'approved')
      .where('slug', '==', slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as UgcBlog;
  } catch (e) { console.error(e); return null; }
}

export async function updateUgcBlogStatus(id: string, status: 'approved' | 'rejected', updatedData?: Partial<UgcBlog>) {
  const updates: any = { status, ...updatedData };
  if (status === 'approved') {
    updates.approvedAt = new Date().toISOString();
  }
  await adminDb.collection(COLLECTION_NAME).doc(id).update(updates);
}
