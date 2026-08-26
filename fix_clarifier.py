with open('components/tools/PhotoClarifierTool.tsx', 'r') as f:
    c = f.read()

c = c.replace('const tW = Math.max(1, Math.round(w * testScale))', 'const tW = Math.max(1, Math.round(canvas.width * testScale))')
c = c.replace('const tH = Math.max(1, Math.round(h * testScale))', 'const tH = Math.max(1, Math.round(canvas.height * testScale))')
c = c.replace('tCtx.drawImage(canvas, 0, 0, w, h, 0, 0, tW, tH)', 'tCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tW, tH)')

with open('components/tools/PhotoClarifierTool.tsx', 'w') as f:
    f.write(c)
