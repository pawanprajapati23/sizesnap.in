import { NextResponse } from 'next/server';
import { submitUgcBlog } from '@/lib/ugcBlogStore';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Basic validation
    if (!data.title || !data.authorName || !data.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Auto-generate slug from title
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    const docId = await submitUgcBlog({
      title: data.title,
      authorName: data.authorName,
      content: data.content,
      excerpt: data.excerpt || data.content.substring(0, 150) + '...',
      slug,
    });

    return NextResponse.json({ success: true, id: docId });
  } catch (error: any) {
    console.error('Submit UGC Blog Error:', error);
    return NextResponse.json({ error: 'Failed to submit blog' }, { status: 500 });
  }
}
