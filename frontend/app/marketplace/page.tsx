'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import MarketplaceNFTCard from '@/app/components/MarketplaceNFTCard';
import { NFTMetadata, Listing, Auction } from '@/services/marketplaceService';

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const { 
    userNFTs, 
    listings, 
    auctions, 
    loading, 
    error, 
    refreshAll 
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'all' | 'my-nfts' | 'listings' | 'auctions'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isConnected) {
      refreshAll();
    }
  }, [isConnected, refreshAll]);

  // Filter NFTs based on active tab and search term
  const getFilteredNFTs = () => {
    let filteredNFTs: NFTMetadata[] = [];
    
    switch (activeTab) {
      case 'my-nfts':
        filteredNFTs = userNFTs;
        break;
      case 'listings':
        // In a real implementation, you'd fetch NFTs that are listed
        filteredNFTs = userNFTs.filter(nft => 
          listings.some(listing => 
            listing.nftContract.toLowerCase() === nft.owner.toLowerCase() && 
            listing.tokenId === nft.tokenId
          )
        );
        break;
      case 'auctions':
        // In a real implementation, you'd fetch NFTs that are in auction
        filteredNFTs = userNFTs.filter(nft => 
          auctions.some(auction => 
            auction.nftContract.toLowerCase() === nft.owner.toLowerCase() && 
            auction.tokenId === nft.tokenId
          )
        );
        break;
      default:
        filteredNFTs = userNFTs;
    }

    // Apply search filter
    if (searchTerm) {
      filteredNFTs = filteredNFTs.filter(nft =>
        nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.tokenId.toString().includes(searchTerm)
      );
    }

    return filteredNFTs;
  };

  const filteredNFTs = getFilteredNFTs();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Marketplace</h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect your wallet to start trading NFTs
            </p>
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <p className="text-gray-500">Please connect your wallet to access the marketplace.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Marketplace</h1>
          <p className="text-lg text-gray-600">
            Discover, buy, sell, and auction NFTs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All NFTs' },
                { key: 'my-nfts', label: 'My NFTs' },
                { key: 'listings', label: 'Listings' },
                { key: 'auctions', label: 'Auctions' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading NFTs...</p>
          </div>
        )}

        {/* NFT Grid */}
        {!loading && (
          <>
            {filteredNFTs.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'my-nfts' ? 'No NFTs found' : 'No NFTs match your criteria'}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'my-nfts' 
                      ? 'You don\'t own any NFTs yet.' 
                      : 'Try adjusting your search or filters.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map((nft) => {
                  // Find associated listing and auction
                  const listing = listings.find(l => 
                    l.nftContract.toLowerCase() === nft.owner.toLowerCase() && 
                    l.tokenId === nft.tokenId
                  );
                  const auction = auctions.find(a => 
                    a.nftContract.toLowerCase() === nft.owner.toLowerCase() && 
                    a.tokenId === nft.tokenId
                  );

                  return (
                    <MarketplaceNFTCard
                      key={nft.tokenId.toString()}
                      nft={nft}
                      listing={listing}
                      auction={auction}
                      showActions={true}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Stats */}
        {!loading && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-2xl font-bold text-purple-600">{userNFTs.length}</h3>
              <p className="text-gray-600">Your NFTs</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-2xl font-bold text-green-600">{listings.length}</h3>
              <p className="text-gray-600">Active Listings</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-2xl font-bold text-blue-600">{auctions.length}</h3>
              <p className="text-gray-600">Active Auctions</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
