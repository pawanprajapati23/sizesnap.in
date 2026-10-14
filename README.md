<div align="center">
  <img src="public/logo.png" width="90" height="90" alt="SizeSnap Logo" />
  <h1>SizeSnap ⚡</h1>
  <p><strong>A high-performance suite of 250+ privacy-first web utilities, document tools, and calculators.</strong></p>
  <p>100% Client-Side Processing • Zero Cloud Uploads • No Watermarks • Instant Downloads</p>
</div>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#tool-categories">Tool Categories</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 🚀 Overview

**SizeSnap** ([sizesnap.in](https://www.sizesnap.in)) is an ultra-fast, production-grade Next.js web application engineered to solve daily digital file tasks directly inside the client's browser.

From precise **KB-target image compressors** and **mobile camera document scanners with auto-perspective crop**, to **government exam application kits**, **PDF tools**, **academic calculators**, and **developer utilities** — SizeSnap processes everything locally using HTML5 Canvas, WebAssembly, and native Web APIs without uploading sensitive user files to remote servers.

---

## ✨ Key Features

- **📸 Mobile Camera Document Scanner (Auto-Crop & Flatten)**:
  - Computer vision edge detection (OpenCV.js) that identifies paper boundaries.
  - Perspective transform that automatically flattens tilted photos taken on beds or tables.
  - Multi-page document scanning with page reordering, re-scan, and clean PDF export.
- **🎯 Exact KB Image Compressor**:
  - Target-size compression algorithms (e.g., compress to exactly 20KB, 50KB, 100KB, 140KB, 200KB).
  - Binary search quantization preserving visual clarity while respecting strict government portal file size limits.
- **📄 Complete PDF Suite**:
  - Merge PDFs, Split PDF, Delete PDF Pages, Extract Pages, Add Page Numbers, and Convert Images to PDF locally.
- **🏛️ Govt Exam Application Kits**:
  - Pre-calibrated dimension and file size presets for SSC (CGL, CHSL, MTS, GD), UPSC, Police recruitments, State PSCs, and IBPS banking portals.
- **🔒 100% Client-Side Privacy**:
  - Photos, signatures, ID cards, and certificates never leave the user's device.
- **⚡ Core Web Vitals & Performance**:
  - Sub-second initial page load with aggressive script lazy-loading and static pre-rendering across 200+ routes.
- **📊 SEO & Rich Schemas**:
  - Full OpenGraph metadata, JSON-LD structured data (`WebApplication`, `FAQPage`, `HowTo`), canonical URL management, and automated XML sitemap generation.

---

## 🗂️ Tool Categories

| Category | Highlights |
| :--- | :--- |
| **Document & Scan** | Mobile Camera Scanner, Auto-Crop, Perspective Correction, Multi-Page Scan to PDF |
| **Image Tools** | Exact KB Compressor, Image Resizer (Pixel/cm/inch), Passport Photo Maker, Background Remover, Crop, Flip, Rotate |
| **PDF Tools** | Merge PDF, Split PDF, Compress PDF (12KB/50KB/140KB), Add Page Numbers, Image to PDF, PDF to Images |
| **Exam Presets** | SSC, UPSC, Delhi Police, UP Police, IBPS Bank, PAN Card, State Recruitment Kits |
| **Student Calculators** | Percentage Calculator, CGPA to Percentage, SGPA Converter, Attendance Planner, Study Timer |
| **Developer Tools** | JSON Formatter/Validator, Base64 Encoder/Decoder, URL Tools, CSV to JSON, Hash Generator, JWT Decoder |
| **Writing & SEO Tools** | Word/Character Counter, Case Converter, Slug Generator, Meta Tag Generator, Robots.txt Builder, Schema Generator |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router with Turbopack)](https://nextjs.org/)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Image & Document Processing**:
  - HTML5 Canvas API (Local image rendering & interpolation)
  - OpenCV.js (Computer vision, Canny edge detection, perspective warp)
  - jsPDF & PDF-Lib (Client-side PDF compilation and manipulation)
  - JSZip (In-memory file archiving)
- **Database / Metrics**: Firebase Realtime Database
- **Analytics & Tracking**: Google Analytics 4 (GA4 lazy-loaded)

---

## 💻 Getting Started

### Prerequisites

- **Node.js** v20.x or higher
- **npm** v10.x or higher (or `bun` / `pnpm`)

### 1. Clone the Repository

```bash
git clone https://github.com/pawanprajapati23/sizesnap.in.git
cd sizesnap.in
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Configure your local `.env` values:

```env
APP_URL="http://localhost:3000"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_ADSENSE_ID="ca-pub-XXXXXXXXXXXXXXXX"
NEXT_PUBLIC_GSC_VERIFICATION="your-verification-code"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Architecture

```
sizesnap/
├── app/                        # Next.js 16 App Router
│   ├── layout.tsx              # Root layout with Navbar & Footer
│   ├── page.tsx                # Homepage & primary search hub
│   ├── sitemap.ts              # Dynamic sitemap generator
│   ├── robots.ts               # Crawler instructions
│   ├── tools/                  # Dedicated tool pages
│   │   ├── document-scanner/   # Mobile camera scanner tool
│   │   ├── compress-pdf-140kb/ # Exact KB PDF compressor
│   │   ├── crop-image/         # High-precision canvas cropper
│   │   └── [slug]/             # Dynamic tool template
│   └── exams/                  # Government exam preset hubs
├── components/                 # Reusable UI components
│   ├── Navbar.tsx              # Global navigation with dropdowns
│   ├── Footer.tsx              # Site footer with legal links
│   ├── Sidebar.tsx             # Quick links & trending tools
│   └── tool-ui/                # Client-side interactive tool engines
│       ├── DocumentScannerTool.tsx
│       ├── CropImageTool.tsx
│       ├── KbCompressor.tsx
│       └── ...
├── data/                       # Structured configurations
│   ├── tools.ts                # Master tool registry & categories
│   ├── tool-redirects.ts       # Canonical URL redirection map
│   └── exam-presets.ts         # Exam dimension & size requirements
├── lib/                        # Core utilities & formatters
│   ├── format-utils.ts         # Byte formatting & math helpers
│   ├── site.ts                 # Site constants
│   └── firebase.ts             # Analytics logging
└── public/                     # Static assets (favicons, logos)
```

---

## 🧪 Quality & Verification

Run static type verification:

```bash
npx tsc --noEmit
```

Run linter:

```bash
npm run lint
```

Create an optimized production build:

```bash
npm run build
```

---

## 📦 Deployment

The application is pre-configured for automated deployment on **Vercel** or any Node.js hosting platform:

1. Connect your repository to Vercel.
2. Supply production environment variables in the project settings.
3. Deploy — Next.js will automatically generate optimized static pages for all registered tools.

---

## 📜 License & Privacy

SizeSnap is engineered with privacy as a foundational principle. All file processing occurs strictly in client memory. No biometric data, candidate photos, or signatures are ever retained or transmitted.
