import React from 'react';
import type { Metadata } from 'next';
import { ShippingLabelToA4Tool } from '@/components/tool-ui/ShippingLabelToA4Tool';

export const metadata: Metadata = {
  title: 'Shipping Label to A4 – Print Multiple Labels Per Page | SizeSnap',
  description: 'Arrange individual shipping labels onto A4 pages for easy printing. Support 1, 2, 4, 6, and 8 labels per sheet.',
};

export default function ShippingLabelToA4Page() {
  return <ShippingLabelToA4Tool isMeesho={false} />;
}
