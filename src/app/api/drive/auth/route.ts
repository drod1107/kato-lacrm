// src/app/api/drive/auth/route.ts
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL || 
        !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('Service account credentials not configured');
    }

    // Create a new JWT client using service account credentials
    const client = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    // Get the access token
    await client.authorize();
    const token = await client.getAccessToken();

    if (!token.token) {
      throw new Error('Failed to get access token');
    }

    return NextResponse.json({
      access_token: token.token,
      expires_in: 3600  // Google tokens typically expire in 1 hour
    });
  } catch (error) {
    console.error('Error getting Google auth token:', error);
    return NextResponse.json(
      { error: 'Failed to get authentication token' },
      { status: 500 }
    );
  }
}