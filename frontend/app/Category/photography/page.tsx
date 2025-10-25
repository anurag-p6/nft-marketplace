'use client';

import { useState, useEffect, ReactNode } from 'react';
import NFTCard from '@/app/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/app/components/Loader';
import { 
  Search, 
  Filter, 
  Camera,
  Aperture,
  MapPin,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  X,
  TrendingUp
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

// Extended NFTMetadata type for photography
interface PhotographyNFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ value?: string }>;
}

// Use intersection type to ensure compatibility with NFTData
type PhotographyNFTData = NFTData & {
  metadata?: PhotographyNFTMetadata;
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

export default function Photography() {
  const [nfts, setNfts] = useState<PhotographyNFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<PhotographyNFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('all');

  const sortOptions = [
    { id: 'recent', name: 'Recently Listed' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'name', name: 'Name A-Z' },
  ];

  const photographyStyles = [
    { id: 'all', name: 'All Styles', count: nfts.length },
    { id: 'landscape', name: 'Landscape', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('landscape') || 
      nft.metadata?.description?.toLowerCase().includes('landscape') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('landscape')
      )
    ).length },
    { id: 'portrait', name: 'Portrait', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('portrait') || 
      nft.metadata?.description?.toLowerCase().includes('portrait') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('portrait')
      )
    ).length },
    { id: 'street', name: 'Street', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('street') || 
      nft.metadata?.description?.toLowerCase().includes('street') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('street')
      )
    ).length },
    { id: 'wildlife', name: 'Wildlife', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('wildlife') || 
      nft.metadata?.description?.toLowerCase().includes('wildlife') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('wildlife')
      )
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Filter for photography NFTs based on metadata analysis
        const photographyNFTs = allNFTs.filter(nft => {
          // Check if NFT has photography-related metadata
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          // Photography-related keywords
          const photographyKeywords = [
            'photo', 'photography', 'camera', 'shot', 'lens',
            'portrait', 'landscape', 'street', 'wildlife', 'nature',
            'urban', 'black and white', 'b&w', 'color', 'exposure',
            'aperture', 'shutter', 'iso', 'film', 'digital'
          ];
          
          return photographyKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => 
              attr.value?.toString().toLowerCase().includes(keyword)
            )
          );
        }) as PhotographyNFTData[];
        
        setNfts(photographyNFTs);
        setFilteredNfts(photographyNFTs);
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

    // Apply style filter
    if (selectedStyle !== 'all') {
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        const attributes = nft.metadata?.attributes || [];
        
        switch (selectedStyle) {
          case 'landscape':
            return name.includes('landscape') || 
                   description.includes('landscape') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('landscape'));
          case 'portrait':
            return name.includes('portrait') || 
                   description.includes('portrait') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('portrait'));
          case 'street':
            return name.includes('street') || 
                   description.includes('street') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('street'));
          case 'wildlife':
            return name.includes('wildlife') || 
                   description.includes('wildlife') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('wildlife'));
          default:
            return true;
        }
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
  }, [nfts, searchQuery, sortBy, selectedStyle]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setSelectedStyle('all');
  };

  const photographyStats = {
    totalPhotos: nfts.length,
    totalVolume: nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0),
    averagePrice: nfts.length > 0 ? nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0) / nfts.length : 0,
    photographers: new Set(nfts.map(nft => nft.owner)).size
  };

  const featuredSeries = [
    { name: 'Urban Landscapes', photos: 24, location: 'New York', icon: '🏙️' },
    { name: 'Wildlife Portraits', photos: 18, location: 'Africa', icon: '🦁' },
    { name: 'Street Moments', photos: 32, location: 'Tokyo', icon: '🏮' },
    { name: 'Nature Abstracts', photos: 15, location: 'Iceland', icon: '❄️' },
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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Camera className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
          >
            Photography
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover extraordinary photographic NFTs from talented photographers around the world. 
            Own a piece of visual storytelling and support photographic artists.
          </motion.p>
          
          {/* Photography Stats */}
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { value: photographyStats.totalPhotos, label: 'Photos' },
              { value: `$${photographyStats.totalVolume.toFixed(0)}`, label: 'Total Volume' },
              { value: `$${photographyStats.averagePrice.toFixed(2)}`, label: 'Avg Price' },
              { value: photographyStats.photographers, label: 'Photographers' }
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

        {/* Featured Series */}
        <AnimatedSection className="mb-12">
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Series</h2>
          </motion.div>
          <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSeries.map((series, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {series.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {series.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Aperture className="w-3 h-3" />
                    <span>{series.photos} photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{series.location}</span>
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
                placeholder="Search photos, locations, or photographers..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Sort By */}
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              Photography Styles
              {showFilters && <X className="w-4 h-4" />}
            </motion.button>
          </motion.div>

          {/* Photography Style Filters */}
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
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Filter by Photography Style
                </h3>
                <div className="flex flex-wrap gap-2">
                  {photographyStyles.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedStyle === style.id
                          ? 'bg-amber-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {style.name} ({style.count})
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
              Showing {filteredNfts.length} photographs
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Photography Grid */}
        <AnimatedSection>
          {loading ? (
            <Loader message="Loading photographs..." />
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
              <Camera className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No photographs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedStyle !== 'all'
                  ? "No photographs match your search criteria"
                  : "Be the first to create photography NFTs!"
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-500 hover:to-orange-500 transition-all duration-300"
              >
                {searchQuery || selectedStyle !== 'all' ? 'Clear Filters' : 'Create Photography NFT'}
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
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Load More Photos
            </motion.button>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}