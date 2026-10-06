const fs = require('fs');

let content = fs.readFileSync('data/tools.ts', 'utf-8');

// The first attempt might have failed due to whitespace/exact string match.
// We will replace the union more robustly.
content = content.replace(/export type ToolCategoryId = [^;]+;/, "export type ToolCategoryId = 'image' | 'pdf' | 'ecommerce' | 'exam' | 'student' | 'calculator' | 'text' | 'social' | 'seo' | 'developer' | 'writing';");

fs.writeFileSync('data/tools.ts', content, 'utf-8');
