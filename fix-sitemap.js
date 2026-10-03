const fs = require('fs');

let content = fs.readFileSync('app/sitemap.ts', 'utf-8');

const newLogic = `
  // Production tool routes
  const productionTools = ALL_TOOLS.filter(t => t.status === 'production');

  const toolRoutes: MetadataRoute.Sitemap = productionTools.map((tool) => {
    let priority = 0.8;
    if (tool.seoPriority === 'High') priority = 1.0;
    else if (tool.seoPriority === 'Medium') priority = 0.9;

    return {
      url: \`\${BASE_URL}/tools/\${tool.slug}\`,
      lastModified: currentDate,
      changeFrequency: priority >= 0.9 ? 'weekly' : 'monthly',
      priority,
    };
  });
`;

content = content.replace(/  \/\/ High‑traffic tool routes(.*)  \/\/ Dedicated Government Exam routes/s, newLogic + '\n  // Dedicated Government Exam routes');

fs.writeFileSync('app/sitemap.ts', content, 'utf-8');
