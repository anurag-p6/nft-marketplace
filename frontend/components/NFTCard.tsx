import { NFTData } from '@/utils/fetchNFTs';
import Link from 'next/link';

interface NFTCardProps {
  nft: NFTData;
  showOwner?: boolean;
}

export default function NFTCard({ nft, showOwner = false }: NFTCardProps) {
  const { tokenId, owner, metadata, listing } = nft;

  // Get image URL from metadata
  const imageUrl = metadata?.image || '/placeholder-nft.png';
  const name = metadata?.name || `NFT #${tokenId}`;
  const description = metadata?.description || 'No description available';

  // Truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Link href={`/nft/${tokenId}`}>
      <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* NFT Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = '/placeholder-nft.png';
            }}
          />

          {/* Token ID Badge */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            #{tokenId}
          </div>
        </div>

        {/* NFT Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>

          {/* Attributes */}
          {metadata?.attributes && metadata.attributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {metadata.attributes.slice(0, 3).map((attr, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                >
                  {attr.trait_type}: {attr.value}
                </span>
              ))}
              {metadata.attributes.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  +{metadata.attributes.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Price */}
          {listing && listing.active && (
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-lg font-bold text-blue-600">
                  ${listing.priceUSD.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Owner Info */}
          {showOwner && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <span className="font-medium">Owner:</span>
              <span className="font-mono">{truncateAddress(owner)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
