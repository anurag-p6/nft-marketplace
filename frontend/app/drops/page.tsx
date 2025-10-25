'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Flame, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Crown,
  Filter,
  Zap,
  Star,
  Award,
  Sparkles,
  Eye,
  Wallet,
  BarChart3,
  Target
} from 'lucide-react';

type Drop = {
  id: string;
  project: string;
  artist: string;
  start: string; // ISO
  end?: string; // optional ISO
  mintPriceUSD: number;
  supply: number;
  minted: number;
  category: 'Art' | 'Gaming' | 'Music' | 'Sports' | 'VirtualWorld' | 'Other';
  verified?: boolean;
  blueChip?: boolean;
  floorAfter?: number; // for past drops
  image?: string;
  trending?: boolean;
  featured?: boolean;
};

type Stat = { label: string; value: string; icon: React.ReactNode; change?: string };

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
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
  exit: { opacity: 0, scale: 0.9 }
};

const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 }
};

const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 }
};

function useCountdown(targetIso: string | undefined) {
  const [remainingMs, setRemainingMs] = useState<number>(() => {
    if (!targetIso) return 0;
    return Math.max(new Date(targetIso).getTime() - Date.now(), 0);
  });

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();
    const tick = () => setRemainingMs(Math.max(target - Date.now(), 0));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const seconds = Math.floor((remainingMs / 1000) % 60);
  const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
  const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

  return { remainingMs, days, hours, minutes, seconds, isExpired: remainingMs <= 0 };
}

function formatCountdown({ days, hours, minutes, seconds }: ReturnType<typeof useCountdown>) {
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function ProgressBar({ minted, supply }: { minted: number; supply: number }) {
  const pct = Math.min(100, Math.round((minted / Math.max(1, supply)) * 100));
  return (
    <div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {minted} / {supply} minted ({pct}%)
      </div>
    </div>
  );
}

function DropCard({ drop, mode }: { drop: Drop; mode: 'upcoming' | 'live' | 'past' }) {
  const countdown = useCountdown(mode === 'past' ? drop.end : drop.start);
  const timeLabel = mode === 'live' ? 'Time remaining' : mode === 'upcoming' ? 'Starts in' : 'Ended';
  const remaining = formatCountdown(countdown);

  const getCategoryColor = (category: string) => {
    const colors = {
      Art: 'from-purple-500 to-pink-500',
      Gaming: 'from-blue-500 to-cyan-500',
      Music: 'from-green-500 to-emerald-500',
      Sports: 'from-orange-500 to-red-500',
      VirtualWorld: 'from-indigo-500 to-purple-500',
      Other: 'from-gray-500 to-gray-600'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(drop.category)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Trending badge */}
      {drop.trending && (
        <div className="absolute top-3 right-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
          >
            <Flame className="w-3 h-3" />
            Trending
          </motion.div>
        </div>
      )}

      {/* Featured badge */}
      {drop.featured && (
        <div className="absolute top-3 left-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium"
          >
            <Star className="w-3 h-3" />
            Featured
          </motion.div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {drop.project}
            </h3>
            {drop.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
              </motion.div>
            )}
            {drop.blueChip && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Crown className="w-4 h-4 text-yellow-500" />
              </motion.div>
            )}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            by {drop.artist} • 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(drop.category)} text-white`}>
              {drop.category}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-gray-900 dark:text-white">${drop.mintPriceUSD.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Supply: {drop.supply}</span>
              </div>
            </div>

            {mode === 'live' && (
              <div className="w-full">
                <ProgressBar minted={drop.minted} supply={drop.supply} />
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 justify-end text-xs text-gray-500 dark:text-gray-400 mb-1">
            <Clock className="w-3 h-3" />
            {timeLabel}
          </div>
          <div className={`text-sm font-semibold ${
            mode === 'live' ? 'text-red-500 animate-pulse' : 
            mode === 'upcoming' ? 'text-blue-500' : 
            'text-gray-500'
          }`}>
            {mode === 'past' ? (drop.floorAfter ? `$${drop.floorAfter} floor` : '—') : remaining}
          </div>

          <div className="mt-4 flex flex-col items-end gap-2">
            {mode === 'upcoming' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert(`Remind set for ${drop.project}`)}
                className="px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Notify Me
              </motion.button>
            )}
            {mode === 'live' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert(`Minting ${drop.project}`)}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-300 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Mint Now
                </motion.button>
              </>
            )}
            {mode === 'past' && (
              <Link href={`/marketplace/collections/${drop.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Collection
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced mock data
const MOCK_DROPS: Drop[] = [
  { 
    id: 'd1', 
    project: 'Neon Canvas', 
    artist: 'A. Rivera', 
    start: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), 
    mintPriceUSD: 50, 
    supply: 1000, 
    minted: 120, 
    category: 'Art', 
    verified: true,
    trending: true,
    featured: true
  },
  { 
    id: 'd2', 
    project: 'SkyRift Exo Blade', 
    artist: 'SkyRift Studio', 
    start: new Date(Date.now() - 1000 * 60 * 60).toISOString(), 
    end: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), 
    mintPriceUSD: 12, 
    supply: 500, 
    minted: 320, 
    category: 'Gaming', 
    trending: true
  },
  { 
    id: 'd3', 
    project: 'Aurora Beats Drop', 
    artist: 'S. Vega', 
    start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), 
    end: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60).toISOString(), 
    mintPriceUSD: 8, 
    supply: 300, 
    minted: 300, 
    category: 'Music', 
    verified: true, 
    floorAfter: 18,
    featured: true
  },
  { 
    id: 'd4', 
    project: 'Legends Moment', 
    artist: 'SportsX', 
    start: new Date(Date.now() + 1000 * 60 * 30).toISOString(), 
    mintPriceUSD: 5, 
    supply: 100, 
    minted: 5, 
    category: 'Sports', 
    blueChip: true 
  },
  { 
    id: 'd5', 
    project: 'Parcel A-12', 
    artist: 'MetaWorld', 
    start: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), 
    end: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), 
    mintPriceUSD: 300, 
    supply: 10, 
    minted: 10, 
    category: 'VirtualWorld', 
    verified: true, 
    floorAfter: 420,
    blueChip: true
  },
];

