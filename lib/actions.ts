'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateBlogCache() {
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml'); // Ensure sitemap updates when posts are added/deleted
  return { success: true };
}
