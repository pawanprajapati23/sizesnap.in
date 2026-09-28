// app/admin/route.ts
// Force /admin to be treated as a static route, not as a dynamic slug under /tools
export const dynamic = 'force-static';
export const revalidate = 0;
