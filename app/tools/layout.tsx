import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Free Tools - Image, PDF & Sarkari Exam Utilites | SizeSnap',
  description: 'Explore our complete collection of 100% free client-side tools. From resizing passport photos for exams to merging PDFs and smart document scanning.',
  alternates: {
    canonical: 'https://sizesnap.in/tools',
  }
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
