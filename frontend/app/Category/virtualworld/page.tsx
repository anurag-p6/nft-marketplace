'use client';

import { useState, useEffect } from 'react';
import NFTCard from '@/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/components/Loader';

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

export default function VirtualWorld() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
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
        });
        
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
        <section className="text-center py-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 text-white">
              <Globe className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Virtual Worlds
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Own digital real estate, avatars, and wearables in the metaverse. 
            Build, explore, and trade in immersive virtual environments.
          </p>
          
          {/* Virtual World Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{virtualWorldStats.totalAssets}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Virtual Assets</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${virtualWorldStats.totalVolume.toFixed(0)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${virtualWorldStats.averagePrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Price</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{virtualWorldStats.landowners}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Landowners</div>
            </div>
          </div>
        </section>

        {/* Featured Worlds */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Worlds</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorlds.map((world, index) => (
              <div
                key={index}
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
                placeholder="Search lands, avatars, or wearables..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              Asset Types
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Asset Type Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                Filter by Asset Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category.id}
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
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredNfts.length} virtual assets
          </div>
        </div>

        {/* Virtual Assets Grid */}
        <section>
          {loading ? (
            <Loader message="Loading virtual assets..." />
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
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-blue-500 transition-all duration-300"
              >
                {searchQuery || selectedCategory !== 'all' ? 'Clear Filters' : 'Create Virtual Asset'}
              </button>
            </div>
          )}
        </section>

        {/* 3D Viewer Section */}
        <section className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Box className="w-6 h-6" />
            <h2 className="text-2xl font-bold">3D Model Viewer</h2>
          </div>
          <p className="mb-6 opacity-90">
            Preview avatars, wearables, and virtual assets in 3D. Integrate with model-viewer or three.js 
            for immersive experiences in the metaverse.
          </p>
          <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎮</div>
            <p className="text-sm opacity-80 mb-4">
              3D viewer integration placeholder — replace with your preferred 3D rendering solution
            </p>
            <div className="flex gap-3 justify-center">
              <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                View in 3D
              </button>
              <button className="px-4 py-2 border border-white text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
                AR Preview
              </button>
            </div>
          </div>
        </section>

        {/* Load More */}
        {filteredNfts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              Load More Assets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}