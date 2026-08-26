import re
import os

# 1. customSeoContent.ts
with open('lib/customSeoContent.ts', 'r') as f:
    c = f.read()

# The issue is that some blocks have:
# introParagraph: '...',
# faqs: [
# Instead of:
# introParagraph: '...',
# bodyHtml: '',
# faqs: [
c = re.sub(r"(introParagraph:\s*'.*?',\n)(\s*)(faqs:\s*\[)", r"\1\2bodyHtml: '',\n\2\3", c)
with open('lib/customSeoContent.ts', 'w') as f:
    f.write(c)

# 2. app/admin/feedback/page.tsx
with open('app/admin/feedback/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('msgSnap.forEach(doc =>', 'msgSnap.forEach((doc: any) =>')
with open('app/admin/feedback/page.tsx', 'w') as f:
    f.write(c)

# 3. app/admin/layout.tsx
with open('app/admin/layout.tsx', 'r') as f:
    c = f.read()
c = c.replace('signOut(auth)', 'signOut(auth as any)')
with open('app/admin/layout.tsx', 'w') as f:
    f.write(c)

# 4. app/admin/page.tsx
with open('app/admin/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('onAuthStateChanged(auth,', 'onAuthStateChanged(auth as any,')
with open('app/admin/page.tsx', 'w') as f:
    f.write(c)

# 5. app/admin/tools/page.tsx
with open('app/admin/tools/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('onAuthStateChanged(auth,', 'onAuthStateChanged(auth as any,')
with open('app/admin/tools/page.tsx', 'w') as f:
    f.write(c)

# 6. app/admin/settings/placeholder.tsx
with open('app/admin/settings/placeholder.tsx', 'r') as f:
    c = f.read()
c = c.replace('Tool, Wrench', 'Wrench')
c = c.replace('Tool,', '')
with open('app/admin/settings/placeholder.tsx', 'w') as f:
    f.write(c)

# 7. app/api/admin/seo/route.ts
with open('app/api/admin/seo/route.ts', 'r') as f:
    c = f.read()
c = c.replace(r'l => l.toUpperCase()', r'(l: any) => l.toUpperCase()')
c = c.replace('opp.status =', '(opp as any).status =')
c = c.replace('opp.completedAt =', '(opp as any).completedAt =')
c = c.replace('opp.beforeStats =', '(opp as any).beforeStats =')
with open('app/api/admin/seo/route.ts', 'w') as f:
    f.write(c)

