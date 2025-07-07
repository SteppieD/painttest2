// Google Indexing API Script for Bulk URL Submission
// This uses the Google Indexing API to submit URLs for immediate crawling

const { google } = require('googleapis');
const key = require('./service-account-key.json'); // You'll need to create this

async function indexUrls() {
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
  );

  const urls = [
    // High priority pages
    'https://www.paintquoteapp.com',
    'https://www.paintquoteapp.com/trial-signup',
    'https://www.paintquoteapp.com/pricing',
    'https://www.paintquoteapp.com/features',
    'https://www.paintquoteapp.com/painting-contractors',
    'https://www.paintquoteapp.com/painting-estimate-software',
    
    // Calculator pages (high commercial intent)
    'https://www.paintquoteapp.com/interior-painting-quote-calculator',
    'https://www.paintquoteapp.com/exterior-painting-estimate-calculator',
    'https://www.paintquoteapp.com/house-painting-cost-calculator',
    'https://www.paintquoteapp.com/painting-estimate-calculator',
    'https://www.paintquoteapp.com/painting-estimate-calculator-free',
    
    // Template pages (lead magnets)
    'https://www.paintquoteapp.com/paint-estimate-templates',
    'https://www.paintquoteapp.com/painting-quote-templates',
    'https://www.paintquoteapp.com/painting-quote-templates-free',
    
    // How-to guides
    'https://www.paintquoteapp.com/how-to-quote-painting-jobs',
    'https://www.paintquoteapp.com/how-to-quote-painting-jobs-professionally',
    
    // Software pages
    'https://www.paintquoteapp.com/paint-contractor-app',
    'https://www.paintquoteapp.com/painting-estimating-software',
    'https://www.paintquoteapp.com/painting-business-software',
    'https://www.paintquoteapp.com/commercial-painting-estimating-software',
    
    // Case studies
    'https://www.paintquoteapp.com/painting-contractor-software-case-study',
    'https://www.paintquoteapp.com/painting-contractor-increased-revenue-software',
    'https://www.paintquoteapp.com/painting-estimate-software-success-story',
    'https://www.paintquoteapp.com/small-painting-business-growth-software',
    
    // Location pages (start with major cities)
    'https://www.paintquoteapp.com/locations',
    'https://www.paintquoteapp.com/locations/los-angeles-ca',
    'https://www.paintquoteapp.com/locations/new-york-ny',
    'https://www.paintquoteapp.com/locations/chicago-il',
    'https://www.paintquoteapp.com/locations/houston-tx',
  ];

  const batch = [];
  
  for (const url of urls) {
    batch.push({
      url: url,
      type: 'URL_UPDATED'
    });
  }

  await jwtClient.authorize();
  
  // Submit in batches of 100 (API limit)
  const batchSize = 100;
  for (let i = 0; i < batch.length; i += batchSize) {
    const currentBatch = batch.slice(i, i + batchSize);
    
    const options = {
      url: 'https://indexing.googleapis.com/batch',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/mixed'
      },
      auth: jwtClient,
      multipart: currentBatch.map((item, index) => ({
        'Content-Type': 'application/http',
        'Content-ID': index + 1,
        body: 'POST /v3/urlNotifications:publish HTTP/1.1\n' +
              'Content-Type: application/json\n\n' +
              JSON.stringify(item)
      }))
    };

    try {
      const response = await jwtClient.request(options);
      console.log(`Batch ${i/batchSize + 1} submitted successfully`);
    } catch (error) {
      console.error(`Error submitting batch ${i/batchSize + 1}:`, error);
    }
  }
}

// To use this script:
// 1. Enable the Indexing API in Google Cloud Console
// 2. Create a service account and download the JSON key
// 3. Add the service account as an owner in Search Console
// 4. Run: node google-indexing-api.js

indexUrls();