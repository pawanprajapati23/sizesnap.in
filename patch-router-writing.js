const fs = require('fs');

let content = fs.readFileSync('app/tools/[slug]/page.tsx', 'utf-8');

const imports = `import { TextFormatterTool } from '@/components/tool-ui/writing/TextFormatterTool';
import { ParagraphFormatterTool } from '@/components/tool-ui/writing/ParagraphFormatterTool';
import { RemoveLineBreaksTool } from '@/components/tool-ui/writing/RemoveLineBreaksTool';
import { RemoveExtraSpacesTool } from '@/components/tool-ui/writing/RemoveExtraSpacesTool';
import { ListFormatterTool } from '@/components/tool-ui/writing/ListFormatterTool';
import { BulletPointGeneratorTool } from '@/components/tool-ui/writing/BulletPointGeneratorTool';
import { NumberedListGeneratorTool } from '@/components/tool-ui/writing/NumberedListGeneratorTool';
import { LoremIpsumGeneratorTool } from '@/components/tool-ui/writing/LoremIpsumGeneratorTool';
import { RandomParagraphGeneratorTool } from '@/components/tool-ui/writing/RandomParagraphGeneratorTool';
import { EmailTextFormatterTool } from '@/components/tool-ui/writing/EmailTextFormatterTool';
`;

content = content.replace("import { ToolButton } from '@/components/ToolButton';", "import { ToolButton } from '@/components/ToolButton';\n" + imports);

const components = `{tool.slug === 'text-formatter' && <TextFormatterTool />}
            {tool.slug === 'paragraph-formatter' && <ParagraphFormatterTool />}
            {tool.slug === 'remove-line-breaks' && <RemoveLineBreaksTool />}
            {tool.slug === 'remove-extra-spaces' && <RemoveExtraSpacesTool />}
            {tool.slug === 'list-formatter' && <ListFormatterTool />}
            {tool.slug === 'bullet-point-generator' && <BulletPointGeneratorTool />}
            {tool.slug === 'numbered-list-generator' && <NumberedListGeneratorTool />}
            {tool.slug === 'lorem-ipsum-generator' && <LoremIpsumGeneratorTool />}
            {tool.slug === 'random-paragraph-generator' && <RandomParagraphGeneratorTool />}
            {tool.slug === 'email-text-formatter' && <EmailTextFormatterTool />}
            `;

content = content.replace(
  "{tool.slug === 'line-counter' && <LineCounterTool />}",
  `{tool.slug === 'line-counter' && <LineCounterTool />}\n            ` + components
);

content = content.replace(
  /(!\[.*?\])\.includes\(tool\.slug\)/,
  `$1.concat(['text-formatter', 'paragraph-formatter', 'remove-line-breaks', 'remove-extra-spaces', 'list-formatter', 'bullet-point-generator', 'numbered-list-generator', 'lorem-ipsum-generator', 'random-paragraph-generator', 'email-text-formatter']).includes(tool.slug)`
);

fs.writeFileSync('app/tools/[slug]/page.tsx', content, 'utf-8');
