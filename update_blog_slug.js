const fs = require('fs');
const filePath = 'app/blog/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("import { blogs } from '@/lib/blogConfigs'", "import { blogs } from '@/lib/blogConfigs'\nimport { getApprovedUgcBlogBySlug, getApprovedUgcBlogs } from '@/lib/ugcBlogStore'");

content = content.replace("export function generateStaticParams() {\n  return blogs.map((blog) => ({\n    slug: blog.slug,\n  }))\n}", "export const revalidate = 3600;\n\nexport async function generateStaticParams() {\n  // Pre-render static blogs\n  const staticSlugs = blogs.map((blog) => ({ slug: blog.slug }));\n  // Wait, UGC blogs might not be fully known at build time, so we just return static ones.\n  // ISR will handle generating dynamic ones on the fly.\n  return staticSlugs;\n}");

content = content.replace("export function generateMetadata({ params }: Props): Metadata {", "export async function generateMetadata({ params }: Props): Promise<Metadata> {");
content = content.replace("const blog = blogs.find((b) => b.slug === params.slug)", "const paramSlug = (await params).slug;\n  let blog = blogs.find((b) => b.slug === paramSlug) as any;\n  if (!blog) {\n    blog = await getApprovedUgcBlogBySlug(paramSlug);\n    if (blog) {\n      blog = { ...blog, date: blog.approvedAt || blog.submittedAt };\n    }\n  }");

content = content.replace("export default function BlogPost({ params }: Props) {", "export default async function BlogPost({ params }: Props) {");
content = content.replace("const blog = blogs.find((b) => b.slug === params.slug)", "const paramSlug = (await params).slug;\n  let blog = blogs.find((b) => b.slug === paramSlug) as any;\n  let isUgc = false;\n  if (!blog) {\n    blog = await getApprovedUgcBlogBySlug(paramSlug);\n    if (blog) {\n      blog = { ...blog, date: blog.approvedAt || blog.submittedAt };\n      isUgc = true;\n    }\n  }");

content = content.replace("'name': 'Pawan Prajapati'", "'name': isUgc ? blog.authorName : 'Pawan Prajapati'");
content = content.replace("Written by Pawan Prajapati", "Written by {isUgc ? blog.authorName : 'Pawan Prajapati'}");
content = content.replace("Founder & Developer at SizeSnap", "{isUgc ? 'Guest Author & Contributor' : 'Founder & Developer at SizeSnap'}");

fs.writeFileSync(filePath, content);
