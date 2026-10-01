const fs = require('fs');

// Fix PixelResizer
let pixelResizerCode = fs.readFileSync('components/tool-ui/PixelResizer.tsx', 'utf8');
pixelResizerCode = pixelResizerCode.replace(
  "export function PixelResizer({ customTitle }: { customTitle?: string }) {",
  "export function PixelResizer({ customTitle, showSeoContent }: { customTitle?: string, showSeoContent?: boolean }) {"
);

fs.writeFileSync('components/tool-ui/PixelResizer.tsx', pixelResizerCode);
console.log("Updated PixelResizer");
