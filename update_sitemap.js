const fs = require('fs');
const filePath = 'app/sitemap.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("import { blogs } from '@/lib/blogConfigs'", "import { blogs } from '@/lib/blogConfigs'\nimport { getApprovedUgcBlogs } from '@/lib/ugcBlogStore'");

content = content.replace("export default function sitemap(): MetadataRoute.Sitemap {", "export const revalidate = 3600;\n\nexport default async function sitemap(): Promise<MetadataRoute.Sitemap> {");

const ugcCode = `
  const approvedUgcBlogs = await getApprovedUgcBlogs();
  const ugcBlogPages = approvedUgcBlogs.map(blog => ({
    url: \`\${BASE_URL}/blog/\${blog.slug}\`,
    lastModified: new Date(blog.approvedAt || blog.submittedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
`;

content = content.replace("const blogPages = blogs.map", ugcCode + "\n  const blogPages = blogs.map");

content = content.replace("...blogPages,", "...blogPages,\n    ...ugcBlogPages,");

fs.writeFileSync(filePath, content);
