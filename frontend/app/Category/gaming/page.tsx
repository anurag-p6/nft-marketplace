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
  Gamepad2,
  Trophy,
  Users,
  Crown,
  Sword,
  Shield,
  Sparkles
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
type GamingNFTData = NFTData & {
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

export default function Gaming() {
  const [nfts, setNfts] = useState<GamingNFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<GamingNFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  const sortOptions = [
    { id: 'recent', name: 'Recently Listed' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'name', name: 'Name A-Z' },
  ];

  const itemTypes = [
    { id: 'all', name: 'All Items', count: nfts.length },
    { id: 'character', name: 'Characters', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('character') || 
      nft.metadata?.description?.toLowerCase().includes('character') ||
      nft.metadata?.attributes?.some(attr => 
        String(attr?.value).toLowerCase().includes('character')
      )
    ).length },
    { id: 'weapon', name: 'Weapons', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('weapon') || 
      nft.metadata?.description?.toLowerCase().includes('weapon') ||
      nft.metadata?.attributes?.some(attr => 
        String(attr?.value).toLowerCase().includes('weapon')
      )
    ).length },
    { id: 'armor', name: 'Armor', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('armor') || 
      nft.metadata?.description?.toLowerCase().includes('armor') ||
      nft.metadata?.attributes?.some(attr => 
        String(attr?.value).toLowerCase().includes('armor')
      )
    ).length },
    { id: 'collectible', name: 'Collectibles', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('collectible') || 
      nft.metadata?.description?.toLowerCase().includes('collectible') ||
      nft.metadata?.attributes?.some(attr => 
        String(attr?.value).toLowerCase().includes('collectible')
      )
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        const gamingNFTs = allNFTs.filter(nft => {
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          const gamingKeywords = [
            'game', 'gaming', 'character', 'weapon', 'armor', 'item',
            'rpg', 'mmo', 'pvp', 'pve', 'quest', 'level', 'xp',
            'boss', 'monster', 'dungeon', 'loot', 'reward', 'skill',
            'class', 'race', 'faction', 'guild', 'raid', 'arena'
          ];
          
          return gamingKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => {
              const attrValue = attr?.value?.toString().toLowerCase() || '';
              return attrValue.includes(keyword);
            })
          );
        }).map(nft => {
          // Add views property to metadata for potential future use
          return {
            ...nft,
            metadata: {
              ...nft.metadata,
              views: Math.floor(Math.random() * 1000) // Add random views for demo
            }
          };
        }) as GamingNFTData[];
        
        setNfts(gamingNFTs);
        setFilteredNfts(gamingNFTs);
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

    if (searchQuery) {
      results = results.filter(nft =>
        nft.metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.metadata?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.owner?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        const attributes = nft.metadata?.attributes || [];
        
        switch (selectedType) {
          case 'character':
            return name.includes('character') || 
                   description.includes('character') ||
                   attributes.some(attr => String(attr?.value).toLowerCase().includes('character'));
          case 'weapon':
            return name.includes('weapon') || 
                   description.includes('weapon') ||
                   attributes.some(attr => String(attr?.value).toLowerCase().includes('weapon'));
          case 'armor':
            return name.includes('armor') || 
                   description.includes('armor') ||
                   attributes.some(attr => String(attr?.value).toLowerCase().includes('armor'));
          case 'collectible':
            return name.includes('collectible') || 
                   description.includes('collectible') ||
                   attributes.some(attr => String(attr?.value).toLowerCase().includes('collectible'));
          default:
            return true;
        }
      });
    }

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
  }, [nfts, searchQuery, sortBy, selectedType]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setSelectedType('all');
  };

  const gamingStats = {
    totalItems: nfts.length,
    totalVolume: nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0),
    averagePrice: nfts.length > 0 ? nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0) / nfts.length : 0,
    players: new Set(nfts.map(nft => nft.owner)).size
  };

  const featuredGames = [
    { name: 'SkyRift', items: 45, volume: '12.5K', icon: '🎮' },
    { name: 'RealmRun', items: 32, volume: '8.2K', icon: '⚔️' },
    { name: 'ArenaX', items: 28, volume: '6.7K', icon: '🛡️' },
    { name: 'PixelQuest', items: 51, volume: '15.3K', icon: '👾' },
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
              <Gamepad2 className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Gaming Universe
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover rare in-game items, powerful characters, and exclusive gaming assets. 
            Trade, collect, and build your ultimate gaming inventory.
          </motion.p>
          
          {/* Gaming Stats */}
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { value: gamingStats.totalItems, label: 'Game Items' },
              { value: `$${gamingStats.totalVolume.toFixed(0)}`, label: 'Total Volume' },
              { value: `$${gamingStats.averagePrice.toFixed(2)}`, label: 'Avg Price' },
              { value: gamingStats.players, label: 'Players' }
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

        {/* Featured Games */}
        <AnimatedSection className="mb-12">
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Games</h2>
          </motion.div>
          <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {game.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium">{game.items}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span className="font-medium text-green-600">{game.volume} ETH</span>
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
                placeholder="Search game items, characters, or weapons..."
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
              Item Types
              {showFilters && <X className="w-4 h-4" />}
            </motion.button>
          </motion.div>

          {/* Item Type Filters */}
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
                  Filter by Item Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {itemTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedType(type.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        selectedType === type.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.id === 'weapon' && <Sword className="w-4 h-4" />}
                      {type.id === 'armor' && <Shield className="w-4 h-4" />}
                      {type.id === 'character' && <Users className="w-4 h-4" />}
                      {type.id === 'collectible' && <Crown className="w-4 h-4" />}
                      {type.name} ({type.count})
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
              Showing {filteredNfts.length} gaming items
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Gaming Items Grid */}
        <AnimatedSection>
          {loading ? (
            <Loader message="Loading gaming items..." />
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
              <Gamepad2 className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No gaming items found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedType !== 'all'
                  ? "No gaming items match your search criteria"
                  : "Be the first to create gaming NFTs!"
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
              >
                {searchQuery || selectedType !== 'all' ? 'Clear Filters' : 'Create Gaming NFT'}
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
              Load More Items
            </motion.button>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}