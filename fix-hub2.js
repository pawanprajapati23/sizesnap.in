const fs = require('fs');

let content = fs.readFileSync('components/templates/CategoryHubPage.tsx', 'utf-8');

content = content.replace(`  if (customSlugs && customSlugs.length > 0) {
    tools = ALL_TOOLS.filter(t => customSlugs.includes(t.slug));
  } else if (category === 'Image') {
    tools = ALL_TOOLS.filter(t => t.categoryTitle.includes('Image') || (t.categoryId === 'exam' || t.categoryId === 'pdf'));
  } else if (category === 'PDF') {
    tools = ALL_TOOLS.filter(t => t.categoryId === 'image');
  } else if (category === 'Compress') {
    tools = ALL_TOOLS.filter(t => t.slug.includes('compress') || t.slug.includes('reduce'));
  } else if (category === 'Resize') {
    tools = ALL_TOOLS.filter(t => t.slug.includes('resize') || t.slug.includes('crop'));
  }`, `  if (customSlugs && customSlugs.length > 0) {
    tools = ALL_TOOLS.filter(t => customSlugs.includes(t.slug));
  } else if (category === 'Compress') {
    tools = ALL_TOOLS.filter(t => t.slug.includes('compress') || t.slug.includes('reduce'));
  } else if (category === 'Resize') {
    tools = ALL_TOOLS.filter(t => t.slug.includes('resize') || t.slug.includes('crop'));
  } else {
    tools = ALL_TOOLS.filter(t => t.categoryId === category);
  }`);

fs.writeFileSync('components/templates/CategoryHubPage.tsx', content, 'utf-8');
