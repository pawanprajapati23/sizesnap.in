const fs = require('fs');

// 1. Navbar and Sidebar remain untouched since they don't explicitly rely on categoryId.
//    (Their structures were verified to be manually defined in the original codebase).

// 2. RelatedTools
let content = fs.readFileSync('components/RelatedTools.tsx', 'utf-8');
content = content.replace(/t\.categoryId === 'F'/g, "t.categoryId === 'exam'");
content = content.replace(/t\.categoryId === 'G'/g, "t.categoryId === 'pdf'");
content = content.replace(/t\.categoryId === 'D'/g, "t.categoryId === 'image'");
content = content.replace(/t\.categoryId === 'E'/g, "t.categoryId === 'calculator'");
fs.writeFileSync('components/RelatedTools.tsx', content, 'utf-8');

// 3. ToolDirectory
content = fs.readFileSync('components/ToolDirectory.tsx', 'utf-8');
content = content.replace(/category\.id === 'A'/g, "category.id === 'image'");
fs.writeFileSync('components/ToolDirectory.tsx', content, 'utf-8');

// 4. CategoryHubPage
content = fs.readFileSync('components/templates/CategoryHubPage.tsx', 'utf-8');
content = content.replace(/t\.categoryId === 'F'/g, "t.categoryId === 'exam'");
content = content.replace(/t\.categoryId === 'G'/g, "t.categoryId === 'pdf'");
content = content.replace(/t\.categoryId === 'D'/g, "t.categoryId === 'image'");
fs.writeFileSync('components/templates/CategoryHubPage.tsx', content, 'utf-8');

// 5. Explicit Hub Pages
const files = [
  'app/image-tools/page.tsx',
  'app/pdf-tools/page.tsx',
  'app/exam-tools/page.tsx',
  'app/social-media-tools/page.tsx'
];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let pageContent = fs.readFileSync(file, 'utf-8');
    pageContent = pageContent.replace(/category="Image"/g, 'category="image"');
    pageContent = pageContent.replace(/category="PDF"/g, 'category="pdf"');
    pageContent = pageContent.replace(/category="Exam"/g, 'category="exam"');
    pageContent = pageContent.replace(/category="Social"/g, 'category="social"');
    fs.writeFileSync(file, pageContent, 'utf-8');
  }
});
