'use client';

import { useEffect, useState } from 'react';
import NFTCard from '@/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Link from 'next/link';
import Loader from '@/components/Loader';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center py-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Discover, Collect, and Sell NFTs
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The world's first and largest digital marketplace for crypto collectibles and non-fungible tokens
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-300 transform hover:scale-105">
                Create NFT
              </button>
            </Link>
            <Link href="/explore">
              <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                Explore Marketplace
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-400">Digital Assets</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">5K+</div>
            <div className="text-gray-600 dark:text-gray-400">Active Users</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">2K+</div>
            <div className="text-gray-600 dark:text-gray-400">Artists</div>
          </div>
        </div>

        {/* All NFTs Section */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Featured NFTs</h2>
            <Link href="/explore" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              View all →
            </Link>
          </div>
          
          {loading ? (
            <Loader message="Loading NFTs..." />
          ) : nfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} showOwner={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No NFTs minted yet</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                Be the first to create and mint an NFT on our platform!
              </p>
              <Link href="/create">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-300 transform hover:scale-105">
                  Create Your First NFT
                </button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}