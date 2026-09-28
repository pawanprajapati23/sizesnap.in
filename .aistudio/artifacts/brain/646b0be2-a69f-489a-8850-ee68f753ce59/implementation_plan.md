# Implementation Plan: 1-Click Multi-Document Exam Kit

## 1. Overview
Currently, candidates applying for government exams (SSC, UPSC, IBPS, UP Police, Delhi Police) have to resize their Photo, Signature, and Thumb Impression/Declaration on separate pages or through separate upload steps.

This feature introduces a **Unified Multi-Document Exam Application Kit** where a candidate:
1. Selects their Target Exam (e.g. **SSC CGL/CHSL**, **UPSC OTR**, **IBPS PO/Clerk**, **UP Police Constable**).
2. Drops their documents simultaneously into designated slots (**Photo**, **Signature**, and **Thumb/Declaration** if applicable).
3. The engine automatically processes each document with official pixel dimensions, aspect ratio, background checks, and strict file size (KB) limits.
4. Candidate gets side-by-side live compliance verification cards with individual 1-click downloads (`Download Photo [35 KB]`, `Download Signature [15 KB]`, etc.).

---

## 2. Key Features & Specifications

### A. Supported Exam Kits
- **SSC Exam Kit**:
  - **Photo**: 3.5 × 4.5 cm (350 × 450 px), 20 KB – 50 KB, clean plain background.
  - **Signature**: 4.0 × 2.0 cm (280 × 120 px), 10 KB – 20 KB, running-hand format.
- **UPSC OTR Kit**:
  - **Photo**: 550 × 550 px square (20 KB – 300 KB) with optional auto-generated Candidate Name & Date of Photo (DOP) stamp.
  - **Signature**: 350 × 175 px (20 KB – 300 KB).
- **IBPS Banking Kit (All-in-One)**:
  - **Photo**: 200 × 230 px (20 KB – 50 KB).
  - **Signature**: 140 × 60 px (10 KB – 20 KB).
  - **Left Thumb Impression**: 240 × 240 px (20 KB – 50 KB).
  - **Handwritten Declaration**: 800 × 400 px (50 KB – 100 KB).
- **UP Police & State Exams Kit**:
  - **Photo**: 35 × 45 mm (20 KB – 50 KB).
  - **Signature**: 280 × 120 px (5 KB – 20 KB) with black ink contrast filter.

### B. User Flow & Experience
1. **Top Selector Bar**: Switch tabs between exams with instant preview of official criteria.
2. **Multi-Dropzone Grid**: Clean cards showing required dimensions and file size targets with drag-and-drop or file pickers.
3. **Instant Parallel Processing**: High-speed client-side canvas binary-search compression for all uploaded documents in parallel.
4. **Compliance Status Badges**: Live checkmarks (e.g. `✓ 34.2 KB (Target: 20-50 KB)` and `✓ 350 × 450 px`).
5. **Direct Individual Downloads**: Clean buttons to download each processed document with official naming (e.g., `ssc_photo_sizesnap.jpg`, `ssc_signature_sizesnap.jpg`).
6. **Quick Adjust / Crop Modal**: If a candidate needs to adjust face centering or crop out extra white margins from their signature before final download.

---

## 3. Architecture & File Structure

1. **Component**: `components/tool-ui/MultiDocExamKit.tsx`
   - Client component managing multiple file states, parallel canvas processing, name/date stamping, and live downloads.
2. **Page Route**: `app/exams/exam-application-kit/page.tsx`
   - Dedicated landing page with complete SEO metadata, instructions, and FAQ section.
3. **Integration Points**:
   - Add highlight banner and entry card on the main `/exams` hub page.
   - Add hero CTA button on `/` (Homepage) for candidates seeking the all-in-one exam kit.
   - Update navigation and `sitemap.ts`.

---

## 4. Verification & Testing Steps
- Verify simultaneous upload of Photo (e.g. 5 MB raw camera file) and Signature (e.g. 3 MB paper photo).
- Verify exact resulting byte sizes and pixel dimensions against official portal specifications.
- Verify individual downloads work seamlessly on mobile and desktop browsers without pop-up blockers.
- Run `npm run lint` and `npm run build` to ensure zero compilation or type errors.
