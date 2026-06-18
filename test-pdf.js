const puppeteer = require('puppeteer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

(async () => {
  // Create a dummy PDF
  const doc = await PDFDocument.create();
  const page = doc.addPage([500, 500]);
  page.drawText('Hello World', { x: 50, y: 400 });
  const pdfBytes = await doc.save();
  fs.writeFileSync('dummy.pdf', pdfBytes);

  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const p = await browser.newPage();
  
  p.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  p.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));

  console.log('Navigating to local server...');
  await p.goto('http://localhost:3000/compress-pdf/to-100kb', { waitUntil: 'networkidle2' });

  console.log('Uploading PDF...');
  const input = await p.$('input[type="file"]');
  await input.uploadFile('dummy.pdf');

  console.log('Waiting for result...');
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
  console.log('Done.');
  process.exit(0);
})();
