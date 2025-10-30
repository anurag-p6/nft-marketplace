import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contracts } from '@/config/contracts';
import { parseEther, formatEther } from 'viem';

// NFT Storage Hooks
export function useNFTStorage() {
  const { writeContract: writeContractStorage } = useWriteContract();

  const mintNFT = async (to: string, tokenURI: string) => {
    return writeContractStorage({
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'mint',
      args: [to as `0x${string}`, tokenURI],
    });
  };

  const getTotalMinted = () => {
    return useReadContract({
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'getTotalMinted',
    });
  };

  const getTokenURI = (tokenId: bigint) => {
    return useReadContract({
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'tokenURI',
      args: [tokenId],
    });
  };

  const getOwnerOf = (tokenId: bigint) => {
    return useReadContract({
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'ownerOf',
      args: [tokenId],
    });
  };

  const getBalanceOf = (owner: string) => {
    return useReadContract({
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'balanceOf',
      args: [owner as `0x${string}`],
    });
  };

  return {
    mintNFT,
    getTotalMinted,
    getTokenURI,
    getOwnerOf,
    getBalanceOf,
  };
}

// NFT Marketplace Hooks
export function useNFTMarketplace() {
  const { writeContract: writeContractMarketplace } = useWriteContract();

  const listNFT = async (nftContract: string, tokenId: bigint, price: string) => {
    return writeContractMarketplace({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'listNFT',
      args: [nftContract as `0x${string}`, tokenId, parseEther(price)],
    });
  };

  const buyNFT = async (listingId: bigint, value: string) => {
    return writeContractMarketplace({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'buyNFT',
      args: [listingId],
      value: parseEther(value),
    });
  };

  const makeOffer = async (listingId: bigint, duration: bigint, value: string) => {
    return writeContractMarketplace({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'makeOffer',
      args: [listingId, duration],
      value: parseEther(value),
    });
  };

  const acceptOffer = async (listingId: bigint, offerer: string) => {
    return writeContractMarketplace({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'acceptOffer',
      args: [listingId, offerer as `0x${string}`],
    });
  };

  const cancelListing = async (listingId: bigint) => {
    return writeContractMarketplace({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'cancelListing',
      args: [listingId],
    });
  };

  const cancelOffer = async (listingId: bigint) => {
    return writeContractMarketplace({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'cancelOffer',
      args: [listingId],
    });
  };

  const getListing = (listingId: bigint) => {
    return useReadContract({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'getListing',
      args: [listingId],
    });
  };

  const getOffer = (listingId: bigint, offerer: string) => {
    return useReadContract({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'getOffer',
      args: [listingId, offerer as `0x${string}`],
    });
  };

  const getListingCounter = () => {
    return useReadContract({
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'listingCounter',
    });
  };

  return {
    listNFT,
    buyNFT,
    makeOffer,
    acceptOffer,
    cancelListing,
    cancelOffer,
    getListing,
    getOffer,
    getListingCounter,
  };
}

// NFT Auction Hooks
export function useNFTAuction() {
  const { writeContract: writeContractAuction } = useWriteContract();

  const createAuction = async (nftContract: string, tokenId: bigint, startPrice: string, duration: bigint) => {
    return writeContractAuction({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'createAuction',
      args: [nftContract as `0x${string}`, tokenId, parseEther(startPrice), duration],
    });
  };

  const placeBid = async (auctionId: bigint, value: string) => {
    return writeContractAuction({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'placeBid',
      args: [auctionId],
      value: parseEther(value),
    });
  };

  const settleAuction = async (auctionId: bigint) => {
    return writeContractAuction({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'settleAuction',
      args: [auctionId],
    });
  };

  const cancelAuction = async (auctionId: bigint) => {
    return writeContractAuction({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'cancelAuction',
      args: [auctionId],
    });
  };

  const withdrawBid = async (auctionId: bigint) => {
    return writeContractAuction({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'withdrawBid',
      args: [auctionId],
    });
  };

  const getAuction = (auctionId: bigint) => {
    return useReadContract({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'getAuction',
      args: [auctionId],
    });
  };

  const getBid = (auctionId: bigint, bidder: string) => {
    return useReadContract({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'getBid',
      args: [auctionId, bidder as `0x${string}`],
    });
  };

  const getTimeLeft = (auctionId: bigint) => {
    return useReadContract({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'getTimeLeft',
      args: [auctionId],
    });
  };

  const getAuctionCounter = () => {
    return useReadContract({
      address: contracts.nftAuction.address,
      abi: contracts.nftAuction.abi,
      functionName: 'auctionCounter',
    });
  };

  return {
    createAuction,
    placeBid,
    settleAuction,
    cancelAuction,
    withdrawBid,
    getAuction,
    getBid,
    getTimeLeft,
    getAuctionCounter,
  };
}

// Utility function to format ETH values
export function formatETH(value: bigint | string): string {
  if (typeof value === 'string') {
    return formatEther(BigInt(value));
  }
  return formatEther(value);
}

// Utility function to parse ETH values
export function parseETH(value: string): bigint {
  return parseEther(value);
}
