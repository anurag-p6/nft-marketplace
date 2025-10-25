'use client';

import { useEffect, useState, ReactNode } from 'react';
import NFTCard from '@/app/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Link from 'next/link';
import Loader from '@/app/components/Loader';
import { TrendingUp, Users, Zap, Shield, Star, Award, Clock, Sparkles, ArrowRight, CheckCircle, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Temporary mock IPFS functions - put this in your page.tsx
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

const uploadToIPFS = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `ipfs://mock_image_${Date.now()}`;
};

const uploadMetadataToIPFS = async (metadata: NFTMetadata): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `ipfs://mock_metadata_${Date.now()}`;
};

const getIPFSUrl = (cid: string): string => {
  return `https://ipfs.io/ipfs/${cid}`;
};
// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
};

const slideInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
};

// Define proper types for the animated components
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
}

// Extended NFTData type to include category
interface ExtendedNFTData extends NFTData {
  category?: string;
}

// Animated component wrapper
function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={fadeInUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedGrid({ children, className = "" }: AnimatedGridProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [nfts, setNfts] = useState<ExtendedNFTData[]>([]);
  const [trendingNfts, setTrendingNfts] = useState<ExtendedNFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Add category based on metadata analysis
        const nftsWithCategory: ExtendedNFTData[] = allNFTs.map(nft => {
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];

          let category = 'art'; // Default category

          // Determine category based on content
          if (name.includes('game') || description.includes('game') || 
              name.includes('character') || description.includes('character') ||
              attributes.some(attr => String(attr?.value).toLowerCase().includes('game'))) {
            category = 'gaming';
          } else if (name.includes('music') || description.includes('music') ||
                     name.includes('song') || description.includes('song') ||
                     attributes.some(attr => String(attr?.value).toLowerCase().includes('music'))) {
            category = 'music';
          } else if (name.includes('photo') || description.includes('photo') ||
                     name.includes('camera') || description.includes('camera') ||
                     attributes.some(attr => String(attr?.value).toLowerCase().includes('photo'))) {
            category = 'photography';
          }

          return {
            ...nft,
            category
          };
        });

        setNfts(nftsWithCategory);
        setTrendingNfts(nftsWithCategory.slice(0, 8));
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
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center py-16 lg:py-24"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                The Future of Digital Collectibles is Here
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
            >
              Discover, Collect, and Sell
              <span className="block">Extraordinary NFTs</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              The world's first and largest digital marketplace for crypto collectibles and non-fungible tokens. 
              Buy, sell, and discover exclusive digital assets.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
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
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <AnimatedSection className="py-16">
          <AnimatedGrid className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-center items-center mb-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection className="py-16">
          <motion.div 
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the next generation of NFT trading with our cutting-edge features
            </p>
          </motion.div>
          
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
              </motion.div>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        {/* Trending NFTs Section */}
        {trendingNfts.length > 0 && (
          <AnimatedSection className="py-16">
            <motion.div variants={fadeInUp} className="flex justify-between items-center mb-8">
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
            </motion.div>
            
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingNfts.slice(0, 4).map((nft, index) => (
                <motion.div
                  key={nft.tokenId}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NFTCard nft={nft} showOwner={true} />
                </motion.div>
              ))}
            </AnimatedGrid>
          </AnimatedSection>
        )}

        {/* How It Works Section */}
        <AnimatedSection className="py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </motion.div>
          
          <AnimatedGrid className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold transition-transform duration-300"
                  >
                    {step.number}
                  </motion.div>
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
              </motion.div>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        {/* All NFTs Section */}
        <AnimatedSection className="py-16">
          <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
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
          </motion.div>

          {/* Category Filters */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {category.name} ({category.count})
              </motion.button>
            ))}
          </motion.div>
          
          {loading ? (
            <Loader message="Loading NFTs..." />
          ) : filteredNfts.length > 0 ? (
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNfts.map((nft, index) => (
                <motion.div
                  key={nft.tokenId}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NFTCard nft={nft} showOwner={true} />
                </motion.div>
              ))}
            </AnimatedGrid>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
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
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-300"
                >
                  Create Your First NFT
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="py-16 text-center">
          <motion.div 
            variants={scaleIn}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-white"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to Join the NFT Revolution?
            </h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Start creating, collecting, and trading unique digital assets today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Creating
                </motion.button>
              </Link>
              <Link href="/explore">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white text-white rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300"
                >
                  Explore Collections
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </AnimatedSection>
      </main>
    </div>
  );
}