(async () => {
  const lighthouse = (await import('lighthouse')).default;
  const chromeLauncher = require('chrome-launcher');
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const config = (await import('lighthouse/core/config/lr-mobile-config.js')).default;
  const options = {logLevel: 'error', output: 'json', onlyCategories: ['performance'], port: chrome.port};
  const runnerResult = await lighthouse('http://localhost:3000', options, config);

  console.log(Object.keys(runnerResult.lhr.audits).filter(k => k.includes('paint')));

  await chrome.kill();
})();
