'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { NFTMetadata, Listing, Auction } from '@/services/marketplaceService';
import Link from 'next/link';

interface MarketplaceNFTCardProps {
  nft: NFTMetadata;
  listing?: Listing;
  auction?: Auction;
  showActions?: boolean;
}

export default function MarketplaceNFTCard({ 
  nft, 
  listing, 
  auction, 
  showActions = true 
}: MarketplaceNFTCardProps) {
  const { address, isConnected } = useAccount();
  const { 
    buyNFT, 
    makeOffer, 
    placeBid, 
    formatETH, 
    isAuctionActive, 
    isAuctionEnded,
    loading 
  } = useMarketplace();

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [offerDuration, setOfferDuration] = useState('7'); // 7 days default

  const isOwner = nft.owner.toLowerCase() === address?.toLowerCase();
  const isListed = listing?.active || false;
  const isAuctioned = auction?.active || false;
  const isAuctionActiveNow = auction ? isAuctionActive(auction) : false;
  const isAuctionEndedNow = auction ? isAuctionEnded(auction) : false;

  const handleBuyNFT = async () => {
    if (!listing || !isListed) return;
    
    try {
      await buyNFT(listing.listingId, formatETH(listing.price));
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };

  const handleMakeOffer = async () => {
    if (!listing || !isListed || !offerPrice) return;
    
    try {
      const duration = BigInt(parseInt(offerDuration) * 24 * 60 * 60); // Convert days to seconds
      await makeOffer(listing.listingId, duration, offerPrice);
      setShowOfferModal(false);
      setOfferPrice('');
    } catch (error) {
      console.error('Error making offer:', error);
    }
  };

  const handlePlaceBid = async () => {
    if (!auction || !isAuctionActiveNow || !bidAmount) return;
    
    try {
      await placeBid(auction.auctionId, bidAmount);
      setShowBidModal(false);
      setBidAmount('');
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const formatTimeLeft = (endTime: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return 'Ended';
    
    const days = Number(timeLeft) / (24 * 60 * 60);
    const hours = (Number(timeLeft) % (24 * 60 * 60)) / (60 * 60);
    
    if (days >= 1) {
      return `${Math.floor(days)}d ${Math.floor(hours)}h`;
    } else {
      return `${Math.floor(hours)}h`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300">
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={nft.image || '/placeholder-nft.png'}
          alt={nft.name || `NFT #${nft.tokenId}`}
          className="w-full h-full object-cover"
        />
        
        {/* Token ID Badge */}
        <div className="absolute top-2 right-2 bg-purple-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          #{nft.tokenId.toString()}
        </div>

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isListed && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              Listed
            </span>
          )}
          {isAuctioned && (
            <span className={`text-white text-xs px-2 py-1 rounded ${
              isAuctionActiveNow ? 'bg-blue-500' : 
              isAuctionEndedNow ? 'bg-gray-500' : 'bg-orange-500'
            }`}>
              {isAuctionActiveNow ? 'Auction' : 
               isAuctionEndedNow ? 'Ended' : 'Starting Soon'}
            </span>
          )}
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {nft.name || `NFT #${nft.tokenId}`}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {nft.description || 'No description available'}
        </p>

        {/* Price Information */}
        {isListed && listing && (
          <div className="border-t border-gray-200 pt-3 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Price</span>
              <span className="text-lg font-bold text-purple-600">
                {formatETH(listing.price)} ETH
              </span>
            </div>
          </div>
        )}

        {isAuctioned && auction && (
          <div className="border-t border-gray-200 pt-3 mb-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Bid</span>
                <span className="text-lg font-bold text-purple-600">
                  {formatETH(auction.highestBid)} ETH
                </span>
              </div>
              {isAuctionActiveNow && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Left</span>
                  <span className="text-sm font-medium text-orange-600">
                    {formatTimeLeft(auction.endTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && isConnected && (
          <div className="space-y-2">
            {isListed && listing && !isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={handleBuyNFT}
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => setShowOfferModal(true)}
                  disabled={loading}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Make Offer
                </button>
              </div>
            )}

            {isAuctioned && auction && isAuctionActiveNow && !isOwner && (
              <button
                onClick={() => setShowBidModal(true)}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Place Bid
              </button>
            )}

            {!isListed && !isAuctioned && isOwner && (
              <Link
                href={`/nft/${nft.tokenId}`}
                className="block w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-center"
              >
                Manage NFT
              </Link>
            )}
          </div>
        )}

        {/* Owner Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
          <span className="font-medium">Owner:</span>
          <span className="font-mono text-gray-700">
            {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
          </span>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Make an Offer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Price (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <select
                  value={offerDuration}
                  onChange={(e) => setOfferDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeOffer}
                disabled={!offerPrice || loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                Make Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Place a Bid</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bid Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.1"
                />
              </div>
              {auction && (
                <div className="text-sm text-gray-600">
                  <p>Current highest bid: {formatETH(auction.highestBid)} ETH</p>
                  <p>Minimum bid: {formatETH(auction.startPrice)} ETH</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBid}
                disabled={!bidAmount || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Place Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
