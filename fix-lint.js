const fs = require('fs');

let content = fs.readFileSync('components/tool-ui/writing/ListFormatterTool.tsx', 'utf-8');
content = content.replace(/Wrap in Quotes ""/, 'Wrap in Quotes &quot;&quot;');
fs.writeFileSync('components/tool-ui/writing/ListFormatterTool.tsx', content, 'utf-8');

// For LoremIpsumGeneratorTool, replace the useEffect initial generation with a lazily initialized state
content = fs.readFileSync('components/tool-ui/writing/LoremIpsumGeneratorTool.tsx', 'utf-8');
content = content.replace(/const \[output, setOutput\] = useState\(''\);/, "const [output, setOutput] = useState(() => { return generateParagraph(5) + '\\n\\n' + generateParagraph(6) + '\\n\\n' + generateParagraph(4); });");
content = content.replace(/useEffect\(\(\) => \{\n    generateText\(\);\n  \}, \[\]\);/g, '');
fs.writeFileSync('components/tool-ui/writing/LoremIpsumGeneratorTool.tsx', content, 'utf-8');

// For RandomParagraphGeneratorTool, replace the useEffect initial generation
content = fs.readFileSync('components/tool-ui/writing/RandomParagraphGeneratorTool.tsx', 'utf-8');
content = content.replace(/const \[output, setOutput\] = useState\(''\);/, "const [output, setOutput] = useState(() => { return [SENTENCES[Math.floor(Math.random() * SENTENCES.length)], SENTENCES[Math.floor(Math.random() * SENTENCES.length)]].join(' ') + '\\n\\n' + [SENTENCES[Math.floor(Math.random() * SENTENCES.length)]].join(' '); });");
content = content.replace(/useEffect\(\(\) => \{\n    generateText\(\);\n  \}, \[\]\);/g, '');
fs.writeFileSync('components/tool-ui/writing/RandomParagraphGeneratorTool.tsx', content, 'utf-8');
