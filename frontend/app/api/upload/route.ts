import { NextRequest, NextResponse } from 'next/server';

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretKey = process.env.PINATA_SECRET_KEY;

function getIPFSUrl(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`;
}

function getPinataUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Upload API] Starting upload request');
    console.log('[Upload API] Pinata API Key exists:', !!pinataApiKey);
    console.log('[Upload API] Pinata Secret Key exists:', !!pinataSecretKey);

    // Validate credentials
    if (!pinataApiKey || !pinataSecretKey) {
      console.error('[Upload API] Missing Pinata credentials');
      return NextResponse.json(
        { success: false, error: 'IPFS credentials not configured. Please add PINATA_API_KEY and PINATA_SECRET_KEY to .env' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadata = formData.get('metadata') as string | null;

    console.log('[Upload API] File present:', !!file);
    console.log('[Upload API] Metadata present:', !!metadata);

    if (file) {
      console.log('[Upload API] Processing file upload');
      console.log('[Upload API] File name:', file.name);
      console.log('[Upload API] File size:', file.size);
      console.log('[Upload API] File type:', file.type);

      // Upload file to Pinata
      const pinataFormData = new FormData();
      pinataFormData.append('file', file);

      const pinataMetadata = JSON.stringify({
        name: file.name,
      });
      pinataFormData.append('pinataMetadata', pinataMetadata);

      console.log('[Upload API] Uploading to Pinata...');
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey,
        },
        body: pinataFormData,
      });

      console.log('[Upload API] Pinata response status:', response.status);
      const result = await response.json();
      console.log('[Upload API] Pinata response:', result);

      if (!response.ok) {
        throw new Error(result.error?.details || result.error || 'Failed to upload to Pinata');
      }

      const cid = result.IpfsHash;
      console.log('[Upload API] Upload successful, CID:', cid);

      return NextResponse.json({
        success: true,
        cid,
        url: getIPFSUrl(cid),
        pinataUrl: getPinataUrl(cid),
      });
    }

    if (metadata) {
      console.log('[Upload API] Processing metadata upload');
      console.log('[Upload API] Metadata length:', metadata.length);

      // Upload JSON metadata to Pinata
      const blob = new Blob([metadata], { type: 'application/json' });
      const metadataFile = new File([blob], 'metadata.json', { type: 'application/json' });

      const pinataFormData = new FormData();
      pinataFormData.append('file', metadataFile);

      const pinataMetadata = JSON.stringify({
        name: 'NFT Metadata',
      });
      pinataFormData.append('pinataMetadata', pinataMetadata);

      console.log('[Upload API] Uploading metadata to Pinata...');
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey,
        },
        body: pinataFormData,
      });

      console.log('[Upload API] Pinata response status:', response.status);
      const result = await response.json();
      console.log('[Upload API] Pinata response:', result);

      if (!response.ok) {
        throw new Error(result.error?.details || result.error || 'Failed to upload metadata to Pinata');
      }

      const cid = result.IpfsHash;
      console.log('[Upload API] Metadata upload successful, CID:', cid);

      return NextResponse.json({
        success: true,
        cid,
        url: getIPFSUrl(cid),
        pinataUrl: getPinataUrl(cid),
      });
    }

    console.log('[Upload API] No file or metadata provided');
    return NextResponse.json(
      { success: false, error: 'No file or metadata provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Upload API] Error occurred:', error);
    if (error instanceof Error) {
      console.error('[Upload API] Error message:', error.message);
      console.error('[Upload API] Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload to IPFS',
      },
      { status: 500 }
    );
  }
}
