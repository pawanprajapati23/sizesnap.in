'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateBlogCache() {
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  return { success: true };
}
