with open('app/api/admin/seo/route.ts', 'r') as f:
    c = f.read()

c = c.replace('existing.status', '(existing as any).status')
c = c.replace('existing?.completedAt', '(existing as any)?.completedAt')
c = c.replace('existing?.beforeStats', '(existing as any)?.beforeStats')
with open('app/api/admin/seo/route.ts', 'w') as f:
    f.write(c)

