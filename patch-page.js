const fs = require('fs');
let content = fs.readFileSync('app/tools/[slug]/page.tsx', 'utf-8');

// 1. generateMetadata
content = content.replace(
  /description: \`Use SizeSnap \$\{tool\.name\} online for free\. Fast, high-quality, privacy-focused image and document processing without watermark\.\`,/,
  "description: tool.shortDescription || `Use SizeSnap ${tool.name} online for free. Fast, high-quality, privacy-focused image and document processing without watermark.`,"
);

// 2. breadcrumb schema (find `const relatedTools = ALL_TOOLS.filter(...)` and append schema)
content = content.replace(
  /const relatedTools = ALL_TOOLS\.filter\(\n    \(t\) => t\.categoryId === tool\.categoryId && t\.slug !== tool\.slug\n  \)\.slice\(0, 6\);/g,
  `const relatedTools = ALL_TOOLS.filter(
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
  };`
);

// 3. inject script and wrap
content = content.replace(
  /return \(\n    <div className="min-h-screen flex flex-col bg-\[#F5F5F7\]">/,
  `return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">`
);

// 4. close fragment
content = content.replace(
  /<Footer \/>\n    <\/div>\n  \);\n\}/,
  `<Footer />
      </div>
    </>
  );
}`
);

// 5. Short Description rendering
content = content.replace(
  /<p className="text-xs sm:text-sm text-gray-600 mt-1">\s*Fast, secure and free online tool for \{tool\.name\.toLowerCase\(\)\}\.\s*<\/p>/,
  `<p className="text-xs sm:text-sm text-gray-600 mt-1">
                {tool.shortDescription || \`Fast, secure and free online tool for \${tool.name.toLowerCase()}.\`}
              </p>`
);

fs.writeFileSync('app/tools/[slug]/page.tsx', content, 'utf-8');
