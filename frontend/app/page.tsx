'use client';

import { useEffect, useState } from 'react';
import NFTCard from '@/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Link from 'next/link';

export default function Home() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        setNfts(allNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Discover, Collect, and Sell NFTs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The world's first and largest digital marketplace for crypto collectibles
          </p>
          <Link href="/create">
            <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Create NFT
            </button>
          </Link>
        </div>

        {/* All NFTs Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Explore NFTs</h2>
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading NFTs...</p>
            </div>
          ) : nfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} showOwner={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No NFTs minted yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Be the first to mint an NFT!
              </p>
              <Link href="/create">
                <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Create NFT
                </button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
