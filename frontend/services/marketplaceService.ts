export interface NFTMetadata {
  tokenId: bigint;
  owner: string;
  tokenURI: string;
  name?: string;
  description?: string;
  image?: string;
}

export interface Listing {
  listingId: bigint;
  seller: string;
  nftContract: string;
  tokenId: bigint;
  price: bigint;
  active: boolean;
}

export interface Auction {
  auctionId: bigint;
  seller: string;
  nftContract: string;
  tokenId: bigint;
  startPrice: bigint;
  highestBid: bigint;
  highestBidder: string;
  startTime: bigint;
  endTime: bigint;
  active: boolean;
  settled: boolean;
}

export interface Offer {
  price: bigint;
  expiresAt: bigint;
}

// Utility functions for ETH formatting
export function formatETH(value: bigint): string {
  return (Number(value) / 1e18).toFixed(4);
}

export function parseETH(value: string): bigint {
  return BigInt(Math.floor(parseFloat(value) * 1e18));
}

export function isAuctionEnded(auction: Auction): boolean {
  return BigInt(Math.floor(Date.now() / 1000)) >= auction.endTime;
}

export function isAuctionActive(auction: Auction): boolean {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return auction.active && now >= auction.startTime && now < auction.endTime;
}

export function isOfferExpired(offer: Offer): boolean {
  return BigInt(Math.floor(Date.now() / 1000)) >= offer.expiresAt;
}