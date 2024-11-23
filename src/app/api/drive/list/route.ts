import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request: { url: string | URL; }) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL || 
        !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('Service account credentials not configured');
    }

    // Create a new JWT client using service account credentials
    const client = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\\\n/g, '\\n'),
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    // Authorize the client
    await client.authorize();
    const drive = google.drive({ version: 'v3', auth: client });

    // Check for folderId query parameter
    const folderId = new URL(request.url).searchParams.get('folderId');

    if (!folderId) {
      // Default behavior: Fetch metadata for specific root folders
      const folderIds = [
        '1-Ay62eXi81FmcVB_h7X3_DD6lm0-OsIh', // Downloads
        '1-R6VCP2aYzJUIFpRniEP3BIP0oRsYDYy', // Desktop
        '1-2gTg3PtEwcjkwmxC2It70Y3elOnV8-M'  // Documents
      ];

      const folderPromises = folderIds.map((id) =>
        drive.files.get({
          fileId: id,
          fields: 'id, name, mimeType'
        })
      );

      const folderResponses = await Promise.all(folderPromises);
      const folders = folderResponses.map((response) => response.data);

      return NextResponse.json(folders);
    } else {
      // Fetch contents of the specified folder
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)'
      });

      return NextResponse.json(res.data.files);
    }
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}