export type StoryConfig = {
  slug: string
  title: string
  description: string
  date: string
  coverImage: string
}

export const stories: StoryConfig[] = [
  {
    slug: 'ssc-photo-rejection',
    title: 'SSC CGL Form Photo Rejection Se Kaise Bachein',
    description: 'Avoid SSC CGL form photo rejection with the right size, background, and upload tips.',
    date: '2026-06-18',
    coverImage: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=800&fit=crop&q=80',
  },
  {
    slug: 'resize-to-50kb',
    title: 'Resize Image to 50KB for Online Forms',
    description: 'Compress your passport photo or signature image to exactly 50KB online for free without quality loss.',
    date: '2026-06-20',
    coverImage: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&h=800&fit=crop&q=80',
  },
]
