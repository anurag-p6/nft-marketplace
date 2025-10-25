'use client';

import { useState, useEffect, ReactNode } from 'react';
import NFTCard from '@/app/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/app/components/Loader';
import { 
  Search, 
  Filter, 
  Users,
  Crown,
  Star,
  TrendingUp,
  Sparkles,
  SlidersHorizontal,
  X
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

// Extended NFTMetadata type for PFP - include all required properties from base NFTMetadata
interface PFPNFTMetadata {
  name?: string;
  description?: string;
  image?: string; // Add the missing image property
  attributes?: Array<{ value?: string }>;
}

// Instead of extending, use intersection type to ensure compatibility
type PFPNFTData = NFTData & {
  metadata?: PFPNFTMetadata;
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

export default function PFP() {
  const [nfts, setNfts] = useState<PFPNFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<PFPNFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');

  const sortOptions = [
    { id: 'recent', name: 'Recently Listed' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'name', name: 'Name A-Z' },
  ];

  const rarityOptions = [
    { id: 'all', name: 'All Rarities', count: nfts.length },
    { id: 'legendary', name: 'Legendary', count: nfts.filter(nft => 
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('legendary')
      )
    ).length },
    { id: 'rare', name: 'Rare', count: nfts.filter(nft => 
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('rare')
      )
    ).length },
    { id: 'common', name: 'Common', count: nfts.filter(nft => 
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('common')
      )
    ).length },
  ];

  const collectionOptions = [
    { id: 'all', name: 'All Collections', count: nfts.length },
    { id: 'bored-apes', name: 'Bored Apes', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('ape') || 
      nft.metadata?.description?.toLowerCase().includes('bored ape')
    ).length },
    { id: 'cryptopunks', name: 'CryptoPunks', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('punk') || 
      nft.metadata?.description?.toLowerCase().includes('cryptopunk')
    ).length },
    { id: 'doodles', name: 'Doodles', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('doodle') || 
      nft.metadata?.description?.toLowerCase().includes('doodle')
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Filter for PFP NFTs based on metadata analysis
        const pfpNFTs = allNFTs.filter(nft => {
          // Check if NFT has PFP-related metadata
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          // PFP-related keywords
          const pfpKeywords = [
            'pfp', 'profile', 'avatar', 'character', 'portrait',
            'ape', 'punk', 'doodle', 'bird', 'penguin', 'azuki',
            'collection', 'edition', 'series', 'avatar'
          ];
          
          return pfpKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => 
              attr.value?.toString().toLowerCase().includes(keyword)
            )
          );
        }) as PFPNFTData[];
        
        setNfts(pfpNFTs);
        setFilteredNfts(pfpNFTs);
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

    // Apply rarity filter
    if (selectedRarity !== 'all') {
      results = results.filter(nft => {
        const attributes = nft.metadata?.attributes || [];
        return attributes.some(attr => 
          attr.value?.toString().toLowerCase().includes(selectedRarity)
        );
      });
    }

    // Apply collection filter
    if (selectedCollection !== 'all') {
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        
        switch (selectedCollection) {
          case 'bored-apes':
            return name.includes('ape') || description.includes('bored ape');
          case 'cryptopunks':
            return name.includes('punk') || description.includes('cryptopunk');
          case 'doodles':
            return name.includes('doodle') || description.includes('doodle');
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
  }, [nfts, searchQuery, sortBy, selectedRarity, selectedCollection]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setSelectedRarity('all');
    setSelectedCollection('all');
  };

  const pfpStats = {
    totalPFPs: nfts.length,
    totalVolume: nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0),
    averagePrice: nfts.length > 0 ? nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0) / nfts.length : 0,
    collections: new Set(nfts.map(nft => nft.metadata?.name?.split('#')[0])).size
  };

  const trendingCollections = [
    { name: 'Bored Ape Yacht Club', volume: '1.2K ETH', items: 10000, icon: '🦍' },
    { name: 'CryptoPunks', volume: '980 ETH', items: 10000, icon: '👨‍🎤' },
    { name: 'Moonbirds', volume: '750 ETH', items: 10000, icon: '🐦' },
    { name: 'Doodles', volume: '620 ETH', items: 10000, icon: '🎨' },
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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Users className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Profile Pictures
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover unique avatar collections and digital identity NFTs. 
            Find your next profile picture from the world's top PFP collections.
          </motion.p>
          
          {/* PFP Stats */}
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { value: pfpStats.totalPFPs, label: 'Total PFPs' },
              { value: `$${pfpStats.totalVolume.toFixed(0)}`, label: 'Total Volume' },
              { value: `$${pfpStats.averagePrice.toFixed(2)}`, label: 'Avg Price' },
              { value: pfpStats.collections, label: 'Collections' }
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

        {/* Trending Collections */}
        <AnimatedSection className="mb-12">
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Collections</h2>
          </motion.div>
          <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCollections.map((collection, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {collection.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {collection.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium">{collection.items}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span className="font-medium text-green-600">{collection.volume}</span>
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
                placeholder="Search PFPs, collections, or traits..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort By */}
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Advanced Filters */}
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
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Filter PFPs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rarity Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Rarity
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rarityOptions.map((rarity) => (
                        <motion.button
                          key={rarity.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedRarity(rarity.id)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedRarity === rarity.id
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {rarity.name} ({rarity.count})
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Collection Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Collection
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {collectionOptions.map((collection) => (
                        <motion.button
                          key={collection.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCollection(collection.id)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedCollection === collection.id
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {collection.name} ({collection.count})
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedSection>

        {/* Results Count */}
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredNfts.length} profile pictures
            </div>
          </motion.div>
        </AnimatedSection>

        {/* PFP Grid */}
        <AnimatedSection>
          {loading ? (
            <Loader message="Loading profile pictures..." />
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
              <Users className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No profile pictures found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedRarity !== 'all' || selectedCollection !== 'all'
                  ? "No PFPs match your search criteria"
                  : "Be the first to create PFP NFTs!"
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
              >
                {searchQuery || selectedRarity !== 'all' || selectedCollection !== 'all' ? 'Clear Filters' : 'Create PFP NFT'}
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
              Load More PFPs
            </motion.button>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}