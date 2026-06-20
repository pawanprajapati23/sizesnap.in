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
  {
    slug: 'passport-photo-fix',
    title: 'Passport Photo Rejection: 5 Mistakes Jo Sab Karte Hain',
    description: 'Avoid passport size photo rejection in SSC, UPSC, and government exams. Learn the 5 most common mistakes students make.',
    date: '2026-06-20',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=800&fit=crop&q=80',
  },
]

export function getRelatedStories(keyword: string) {
  const normalized = keyword.toLowerCase()
  return stories.filter(story => {
    const text = (story.title + ' ' + story.description + ' ' + story.slug).toLowerCase()
    if (
      normalized.includes('photo') || 
      normalized.includes('ssc') || 
      normalized.includes('resize') || 
      normalized.includes('size')
    ) {
      return (
        text.includes('photo') || 
        text.includes('ssc') || 
        text.includes('size') || 
        text.includes('resize')
      )
    }
    return text.includes(normalized)
  }).slice(0, 3)
}

