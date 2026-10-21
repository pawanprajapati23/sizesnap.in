# SizeSnap Master SEO & Traffic Scaling Roadmap

> **Execution Rule:** All development and optimizations are executed, tested, and committed **locally**. No `git push origin main` will occur until all phases are complete and the user explicitly gives the green light (*"ab kardo"*).

---

## 🎯 Strategic Objective
Replicate and outperform the organic traffic funnels of **11zon** (exact KB PDF pages) and **imresizer.com** (Indian exam & ID document specifications) with SizeSnap's unfair advantages:
- **0.3s Desktop & 97+ Mobile Speed**
- **100% Client-Side Private (Zero server uploads for sensitive Aadhaar/certificates)**
- **Zero Watermark & Clean Modern UI**

---

## 📋 Phase-by-Phase Roadmap

### Phase 1: High-Volume Exact KB PDF Tools (11zon Model)
*Targeting the #1 search queries for Indian document submissions where 11zon currently takes millions of hits.*

- [x] **1.1 Tool: `compress-pdf-to-200kb` (`/tools/compress-pdf-200kb`)**
  - **Why:** 200KB is the official ceiling for SSC marksheet uploads, GATE, State PSCs, and Banking exams.
  - **Component:** Uses `<CompressPdfTool initialTargetKB={200} />`.
  - **SEO:** Title starting with exact keyword, HowTo Schema, FAQPage Schema, WebApplication Schema.
  - **Routing & Aliases:** Map `/compress-pdf/to-200kb`, `/compress-pdf-to-200kb`, and `/compress-pdf/200kb` to this route.

- [x] **1.2 Tool: `compress-pdf-to-100kb` (`/tools/compress-pdf-100kb`)**
  - **Why:** Required for National Scholarship Portal (NSP), college admission forms, and court submissions.
  - **Component:** Uses `<CompressPdfTool initialTargetKB={100} />`.
  - **SEO:** Exact-match title, rich structured snippets, step-by-step guidance.
  - **Routing & Aliases:** Map `/compress-pdf/to-100kb`, `/compress-pdf-to-100kb`, and `/compress-pdf/100kb`.

- [x] **1.3 Tool: `compress-pdf-to-500kb` (`/tools/compress-pdf-500kb`)**
  - **Why:** Standard for multi-page marksheets, academic transcripts, and EPFO / passport police verification documents.
  - **Component:** Uses `<CompressPdfTool initialTargetKB={500} />`.
  - **SEO:** Exact-match title, HowTo schema, multi-page compression guidance.
  - **Routing & Aliases:** Map `/compress-pdf/to-500kb`, `/compress-pdf-to-500kb`.

- [x] **1.4 Tool: `compress-pdf-to-50kb` (`/tools/compress-pdf-50kb`)**
  - **Why:** Strict state police and municipal recruitment portals that limit documents to under 50KB.
  - **Component:** Uses `<CompressPdfTool initialTargetKB={50} />`.

- [x] **1.5 Cross-Linking & Navigation Registry:**
  - Register all 4 tools in `data/tools.ts` under `ALL_TOOLS` and `NAV_MENUS`.
  - Add to `KNOWN_EXTRA_TOOLS` in `lib/seo-redirects.ts`.
  - Add quick-navigation badges to `components/ToolDirectory.tsx` on homepage.

---

### Phase 2: High-Volume Govt ID & Exam Funnels (imresizer Model)
*Targeting the highest-demand Indian government identity and exam specifications.*

- [x] **2.1 Tool: `pan-card-photo-resizer` (`/tools/pan-card-photo-resizer`)**
  - **Why:** NSDL and UTIITSL PAN card applications strictly reject photos that do not match exact criteria:
    - **Photo:** 213 × 213 pixels (3.5 × 2.5 cm), 300 DPI, under 50 KB / 30 KB.
    - **Signature:** 213 × 400 pixels (2 × 4.5 cm), 300 DPI, under 30 KB.
  - **Component:** Dedicated dual-preset tool (Photo tab & Signature tab) with 1-click download.
  - **Routing & Aliases:** Map `resize-image-to-pan-card-size`, `pan-card-size`, and `pan-card` to this tool.

