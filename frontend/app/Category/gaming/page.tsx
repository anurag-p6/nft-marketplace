'use client';

import { useState, useEffect } from 'react';
import NFTCard from '@/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/components/Loader';
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

export default function Gaming() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
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
        attr.value?.toString().toLowerCase().includes('character')
      )
    ).length },
    { id: 'weapon', name: 'Weapons', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('weapon') || 
      nft.metadata?.description?.toLowerCase().includes('weapon') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('weapon')
      )
    ).length },
    { id: 'armor', name: 'Armor', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('armor') || 
      nft.metadata?.description?.toLowerCase().includes('armor') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('armor')
      )
    ).length },
    { id: 'collectible', name: 'Collectibles', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('collectible') || 
      nft.metadata?.description?.toLowerCase().includes('collectible') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('collectible')
      )
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Filter for gaming NFTs based on metadata analysis
        const gamingNFTs = allNFTs.filter(nft => {
          // Check if NFT has gaming-related metadata
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          // Gaming-related keywords
          const gamingKeywords = [
            'game', 'gaming', 'character', 'weapon', 'armor', 'item',
            'rpg', 'mmo', 'pvp', 'pve', 'quest', 'level', 'xp',
            'boss', 'monster', 'dungeon', 'loot', 'reward', 'skill',
            'class', 'race', 'faction', 'guild', 'raid', 'arena'
          ];
          
          return gamingKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => 
              attr.value?.toString().toLowerCase().includes(keyword)
            )
          );
        });
        
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

    // Apply search filter
    if (searchQuery) {
      results = results.filter(nft =>
        nft.metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.metadata?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.owner?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply item type filter
    if (selectedType !== 'all') {
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        const attributes = nft.metadata?.attributes || [];
        
        switch (selectedType) {
          case 'character':
            return name.includes('character') || 
                   description.includes('character') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('character'));
          case 'weapon':
            return name.includes('weapon') || 
                   description.includes('weapon') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('weapon'));
          case 'armor':
            return name.includes('armor') || 
                   description.includes('armor') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('armor'));
          case 'collectible':
            return name.includes('collectible') || 
                   description.includes('collectible') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('collectible'));
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
          // Use token ID as proxy for recent (higher ID = newer)
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
        <section className="text-center py-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Gamepad2 className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gaming Universe
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover rare in-game items, powerful characters, and exclusive gaming assets. 
            Trade, collect, and build your ultimate gaming inventory.
          </p>
          
          {/* Gaming Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{gamingStats.totalItems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Game Items</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${gamingStats.totalVolume.toFixed(0)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${gamingStats.averagePrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Price</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{gamingStats.players}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Players</div>
            </div>
          </div>
        </section>

        {/* Featured Games */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Games</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
              <div
                key={index}
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
              </div>
            ))}
          </div>
        </section>

        {/* Search and Controls */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search game items, characters, or weapons..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Item Types
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Item Type Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Filter by Item Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {itemTypes.map((type) => (
                  <button
                    key={type.id}
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
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredNfts.length} gaming items
          </div>
        </div>

        {/* Gaming Items Grid */}
        <section>
          {loading ? (
            <Loader message="Loading gaming items..." />
          ) : filteredNfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNfts.map((nft) => (
                <NFTCard 
                  key={nft.tokenId} 
                  nft={nft} 
                  showOwner={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
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
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
              >
                {searchQuery || selectedType !== 'all' ? 'Clear Filters' : 'Create Gaming NFT'}
              </button>
            </div>
          )}
        </section>

        {/* Load More */}
        {filteredNfts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              Load More Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}