import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const parser = new Parser();
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const jobsDir = path.join(process.cwd(), 'data/sarkari-jobs');

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').substring(0, 50);
}

async function fetchLatestJob() {
  console.log('Fetching latest Sarkari Naukri from SarkariResult RSS Feed...');
  try {
    const feed = await parser.parseURL('https://www.sarkariresult.com/feed/');
    
    for (let i = 0; i < Math.min(5, feed.items.length); i++) {
      const item = feed.items[i];
      const title = item.title;
      const url = item.link;

      const slug = generateSlug(title);
      const filePath = path.join(jobsDir, `${slug}.json`);

      if (fs.existsSync(filePath)) {
        console.log(`Job already exists: ${slug}`);
        continue;
      }

      console.log(`Processing new job: ${title}`);
      
      // Fetch job page content safely
      const html = await fetch(url).then(r => r.text());
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyHtml = bodyMatch ? bodyMatch[1] : html;
      const jobText = bodyHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').substring(0, 4000);

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
        
        break;

      } catch (apiError) {
        console.error("NVIDIA API or Parsing Error:", apiError);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    process.exit(1);
  }
}

fetchLatestJob();
