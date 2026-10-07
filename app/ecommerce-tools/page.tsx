import { CategoryHubPage } from '@/components/templates/CategoryHubPage';
import { ALL_TOOLS } from '@/data/tools';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-commerce Seller Tools & Calculators | SizeSnap',
  description: 'Free utilities for online sellers: PDF shipping label croppers, SKU generators, profit calculators, and marketplace image compliance checkers.',
  alternates: {
    canonical: 'https://sizesnap.in/ecommerce-tools',
  },
};

export default function EcommerceToolsPage() {
  const tools = ALL_TOOLS.filter((t) => t.category === 'ecommerce-tools');

  return (
    <CategoryHubPage
      title="E-commerce Seller Tools"
      description="Streamline your dispatch and listing workflows. Crop A4 shipping labels for thermal printers, calculate exact profit margins, check product image compliance, and generate SKUs instantly."
      tools={tools}
    />
  );
}
