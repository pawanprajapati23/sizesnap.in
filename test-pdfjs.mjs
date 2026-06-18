import('pdfjs-dist/build/pdf.mjs').then(mod => {
  console.log("Keys:", Object.keys(mod));
  console.log("getDocument type:", typeof mod.getDocument);
  console.log("version:", mod.version);
}).catch(console.error);
