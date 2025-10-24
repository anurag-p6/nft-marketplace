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
  Palette,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function ArtCategory() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
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
        attr.value?.toString().toLowerCase().includes('digital')
      )
    ).length },
    { id: 'abstract', name: 'Abstract', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('abstract') || 
      nft.metadata?.description?.toLowerCase().includes('abstract') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('abstract')
      )
    ).length },
    { id: 'painting', name: 'Painting', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('painting') || 
      nft.metadata?.description?.toLowerCase().includes('painting') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('painting')
      )
    ).length },
    { id: 'photography', name: 'Photography', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('photo') || 
      nft.metadata?.description?.toLowerCase().includes('photo') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('photo')
      )
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Filter for art NFTs based on metadata analysis
        const artNFTs = allNFTs.filter(nft => {
          // Check if NFT has art-related metadata
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          // Art-related keywords
          const artKeywords = [
            'art', 'painting', 'digital', 'abstract', 'portrait', 'landscape',
            'drawing', 'illustration', 'sketch', 'canvas', 'gallery', 'artist',
            'masterpiece', 'creative', 'design', 'visual', 'aesthetic'
          ];
          
          return artKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => 
              attr.value?.toString().toLowerCase().includes(keyword)
            )
          );
        });
        
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
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('digital'));
          case 'abstract':
            return name.includes('abstract') || 
                   description.includes('abstract') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('abstract'));
          case 'painting':
            return name.includes('painting') || 
                   description.includes('painting') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('painting'));
          case 'photography':
            return name.includes('photo') || 
                   description.includes('photo') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('photo'));
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
          return (b.metadata?.views || 0) - (a.metadata?.views || 0);
        case 'recent':
        default:
          // Use token ID as proxy for recent (higher ID = newer)
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
        <section className="text-center py-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Palette className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Digital Art Gallery
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover extraordinary digital artworks from talented artists around the world. 
            Explore unique pieces that redefine creativity in the digital age.
          </p>
          
          {/* Art Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{artStats.totalItems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Artworks</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${artStats.totalVolume.toFixed(0)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${artStats.averagePrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Price</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{artStats.artists}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Artists</div>
            </div>
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
                placeholder="Search art pieces, artists, or descriptions..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              Art Styles
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Art Style Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Filter by Art Style
              </h3>
              <div className="flex flex-wrap gap-2">
                {artStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedStyle === style.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {style.name} ({style.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* View Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredNfts.length} digital artworks
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Artist Spotlight */}
        {nfts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Artists</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from(new Set(nfts.slice(0, 8).map(nft => nft.owner))).slice(0, 4).map((artist, index) => (
                <div
                  key={index}
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Artworks Grid */}
        <section>
          {loading ? (
            <Loader message="Loading digital artworks..." />
          ) : filteredNfts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "grid grid-cols-1 gap-6"
            }>
              {filteredNfts.map((nft) => (
                <NFTCard 
                  key={nft.tokenId} 
                  nft={nft} 
                  showOwner={true}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
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
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                {searchQuery || selectedStyle !== 'all' ? 'Clear Filters' : 'Create Art NFT'}
              </button>
            </div>
          )}
        </section>

        {/* Load More */}
        {filteredNfts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              Load More Artworks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}