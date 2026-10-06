const fs = require('fs');

let content = fs.readFileSync('data/tools.ts', 'utf-8');

const newTools = `
  {
    id: 'character-frequency-counter',
    name: 'Character Frequency Counter',
    slug: 'character-frequency-counter',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Count the frequency of each character, letter, or symbol in a text block instantly.',
    keywords: ['character frequency', 'letter frequency', 'count letters'],
    aliases: ['letter frequency counter', 'word letter count', 'symbol frequency'],
    searchIntent: 'Utility',
    relatedTools: ['character-counter', 'word-counter'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'character-frequency-counter'
  },
  {
    id: 'line-counter',
    name: 'Line Counter',
    slug: 'line-counter',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Count total lines, empty lines, and lines with content in any text file or block.',
    keywords: ['line counter', 'count lines', 'number of lines'],
    aliases: ['count empty lines', 'text line counter'],
    searchIntent: 'Utility',
    relatedTools: ['remove-empty-lines', 'word-counter'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'line-counter'
  },`;

content = content.replace(/export const ALL_TOOLS: ToolItem\[\] = \[/, 'export const ALL_TOOLS: ToolItem[] = [\n' + newTools);

fs.writeFileSync('data/tools.ts', content, 'utf-8');
