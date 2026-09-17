import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load .env.local if running locally
dotenv.config({ path: '.env.local' });

const parser = new Parser();

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
    .substring(0, 50); // keep it short
}

async function fetchLatestJob() {
  console.log('Fetching latest Sarkari Naukri from Google News RSS...');
  try {
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=sarkari+job+notification&hl=en-IN&gl=IN&ceid=IN:en');
    
    // Get top 3 items to find a good one
    for (let i = 0; i < Math.min(3, feed.items.length); i++) {
      const item = feed.items[i];
      const title = item.title.split(' - ')[0]; // Remove publisher name
      const link = item.link;
      const pubDate = item.pubDate;

      const slug = generateSlug(title);
      const filePath = path.join(jobsDir, `${slug}.json`);

      // Check if job already exists
      if (fs.existsSync(filePath)) {
        console.log(`Job already exists: ${slug}`);
        continue;
      }

      console.log(`Found new job: ${title}`);
      
      let activeModel = "meta/llama-3.1-70b-instruct";
      try {
        const modelsList = await openai.models.list();
        const llamaModels = modelsList.data.filter(m => m.id.toLowerCase().includes("llama"));
        if (llamaModels.length > 0) {
           const preferred = llamaModels.find(m => m.id.includes("70b"));
           activeModel = preferred ? preferred.id : llamaModels[0].id;
        }
      } catch (e) {
        console.error("Warning: Could not fetch models list, trying default.");
      }
      
      console.log('Generating SEO-optimized article with NVIDIA API (' + activeModel + ')...');
      
      const prompt = `
      You are an expert Sarkari Naukri (Government Job) content writer for an Indian audience.
      Write a highly engaging, SEO-optimized job notification article for the following job headline:
      "${title}"
      
      Important Instructions:
      - Write in Hinglish (a mix of Hindi and English, written in English script).
      - Make it sound exciting and urgent.
      - Output MUST be a valid JSON object matching this exact structure, with NO markdown formatting, NO \`\`\`json wrappers, just raw JSON:
      {
        "title": "Exciting click-bait style title for the job (max 70 chars)",
        "slug": "${slug}",
        "publishedAt": "${new Date().toISOString()}",
        "examName": "Full name of the exam/job based on the headline",
        "shortDescription": "2-3 lines of summary in Hinglish.",
        "content": "Full detailed article in HTML format. Use <h2> tags for headings (like Important Dates, Eligibility, Age Limit, Application Fee). Include bullet points. At the end, add an H2 heading 'Photo & Signature Upload Rules' and mention that users must upload 20KB-50KB photo and 10KB-20KB signature without glasses/cap. Add a call to action encouraging them to use sizesnap.in to compress their photos.",
        "photoSize": "20KB to 50KB",
        "signatureSize": "10KB to 20KB",
        "applyLink": "Official website link (guess it based on the job, e.g. ssc.gov.in, upsc.gov.in) or leave empty string"
      }
      `;

      try {
        const response = await openai.chat.completions.create({
          model: activeModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1500,
        });

        const rawContent = response.choices[0]?.message?.content;
        
        // Try to clean up if the AI added markdown backticks
        let jsonStr = rawContent.trim();
        if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
        if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
        if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
        jsonStr = jsonStr.trim();

        const jobData = JSON.parse(jsonStr);

        // Save to file
        fs.writeFileSync(filePath, JSON.stringify(jobData, null, 2));
        console.log(`Successfully generated and saved: ${filePath}`);
        
        // Only process 1 new job per run to avoid spamming the API and the site
        break;

      } catch (apiError) {
        console.error("NVIDIA API or Parsing Error:", apiError);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Error fetching RSS:', err);
  }
}

fetchLatestJob();
