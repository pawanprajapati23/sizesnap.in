const sharp = require('sharp');
sharp('public/logo.png').resize(64, 64).toFile('public/logo_small.png').then(() => {
  console.log('resized logo');
});
sharp('public/favicon.png').resize(32, 32).toFile('public/favicon_small.png').then(() => {
  console.log('resized favicon');
});
