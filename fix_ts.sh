#!/bin/bash

# 1. customSeoContent.ts (remove duplicate 'compress-pdf/to-15kb' block from 1634)
# Since sed multiline delete is tricky, I'll use a python script to fix everything!

cat << 'PYEOF' > fix.py
import re

# 1. lib/customSeoContent.ts - remove second compress-pdf/to-15kb block
with open('lib/customSeoContent.ts', 'r') as f:
    content = f.read()
# Find all occurrences of compress-pdf/to-15kb and remove the second one.
parts = content.split("'compress-pdf/to-15kb': {")
if len(parts) > 2:
    # There is a second occurrence
    rest = parts[2]
    # find the end of the block (the next '},' or similar)
    end_idx = rest.find("  },")
    if end_idx != -1:
        rest = rest[end_idx + 4:] # Skip the "  }," and the newline
    content = parts[0] + "'compress-pdf/to-15kb': {" + parts[1] + rest
    with open('lib/customSeoContent.ts', 'w') as f:
        f.write(content)

# 2. app/admin/blog/page.tsx
with open('app/admin/blog/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('snap.forEach(d =>', 'snap.forEach((d: any) =>')
with open('app/admin/blog/page.tsx', 'w') as f:
    f.write(c)

# 3. app/admin/exams/page.tsx
with open('app/admin/exams/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('snap.forEach(d =>', 'snap.forEach((d: any) =>')
with open('app/admin/exams/page.tsx', 'w') as f:
    f.write(c)

# 4. app/admin/feedback/page.tsx
with open('app/admin/feedback/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('snap.forEach(doc =>', 'snap.forEach((doc: any) =>')
with open('app/admin/feedback/page.tsx', 'w') as f:
    f.write(c)

# 5. app/admin/layout.tsx
with open('app/admin/layout.tsx', 'r') as f:
    c = f.read()
c = c.replace('onAuthStateChanged(auth,', 'onAuthStateChanged(auth as any,')
c = c.replace('auth.signOut()', 'auth?.signOut()')
with open('app/admin/layout.tsx', 'w') as f:
    f.write(c)

# 6. app/admin/page.tsx
with open('app/admin/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('signOut(auth)', 'signOut(auth as any)')
with open('app/admin/page.tsx', 'w') as f:
    f.write(c)

# 7. app/admin/settings/placeholder.tsx
with open('app/admin/settings/placeholder.tsx', 'r') as f:
    c = f.read()
c = c.replace('import { Tool', 'import { Wrench')
c = c.replace('<Tool ', '<Wrench ')
with open('app/admin/settings/placeholder.tsx', 'w') as f:
    f.write(c)

# 8. app/admin/tools/page.tsx
with open('app/admin/tools/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('signOut(auth)', 'signOut(auth as any)')
with open('app/admin/tools/page.tsx', 'w') as f:
    f.write(c)

# 9. app/api/admin/seo/route.ts
with open('app/api/admin/seo/route.ts', 'r') as f:
    c = f.read()
c = c.replace('const logs = auditDoc.data()?.logs.map(l =>', 'const logs = auditDoc.data()?.logs.map((l: any) =>')
c = c.replace('const job = { id: jobId }', 'const job: any = { id: jobId }')
with open('app/api/admin/seo/route.ts', 'w') as f:
    f.write(c)

# 10. components/tools/LiveDocumentScannerTool.tsx
with open('components/tools/LiveDocumentScannerTool.tsx', 'r') as f:
    c = f.read()
c = c.replace('new Blob([pdfBytes],', 'new Blob([pdfBytes as any],')
with open('components/tools/LiveDocumentScannerTool.tsx', 'w') as f:
    f.write(c)

# 11. components/tools/SmartAadharPrintTool.tsx
with open('components/tools/SmartAadharPrintTool.tsx', 'r') as f:
    c = f.read()
c = c.replace('new Blob([pdfBytes],', 'new Blob([pdfBytes as any],')
with open('components/tools/SmartAadharPrintTool.tsx', 'w') as f:
    f.write(c)

PYEOF
python3 fix.py
