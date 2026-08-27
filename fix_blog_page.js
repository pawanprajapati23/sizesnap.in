const fs = require('fs');
let content = fs.readFileSync('app/blog/page.tsx', 'utf8');

// Fix the typo
content = content.replace('</div>>', '</div>');

// Add import
content = content.replace("import { getApprovedUgcBlogs } from '@/lib/ugcBlogStore'", "import { getApprovedUgcBlogs } from '@/lib/ugcBlogStore'\nimport { ShareWriteLink } from '@/components/ShareWriteLink'");

fs.writeFileSync('app/blog/page.tsx', content);
