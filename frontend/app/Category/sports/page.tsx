'use client';

import { useState, useEffect, ReactNode } from 'react';
import NFTCard from '@/app/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/app/components/Loader';
import { 
  Search, 
  Filter, 
  Trophy,
  Users,
  TrendingUp,
  Star,
  Sparkles,
  SlidersHorizontal,
  X,
  Award,
  Target
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

// Extended NFTMetadata type for sports
interface SportsNFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ value?: string }>;
}

// Use intersection type to ensure compatibility with NFTData
type SportsNFTData = NFTData & {
  metadata?: SportsNFTMetadata;
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

export default function Sports() {
  const [nfts, setNfts] = useState<SportsNFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<SportsNFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const sortOptions = [
    { id: 'recent', name: 'Recently Listed' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'name', name: 'Name A-Z' },
  ];

  const sportOptions = [
    { id: 'all', name: 'All Sports', count: nfts.length },
    { id: 'basketball', name: 'Basketball', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('basketball') || 
      nft.metadata?.description?.toLowerCase().includes('basketball') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('basketball')
      )
    ).length },
    { id: 'football', name: 'Football', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('football') || 
      nft.metadata?.description?.toLowerCase().includes('football') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('football')
      )
    ).length },
    { id: 'soccer', name: 'Soccer', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('soccer') || 
      nft.metadata?.description?.toLowerCase().includes('soccer') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('soccer')
      )
    ).length },
    { id: 'baseball', name: 'Baseball', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('baseball') || 
      nft.metadata?.description?.toLowerCase().includes('baseball') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('baseball')
      )
    ).length },
  ];

  const typeOptions = [
    { id: 'all', name: 'All Types', count: nfts.length },
    { id: 'player', name: 'Player Cards', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('player') || 
      nft.metadata?.description?.toLowerCase().includes('player') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('player')
      )
    ).length },
    { id: 'moment', name: 'Moments', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('moment') || 
      nft.metadata?.description?.toLowerCase().includes('moment') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('moment')
      )
    ).length },
    { id: 'highlight', name: 'Highlights', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('highlight') || 
      nft.metadata?.description?.toLowerCase().includes('highlight') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('highlight')
      )
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Filter for sports NFTs based on metadata analysis
        const sportsNFTs = allNFTs.filter(nft => {
          // Check if NFT has sports-related metadata
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          // Sports-related keywords
          const sportsKeywords = [
            'sports', 'sport', 'athlete', 'player', 'team',
            'basketball', 'football', 'soccer', 'baseball', 'hockey',
            'moment', 'highlight', 'card', 'trading', 'collectible',
            'championship', 'game', 'match', 'tournament', 'league'
          ];
          
          return sportsKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => 
              attr.value?.toString().toLowerCase().includes(keyword)
            )
          );
        }) as SportsNFTData[];
        
        setNfts(sportsNFTs);
        setFilteredNfts(sportsNFTs);
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

    // Apply sport filter
    if (selectedSport !== 'all') {
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        const attributes = nft.metadata?.attributes || [];
        
        return name.includes(selectedSport) || 
               description.includes(selectedSport) ||
               attributes.some(attr => attr.value?.toString().toLowerCase().includes(selectedSport));
      });
    }

    // Apply type filter
    if (selectedType !== 'all') {
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        const attributes = nft.metadata?.attributes || [];
        
        return name.includes(selectedType) || 
               description.includes(selectedType) ||
               attributes.some(attr => attr.value?.toString().toLowerCase().includes(selectedType));
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
  }, [nfts, searchQuery, sortBy, selectedSport, selectedType]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setSelectedSport('all');
    setSelectedType('all');
  };

  const sportsStats = {
    totalItems: nfts.length,
    totalVolume: nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0),
    averagePrice: nfts.length > 0 ? nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0) / nfts.length : 0,
    athletes: new Set(nfts.map(nft => nft.owner)).size
  };

  const featuredTeams = [
    { name: 'Tigers', sport: 'Baseball', items: 45, icon: '⚾' },
    { name: 'Raptors', sport: 'Basketball', items: 32, icon: '🏀' },
    { name: 'Gladiators', sport: 'Football', items: 28, icon: '🏈' },
    { name: 'Strikers', sport: 'Soccer', items: 51, icon: '⚽' },
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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 text-white">
              <Trophy className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
          >
            Sports Collectibles
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Own legendary sports moments, player cards, and exclusive highlights. 
            Collect, trade, and own a piece of sports history as digital assets.
          </motion.p>
          
          {/* Sports Stats */}
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { value: sportsStats.totalItems, label: 'Collectibles' },
              { value: `$${sportsStats.totalVolume.toFixed(0)}`, label: 'Total Volume' },
              { value: `$${sportsStats.averagePrice.toFixed(2)}`, label: 'Avg Price' },
              { value: sportsStats.athletes, label: 'Athletes' }
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

        {/* Featured Teams */}
        <AnimatedSection className="mb-12">
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Teams</h2>
          </motion.div>
          <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTeams.map((team, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {team.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {team.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {team.sport}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{team.items} items</span>
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
                placeholder="Search players, teams, or moments..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Sort By */}
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
              Sports Filters
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
                  <Sparkles className="w-5 h-5 text-red-600" />
                  Filter Sports Collectibles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sport Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Sport Type
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {sportOptions.map((sport) => (
                        <motion.button
                          key={sport.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSport(sport.id)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedSport === sport.id
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {sport.name} ({sport.count})
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Collectible Type
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {typeOptions.map((type) => (
                        <motion.button
                          key={type.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedType(type.id)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedType === type.id
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {type.name} ({type.count})
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
              Showing {filteredNfts.length} sports collectibles
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Sports Collectibles Grid */}
        <AnimatedSection>
          {loading ? (
            <Loader message="Loading sports collectibles..." />
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
              <Trophy className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No sports collectibles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedSport !== 'all' || selectedType !== 'all'
                  ? "No sports collectibles match your search criteria"
                  : "Be the first to create sports NFTs!"
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:from-red-500 hover:to-orange-500 transition-all duration-300"
              >
                {searchQuery || selectedSport !== 'all' || selectedType !== 'all' ? 'Clear Filters' : 'Create Sports NFT'}
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
              Load More Collectibles
            </motion.button>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}