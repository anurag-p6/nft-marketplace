'use client';

import { useState, useEffect, ReactNode } from 'react';
import NFTCard from '@/app/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/app/components/Loader';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  X,
  Palette,
  Sparkles,
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

// Use the original NFTData type directly instead of extending
type ArtNFTData = NFTData & {
  metadata: {
    views?: number;
  };
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

export default function ArtCategory() {
  const [nfts, setNfts] = useState<ArtNFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<ArtNFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('all');

  const sortOptions = [
    { id: 'recent', name: 'Recently Listed' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'most-viewed', name: 'Most Viewed' },
  ];

  // Art styles based on metadata analysis
  const artStyles = [
    { id: 'all', name: 'All Art', count: nfts.length },
    { id: 'digital', name: 'Digital Art', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('digital') || 
      nft.metadata?.description?.toLowerCase().includes('digital') ||
      nft.metadata?.attributes?.some(attr => 
        String(attr?.value).toLowerCase().includes('digital')
      )
    ).length },
    { id: 'abstract', name: 'Abstract', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('abstract') || 
      nft.metadata?.description?.toLowerCase().includes('abstract') ||
      nft.metadata?.attributes?.some(attr => 
        String(attr?.value).toLowerCase().includes('abstract')
      )
    ).length },
    { id: 'painting', name: 'Painting', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('painting') || 
      nft.metadata?.description?.toLowerCase().includes('painting') ||
      nft.metadata?.attributes?.some(attr => 
        String(attr?.value).toLowerCase().includes('painting')
      )
    ).length },
    { id: 'photography', name: 'Photography', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('photo') || 
      nft.metadata?.description?.toLowerCase().includes('photo') ||
      nft.metadata?.attributes?.some(attr => 
        String(attr?.value).toLowerCase().includes('photo')
      )
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Filter for art NFTs based on metadata analysis and ensure required fields
        const artNFTs = allNFTs.filter(nft => {
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          const artKeywords = [
            'art', 'painting', 'digital', 'abstract', 'portrait', 'landscape',
            'drawing', 'illustration', 'sketch', 'canvas', 'gallery', 'artist',
            'masterpiece', 'creative', 'design', 'visual', 'aesthetic'
          ];
          
          return artKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => {
              const attrValue = attr?.value?.toString().toLowerCase() || '';
              return attrValue.includes(keyword);
            })
          );
        }).map(nft => {
          // Add views property to metadata for sorting
          return {
            ...nft,
            metadata: {
              ...nft.metadata,
              views: Math.floor(Math.random() * 1000) // Add random views for demo
            }
          };
        }) as ArtNFTData[];
        
        setNfts(artNFTs);
        setFilteredNfts(artNFTs);
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

    // Apply art style filter
    if (selectedStyle !== 'all') {
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        const attributes = nft.metadata?.attributes || [];
        
        switch (selectedStyle) {
          case 'digital':
            return name.includes('digital') || 
                   description.includes('digital') ||
                   attributes.some(attr => String(attr?.value).toLowerCase().includes('digital'));
          case 'abstract':
            return name.includes('abstract') || 
                   description.includes('abstract') ||
                   attributes.some(attr => String(attr?.value).toLowerCase().includes('abstract'));
          case 'painting':
            return name.includes('painting') || 
                   description.includes('painting') ||
                   attributes.some(attr => String(attr?.value).toLowerCase().includes('painting'));
          case 'photography':
            return name.includes('photo') || 
                   description.includes('photo') ||
                   attributes.some(attr => String(attr?.value).toLowerCase().includes('photo'));
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
        case 'most-viewed':
          return ((b.metadata as any)?.views || 0) - ((a.metadata as any)?.views || 0);
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

  const artStats = {
    totalItems: nfts.length,
    totalVolume: nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0),
    averagePrice: nfts.length > 0 ? nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0) / nfts.length : 0,
    artists: new Set(nfts.map(nft => nft.owner)).size
  };

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
              <Palette className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Digital Art Gallery
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover extraordinary digital artworks from talented artists around the world. 
            Explore unique pieces that redefine creativity in the digital age.
          </motion.p>
          
          {/* Art Stats */}
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { value: artStats.totalItems, label: 'Artworks' },
              { value: `$${artStats.totalVolume.toFixed(0)}`, label: 'Total Volume' },
              { value: `$${artStats.averagePrice.toFixed(2)}`, label: 'Avg Price' },
              { value: artStats.artists, label: 'Artists' }
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
                placeholder="Search art pieces, artists, or descriptions..."
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
              Art Styles
              {showFilters && <X className="w-4 h-4" />}
            </motion.button>
          </motion.div>

          {/* Art Style Filters */}
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
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Filter by Art Style
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artStyles.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedStyle === style.id
                          ? 'bg-purple-600 text-white shadow-lg'
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

        {/* View Controls */}
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredNfts.length} digital artworks
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

        {/* Featured Artist Spotlight */}
        {nfts.length > 0 && (
          <AnimatedSection className="mb-12">
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Artists</h2>
            </motion.div>
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from(new Set(nfts.slice(0, 8).map(nft => nft.owner))).slice(0, 4).map((artist, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mb-3">
                    {artist?.slice(2, 4).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                    {artist?.slice(0, 6)}...{artist?.slice(-4)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {nfts.filter(nft => nft.owner === artist).length} artworks
                  </p>
                </motion.div>
              ))}
            </AnimatedGrid>
          </AnimatedSection>
        )}

        {/* Artworks Grid */}
        <AnimatedSection>
          {loading ? (
            <Loader message="Loading digital artworks..." />
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
                  className={viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}
                >
                  <NFTCard 
                    nft={nft} 
                    showOwner={true}
                    // Remove viewMode prop since NFTCard doesn't support it
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
              <Palette className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No artworks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedStyle !== 'all'
                  ? "No artworks match your search criteria"
                  : "Be the first to create digital art in this category!"
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                {searchQuery || selectedStyle !== 'all' ? 'Clear Filters' : 'Create Art NFT'}
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
              Load More Artworks
            </motion.button>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}