import { CategoryHubPage } from '@/components/templates/CategoryHubPage';
import { ALL_TOOLS } from '@/data/tools';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Image Tools & Resizers | SizeSnap',
  description: 'Free client-side tools to perfectly resize and crop your images for Instagram, YouTube, LinkedIn, Facebook, X, and WhatsApp.',
  alternates: {
    canonical: 'https://sizesnap.in/social-media-tools',
  },
};

export default function SocialMediaToolsPage() {
  const tools = ALL_TOOLS.filter((t) => t.category === 'social-media-tools');

  return (
    <CategoryHubPage
      title="Social Media Tools"
      description="Format your content perfectly for every platform. Free online client-side resizers for Instagram, YouTube, LinkedIn, and more without uploading your photos to a server."
      tools={tools}
    />
  );
}
