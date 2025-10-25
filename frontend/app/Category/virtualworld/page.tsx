'use client';

import { useState, useEffect, ReactNode } from 'react';
import NFTCard from '@/app/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/app/components/Loader';
import { 
  Search, 
  Filter, 
  Globe,
  Box, 
  Square, 
  Package,
  Container,
  Users,
  Home,
  Sparkles,
  SlidersHorizontal,
  X,
  TrendingUp,
  MapPin
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

// Define proper types for the animated components
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
}

// Extended NFTMetadata type for virtual worlds
interface VirtualWorldNFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ value?: string }>;
}

// Use intersection type to ensure compatibility with NFTData
type VirtualWorldNFTData = NFTData & {
  metadata?: VirtualWorldNFTMetadata;
};

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

export default function VirtualWorld() {
  const [nfts, setNfts] = useState<VirtualWorldNFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<VirtualWorldNFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sortOptions = [
    { id: 'recent', name: 'Recently Listed' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'name', name: 'Name A-Z' },
  ];

  const categoryOptions = [
    { id: 'all', name: 'All Assets', count: nfts.length },
    { id: 'land', name: 'Virtual Land', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('land') || 
      nft.metadata?.description?.toLowerCase().includes('land') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('land')
      )
    ).length },
    { id: 'avatar', name: 'Avatars', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('avatar') || 
      nft.metadata?.description?.toLowerCase().includes('avatar') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('avatar')
      )
    ).length },
    { id: 'wearable', name: 'Wearables', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('wearable') || 
      nft.metadata?.description?.toLowerCase().includes('wearable') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('wearable')
      )
    ).length },
    { id: 'estate', name: 'Estates', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('estate') || 
      nft.metadata?.description?.toLowerCase().includes('estate') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('estate')
      )
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Filter for virtual world NFTs based on metadata analysis
        const virtualWorldNFTs = allNFTs.filter(nft => {
          // Check if NFT has virtual world-related metadata
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          // Virtual world-related keywords
          const virtualWorldKeywords = [
            'virtual', 'metaverse', 'land', 'parcel', 'estate',
            'avatar', 'wearable', '3d', 'vr', 'ar', 'digital',
            'world', 'realm', 'domain', 'property', 'space',
            'plot', 'terrain', 'environment', 'universe'
          ];
          
          return virtualWorldKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => 
              attr.value?.toString().toLowerCase().includes(keyword)
            )
          );
        }) as VirtualWorldNFTData[];
        
        setNfts(virtualWorldNFTs);
        setFilteredNfts(virtualWorldNFTs);
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
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        const attributes = nft.metadata?.attributes || [];
        
        return name.includes(selectedCategory) || 
               description.includes(selectedCategory) ||
               attributes.some(attr => attr.value?.toString().toLowerCase().includes(selectedCategory));
      });
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.listing?.priceUSD || 0) - (b.listing?.priceUSD || 0);
        case 'price-high':
          return (b.listing?.priceUSD || 0) - (a.listing?.priceUSD || 0);
        case 'name':
          return (a.metadata?.name || '').localeCompare(b.metadata?.name || '');
        case 'recent':
        default:
          return parseInt(b.tokenId) - parseInt(a.tokenId);
      }
    });

    setFilteredNfts(results);
  }, [nfts, searchQuery, sortBy, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setSelectedCategory('all');
  };

  const virtualWorldStats = {
    totalAssets: nfts.length,
    totalVolume: nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0),
    averagePrice: nfts.length > 0 ? nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0) / nfts.length : 0,
    landowners: new Set(nfts.map(nft => nft.owner)).size
  };

  const featuredWorlds = [
    { name: 'Decentraland', assets: 2450, users: '50K', icon: '🏙️' },
    { name: 'The Sandbox', assets: 1820, users: '35K', icon: '🕹️' },
    { name: 'Somnium Space', assets: 890, users: '15K', icon: '🚀' },
    { name: 'Cryptovoxels', assets: 670, users: '12K', icon: '🧊' },
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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 text-white">
              <Globe className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            Virtual Worlds
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Own digital real estate, avatars, and wearables in the metaverse. 
            Build, explore, and trade in immersive virtual environments.
          </motion.p>
          
          {/* Virtual World Stats */}
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { value: virtualWorldStats.totalAssets, label: 'Virtual Assets' },
              { value: `$${virtualWorldStats.totalVolume.toFixed(0)}`, label: 'Total Volume' },
              { value: `$${virtualWorldStats.averagePrice.toFixed(2)}`, label: 'Avg Price' },
              { value: virtualWorldStats.landowners, label: 'Landowners' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </AnimatedGrid>
        </motion.section>

        {/* Featured Worlds */}
        <AnimatedSection className="mb-12">
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Worlds</h2>
          </motion.div>
          <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorlds.map((world, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {world.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {world.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Assets:</span>
                    <span className="font-medium">{world.assets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Users:</span>
                    <span className="font-medium text-blue-600">{world.users}</span>
                  </div>
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
                placeholder="Search lands, avatars, or wearables..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Sort By */}
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              Asset Types
              {showFilters && <X className="w-4 h-4" />}
            </motion.button>
          </motion.div>

          {/* Asset Type Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Filter by Asset Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        selectedCategory === category.id
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.id === 'land' && <MapPin className="w-4 h-4" />}
                      {category.id === 'avatar' && <Users className="w-4 h-4" />}
                      {category.id === 'wearable' && <Package className="w-4 h-4" />}
                      {category.id === 'estate' && <Home className="w-4 h-4" />}
                      {category.name} ({category.count})
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedSection>

        {/* Results Count */}
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredNfts.length} virtual assets
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Virtual Assets Grid */}
        <AnimatedSection>
          {loading ? (
            <Loader message="Loading virtual assets..." />
          ) : filteredNfts.length > 0 ? (
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <Globe className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No virtual assets found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? "No virtual assets match your search criteria"
                  : "Be the first to create virtual world NFTs!"
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-blue-500 transition-all duration-300"
              >
                {searchQuery || selectedCategory !== 'all' ? 'Clear Filters' : 'Create Virtual Asset'}
              </motion.button>
            </motion.div>
          )}
        </AnimatedSection>

        {/* 3D Viewer Section */}
        <AnimatedSection className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
            <Box className="w-6 h-6" />
            <h2 className="text-2xl font-bold">3D Model Viewer</h2>
          </motion.div>
          <motion.p variants={fadeInUp} className="mb-6 opacity-90">
            Preview avatars, wearables, and virtual assets in 3D. Integrate with model-viewer or three.js 
            for immersive experiences in the metaverse.
          </motion.p>
          <motion.div 
            variants={scaleIn}
            className="bg-white bg-opacity-10 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-4">🎮</div>
            <p className="text-sm opacity-80 mb-4">
              3D viewer integration placeholder — replace with your preferred 3D rendering solution
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                View in 3D
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-white text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                AR Preview
              </motion.button>
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Load More */}
        {filteredNfts.length > 0 && (
          <AnimatedSection className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Load More Assets
            </motion.button>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}