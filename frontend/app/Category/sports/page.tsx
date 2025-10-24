'use client';

import { useState, useEffect } from 'react';
import NFTCard from '@/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/components/Loader';
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

export default function Sports() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
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
        });
        
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
        <section className="text-center py-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 text-white">
              <Trophy className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Sports Collectibles
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Own legendary sports moments, player cards, and exclusive highlights. 
            Collect, trade, and own a piece of sports history as digital assets.
          </p>
          
          {/* Sports Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{sportsStats.totalItems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Collectibles</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${sportsStats.totalVolume.toFixed(0)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${sportsStats.averagePrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Price</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{sportsStats.athletes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Athletes</div>
            </div>
          </div>
        </section>

        {/* Featured Teams */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Teams</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTeams.map((team, index) => (
              <div
                key={index}
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
                placeholder="Search players, teams, or moments..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
              Sports Filters
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
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
                      <button
                        key={sport.id}
                        onClick={() => setSelectedSport(sport.id)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                          selectedSport === sport.id
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {sport.name} ({sport.count})
                      </button>
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
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                          selectedType === type.id
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {type.name} ({type.count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredNfts.length} sports collectibles
          </div>
        </div>

        {/* Sports Collectibles Grid */}
        <section>
          {loading ? (
            <Loader message="Loading sports collectibles..." />
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
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:from-red-500 hover:to-orange-500 transition-all duration-300"
              >
                {searchQuery || selectedSport !== 'all' || selectedType !== 'all' ? 'Clear Filters' : 'Create Sports NFT'}
              </button>
            </div>
          )}
        </section>

        {/* Load More */}
        {filteredNfts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              Load More Collectibles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}