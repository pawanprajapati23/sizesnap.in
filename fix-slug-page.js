const fs = require('fs');

let content = fs.readFileSync('app/tools/[slug]/page.tsx', 'utf-8');

// Update generateMetadata description mapping
content = content.replace(
  /description: \`Use SizeSnap \$\{tool\.name\} online for free\. Fast, high-quality, privacy-focused image and document processing without watermark\.\`,/,
  "description: tool.shortDescription || `Use SizeSnap ${tool.name} online for free. Fast, high-quality, privacy-focused image and document processing without watermark.`,"
);

// Add Breadcrumb Schema
content = content.replace(
  /const relatedTools = ALL_TOOLS\.filter\([\s\S]*?\]\)\];\s*\}?/g,
  function(match) {
    if (content.includes('breadcrumbSchema')) return match; // avoid duplication
    return `const relatedTools = ALL_TOOLS.filter(
    (t) => t.categoryId === tool.categoryId && t.slug !== tool.slug
  ).slice(0, 6);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://sizesnap.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.categoryTitle,
        item: \`https://sizesnap.in/\${tool.categoryId}-tools\`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: \`https://sizesnap.in/tools/\${tool.slug}\`,
      },
    ],
  };`;
  }
);

content = content.replace(
  /<div className="min-h-screen flex flex-col bg-\[#F5F5F7\]">/,
  `<>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">`
);

content = content.replace(
  /<Footer \/>\n    <\/div>/,
  `<Footer />
      </div>
    </>`
);

content = content.replace(
  /<p className="text-xs sm:text-sm text-gray-600 mt-1">\s*Fast, secure and free online tool for \{tool\.name\.toLowerCase\(\)\}\.\s*<\/p>/,
  `<p className="text-xs sm:text-sm text-gray-600 mt-1">
                {tool.shortDescription || \`Fast, secure and free online tool for \${tool.name.toLowerCase()}.\`}
              </p>`
);


fs.writeFileSync('app/tools/[slug]/page.tsx', content, 'utf-8');
