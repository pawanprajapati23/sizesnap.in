import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Avoid Google News 503s by setting a browser User-Agent
const parser = new Parser({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  }
});

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: 60000 } // 60 seconds timeout to prevent HeadersTimeoutError hanging
});

const jobsDir = path.join(process.cwd(), 'data/sarkari-jobs');
fs.mkdirSync(jobsDir, { recursive: true });

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 50);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLatestJob() {
  console.log('Fetching latest Sarkari Naukri from Google News RSS...');

  try {
    const feed = await parser.parseURL(
      'https://news.google.com/rss/search?q=sarkari+job+notification&hl=en-IN&gl=IN&ceid=IN:en'
    );

    if (!feed.items || feed.items.length === 0) {
      console.log('No RSS items found.');
      return;
    }

    for (let i = 0; i < Math.min(3, feed.items.length); i++) {
      const item = feed.items[i];
      const title = (item.title || '').split(' - ')[0].trim();
      const slug = generateSlug(title);

      if (!title) continue;

      const filePath = path.join(jobsDir, `${slug}.json`);

      if (fs.existsSync(filePath)) {
        console.log(`Job already exists: ${slug}`);
        continue;
      }

      console.log(`Found new job: ${title}`);
      
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
        "content": "Full detailed article in HTML format. Use <h2> tags for headings (like Important Dates, Eligibility, Age Limit, Application Fee). Include bullet points. At the end, add an H2 heading titled 'How to Apply' and another H2 heading titled 'Important Links'.",
        "photoSize": "20KB to 50KB",
        "signatureSize": "10KB to 20KB",
        "applyLink": "Official website link (guess it based on the job, e.g. ssc.gov.in, upsc.gov.in) or leave empty string"
      }
      `;

      let jsonStr = "";
      let attempts = 0;
      const maxAttempts = 3;
      
      // List of fallback models to try if 3.6-flash is overloaded or unavailable (avoids 503 and 404 errors)
      const modelsToTry = ['gemini-3.6-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];
      
      while (attempts < maxAttempts) {
        const currentModel = modelsToTry[attempts % modelsToTry.length];
        try {
          console.log(`Attempting to generate with model: ${currentModel}...`);
          const response = await ai.models.generateContent({
              model: currentModel,
              contents: prompt,
              config: {
                  temperature: 0.7,
                  responseMimeType: "application/json"
              }
          });

          const rawContent = response.text || '';
          
          jsonStr = rawContent.trim();
          if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
          if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
          if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
          jsonStr = jsonStr.trim();
          
          break; // Success, exit loop
        } catch (apiError) {
          attempts++;
          console.error(`Gemini API Error with ${currentModel} (Attempt ${attempts}/${maxAttempts}):`, apiError.message);
          if (attempts >= maxAttempts) {
            console.error("Max retries reached on all fallback models. Exiting.");
            process.exit(1);
          }
          console.log("Waiting 5 seconds before trying the next fallback model...");
          await sleep(5000);
        }
      }

      try {
        const jobData = JSON.parse(jsonStr);
        fs.writeFileSync(filePath, JSON.stringify(jobData, null, 2));
        console.log(`Successfully generated and saved: ${filePath}`);
        break; // Only do one job at a time
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Error fetching RSS:', err);
    process.exit(1);
  }
}

fetchLatestJob();
