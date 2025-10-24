'use client';

import { useEffect, useState } from 'react';
import NFTCard from '@/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Link from 'next/link';
import Loader from '@/components/Loader';

import { TrendingUp, Users, Zap, Shield, Star, Award, Clock, Sparkles, ArrowRight, CheckCircle, Flame } from 'lucide-react';

export default function Home() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [trendingNfts, setTrendingNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        setNfts(allNFTs);
        // Simulate trending NFTs (first 8 for demo)
        setTrendingNfts(allNFTs.slice(0, 8));
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', count: nfts.length },
    { id: 'art', name: 'Art', count: nfts.filter(nft => nft.category === 'art').length },
    { id: 'gaming', name: 'Gaming', count: nfts.filter(nft => nft.category === 'gaming').length },
    { id: 'music', name: 'Music', count: nfts.filter(nft => nft.category === 'music').length },
    { id: 'photography', name: 'Photography', count: nfts.filter(nft => nft.category === 'photography').length },
  ];

  const filteredNfts = activeCategory === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.category === activeCategory);

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Marketplace',
      description: 'Blockchain-powered security with smart contract verification'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Gas-Free Minting',
      description: 'Mint NFTs without paying gas fees on our optimized network'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Driven',
      description: 'Join a thriving community of artists and collectors'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Royalty System',
      description: 'Earn ongoing royalties from secondary market sales'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Digital Assets', icon: <Sparkles className="w-5 h-5" /> },
    { value: '5K+', label: 'Active Users', icon: <Users className="w-5 h-5" /> },
    { value: '2K+', label: 'Artists', icon: <Award className="w-5 h-5" /> },
    { value: '1M+', label: 'Volume Traded', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  const steps = [
    {
      number: '01',
      title: 'Set Up Your Wallet',
      description: 'Connect your preferred crypto wallet to get started'
    },
    {
      number: '02',
      title: 'Create Your Collection',
      description: 'Upload your artwork and add descriptions'
    },
    {
      number: '03',
      title: 'List Them For Sale',
      description: 'Choose between auctions and fixed-price listings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 lg:py-24 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                The Future of Digital Collectibles is Here
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Discover, Collect, and Sell
              <span className="block">Extraordinary NFTs</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              The world's first and largest digital marketplace for crypto collectibles and non-fungible tokens. 
              Buy, sell, and discover exclusive digital assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/create">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-300 transform hover:scale-105 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create NFT
                </button>
              </Link>
              <Link href="/explore">
                <button className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center gap-2">
                  Explore Marketplace
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-center items-center mb-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the next generation of NFT trading with our cutting-edge features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trending NFTs Section */}
        {trendingNfts.length > 0 && (
          <section className="py-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Trending Now
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover the most popular NFTs in the marketplace
                </p>
              </div>
              <Link href="/explore" className="hidden sm:flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                View all trending
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingNfts.slice(0, 4).map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} showOwner={true} />
              ))}
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <section className="py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform translate-x-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* All NFTs Section */}
        <section className="py-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Featured NFTs
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore unique digital assets from talented creators
              </p>
            </div>
            <Link href="/explore" className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              View all NFTs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
          
          {loading ? (
            <Loader message="Loading NFTs..." />
          ) : filteredNfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNfts.map((nft) => (
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
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No NFTs found</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                {activeCategory === 'all' 
                  ? "Be the first to create and mint an NFT on our platform!"
                  : `No NFTs found in the ${activeCategory} category.`
                }
              </p>
              <Link href="/create">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-300 transform hover:scale-105">
                  Create Your First NFT
                </button>
              </Link>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to Join the NFT Revolution?
            </h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Start creating, collecting, and trading unique digital assets today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Start Creating
                </button>
              </Link>
              <Link href="/explore">
                <button className="px-8 py-4 border border-white text-white rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                  Explore Collections
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}