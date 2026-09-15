import fs from 'fs'
import path from 'path'

const jobsDir = path.join(process.cwd(), 'data/sarkari-jobs')

export interface SarkariJob {
  title: string
  slug: string
  publishedAt: string
  examName: string
  shortDescription: string
  content: string
  photoSize?: string
  signatureSize?: string
  applyLink?: string
}

export function getAllSarkariJobs(): SarkariJob[] {
  if (!fs.existsSync(jobsDir)) {
    return []
  }
  const files = fs.readdirSync(jobsDir)
  const jobs = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(jobsDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      try {
        return JSON.parse(fileContent) as SarkariJob
      } catch (e) {
        console.error(`Error parsing job JSON in ${file}`, e)
        return null
      }
    })
    .filter(job => job !== null) as SarkariJob[]

  // Sort by published date descending
  return jobs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getSarkariJobBySlug(slug: string): SarkariJob | null {
  const filePath = path.join(jobsDir, `${slug}.json`)
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    try {
      return JSON.parse(fileContent) as SarkariJob
    } catch (e) {
      console.error(`Error parsing job JSON for ${slug}`, e)
      return null
    }
  }
  return null
}
