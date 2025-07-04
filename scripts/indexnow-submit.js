// IndexNow Bulk Submission Script
// Instantly notifies Bing, Yandex, and other search engines

const axios = require('axios');
const crypto = require('crypto');

async function submitToIndexNow() {
  // Generate a unique key (you should save this and reuse it)
  const indexNowKey = crypto.randomBytes(16).toString('hex');
  
  // First, create the key file on your server
  // You need to host this at: https://www.paintquoteapp.com/[indexNowKey].txt
  console.log(`Create a file at: https://www.paintquoteapp.com/${indexNowKey}.txt`);
  console.log(`File content should be: ${indexNowKey}`);
  
  const urls = [
    'https://www.paintquoteapp.com',
    'https://www.paintquoteapp.com/trial-signup',
    'https://www.paintquoteapp.com/pricing',
    'https://www.paintquoteapp.com/features',
    'https://www.paintquoteapp.com/painting-contractors',
    'https://www.paintquoteapp.com/painting-estimate-software',
    // Add all your URLs here
  ];

  const payload = {
    host: 'www.paintquoteapp.com',
    key: indexNowKey,
    keyLocation: `https://www.paintquoteapp.com/${indexNowKey}.txt`,
    urlList: urls
  };

  try {
    // Submit to Bing
    const bingResponse = await axios.post(
      'https://www.bing.com/indexnow',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Bing submission successful:', bingResponse.status);

    // Submit to Yandex
    const yandexResponse = await axios.post(
      'https://yandex.com/indexnow',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Yandex submission successful:', yandexResponse.status);

  } catch (error) {
    console.error('IndexNow submission error:', error.message);
  }
}

// Run this after creating the key file on your server
submitToIndexNow();