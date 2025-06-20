import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyName, accessCode, email, phone } = req.body;

    // For now, just return success to test if the API works
    return res.status(200).json({
      success: true,
      message: 'API route is working!',
      data: { companyName, accessCode, email }
    });
  } catch (error) {
    console.error('Trial signup error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}