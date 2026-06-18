const { PDFDocument } = require('pdf-lib');
(async () => {
  const doc = await PDFDocument.create();
  try {
    const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    await doc.embedJpg(dataUrl);
    console.log("Success with data URL!");
  } catch (e) {
    console.error("Failed with data URL:", e.message);
  }
})();
