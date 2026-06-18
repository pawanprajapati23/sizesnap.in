# SizeSnap.in

SizeSnap is a lightning-fast, entirely client-side web application designed to help users quickly process, compress, and resize their images and PDFs directly within their browser. The primary focus of this application is unparalleled privacy and speed—no files are ever uploaded or processed on a remote server.

## Features

- **Blazing Fast & Serverless:** 100% of processing happens locally in the user's browser via Canvas APIs, WebAssembly, and `pdf-lib`.
- **Absolute Privacy:** User files never leave their device. Nothing is uploaded, stored, or indexed on external servers.
- **Image Resizing & Compression:** Resize images to exact pixel dimensions, exact kilobytes (KB) limits, and handle bulk compressions perfectly.
- **PDF Manipulation:** Compress PDFs to custom KB sizes or convert PDF pages to separate JPGs in an instant.
- **Utility Tools for Students:** Specialized workflows to quickly create cropped and padded passport photos, and resize scanned signatures to strict exam/university portal spec.
- **No-Crop DP Maker & Document Scanner:** Instantly format vertical/horizontal shots into perfect squares for WhatsApp, and add a black & white filter to scanned documents to improve contrast.
- **Watermark Photos:** Automatically add Candidate Names and Dates of Photo at the bottom of pictures, as requested by multiple government portals.
- **SEO & Ad-Ready:** Built-in slots for Google AdSense with strict layout-shift prevention, Cookie Consent Banners for GDPR/global compliance, and structured JSON-LD schemas for high CTR rich snippets in Google Search.

## Tech Stack

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Processing:** `pdf-lib` (running in browser)
- **Image Processing:** HTML5 Canvas API
- **Language:** TypeScript 

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sizesnap.git
   cd sizesnap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## Production Build

To build the application for optimal performance and static generation:

```bash
npm run build
npm start
``` 

## Built With Intent

This project is built to answer the repetitive, painful problem millions face when applying for jobs and university slots: strict file size uploads. By keeping everything client-side, SizeSnap drastically reduces infrastructure overhead (serverless) while providing users a completely private and highly performant experience.

## Contributing

Pull requests are always welcome! If you spot an optimization for image quality or PDF compression ratios in WASM, feel free to submit a PR or open an issue.

## License

This project is open-source and available under the [MIT License](LICENSE).
