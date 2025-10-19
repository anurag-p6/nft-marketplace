'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { getTokenOwner, getTokenURI } from '@/utils/fetchNFTs';
import { getTokenListing, buyNFT } from '@/utils/marketplace';
import { NFTMetadata } from '@/utils/ipfs';
import { contracts } from '@/config/contracts';
import Loader from '@/components/Loader'; 

export default function NFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const tokenId = params.tokenId as string;

  const [nftData, setNftData] = useState<{
    owner: string;
    tokenURI: string;
    metadata?: NFTMetadata;
    listing?: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  // Fetch NFT data
  useEffect(() => {
    const fetchNFTData = async () => {
      if (!tokenId) return;

      setLoading(true);
      try {
        const tokenIdBigInt = BigInt(tokenId);

        // Fetch owner and token URI
        const [owner, tokenURI] = await Promise.all([
          getTokenOwner(tokenIdBigInt),
          getTokenURI(tokenIdBigInt),
        ]);

        if (!owner || !tokenURI) {
          console.error('[NFT Detail] NFT not found');
          return;
        }

        // Fetch metadata from IPFS
        let metadata: NFTMetadata | undefined;
        try {
          let url = tokenURI;
          if (tokenURI.startsWith('ipfs://')) {
            url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
          }
          const response = await fetch(url);
          if (response.ok) {
            metadata = await response.json();
          }
        } catch (error) {
          console.error('[NFT Detail] Error fetching metadata:', error);
        }

        // Fetch listing data
        let listing = null;
        try {
          listing = await getTokenListing(contracts.nftStorage.address, tokenIdBigInt);
        } catch (error) {
          console.log('[NFT Detail] No listing found');
        }

        setNftData({
          owner,
          tokenURI,
          metadata,
          listing,
        });
      } catch (error) {
        console.error('[NFT Detail] Error fetching NFT data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, [tokenId]);

  const handleBuyNFT = async () => {
    if (!nftData?.listing || !isConnected) return;

    setBuying(true);
    try {
      console.log('[NFT Detail] Buying NFT...', {
        listingId: nftData.listing.listingId.toString(),
        price: nftData.listing.price.toString(),
      });

      await buyNFT(nftData.listing.listingId, nftData.listing.price);

      alert('NFT purchased successfully!');
      router.push('/profile');
    } catch (error) {
      console.error('[NFT Detail] Error buying NFT:', error);
      alert(error instanceof Error ? error.message : 'Failed to buy NFT');
    } finally {
      setBuying(false);
    }
  };

  // Truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading NFT...</p>
        </div>
      </div>
    );
  }

  if (!nftData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Not Found</h1>
          <p className="text-gray-600 mb-4">The NFT you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = nftData.metadata?.image || '/placeholder-nft.png';
  const name = nftData.metadata?.name || `NFT #${tokenId}`;
  const description = nftData.metadata?.description || 'No description available';
  const isOwner = address && nftData.owner.toLowerCase() === address.toLowerCase();
  const isListedForSale = nftData.listing && nftData.listing.active;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NFT Image */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-square relative bg-gray-100">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-nft.png';
                }}
              />
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <span className="font-medium">Token ID:</span>
                <span className="font-mono">#{tokenId}</span>
              </div>

              {/* Price Section */}
              {isListedForSale && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Current Price</p>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-4">
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      ${nftData.listing.priceUSD.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      {(Number(nftData.listing.price) / 1e18).toFixed(6)} ETH
                    </p>
                  </div>

                  {!isOwner && isConnected && (
                    <button
                      onClick={handleBuyNFT}
                      disabled={buying}
                      className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      {buying ? 'Processing...' : 'Buy Now'}
                    </button>
                  )}

                  {!isConnected && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-sm text-amber-800 font-medium">
                        Please connect your wallet to purchase this NFT
                      </p>
                    </div>
                  )}

                  {isOwner && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <p className="text-sm text-emerald-800 font-medium">
                        You own this NFT
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!isListedForSale && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-600">
                      {isOwner ? 'This NFT is not currently listed for sale' : 'This NFT is not available for purchase'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600">{description}</p>
            </div>

            {/* Attributes */}
            {nftData.metadata?.attributes && nftData.metadata.attributes.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Attributes</h2>
                <div className="grid grid-cols-2 gap-3">
                  {nftData.metadata.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                      <p className="text-xs text-blue-600 font-medium uppercase mb-1">
                        {attr.trait_type}
                      </p>
                      <p className="text-sm text-gray-900 font-semibold">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Owner</h2>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-600">
                  {truncateAddress(nftData.owner)}
                </span>
                {isOwner && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    You
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
