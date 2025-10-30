'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { NFTMetadata, Listing, Auction, formatETH, parseETH, isAuctionEnded, isAuctionActive } from '@/services/marketplaceService';
import { useNFTStorage, useNFTMarketplace, useNFTAuction } from '@/hooks/useContracts';

interface MarketplaceContextType {
  // State
  userNFTs: NFTMetadata[];
  listings: Listing[];
  auctions: Auction[];
  loading: boolean;
  error: string | null;

  // Actions
  refreshUserNFTs: () => Promise<void>;
  refreshListings: () => Promise<void>;
  refreshAuctions: () => Promise<void>;
  refreshAll: () => Promise<void>;

  // Marketplace functions
  listNFT: (nftContract: string, tokenId: bigint, price: string) => Promise<any>;
  buyNFT: (listingId: bigint, price: string) => Promise<any>;
  makeOffer: (listingId: bigint, duration: bigint, price: string) => Promise<any>;
  acceptOffer: (listingId: bigint, offerer: string) => Promise<any>;
  cancelListing: (listingId: bigint) => Promise<any>;
  cancelOffer: (listingId: bigint) => Promise<any>;

  // Auction functions
  createAuction: (nftContract: string, tokenId: bigint, startPrice: string, duration: bigint) => Promise<any>;
  placeBid: (auctionId: bigint, bidAmount: string) => Promise<any>;
  settleAuction: (auctionId: bigint) => Promise<any>;
  cancelAuction: (auctionId: bigint) => Promise<any>;
  withdrawBid: (auctionId: bigint) => Promise<any>;

  // Utility functions
  formatETH: (value: bigint) => string;
  parseETH: (value: string) => bigint;
  isAuctionEnded: (auction: Auction) => boolean;
  isAuctionActive: (auction: Auction) => boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const nftStorage = useNFTStorage();
  const marketplace = useNFTMarketplace();
  const auction = useNFTAuction();
  