- [x] **2.2 Tool: `ssc-photo-and-signature-resizer` (`/tools/ssc-photo-and-signature-resizer`)**
  - **Why:** SSC (CGL, CHSL, GD, MTS) is India's largest examination body (30+ million applicants annually).
  - **Specs:** Photo 20KB–50KB (3.5×4.5 cm), Signature 10KB–20KB (4.0×2.0 cm), with optional Name & Date on Photo (DOP).
  - **Component:** Dedicated high-intent redirect to unified `/exams/ssc-photo-signature-resizer` authority engine.

- [x] **2.3 Tool: `resize-image-to-passport-size-3.5x4.5cm` (`/tools/passport-size-photo-3.5x4.5cm`)**
  - **Why:** Official Indian passport, visa, and ID photo standard.
  - **Features:** 3.5 × 4.5 cm crop, white background enhancer, 300 DPI.

---

### Phase 3: High-Intent GSC & Long-Tail Optimization
*Capitalizing on queries already ranking in Google Search Console.*

- [x] **3.1 Tool: `60kb-photo-size` (`/tools/60kb-photo-size`)**
  - Addresses `jpg60kb` query ranking at Position 9.7 in GSC.
- [x] **3.2 Tool: `200-dpi-converter` (`/tools/200-dpi-converter`)**
  - Addresses `dpi200` query ranking at Position 8.1 in GSC (UPSC and SSC mandatory scan DPI).
- [x] **3.3 Update `reduce-image-size-in-kb` Meta:**
  - Inject keywords: `photo compressor in kb`, `size reducer in kb`, `photo resizer in kb`.

---

### Phase 4: Rigorous Quality Verification (Local)
- [x] **4.1 Code Linting:** Run `npm run lint` -> 0 errors and 0 warnings.
- [x] **4.2 Static Site Generation Build:** Run `npm run build` -> all 265 routes compile cleanly into static HTML.
- [x] **4.3 Redirect Loop Simulation:** Automated check of all historical URLs -> 100% passed (0 loops).
- [x] **4.4 Schema Validation:** Verified JSON-LD schemas (`WebApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`).

---

### Phase 5: Final Production Deployment
- [ ] Present completion summary to the user.
- [ ] Wait for explicit user confirmation (*"ab kardo"*).
- [ ] Run `git push origin main` -> automatic Vercel production deploy.
- [ ] Verify live deployment on `https://www.sizesnap.in`.

---

## 📊 Current Progress Tracker
| Phase | Task | Status |
| :--- | :--- | :--- |
| **Foundation** | Redirect Loop Fix (`reduce-image-size-in-kb`) | ✅ Completed & Deployed |
| **Foundation** | Monetag Vignette Post-Download Trigger | ✅ Completed & Deployed |
| **Foundation** | Monetag In-Page Push Interaction Deferral (97 Speed) | ✅ Completed & Deployed |
| **Foundation** | Naya 110KB Photo Tool | ✅ Completed & Deployed |
| **Foundation** | Naya Remove Shadow from Document Tool | ✅ Completed & Deployed |
| **Phase 1** | Compress PDF to 200KB Tool | ✅ Completed & Verified |
| **Phase 1** | Compress PDF to 100KB Tool | ✅ Completed & Verified |
| **Phase 1** | Compress PDF to 500KB Tool | ✅ Completed & Verified |
| **Phase 1** | Compress PDF to 50KB Tool | ✅ Completed & Verified |
| **Phase 2** | PAN Card Photo & Signature Resizer | ✅ Completed & Verified |
| **Phase 2** | SSC Photo & Signature Resizer | ✅ Completed & Verified |
| **Phase 2** | 3.5x4.5cm Passport Photo Tool | ✅ Completed & Verified |
| **Phase 3** | GSC Long-Tail Tools (60KB, 200 DPI) | ✅ Completed & Verified |
| **Phase 4** | Full Build & Schema Verification (265/265 static pages) | ✅ Passed (0 errors) |
| **Phase 5** | Final Git Push to Main | 🔒 Locked until user says "ab kardo" |
