'use client';

import { useState, useEffect, useRef } from 'react';
import NFTCard from '@/components/NFTCard';
import { getAllNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/components/Loader';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  X,
  Music as MusicIcon,
  Play,
  Pause,
  Headphones,
  Mic2,
  Disc,
  TrendingUp,
  Users,
  Sparkles
} from 'lucide-react';

function AudioPlayer({ audioUrl }: { audioUrl?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />
      
      <button
        onClick={togglePlay}
        disabled={!audioUrl}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
          audioUrl
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </button>

      <div className="flex-1">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-purple-600 h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Music() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');

  const sortOptions = [
    { id: 'recent', name: 'Recently Listed' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'name', name: 'Name A-Z' },
  ];

  const musicGenres = [
    { id: 'all', name: 'All Music', count: nfts.length },
    { id: 'electronic', name: 'Electronic', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('electronic') || 
      nft.metadata?.description?.toLowerCase().includes('electronic') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('electronic')
      )
    ).length },
    { id: 'hiphop', name: 'Hip Hop', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('hip hop') || 
      nft.metadata?.description?.toLowerCase().includes('hip hop') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('hip hop')
      )
    ).length },
    { id: 'rock', name: 'Rock', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('rock') || 
      nft.metadata?.description?.toLowerCase().includes('rock') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('rock')
      )
    ).length },
    { id: 'classical', name: 'Classical', count: nfts.filter(nft => 
      nft.metadata?.name?.toLowerCase().includes('classical') || 
      nft.metadata?.description?.toLowerCase().includes('classical') ||
      nft.metadata?.attributes?.some(attr => 
        attr.value?.toString().toLowerCase().includes('classical')
      )
    ).length },
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        
        // Filter for music NFTs based on metadata analysis
        const musicNFTs = allNFTs.filter(nft => {
          // Check if NFT has music-related metadata
          const name = nft.metadata?.name?.toLowerCase() || '';
          const description = nft.metadata?.description?.toLowerCase() || '';
          const attributes = nft.metadata?.attributes || [];
          
          // Music-related keywords
          const musicKeywords = [
            'music', 'song', 'track', 'audio', 'sound', 'beat',
            'melody', 'rhythm', 'instrument', 'vocal', 'album',
            'single', 'ep', 'lp', 'remix', 'mix', 'producer',
            'artist', 'band', 'singer', 'composer', 'dj'
          ];
          
          return musicKeywords.some(keyword => 
            name.includes(keyword) || 
            description.includes(keyword) ||
            attributes.some(attr => 
              attr.value?.toString().toLowerCase().includes(keyword)
            )
          );
        });
        
        setNfts(musicNFTs);
        setFilteredNfts(musicNFTs);
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

    // Apply genre filter
    if (selectedGenre !== 'all') {
      results = results.filter(nft => {
        const name = nft.metadata?.name?.toLowerCase() || '';
        const description = nft.metadata?.description?.toLowerCase() || '';
        const attributes = nft.metadata?.attributes || [];
        
        switch (selectedGenre) {
          case 'electronic':
            return name.includes('electronic') || 
                   description.includes('electronic') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('electronic'));
          case 'hiphop':
            return name.includes('hip hop') || 
                   description.includes('hip hop') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('hip hop'));
          case 'rock':
            return name.includes('rock') || 
                   description.includes('rock') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('rock'));
          case 'classical':
            return name.includes('classical') || 
                   description.includes('classical') ||
                   attributes.some(attr => attr.value?.toString().toLowerCase().includes('classical'));
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
  }, [nfts, searchQuery, sortBy, selectedGenre]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setSelectedGenre('all');
  };

  const musicStats = {
    totalTracks: nfts.length,
    totalVolume: nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0),
    averagePrice: nfts.length > 0 ? nfts.reduce((sum, nft) => sum + (nft.listing?.priceUSD || 0), 0) / nfts.length : 0,
    artists: new Set(nfts.map(nft => nft.owner)).size
  };

  const featuredAlbums = [
    { name: 'Synthwave Drops', tracks: 8, artist: 'Various Artists', icon: '🎹' },
    { name: 'Acoustic Sessions', tracks: 6, artist: 'Indie Collective', icon: '🎸' },
    { name: 'Electronic Dreams', tracks: 10, artist: 'Digital Waves', icon: '🎧' },
    { name: 'Urban Beats', tracks: 12, artist: 'City Sounds', icon: '🎤' },
  ];

  // Demo audio tracks for preview
  const demoAudioTracks = [
    {
      id: '1',
      title: 'Aurora Beats',
      artist: 'S. Vega',
      duration: '2:45',
      audioUrl: '/audio/sample1.mp3' // You can add actual audio files in public/audio/
    },
    {
      id: '2',
      title: 'Echoes',
      artist: 'R. Snow',
      duration: '3:10',
      audioUrl: '/audio/sample2.mp3'
    },
    {
      id: '3',
      title: 'Neon Dreams',
      artist: 'Digital Waves',
      duration: '4:22',
      audioUrl: '/audio/sample3.mp3'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <MusicIcon className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Music NFTs
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover exclusive audio collectibles, albums, and music drops with built-in royalty systems. 
            Own a piece of music history and support artists directly.
          </p>
          
          {/* Music Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{musicStats.totalTracks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Music Tracks</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${musicStats.totalVolume.toFixed(0)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${musicStats.averagePrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Price</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{musicStats.artists}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Artists</div>
            </div>
          </div>
        </section>

        {/* Featured Albums */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Disc className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Albums</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAlbums.map((album, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {album.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {album.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {album.artist}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Headphones className="w-4 h-4" />
                  <span>{album.tracks} tracks</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Audio Previews Section */}
        <section className="mb-12 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Headphones className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Listen to Previews</h2>
          </div>
          <div className="space-y-4">
            {demoAudioTracks.map((track) => (
              <div key={track.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{track.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mic2 className="w-3 h-3" />
                    {track.artist} • {track.duration}
                  </div>
                </div>
                <div className="w-64">
                  <AudioPlayer audioUrl={track.audioUrl} />
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
                placeholder="Search music tracks, artists, or albums..."
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
              Music Genres
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Music Genre Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Filter by Music Genre
              </h3>
              <div className="flex flex-wrap gap-2">
                {musicGenres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedGenre === genre.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {genre.name} ({genre.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredNfts.length} music tracks
          </div>
        </div>

        {/* Music NFTs Grid */}
        <section>
          {loading ? (
            <Loader message="Loading music tracks..." />
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
              <MusicIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No music tracks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedGenre !== 'all'
                  ? "No music tracks match your search criteria"
                  : "Be the first to create music NFTs!"
                }
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                {searchQuery || selectedGenre !== 'all' ? 'Clear Filters' : 'Create Music NFT'}
              </button>
            </div>
          )}
        </section>

        {/* Royalty Information */}
        <section className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Artist Royalties</h2>
          </div>
          <p className="mb-4 opacity-90">
            Each music NFT includes built-in royalty systems that automatically pay artists on secondary sales. 
            Support your favorite musicians directly and own a piece of their creative journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-10 p-3 rounded-lg">
              <div className="font-semibold">Primary Sales</div>
              <div>Artists receive 100% of initial sale</div>
            </div>
            <div className="bg-white bg-opacity-10 p-3 rounded-lg">
              <div className="font-semibold">Secondary Sales</div>
              <div>10% royalty on all resales</div>
            </div>
            <div className="bg-white bg-opacity-10 p-3 rounded-lg">
              <div className="font-semibold">Lifetime Earnings</div>
              <div>Continuous revenue for artists</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}