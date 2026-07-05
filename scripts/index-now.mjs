const HOST = 'sizesnap.in';
const KEY = 'sizesnap2026indexnowkey';
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const INDEXNOW_API = 'https://api.indexnow.org/indexnow';

async function run() {
  console.log(`[IndexNow] Fetching sitemap from ${SITEMAP_URL}...`);
  try {
    const res = await fetch(SITEMAP_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap: ${res.statusText}`);
    }
    const xml = await res.text();
    
    // Simple regex to parse all <loc> values
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    const urlList = [];
    let match;
    while ((match = urlRegex.exec(xml)) !== null) {
      urlList.push(match[1]);
    }

    console.log(`[IndexNow] Found ${urlList.length} URLs in sitemap.`);

    if (urlList.length === 0) {
      console.log('[IndexNow] No URLs found. Exiting.');
      return;
    }

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urlList
    };

    console.log(`[IndexNow] Submitting ${urlList.length} URLs to IndexNow API...`);
    const submitRes = await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (submitRes.ok) {
      console.log('[IndexNow] Successfully submitted all URLs to IndexNow! Search engines will now crawl them instantly.');
    } else {
      const errorText = await submitRes.text();
      console.error(`[IndexNow] Submission failed with status ${submitRes.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('[IndexNow] Error occurred:', error.message);
  }
}

run();