  const [userNFTs, setUserNFTs] = useState<NFTMetadata[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh user NFTs
  const refreshUserNFTs = async () => {
    if (!address || !isConnected) {
      setUserNFTs([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get user's NFT balance
      const balanceResult = nftStorage.getBalanceOf(address);
      if (!balanceResult.data) {
        setUserNFTs([]);
        return;
      }

      const nfts: NFTMetadata[] = [];
      // Note: This is a simplified approach. In a real implementation,
      // you'd need to track token IDs or use events to get user's NFTs
      for (let i = 1; i <= Number(balanceResult.data); i++) {
        try {
          const [ownerResult, tokenURIResult] = await Promise.all([
            nftStorage.getOwnerOf(BigInt(i)),
            nftStorage.getTokenURI(BigInt(i)),
          ]);

          if (ownerResult.data && tokenURIResult.data) {
            // Fetch metadata from IPFS
            let metadata: any = {};
            try {
              const response = await fetch(tokenURIResult.data);
              metadata = await response.json();
            } catch (error) {
              console.warn('Failed to fetch NFT metadata:', error);
            }

            nfts.push({
              tokenId: BigInt(i),
              owner: ownerResult.data,
              tokenURI: tokenURIResult.data,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            });
          }
        } catch (error) {
          console.warn(`Error fetching NFT ${i}:`, error);
        }
      }

      setUserNFTs(nfts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user NFTs');
      console.error('Error refreshing user NFTs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh listings (simplified - in a real app you'd fetch from events)
  const refreshListings = async () => {
    try {
      setLoading(true);
      setError(null);
      // This is a placeholder - in a real implementation you'd fetch from events
      setListings([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      console.error('Error refreshing listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh auctions (simplified - in a real app you'd fetch from events)
  const refreshAuctions = async () => {
    try {
      setLoading(true);
      setError(null);
      // This is a placeholder - in a real implementation you'd fetch from events
      setAuctions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auctions');
      console.error('Error refreshing auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshAll = async () => {
    await Promise.all([
      refreshUserNFTs(),
      refreshListings(),
      refreshAuctions(),
    ]);
  };

  // Marketplace functions
  const listNFT = async (nftContract: string, tokenId: bigint, price: string) => {
    try {
      setError(null);
      const result = await marketplace.listNFT(nftContract, tokenId, price);
      await refreshListings();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list NFT');
      throw err;
    }
  };

  const buyNFT = async (listingId: bigint, price: string) => {
    try {
      setError(null);
      const result = await marketplace.buyNFT(listingId, price);
      await refreshAll();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to buy NFT');
      throw err;
    }
  };

  const makeOffer = async (listingId: bigint, duration: bigint, price: string) => {
    try {
      setError(null);
      const result = await marketplace.makeOffer(listingId, duration, price);
      await refreshListings();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make offer');
      throw err;
    }
  };

  const acceptOffer = async (listingId: bigint, offerer: string) => {
    try {
      setError(null);
      const result = await marketplace.acceptOffer(listingId, offerer);
      await refreshAll();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept offer');
      throw err;
    }
  };

  const cancelListing = async (listingId: bigint) => {
    try {
      setError(null);
      const result = await marketplace.cancelListing(listingId);
      await refreshListings();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel listing');
      throw err;
    }
  };

  const cancelOffer = async (listingId: bigint) => {
    try {
      setError(null);
      const result = await marketplace.cancelOffer(listingId);
      await refreshListings();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel offer');
      throw err;
    }
  };

  // Auction functions
  const createAuction = async (nftContract: string, tokenId: bigint, startPrice: string, duration: bigint) => {
    try {
      setError(null);
      const result = await auction.createAuction(nftContract, tokenId, startPrice, duration);
      await refreshAuctions();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create auction');
      throw err;
    }
  };

  const placeBid = async (auctionId: bigint, bidAmount: string) => {
    try {
      setError(null);
      const result = await auction.placeBid(auctionId, bidAmount);
      await refreshAuctions();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bid');
      throw err;
    }
  };

  const settleAuction = async (auctionId: bigint) => {
    try {
      setError(null);
      const result = await auction.settleAuction(auctionId);
      await refreshAll();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to settle auction');
      throw err;
    }
  };

  const cancelAuction = async (auctionId: bigint) => {
    try {
      setError(null);
      const result = await auction.cancelAuction(auctionId);
      await refreshAuctions();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel auction');
      throw err;
    }
  };

  const withdrawBid = async (auctionId: bigint) => {
    try {
      setError(null);
      const result = await auction.withdrawBid(auctionId);
      await refreshAuctions();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw bid');
      throw err;
    }
  };

  // Utility functions
  const formatETHValue = (value: bigint) => formatETH(value);
  const parseETHValue = (value: string) => parseETH(value);
  const isAuctionEndedCheck = (auction: Auction) => isAuctionEnded(auction);
  const isAuctionActiveCheck = (auction: Auction) => isAuctionActive(auction);

  // Auto-refresh when address changes
  useEffect(() => {
    if (isConnected && address) {
      refreshAll();
    } else {
      setUserNFTs([]);
      setListings([]);
      setAuctions([]);
    }
  }, [address, isConnected]);

  const value: MarketplaceContextType = {
    // State
    userNFTs,
    listings,
    auctions,
    loading,
    error,

    // Actions
    refreshUserNFTs,
    refreshListings,
    refreshAuctions,
    refreshAll,

    // Marketplace functions
    listNFT,
    buyNFT,
    makeOffer,
    acceptOffer,
    cancelListing,
    cancelOffer,

    // Auction functions
    createAuction,
    placeBid,
    settleAuction,
    cancelAuction,
    withdrawBid,

    // Utility functions
    formatETH: formatETHValue,
    parseETH: parseETHValue,
    isAuctionEnded: isAuctionEndedCheck,
    isAuctionActive: isAuctionActiveCheck,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
