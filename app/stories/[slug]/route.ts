import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: Request, context: any) {
  const slug = context.params.slug
  const filePath = path.join(process.cwd(), 'public', 'stories', `${slug}.html`)

  try {
    const html = await fs.readFile(filePath, 'utf8')
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    return new Response('Not found', { status: 404 })
  }
}
