<div align="center">
  <img src="public/logo.png" width="100" height="100" alt="SizeSnap Logo" />
  <h1>SizeSnap 📸</h1>
  <p><strong>India's most trusted suite of 250+ free online utilities, calculators, and document tools.</strong></p>
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

**SizeSnap** is an ultra-fast, production-ready Next.js application that provides over 250+ utility tools across various categories (Calculators, Image/PDF Tools, Student/Exam Tools, SEO, Developer, and Writing Tools).

It emphasizes **100% Client-Side Privacy** by running heavy processing inside the browser using HTML5 Canvas and WebAssembly. No user files are ever uploaded to cloud servers.

## ✨ Features

- **250+ Unique Tools**: From GPA calculators to Base64 encoders and Image Compressors, all neatly organized into intuitive categories.
- **Blazing Fast Performance**: Aggressive Core Web Vitals optimizations including `content-visibility`, Lazy Loading for 3rd party scripts, and IntersectionObserver-based Ad rendering (95+ PageSpeed Score).
- **Zero Cloud Storage (100% Private)**: Government IDs, photos, and signatures are processed locally. No web server uploads.
- **Admin Dashboard**: Real-time admin panel featuring:
  - Tool usage and file download tracking (powered by Firebase).
  - **Adsterra Revenue Dashboard**: Fetches and displays daily impressions, clicks, CPM, and revenue using the Adsterra Publisher API.
- **SEO Optimized**: Fully integrated with canonical tags, dynamic `sitemap.xml`, Open Graph metadata, and JSON-LD structured FAQs.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Database**: Firebase Realtime Database
- **APIs**: Adsterra Publisher API
- **Animations**: `framer-motion`

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

# Google Analytics & AdSense
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_ADSENSE_ID="ca-pub-XXXXXXXXXXXXXXXX"

# Google Search Console Verification
NEXT_PUBLIC_GSC_VERIFICATION="your-verification-code-here"

# Adsterra Publisher API (Required for Admin Ads Dashboard)
ADSTERRA_API="your-adsterra-api-token"
```

## 📈 SEO & Tracking

- **Sitemap**: Automatically generated at `/sitemap.xml` with dynamic route prioritization.
- **Structured Data**: FAQ JSON-LD schemas injected in tool pages for rich SERP results.
- **Analytics**: GA4 script runs seamlessly via `next/script` (`lazyOnload`).

## 📦 Deployment (Production)

The app is built to be deployed on **Vercel** (Recommended).

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Add your Environment Variables in the Vercel dashboard.
4. Deploy!

## 📜 Legal & Disclaimer

SizeSnap is an independent client-side utility built for precision document sizing. All image rendering and compression takes place inside your browser memory. We do not transmit or store candidate photos, signatures, or biometric records on any web server. Always verify final file details against official recruitment notifications before submitting.
