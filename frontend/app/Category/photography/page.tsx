'use client';

import { useState, useEffect } from 'react';
import NFTCard from '@/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/components/Loader';
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

export default function Photography() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
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
        });
        
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
        <section className="text-center py-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Camera className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Photography
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover extraordinary photographic NFTs from talented photographers around the world. 
            Own a piece of visual storytelling and support photographic artists.
          </p>
          
          {/* Photography Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{photographyStats.totalPhotos}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Photos</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${photographyStats.totalVolume.toFixed(0)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${photographyStats.averagePrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Price</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{photographyStats.photographers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Photographers</div>
            </div>
          </div>
        </section>

        {/* Featured Series */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Series</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSeries.map((series, index) => (
              <div
                key={index}
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
                placeholder="Search photos, locations, or photographers..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              Photography Styles
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Photography Style Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Filter by Photography Style
              </h3>
              <div className="flex flex-wrap gap-2">
                {photographyStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedStyle === style.id
                        ? 'bg-amber-600 text-white shadow-lg'
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

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredNfts.length} photographs
          </div>
        </div>

        {/* Photography Grid */}
        <section>
          {loading ? (
            <Loader message="Loading photographs..." />
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
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-500 hover:to-orange-500 transition-all duration-300"
              >
                {searchQuery || selectedStyle !== 'all' ? 'Clear Filters' : 'Create Photography NFT'}
              </button>
            </div>
          )}
        </section>

        {/* Load More */}
        {filteredNfts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              Load More Photos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}