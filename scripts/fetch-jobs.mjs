import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load .env.local if running locally
dotenv.config({ path: '.env.local' });

// NVIDIA NIM setup using OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const jobsDir = path.join(process.cwd(), 'data/sarkari-jobs');

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 50);
}

async function fetchLatestJob() {
  console.log('Fetching latest Sarkari Naukri from SarkariResult.com using Puppeteer...');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
    await page.goto('https://www.sarkariresult.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Scrape top job links
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter(a => a.href.includes('/2026/') || a.href.includes('/2027/') || a.href.includes('/latestjob/'))
        .filter(a => a.textContent && a.textContent.trim().length > 15)
        .map(a => ({ title: a.textContent.trim(), url: a.href }))
        .slice(0, 5); // Get top 5
    });

    console.log(`Found ${jobLinks.length} job links.`);

    for (const job of jobLinks) {
      const slug = generateSlug(job.title);
      const filePath = path.join(jobsDir, `${slug}.json`);

      if (fs.existsSync(filePath)) {
        console.log(`Job already exists: ${slug}`);
        continue;
      }

      console.log(`Processing new job: ${job.title}`);
      
      // Navigate to the job page to scrape its text
      await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const jobText = await page.evaluate(() => document.body.textContent.substring(0, 4000));

      let activeModel = "meta/llama-3.1-70b-instruct";
      try {
        const modelsList = await openai.models.list();
        const llamaModels = modelsList.data.filter(m => m.id.toLowerCase().includes("llama"));
        if (llamaModels.length > 0) {
           const preferred = llamaModels.find(m => m.id.includes("70b"));
           activeModel = preferred ? preferred.id : llamaModels[0].id;
        }
      } catch (e) {
        console.error("Warning: Could not fetch models list, using safe fallback.");
        activeModel = "nvidia/llama-3.1-nemotron-70b-instruct";
      }
      
      console.log(`Generating article with NVIDIA API (${activeModel})...`);
      
      const prompt = `
      You are an expert Sarkari Naukri (Government Job) content writer for an Indian audience.
      Write a highly engaging, SEO-optimized job notification article based on this scraped text from SarkariResult:
      "${jobText}"
      
      Important Instructions:
      - Write in Hinglish (a mix of Hindi and English, written in English script).
      - Make it sound exciting and urgent.
      - Output MUST be a valid JSON object matching this exact structure, with NO markdown formatting, NO \`\`\`json wrappers, just raw JSON:
      {
        "title": "Exciting click-bait style title for the job (max 70 chars)",
        "slug": "${slug}",
        "publishedAt": "${new Date().toISOString()}",
        "examName": "Full name of the exam/job",
        "shortDescription": "2-3 lines of summary in Hinglish.",
        "content": "Full detailed article in HTML format. Use <h2> tags for headings (like Important Dates, Eligibility, Age Limit, Application Fee). Include bullet points. IMPORTANT: Add an H2 heading 'Photo & Signature Upload Rules'. Extract the photo/signature dimensions and sizes from the text if available. Then ADD HTML links encouraging users to use sizesnap.in: e.g. <a href='https://sizesnap.in/compress-image' target='_blank'>Click here to compress your photo to exact size for this form</a> and <a href='https://sizesnap.in/resize-image' target='_blank'>Click here to resize your signature</a>.",
        "photoSize": "Extract required photo size (e.g. 20KB-50KB) or leave empty",
        "signatureSize": "Extract required signature size (e.g. 10KB-20KB) or leave empty",
        "applyLink": "Extract the Official Apply Online link from the text if possible, or leave empty"
      }
      `;

      try {
        const response = await openai.chat.completions.create({
          model: activeModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        });

        const rawContent = response.choices[0]?.message?.content;
        
        let jsonStr = rawContent.trim();
        if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
        if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
        if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
        jsonStr = jsonStr.trim();

        const jobData = JSON.parse(jsonStr);

        fs.writeFileSync(filePath, JSON.stringify(jobData, null, 2));
        console.log(`Successfully generated and saved: ${filePath}`);
        
        // Process only 1 new job per run to avoid spamming the API/site
        break;

      } catch (apiError) {
        console.error("NVIDIA API or Parsing Error:", apiError);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Error in Puppeteer script:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

fetchLatestJob();
