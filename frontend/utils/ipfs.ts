export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Mock IPFS upload for development
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    console.log('Mock IPFS upload for file:', file.name, file.type, file.size);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock CID
    const mockCid = `mock_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Generated mock image CID:', mockCid);
    
    return `ipfs://${mockCid}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file');
  }
};

// Mock metadata upload for development
export const uploadMetadataToIPFS = async (metadata: NFTMetadata): Promise<string> => {
  try {
    console.log('Mock IPFS metadata upload:', metadata.name);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock CID
    const mockCid = `mock_metadata_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Generated mock metadata CID:', mockCid);
    
    return `ipfs://${mockCid}`;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata');
  }
};

// Get IPFS URL from CID
export const getIPFSUrl = (cid: string): string => {
  // For mock CIDs, return a placeholder image
  if (cid.startsWith('mock_')) {
    return 'https://via.placeholder.com/400x400/6366f1/ffffff?text=NFT+Preview';
  }
  
  // Use your preferred IPFS gateway for real CIDs
  const gateway = 'https://ipfs.io/ipfs/';
  return `${gateway}${cid}`;
};

// Real IPFS implementation (commented out for now)
/*
// Real implementation using Web3.Storage
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to IPFS');
    }

    const data = await response.json();
    return `ipfs://${data.cid}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file');
  }
};
*/