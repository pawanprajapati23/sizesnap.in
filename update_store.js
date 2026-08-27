const fs = require('fs');
const filePath = 'lib/ugcBlogStore.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  "export async function getApprovedUgcBlogs(): Promise<UgcBlog[]> {\n  const snapshot = await adminDb.collection(COLLECTION_NAME).where('status', '==', 'approved').get();\n  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UgcBlog));\n}",
  "export async function getApprovedUgcBlogs(): Promise<UgcBlog[]> {\n  try {\n    const snapshot = await adminDb.collection(COLLECTION_NAME).where('status', '==', 'approved').get();\n    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UgcBlog));\n  } catch(e) { console.error(e); return []; }\n}"
);

content = content.replace(
  "export async function getApprovedUgcBlogBySlug(slug: string): Promise<UgcBlog | null> {\n  const snapshot = await adminDb.collection(COLLECTION_NAME)\n    .where('status', '==', 'approved')\n    .where('slug', '==', slug)\n    .limit(1)\n    .get();\n  \n  if (snapshot.empty) return null;\n  const doc = snapshot.docs[0];\n  return { id: doc.id, ...doc.data() } as UgcBlog;\n}",
  "export async function getApprovedUgcBlogBySlug(slug: string): Promise<UgcBlog | null> {\n  try {\n    const snapshot = await adminDb.collection(COLLECTION_NAME)\n      .where('status', '==', 'approved')\n      .where('slug', '==', slug)\n      .limit(1)\n      .get();\n    if (snapshot.empty) return null;\n    const doc = snapshot.docs[0];\n    return { id: doc.id, ...doc.data() } as UgcBlog;\n  } catch (e) { console.error(e); return null; }\n}"
);

fs.writeFileSync(filePath, content);
