'use client';

import { useState, useEffect, ReactNode } from 'react';
import NFTCard from '@/app/components/NFTCard';
import { getAllNFTs, NFTData } from '../../utils/fetchNFTs';
import Loader from '@/app/components/Loader';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  X,
  Flame,
  Sparkles,
  Zap,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
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
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

// Define proper types for animated components
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

// Animated component wrappers
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

export default function Explore() {
  const [nfts, setNfts] = useState<ExtendedNFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<ExtendedNFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', count: nfts.length, icon: '✨' },
    { id: 'art', name: 'Art', count: nfts.filter(nft => nft.category === 'art').length, icon: '🎨' },
    { id: 'gaming', name: 'Gaming', count: nfts.filter(nft => nft.category === 'gaming').length, icon: '🎮' },
    { id: 'music', name: 'Music', count: nfts.filter(nft => nft.category === 'music').length, icon: '🎵' },
    { id: 'photography', name: 'Photography', count: nfts.filter(nft => nft.category === 'photography').length, icon: '📸' },
    { id: 'pfp', name: 'PFP', count: nfts.filter(nft => nft.category === 'pfp').length, icon: '👤' },
    { id: 'sports', name: 'Sports', count: nfts.filter(nft => nft.category === 'sports').length, icon: '⚽' },
    { id: 'virtual-worlds', name: 'Virtual Worlds', count: nfts.filter(nft => nft.category === 'virtual-worlds').length, icon: '🌐' },
  ];

  const sortOptions = [
    { id: 'recent', name: 'Recently Listed', icon: <Zap className="w-4 h-4" /> },
    { id: 'price-low', name: 'Price: Low to High', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'price-high', name: 'Price: High to Low', icon: <Flame className="w-4 h-4" /> },
  ];

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
          } else if (name.includes('sport') || description.includes('sport') ||
                     attributes.some(attr => String(attr?.value).toLowerCase().includes('sport'))) {
            category = 'sports';
          } else if (name.includes('virtual') || description.includes('virtual') ||
                     name.includes('world') || description.includes('world') ||
                     attributes.some(attr => String(attr?.value).toLowerCase().includes('virtual'))) {
            category = 'virtual-worlds';
          } else if (name.includes('pfp') || description.includes('pfp') ||
                     name.includes('profile') || description.includes('profile') ||
                     attributes.some(attr => String(attr?.value).toLowerCase().includes('pfp'))) {
            category = 'pfp';
          }

          return {
            ...nft,
            category
          };
        });

        setNfts(nftsWithCategory);
        setFilteredNfts(nftsWithCategory);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  useEffect(() => {
    let results = nfts;

    // Apply search filter
    if (searchQuery) {
      results = results.filter(nft =>
        nft.metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.metadata?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.owner?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(nft => nft.category === selectedCategory);
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.listing?.priceUSD || 0) - (b.listing?.priceUSD || 0);
        case 'price-high':
          return (b.listing?.priceUSD || 0) - (a.listing?.priceUSD || 0);
        case 'recent':
        default:
          return parseInt(b.tokenId) - parseInt(a.tokenId);
      }
    });

    setFilteredNfts(results);
  }, [nfts, searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('recent');
  };

  const trendingCollections = [
    { name: 'CryptoPunks', volume: '12.5K', change: '+12%', icon: '👾' },
    { name: 'Bored Ape', volume: '8.2K', change: '+8%', icon: '🐵' },
    { name: 'Art Blocks', volume: '6.7K', change: '+15%', icon: '🎨' },
    { name: 'Doodles', volume: '5.3K', change: '+22%', icon: '🖍️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center py-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center items-center gap-3 mb-4"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Sparkles className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Explore NFTs
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover thousands of unique digital assets from talented creators worldwide
          </motion.p>
        </motion.section>

        {/* Trending Collections */}
        <AnimatedSection className="mb-8">
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Collections</h2>
          </motion.div>
          <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCollections.map((collection, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {collection.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {collection.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {collection.volume} ETH
                  </span>
                  <span className="text-sm text-green-500 font-medium">
                    {collection.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        {/* Search and Controls */}
        <AnimatedSection className="mb-8">
          <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, collections, and creators..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Sort By */}
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </motion.select>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {showFilters && <X className="w-4 h-4" />}
            </motion.button>
          </motion.div>

          {/* Categories */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <span className="text-sm">{category.icon}</span>
                  {category.name} 
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </AnimatedSection>

        {/* View Controls */}
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredNfts.length} of {nfts.length} items
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatedSection>

        {/* NFT Grid */}
        <AnimatedSection>
          {loading ? (
            <Loader message="Loading NFTs..." />
          ) : filteredNfts.length > 0 ? (
            <AnimatedGrid className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "grid grid-cols-1 gap-6"
            }>
              {filteredNfts.map((nft, index) => (
                <motion.div
                  key={nft.tokenId}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <NFTCard 
                    nft={nft} 
                    showOwner={true}
                  />
                </motion.div>
              ))}
            </AnimatedGrid>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <Search className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No NFTs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatedSection>

        {/* Load More */}
        {filteredNfts.length > 0 && (
          <AnimatedSection className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              Load More NFTs
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}