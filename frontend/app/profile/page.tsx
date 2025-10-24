'use client';

import { useAccount, useBalance, useEnsName } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../component/Header';
import NFTCard from '@/components/NFTCard';
import { getUserNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/components/Loader'; 
export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!address) return;

      setLoading(true);
      try {
        const userNFTs = await getUserNFTs(address);
        setNfts(userNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  if (!isConnected || !address) {
    return null;
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {ensName ? ensName[0].toUpperCase() : address.slice(2, 4).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ensName || 'Unnamed'}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <code className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                  {truncateAddress(address)}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="text-purple-600 hover:text-purple-700 transition-colors"
                  title="Copy address"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>

              {/* Balance */}
              {balance && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Balance:</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-8 pt-6">
              <button className="pb-4 border-b-2 border-purple-600 text-purple-600 font-semibold">
                Collected
              </button>
              <button className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-semibold">
                Created
              </button>
              <button className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-semibold">
                Favorited
              </button>
              <button className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-semibold">
                Activity
              </button>
            </nav>
          </div>

          {/* NFT Grid */}
          <div className="p-8">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Loading your NFTs...</p>
              </div>
            ) : nfts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                  <NFTCard key={nft.tokenId} nft={nft} showOwner={false} />
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
                <h3 className="mt-4 text-lg font-medium text-gray-900">No NFTs yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Start collecting NFTs to see them here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}