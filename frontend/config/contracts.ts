import NFTStorageABI from '@/abis/NFTStorage.json';
import NFTMarketplaceABI from '@/abis/NFTMarketplace.json';
import NFTAuctionABI from '@/abis/NFTAuction.json';

// Contract Addresses
export const NFT_STORAGE_ADDRESS = process.env.NEXT_PUBLIC_NFT_STORAGE_ADDRESS as `0x${string}`;
export const NFT_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS as `0x${string}`;
export const NFT_AUCTION_ADDRESS = process.env.NEXT_PUBLIC_NFT_AUCTION_ADDRESS as `0x${string}`;

export const contracts = {
  nftStorage: {
    address: NFT_STORAGE_ADDRESS,
    abi: NFTStorageABI,
  },
  nftMarketplace: {
    address: NFT_MARKETPLACE_ADDRESS,
    abi: NFTMarketplaceABI,
  },
  nftAuction: {
    address: NFT_AUCTION_ADDRESS,
    abi: NFTAuctionABI,
  },
} as const;

// Validate contract addresses are configured
if (!NFT_STORAGE_ADDRESS) {
  console.warn('NFT_STORAGE_ADDRESS is not configured in environment variables');
}

if (!NFT_MARKETPLACE_ADDRESS) {
  console.warn('NFT_MARKETPLACE_ADDRESS is not configured in environment variables');
}

if (!NFT_AUCTION_ADDRESS) {
  console.warn('NFT_AUCTION_ADDRESS is not configured in environment variables');
}