const fs = require('fs');

let content = fs.readFileSync('app/tools/[slug]/page.tsx', 'utf-8');

const imports = `import { CharacterFrequencyCounterTool } from '@/components/tool-ui/text/CharacterFrequencyCounterTool';
import { LineCounterTool } from '@/components/tool-ui/text/LineCounterTool';`;

content = content.replace("import { TextReverseTool } from '@/components/tool-ui/text/TextReverseTool';", "import { TextReverseTool } from '@/components/tool-ui/text/TextReverseTool';\n" + imports);

content = content.replace(
  "{tool.slug === 'text-reverse' && <TextReverseTool />}",
  `{tool.slug === 'text-reverse' && <TextReverseTool />}
            {tool.slug === 'character-frequency-counter' && <CharacterFrequencyCounterTool />}
            {tool.slug === 'line-counter' && <LineCounterTool />}`
);

content = content.replace(
  /!\[(.*?)\].includes\(tool\.slug\)/,
  "![$1, 'character-frequency-counter', 'line-counter'].includes(tool.slug)"
);

fs.writeFileSync('app/tools/[slug]/page.tsx', content, 'utf-8');
