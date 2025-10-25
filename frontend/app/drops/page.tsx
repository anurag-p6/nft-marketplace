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
  Target,
  Search,
  AlertCircle,
  PieChart,
  Activity,
  Shield,
  BadgeCheck
} from 'lucide-react';

type Drop = {
  id: string;
  project: string;
  artist: string;
  start: string;
  end?: string;
  mintPriceUSD: number;
  supply: number;
  minted: number;
  category: 'Art' | 'Gaming' | 'Music' | 'Sports' | 'VirtualWorld' | 'Other';
  verified?: boolean;
  blueChip?: boolean;
  floorAfter?: number;
  image?: string;
  trending?: boolean;
  featured?: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
  marketCap?: number;
  totalVolume?: number;
};

type Stat = { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  change?: string;
  description?: string;
};

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
          className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {minted} / {supply} minted ({pct}%)
      </div>
    </div>
  );
}

function RiskIndicator({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const colors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[level]}`}>
      {level} Risk
    </span>
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
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(drop.category)} opacity-3 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Status badges */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          {drop.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium"
            >
              <Star className="w-3 h-3" />
              Featured
            </motion.div>
          )}
          <RiskIndicator level={drop.riskLevel} />
        </div>
        
        <div className="flex gap-1">
          {drop.trending && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
            >
              <Flame className="w-3 h-3" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {drop.project}
            </h3>
            {drop.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <BadgeCheck className="w-4 h-4 text-blue-500" />
              </motion.div>
            )}
            {drop.blueChip && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Shield className="w-4 h-4 text-green-500" />
              </motion.div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            by {drop.artist}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(drop.category)} text-white`}>
              {drop.category}
            </span>
            {drop.marketCap && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                MC: ${(drop.marketCap / 1000).toFixed(1)}K
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-gray-900 dark:text-white">${drop.mintPriceUSD.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">{drop.supply.toLocaleString()}</span>
              </div>
            </div>

            {mode === 'live' && (
              <ProgressBar minted={drop.minted} supply={drop.supply} />
            )}
          </div>
        </div>

        <div className="text-right min-w-[120px]">
          <div className="flex items-center gap-1 justify-end text-xs text-gray-500 dark:text-gray-400 mb-1">
            <Clock className="w-3 h-3" />
            {timeLabel}
          </div>
          <div className={`text-sm font-semibold ${
            mode === 'live' ? 'text-red-500' : 
            mode === 'upcoming' ? 'text-blue-500' : 
            'text-gray-500'
          }`}>
            {mode === 'past' ? (drop.floorAfter ? `$${drop.floorAfter}` : '—') : remaining}
          </div>

          {drop.floorAfter && mode === 'past' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current floor
            </div>
          )}

          <div className="mt-4 flex flex-col items-end gap-2">
            {mode === 'upcoming' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Notify
              </motion.button>
            )}
            {mode === 'live' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-300/30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Mint Now
              </motion.button>
            )}
            {mode === 'past' && (
              <Link href={`/marketplace/collections/${drop.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced mock data with more professional projects
const MOCK_DROPS: Drop[] = [
  { 
    id: 'd1', 
    project: 'Digital Renaissance', 
    artist: 'Alex Rivera Studios', 
    start: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), 
    mintPriceUSD: 250, 
    supply: 1000, 
    minted: 120, 
    category: 'Art', 
    verified: true,
    trending: true,
    featured: true,
    riskLevel: 'Low',
    marketCap: 250000,
    totalVolume: 120000
  },
  { 
    id: 'd2', 
    project: 'SkyRift Genesis', 
    artist: 'SkyRift Games', 
    start: new Date(Date.now() - 1000 * 60 * 60).toISOString(), 
    end: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), 
    mintPriceUSD: 89, 
    supply: 5000, 
    minted: 3200, 
    category: 'Gaming', 
    trending: true,
    riskLevel: 'Medium',
    marketCap: 445000,
    totalVolume: 284800
  },
  { 
    id: 'd3', 
    project: 'Harmonic Waves', 
    artist: 'Studio Vega', 
    start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), 
    end: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60).toISOString(), 
    mintPriceUSD: 75, 
    supply: 1000, 
    minted: 1000, 
    category: 'Music', 
    verified: true, 
    floorAfter: 245,
    featured: true,
    riskLevel: 'Low',
    marketCap: 245000,
    totalVolume: 75000
  },
  { 
    id: 'd4', 
    project: 'Legends Collection', 
    artist: 'SportsX Official', 
    start: new Date(Date.now() + 1000 * 60 * 30).toISOString(), 
    mintPriceUSD: 199, 
    supply: 500, 
    minted: 5, 
    category: 'Sports', 
    blueChip: true,
    riskLevel: 'Low',
    marketCap: 99500
  },
  { 
    id: 'd5', 
    project: 'Meta Estates', 
    artist: 'Virtual Holdings', 
    start: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), 
    end: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), 
    mintPriceUSD: 1250, 
    supply: 50, 
    minted: 50, 
    category: 'VirtualWorld', 
    verified: true, 
    floorAfter: 4200,
    blueChip: true,
    riskLevel: 'High',
    marketCap: 210000,
    totalVolume: 62500
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
  const [riskLevel, setRiskLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');

  const now = Date.now();

  const filtered = useMemo(() => {
    return MOCK_DROPS.filter(d => {
      if (category !== 'All' && d.category !== category) return false;
      if (minPrice !== '' && d.mintPriceUSD < Number(minPrice)) return false;
      if (maxPrice !== '' && d.mintPriceUSD > Number(maxPrice)) return false;
      if (verifiedOnly && !d.verified) return false;
      if (blueChipOnly && !d.blueChip) return false;
      if (riskLevel !== 'All' && d.riskLevel !== riskLevel) return false;
      if (startDate && new Date(d.start).getTime() < new Date(startDate).getTime()) return false;
      if (endDate && new Date(d.start).getTime() > new Date(endDate).getTime()) return false;
      if (searchQuery && !d.project.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !d.artist.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [category, minPrice, maxPrice, verifiedOnly, blueChipOnly, riskLevel, startDate, endDate, searchQuery]);

  const upcoming = filtered.filter(d => new Date(d.start).getTime() > now);
  const live = filtered.filter(d => new Date(d.start).getTime() <= now && (d.end ? new Date(d.end).getTime() > now : true));
  const past = filtered.filter(d => d.end ? new Date(d.end).getTime() < now : false);

  const stats: Stat[] = [
    { 
      label: 'Market Volume', 
      value: '$2.4M', 
      icon: <TrendingUp className="w-4 h-4" />, 
      change: '+12.4%',
      description: '24h total volume'
    },
    { 
      label: 'Active Drops', 
      value: '24', 
      icon: <Activity className="w-4 h-4" />, 
      change: '+3',
      description: 'Live collections'
    },
    { 
      label: 'Avg. Price', 
      value: '$185', 
      icon: <DollarSign className="w-4 h-4" />, 
      change: '+5.2%',
      description: 'Mean mint price'
    },
    { 
      label: 'Success Rate', 
      value: '78%', 
      icon: <PieChart className="w-4 h-4" />, 
      change: '+8%',
      description: 'Sold out collections'
    },
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
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Professional NFT Marketplace
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                NFT Drops Dashboard
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl"
              >
                Advanced analytics and discovery platform for professional NFT collectors and investors.
              </motion.p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative lg:w-80"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </motion.div>
          </div>
        </motion.header>

        {/* Market Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  {stat.icon}
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                {stat.change && (
                  <span className="text-sm font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              {stat.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              )}
            </motion.div>
          ))}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial="initial"
            animate="animate"
            variants={slideInLeft}
            className="lg:col-span-1 space-y-6"
          >
            {/* Filters Card */}
            <motion.div
              variants={scaleIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Category
                  </label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Risk Level
                  </label>
                  <select 
                    value={riskLevel} 
                    onChange={(e) => setRiskLevel(e.target.value)} 
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>All</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Price Range (USD)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Min" 
                      type="number" 
                      value={minPrice} 
                      onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                      className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input 
                      placeholder="Max" 
                      type="number" 
                      value={maxPrice} 
                      onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                      className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={verifiedOnly} 
                      onChange={e => setVerifiedOnly(e.target.checked)} 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                    Verified projects only
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={blueChipOnly} 
                      onChange={e => setBlueChipOnly(e.target.checked)} 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Shield className="w-4 h-4 text-green-500" />
                    Blue-chip collections
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
                    setRiskLevel('All');
                    setSearchQuery('');
                  }} 
                  className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  Clear all filters
                </motion.button>
              </div>
            </motion.div>

            {/* Market Insights */}
            <motion.div
              variants={scaleIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Market Insights</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Market Trend</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    NFT volume up 24% this week. Art and Gaming sectors leading growth.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Risk Advisory</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    High-risk drops show 68% failure rate. Consider verified projects.
                  </p>
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
              className="bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all' as const, label: 'All Drops', count: filtered.length },
                  { id: 'live' as const, label: 'Live Minting', count: live.length, icon: <Flame className="w-4 h-4" /> },
                  { id: 'upcoming' as const, label: 'Upcoming', count: upcoming.length, icon: <Clock className="w-4 h-4" /> },
                  { id: 'past' as const, label: 'Past Drops', count: past.length, icon: <Calendar className="w-4 h-4" /> }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
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
                      No matching drops found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Adjust your filters or search criteria to see more results
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.section>
        </div>
      </main>
    </div>
  );
}