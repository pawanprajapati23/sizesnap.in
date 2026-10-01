const fs = require('fs');
let code = fs.readFileSync('components/tool-ui/KbCompressor.tsx', 'utf8');

code = code.replace(
  "export function KbCompressor({ initialTargetKb }: { initialTargetKb?: number }) {",
  "export function KbCompressor({ initialTargetKb, title, showSeoContent }: { initialTargetKb?: number, title?: string, showSeoContent?: boolean }) {"
);

code = code.replace(
  "Compress and reduce image file size to a specific KB target without losing quality. Works entirely in your browser.",
  "{showSeoContent === false ? 'Compress your product images entirely in your browser.' : 'Compress and reduce image file size to a specific KB target without losing quality. Works entirely in your browser.'}"
);

code = code.replace(
  /<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">\s*<Target className="h-6 w-6 text-\[#414FA8\]" \/>\s*Reduce Image Size in KB\s*<\/h2>/,
  `<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-6 w-6 text-[#414FA8]" />
                {title || 'Reduce Image Size in KB'}
              </h2>`
);

code = code.replace(
  /className="p-6 md:p-8 bg-gray-50 border-t border-gray-100"/,
  "className={`p-6 md:p-8 bg-gray-50 border-t border-gray-100 ${showSeoContent === false ? 'hidden' : ''}`}"
);

fs.writeFileSync('components/tool-ui/KbCompressor.tsx', code);
console.log("Updated KbCompressor.tsx");
