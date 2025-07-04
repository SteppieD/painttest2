import { NextResponse } from 'next/server';

// IndexNow API endpoint for automatic submission
export async function POST(request: Request) {
  const { urls } = await request.json();
  
  const indexNowKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
  
  const payload = {
    host: 'www.paintquoteapp.com',
    key: indexNowKey,
    keyLocation: 'https://www.paintquoteapp.com/indexnow-key.txt',
    urlList: urls || ['https://www.paintquoteapp.com']
  };

  try {
    // Submit to Bing
    const bingResponse = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Submit to Yandex  
    const yandexResponse = await fetch('https://yandex.com/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: true,
      bing: bingResponse.status,
      yandex: yandexResponse.status
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}