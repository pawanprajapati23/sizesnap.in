import React from 'react';
import type { Metadata } from 'next';
import { ShippingLabelToA4Tool } from '@/components/tool-ui/ShippingLabelToA4Tool';

export const metadata: Metadata = {
  title: 'Meesho Shipping Label to A4 – Print 4 Labels Per Page | SizeSnap',
  description: 'Easily convert and arrange your Meesho shipping labels to print 4 per A4 page. Free, fast, and secure client-side processing.',
};

export default function MeeshoLabelToA4Page() {
  return <ShippingLabelToA4Tool isMeesho={true} />;
}
