<div align="center">
  <img src="public/logo.png" width="100" height="100" alt="SizeSnap Logo" />
  <h1>SizeSnap 📸</h1>
  <p><strong>India's fastest precision image resizer, compressor, and document scanner tool.</strong></p>
</div>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 🚀 Overview

**SizeSnap** is a production-ready Next.js application designed to help users compress, resize, and optimize images and PDF documents for strict portal uploads (like SSC, UPSC, and State PSCs). 

It emphasizes **100% Client-Side Privacy** by running heavy processing inside the browser using HTML5 Canvas and WebAssembly. No user files are ever uploaded to cloud servers.

## ✨ Features

- **Blazing Fast Local Processing**: Powered by local browser memory—resizes and compresses images in under 100ms.
- **Zero Cloud Storage (100% Private)**: Government IDs, photos, and signatures are processed locally. No web server uploads.
- **Strict Size Targeting**: Compress images to exact sizes (e.g., *12 KB, 20 KB, 50 KB, 100 KB*).
- **PDF Manipulation**: Structural and visual PDF compression with multiple presets.
- **Admin Dashboard**: Real-time Firebase-powered dashboard to track tool usage and file downloads across different time ranges (24h/7d/30d/3m).
- **SEO Optimized**: Fully integrated with canonical tags, dynamic `sitemap.xml`, Open Graph metadata, and JSON-LD structured FAQs.
- **Production Analytics**: Pre-configured for Google Analytics (GA4) and Google Search Console (GSC).

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Database & Analytics**: Firebase Realtime Database (for Admin usage tracking)
- **PDF Manipulation**: `pdf-lib` and `pdfjs-dist`
- **Animations**: `framer-motion`
- **Linting & Formatting**: ESLint

## 💻 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed.

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/pawanprajapati23/sizesnap.in.git
cd sizesnap.in

# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file based on the provided template:

```bash
cp .env.example .env
```
Update your `.env` file with your specific tracking and domain details (see *Environment Variables* section below).

### 3. Run Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the Admin Dashboard.

## 🔐 Environment Variables

The application expects the following variables in production. You do not need tracking variables for local development.

```env
# URL Configuration
APP_URL="https://sizesnap.in"

# Google Analytics (Optional but recommended)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Google Search Console (If using HTML tag verification instead of DNS)
NEXT_PUBLIC_GSC_VERIFICATION="your-verification-code-here"
```
*(Note: Firebase initialization keys are configured directly in `lib/firebase.ts`.)*

## 📈 SEO & Tracking

- **Sitemap**: Automatically generated at `/sitemap.xml` with dynamic route prioritization (high traffic tools prioritized).
- **Robots.txt**: Dynamically served at `/robots.txt`.
- **Structured Data**: FAQ JSON-LD schemas injected in tool pages for rich SERP results.
- **Analytics**: GA4 script runs seamlessly via `next/script` in `layout.tsx`.

## 📦 Deployment (Production)

The app is built to be deployed on **Vercel**, **Google Cloud Run**, or any Node.js hosting platform.

**Vercel Deployment (Recommended):**
1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Add your Environment Variables in the Vercel dashboard.
4. Deploy!

```bash
# Manual Build Command
npm run build && npm start
```

## 📜 Legal & Disclaimer

SizeSnap is an independent client-side utility built for precision document sizing. All image rendering and compression takes place inside your browser memory. We do not transmit or store candidate photos, signatures, or biometric records on any web server. Always verify final file details against official recruitment notifications before submitting.