export default function DropsPage() {
  const [category, setCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [blueChipOnly, setBlueChipOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');

  const now = Date.now();

  const filtered = useMemo(() => {
    return MOCK_DROPS.filter(d => {
      if (category !== 'All' && d.category !== category) return false;
      if (minPrice !== '' && d.mintPriceUSD < Number(minPrice)) return false;
      if (maxPrice !== '' && d.mintPriceUSD > Number(maxPrice)) return false;
      if (verifiedOnly && !d.verified) return false;
      if (blueChipOnly && !d.blueChip) return false;
      if (startDate && new Date(d.start).getTime() < new Date(startDate).getTime()) return false;
      if (endDate && new Date(d.start).getTime() > new Date(endDate).getTime()) return false;
      return true;
    });
  }, [category, minPrice, maxPrice, verifiedOnly, blueChipOnly, startDate, endDate]);

  const upcoming = filtered.filter(d => new Date(d.start).getTime() > now);
  const live = filtered.filter(d => new Date(d.start).getTime() <= now && (d.end ? new Date(d.end).getTime() > now : true));
  const past = filtered.filter(d => d.end ? new Date(d.end).getTime() < now : false);

  const stats: Stat[] = [
    { label: '24h Volume', value: 'Ξ 120', icon: <TrendingUp className="w-4 h-4" />, change: '+12%' },
    { label: '7d Volume', value: 'Ξ 980', icon: <BarChart3 className="w-4 h-4" />, change: '+24%' },
    { label: '30d Volume', value: 'Ξ 3,420', icon: <Target className="w-4 h-4" />, change: '+18%' },
    { label: 'Traders (24h)', value: '1,240', icon: <Users className="w-4 h-4" />, change: '+8%' },
    { label: 'Avg Sale', value: '$75', icon: <DollarSign className="w-4 h-4" />, change: '+5%' },
  ];

  const getDisplayDrops = () => {
    switch (activeTab) {
      case 'live': return live;
      case 'upcoming': return upcoming;
      case 'past': return past;
      default: return filtered;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Live NFT Drops
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Discover NFT Drops
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Find upcoming, live and past drops. Filter by category, price, date and more to discover your next NFT gem.
          </motion.p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Filters & Stats */}
          <motion.aside
            initial="initial"
            animate="animate"
            variants={slideInLeft}
            className="lg:col-span-1 space-y-6"
          >
            {/* Filters */}
            <motion.div
              variants={scaleIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option>All</option>
                    <option>Art</option>
                    <option>Gaming</option>
                    <option>Music</option>
                    <option>Sports</option>
                    <option>VirtualWorld</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range ($)</label>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Min" 
                      type="number" 
                      value={minPrice} 
                      onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                      className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <input 
                      placeholder="Max" 
                      type="number" 
                      value={maxPrice} 
                      onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                      className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-2"
                  />
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={verifiedOnly} 
                      onChange={e => setVerifiedOnly(e.target.checked)} 
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Verified artists only
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={blueChipOnly} 
                      onChange={e => setBlueChipOnly(e.target.checked)} 
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Crown className="w-4 h-4 text-yellow-500" />
                    Blue-chip projects
                  </label>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { 
                    setCategory('All'); 
                    setMinPrice('' as any); 
                    setMaxPrice('' as any); 
                    setStartDate(''); 
                    setEndDate(''); 
                    setVerifiedOnly(false); 
                    setBlueChipOnly(false); 
                  }} 
                  className="w-full p-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset filters
                </motion.button>
              </div>
            </motion.div>

            {/* Market Overview */}
            <motion.div
              variants={scaleIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Market Overview</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {stat.icon}
                      <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">{stat.value}</div>
                    {stat.change && (
                      <div className="text-xs text-green-500 font-medium">{stat.change}</div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-purple-500" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Your Stats</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Portfolio:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$1,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">NFTs owned:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total spent:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$2,200</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.aside>

          {/* Main Content */}
          <motion.section
            initial="initial"
            animate="animate"
            variants={slideInRight}
            className="lg:col-span-3 space-y-8"
          >
            {/* Tab Navigation */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex space-x-1">
                {[
                  { id: 'all' as const, label: 'All Drops', count: filtered.length },
                  { id: 'live' as const, label: 'Live Now', count: live.length, icon: <Flame className="w-4 h-4" /> },
                  { id: 'upcoming' as const, label: 'Upcoming', count: upcoming.length, icon: <Clock className="w-4 h-4" /> },
                  { id: 'past' as const, label: 'Past Drops', count: past.length, icon: <Calendar className="w-4 h-4" /> }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Drops Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <AnimatePresence>
                    {getDisplayDrops().map((drop, index) => (
                      <DropCard 
                        key={drop.id} 
                        drop={drop} 
                        mode={activeTab === 'all' ? 
                          (new Date(drop.start).getTime() > now ? 'upcoming' : 
                           (drop.end && new Date(drop.end).getTime() < now ? 'past' : 'live')) : 
                          activeTab} 
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {getDisplayDrops().length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
                  >
                    <Award className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      No drops found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Try adjusting your filters to see more results
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Additional Analytics */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Collection Analytics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Floor Price (30d)', value: '$42', change: '+5%' },
                  { label: 'Volume trend', value: '+12% (7d)', change: '↑' },
                  { label: 'Holder distribution', value: 'Top 10 hold 24%', change: 'Stable' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">{stat.value}</div>
                    <div className={`text-xs font-medium ${
                      stat.change.includes('+') || stat.change === '↑' ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Wallet Insights</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Gas fees spent:</div>
                    <div className="font-semibold text-gray-900 dark:text-white">Ξ 0.85</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Minting activity:</div>
                    <div className="font-semibold text-gray-900 dark:text-white">5 mints this month</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}