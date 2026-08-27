import { NextResponse } from 'next/server';
import { getPendingUgcBlogs, updateUgcBlogStatus } from '@/lib/ugcBlogStore';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const pendingBlogs = await getPendingUgcBlogs();
    return NextResponse.json({ blogs: pendingBlogs });
  } catch (error: any) {
    console.error('Fetch Pending UGC Blogs Error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, updatedData } = await req.json();
    
    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await updateUgcBlogStatus(id, status, updatedData);

    // Trigger revalidation so the new blog appears immediately
    if (status === 'approved') {
      revalidatePath('/blog');
      revalidatePath('/sitemap.xml');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update UGC Blog Error:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}
