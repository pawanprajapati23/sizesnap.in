# SizeSnap 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat&logo=tailwind-css)](#)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-orange?style=flat)](#)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat&logo=github-actions)](#)

SizeSnap is a modern, privacy-first **Next.js web application** equipped with client-side WebAssembly (WASM) image/PDF compression tools and a fully autonomous **AI-driven Job Portal**. Built with a focus on performance, automation, and technical excellence, SizeSnap solves real-world problems for students and job seekers.

🔗 **Live Website:** [sizesnap.in](https://sizesnap.in)

---

## 🌟 Key Features & Architecture

### 1. 🤖 Fully Autonomous AI Auto-Blogger (CI/CD Pipeline)
An autonomous backend script integrated with **GitHub Actions** that curates daily job postings without any human intervention.
- **RSS Parsing:** Automatically fetches the latest government job (Sarkari Naukri) notifications from Google News RSS.
- **Generative AI (Google Gemini):** Utilizes `gemini-3.6-flash` via `@google/genai` to read news headlines and generate highly engaging, SEO-optimized articles formatted in JSON.
- **Resilient AI Pipeline:** Implements robust Error Handling, exponential backoff, and model fallback arrays to bypass API quotas (`429`) and server overloads (`503`).
- **Automated CI/CD:** A scheduled cron job (`06:00 AM IST`) automatically runs the AI script, pulls remote changes, rebases, and pushes the newly generated JSON articles directly into the `main` branch. 
- **Dynamic Routing & Sitemap:** Next.js dynamically reads the generated JSON files to render job pages instantly. The `sitemap.ts` file automatically detects new jobs and updates the XML sitemap for instantaneous Google Indexing.

### 2. ⚡ 100% Client-Side Processing (Zero-Server Architecture)
Unparalleled privacy and speed—no user files are ever uploaded or processed on a remote server.
- **Image Resizing & Compression:** Uses HTML5 Canvas APIs and Web Workers to resize images to exact pixel dimensions and strictly compress files to target kilobyte (KB) limits.
- **PDF Manipulation:** Integrates `pdf-lib` to compress PDFs and extract PDF pages to JPGs natively within the browser.
- **Utility Tools:** Specialized workflows for creating cropped passport photos, resizing signatures to strict exam portal specifications, and adding watermarks (Candidate Name / Date).

### 3. 🎯 SEO & Performance Optimization
- **Next.js App Router:** Built using the latest React Server Components for optimal TTFB (Time to First Byte) and zero client-side JavaScript overhead where possible.
- **Rich Snippets & JSON-LD:** Structured schema markup for high CTR in Google Search results.
- **Fully Responsive:** Styled with **Tailwind CSS v4** for a seamless mobile-first experience.

---

## 💻 Tech Stack

- **Frontend:** Next.js 15+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **AI Integration:** Google Gemini API (`@google/genai`)
- **CI/CD & Automation:** GitHub Actions, Node.js (`rss-parser`, `dotenv`)
- **Browser Processing:** HTML5 Canvas API, `pdf-lib`
- **Deployment:** Vercel

---

## 🚀 Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pawanprajapati23/sizesnap.in.git
   cd sizesnap.in
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

5. **Test the AI Auto-Blogger locally:**
   ```bash
   node scripts/fetch-jobs.mjs
   ```

---

## 👨‍💻 Note for Recruiters
This repository demonstrates full-stack proficiency, encompassing:
1. **Frontend Development:** Modern Next.js patterns, responsive UI/UX, and complex client-side state management for image processing.
2. **Backend/DevOps Automation:** Writing autonomous Node.js scripts, managing CI/CD pipelines via GitHub Actions, and handling Git rebasing programmatically.
3. **AI Engineering:** Integrating LLMs (Large Language Models) effectively, crafting structured prompts for consistent JSON output, and building resilient error-handling logic for API rate limits.
4. **SEO & Architecture:** Building products designed to rank organically and scale without backend server costs.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
