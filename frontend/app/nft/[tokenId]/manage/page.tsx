'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { NFTMetadata, Listing, Auction } from '@/services/marketplaceService';

export default function NFTManagePage() {
  const params = useParams();
  const tokenId = BigInt(params.tokenId as string);
  const { address, isConnected } = useAccount();
  const { 
    userNFTs, 
    listings, 
    auctions, 
    listNFT, 
    createAuction, 
    cancelListing, 
    cancelAuction,
    formatETH,
    loading 
  } = useMarketplace();

  const [nft, setNft] = useState<NFTMetadata | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [auction, setAuction] = useState<Auction | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [listPrice, setListPrice] = useState('');
  const [auctionStartPrice, setAuctionStartPrice] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('7');

  useEffect(() => {
    if (userNFTs.length > 0) {
      const foundNFT = userNFTs.find(n => n.tokenId === tokenId);
      setNft(foundNFT || null);
    }
  }, [userNFTs, tokenId]);

  useEffect(() => {
    if (listings.length > 0) {
      const foundListing = listings.find(l => l.tokenId === tokenId);
      setListing(foundListing || null);
    }
  }, [listings, tokenId]);

  useEffect(() => {
    if (auctions.length > 0) {
      const foundAuction = auctions.find(a => a.tokenId === tokenId);
      setAuction(foundAuction || null);
    }
  }, [auctions, tokenId]);

  const handleListNFT = async () => {
    if (!nft || !listPrice) return;
    
    try {
      await listNFT(nft.owner, nft.tokenId, listPrice);
      setShowListModal(false);
      setListPrice('');
    } catch (error) {
      console.error('Error listing NFT:', error);
    }
  };

  const handleCreateAuction = async () => {
    if (!nft || !auctionStartPrice || !auctionDuration) return;
    
    try {
      const duration = BigInt(parseInt(auctionDuration) * 24 * 60 * 60); // Convert days to seconds
      await createAuction(nft.owner, nft.tokenId, auctionStartPrice, duration);
      setShowAuctionModal(false);
      setAuctionStartPrice('');
      setAuctionDuration('7');
    } catch (error) {
      console.error('Error creating auction:', error);
    }
  };

  const handleCancelListing = async () => {
    if (!listing) return;
    
    try {
      await cancelListing(listing.listingId);
    } catch (error) {
      console.error('Error canceling listing:', error);
    }
  };

  const handleCancelAuction = async () => {
    if (!auction) return;
    
    try {
      await cancelAuction(auction.auctionId);
    } catch (error) {
      console.error('Error canceling auction:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Management</h1>
            <p className="text-lg text-gray-600">Please connect your wallet to manage NFTs.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Not Found</h1>
            <p className="text-lg text-gray-600">This NFT doesn't exist or you don't own it.</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = nft.owner.toLowerCase() === address?.toLowerCase();
  const isListed = listing?.active || false;
  const isAuctioned = auction?.active || false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Manage NFT #{nft.tokenId.toString()}
          </h1>
        </div>

        {/* NFT Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NFT Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={nft.image || '/placeholder-nft.png'}
                alt={nft.name || `NFT #${nft.tokenId}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* NFT Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {nft.name || `NFT #${nft.tokenId}`}
                </h2>
                <p className="text-gray-600 mt-2">
                  {nft.description || 'No description available'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Token ID:</span>
                  <span className="font-mono">#{nft.tokenId.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner:</span>
                  <span className="font-mono text-sm">
                    {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    isListed ? 'bg-green-100 text-green-800' :
                    isAuctioned ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {isListed ? 'Listed' : isAuctioned ? 'In Auction' : 'Not Listed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Actions */}
        {isOwner && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Actions</h3>
            
            <div className="space-y-4">
              {/* Current Status */}
              {isListed && listing && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800">NFT is Listed</h4>
                      <p className="text-sm text-green-600">
                        Price: {formatETH(listing.price)} ETH
                      </p>
                    </div>
                    <button
                      onClick={handleCancelListing}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      Cancel Listing
                    </button>
                  </div>
                </div>
              )}

              {isAuctioned && auction && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-800">NFT is in Auction</h4>
                      <p className="text-sm text-blue-600">
                        Start Price: {formatETH(auction.startPrice)} ETH
                      </p>
                      <p className="text-sm text-blue-600">
                        Current Bid: {formatETH(auction.highestBid)} ETH
                      </p>
                    </div>
                    <button
                      onClick={handleCancelAuction}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      Cancel Auction
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isListed && !isAuctioned && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowListModal(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    List for Sale
                  </button>
                  <button
                    onClick={() => setShowAuctionModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Auction
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* List Modal */}
        {showListModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">List NFT for Sale</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.1"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowListModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleListNFT}
                  disabled={!listPrice || loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  List NFT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auction Modal */}
        {showAuctionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Create Auction</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Price (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={auctionStartPrice}
                    onChange={(e) => setAuctionStartPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (days)
                  </label>
                  <select
                    value={auctionDuration}
                    onChange={(e) => setAuctionDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onClick={() => setShowAuctionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAuction}
                  disabled={!auctionStartPrice || loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Create Auction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
