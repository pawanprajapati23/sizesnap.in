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

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const jobsDir = path.join(process.cwd(), 'data/sarkari-jobs');
fs.mkdirSync(jobsDir, { recursive: true });

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MAX_GEMINI_ATTEMPTS = 5;

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

function isRetryableGeminiError(error) {
  const status = Number(error?.status || error?.code);
  const message = String(error?.message || error);

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes('UNAVAILABLE') ||
    message.includes('high demand') ||
    message.includes('overloaded') ||
    message.includes('temporarily')
  );
}

async function generateGeminiContent(prompt) {
  for (let attempt = 1; attempt <= MAX_GEMINI_ATTEMPTS; attempt++) {
    try {
      console.log(
        `Generating article with Gemini (${GEMINI_MODEL}), attempt ${attempt}/${MAX_GEMINI_ATTEMPTS}...`
      );

      return await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      });
    } catch (error) {
      const retryable = isRetryableGeminiError(error);

      if (!retryable || attempt === MAX_GEMINI_ATTEMPTS) {
        throw error;
      }

      const delayMs =
        Math.min(30_000, 2 ** (attempt - 1) * 5_000) +
        Math.floor(Math.random() * 1000);

      console.warn(
        `Gemini request failed temporarily. Retrying in ${delayMs} ms...`
      );
      await sleep(delayMs);
    }
  }

  throw new Error('Gemini request failed after all retry attempts');
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
      console.log('Generating SEO-optimized article with Gemini...');

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

      try {
        const response = await generateGeminiContent(prompt);
        const rawContent = response.text || '';

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
        console.error('Gemini API or parsing failed after retries:', apiError);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Error fetching RSS:', err);
    process.exit(1);
  }
}

fetchLatestJob();
