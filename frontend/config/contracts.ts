import NFTStorageABI from '@/abis/NFTStorage.json';
import NFTMarketplaceABI from '@/abis/NFTMarketplace.json';

// Contract Addresses
export const NFT_STORAGE_ADDRESS = process.env.NEXT_PUBLIC_NFT_STORAGE_ADDRESS as `0x${string}`;
export const NFT_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS as `0x${string}`;

export const contracts = {
  nftStorage: {
    address: NFT_STORAGE_ADDRESS,
    abi: NFTStorageABI,
  },
  nftMarketplace: {
    address: NFT_MARKETPLACE_ADDRESS,
    abi: NFTMarketplaceABI,
  },
} as const;

// Validate contract addresses are configured
if (!NFT_STORAGE_ADDRESS) {
  console.warn('NFT_STORAGE_ADDRESS is not configured in environment variables');
}

if (!NFT_MARKETPLACE_ADDRESS) {
  console.warn('NFT_MARKETPLACE_ADDRESS is not configured in environment variables');
}