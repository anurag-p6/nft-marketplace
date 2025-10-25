import { NFTData } from '@/utils/fetchNFTs';
import Link from 'next/link';
import { useState } from 'react';

interface NFTCardProps {
  nft: NFTData;
  showOwner?: boolean;
}

interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: NFTAttribute[];
}

interface NFTListing {
  active?: boolean;
  priceUSD?: number;
}

export default function NFTCard({ nft, showOwner = false }: NFTCardProps) {
  const { tokenId, owner, metadata, listing } = nft;
  const [imageError, setImageError] = useState(false);

  // Safely get values with fallbacks
  const safeMetadata: NFTMetadata = metadata || {};
  const safeListing: NFTListing = listing || {};

  const imageUrl = !imageError && safeMetadata.image ? safeMetadata.image : '/placeholder-nft.png';
  const name = safeMetadata.name || `NFT #${tokenId}`;
  const description = safeMetadata.description || 'No description available';

  // Truncate address for display
  const truncateAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={`/nft/${tokenId}`} className="block">
      <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:shadow-purple-200 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-purple-300">
        {/* NFT Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
          />

          {/* Token ID Badge */}
          <div className="absolute top-2 right-2 bg-purple-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            #{tokenId}
          </div>

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* NFT Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate group-hover:text-purple-600 transition-colors duration-300">
            {name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
            {description}
          </p>

          {/* Attributes */}
          {safeMetadata.attributes && safeMetadata.attributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {safeMetadata.attributes.slice(0, 3).map((attr, index) => (
                <span
                  key={index}
                  className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200"
                >
                  {attr.trait_type}: {attr.value}
                </span>
              ))}
              {safeMetadata.attributes.length > 3 && (
                <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">
                  +{safeMetadata.attributes.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Price */}
          {safeListing.active && safeListing.priceUSD && (
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-lg font-bold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">
                  ${safeListing.priceUSD.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Owner Info */}
          {showOwner && owner && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <span className="font-medium">Owner:</span>
              <span className="font-mono text-gray-700">{truncateAddress(owner)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}