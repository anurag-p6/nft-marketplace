'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  Target, 
  Sparkles,
  Flame,
  Crown,
  Zap,
  ArrowUp,
  ArrowDown,
  Eye,
  Wallet,
  Activity,
  Award,
  Clock,
  Filter,
  ChevronRight
} from 'lucide-react';

type Stat = { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down';
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
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

const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

function StatCard({ label, value, icon, change, trend }: Stat) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
            trend === 'up' 
              ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
              : 'text-red-600 bg-red-50 dark:bg-red-900/20'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

function Sparkline({ points = [3,6,4,8,5,9,6], positive = true }: { points?: number[]; positive?: boolean }) {
  const max = Math.max(...points);
  const w = 120;
  const h = 36;
  const step = w / Math.max(1, points.length - 1);
  const coords = points.map((p, i) => `${i * step},${h - (p / max) * h}`).join(' ');
  const gradientId = `sparkline-gradient-${positive ? 'green' : 'red'}`;
  
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={positive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? "#10b981" : "#ef4444"} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <polyline 
        points={coords} 
        fill={`url(#${gradientId})`} 
        stroke={positive ? "#10b981" : "#ef4444"} 
        strokeWidth={2} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

function PerformanceCard({ item, index, showSparkline = false }: { 
  item: any; 
  index: number;
  showSparkline?: boolean;
}) {
  const isPositive = item.change?.startsWith('+');
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {index + 1}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {item.name}
          </div>
          {item.volume && (
            <div className="text-xs text-gray-500 dark:text-gray-400">Vol: {item.volume}</div>
          )}
          {item.floor && (
            <div className="text-xs text-gray-500 dark:text-gray-400">Floor: {item.floor}</div>
          )}
          {item.price && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.price}</div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {showSparkline && <Sparkline positive={isPositive} />}
        {item.change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {item.change}
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
      </div>
    </motion.div>
  );
}

export default function StatsPage() {
  const marketOverview: Stat[] = [
    { 
      label: '24h Volume', 
      value: 'Ξ 120', 
      icon: <Activity className="w-5 h-5" />,
      change: '+12%',
      trend: 'up'
    },
    { 
      label: '7d Volume', 
      value: 'Ξ 980', 
      icon: <BarChart3 className="w-5 h-5" />,
      change: '+24%',
      trend: 'up'
    },
    { 
      label: '30d Volume', 
      value: 'Ξ 3,420', 
      icon: <Target className="w-5 h-5" />,
      change: '+18%',
      trend: 'up'
    },
    { 
      label: 'Traders (24h)', 
      value: '1,240', 
      icon: <Users className="w-5 h-5" />,
      change: '+8%',
      trend: 'up'
    },
    { 
      label: 'Avg Sale', 
      value: '$75', 
      icon: <DollarSign className="w-5 h-5" />,
      change: '+5%',
      trend: 'up'
    },
    { 
      label: 'Market Cap', 
      value: '$1.2M', 
      icon: <TrendingUp className="w-5 h-5" />,
      change: '+15%',
      trend: 'up'
    },
  ];

  const topPerformers = [
    { id: 'c1', name: 'Neon Canvas', change: '+42%', volume: 'Ξ 320' },
    { id: 'c2', name: 'SkyRift', change: '+31%', volume: 'Ξ 210' },
    { id: 'c3', name: 'Aurora Beats', change: '+18%', volume: 'Ξ 90' },
  ];

  const trending = [
    { id: 't1', name: 'Emerging Digital Artists', floor: '$12', change: '+25%' },
    { id: 't2', name: 'Play2Earn Showcases', floor: '$4', change: '+18%' },
  ];

  const newlyListed = [
    { id: 'n1', name: 'Parcel A-12', price: '$300' },
    { id: 'n2', name: 'Exo Blade', price: '$80' },
    { id: 'n3', name: 'Digital Dreams', price: '$45' },
  ];

  const userStats: Stat[] = [
    { 
      label: 'Portfolio value', 
      value: '$1,240', 
      icon: <Wallet className="w-5 h-5" />,
      change: '+8%',
      trend: 'up'
    },
    { 
      label: 'NFTs owned', 
      value: '12', 
      icon: <Award className="w-5 h-5" />,
      change: '+2',
      trend: 'up'
    },
    { 
      label: 'Total spent', 
      value: '$2,200', 
      icon: <DollarSign className="w-5 h-5" /> 
    },
    { 
      label: 'Total earned', 
      value: '$950', 
      icon: <TrendingUp className="w-5 h-5" />,
      change: '+15%',
      trend: 'up'
    },
    { 
      label: 'ROI', 
      value: '−56%', 
      icon: <Target className="w-5 h-5" />,
      change: '-12%',
      trend: 'down'
    },
  ];

  const quickCollections = [
    { name: 'Neon Canvas', floor: '$12', volume: 'Ξ 320' },
    { name: 'SkyRift', floor: '$8', volume: 'Ξ 210' },
    { name: 'Aurora Beats', floor: '$5', volume: 'Ξ 90' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Real-time Market Analytics
            </span>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Stats Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Market overview, collection analytics, and wallet insights
          </p>
        </motion.header>

        {/* Market Overview */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          {marketOverview.map((stat, index) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Top performers & Trending */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={slideInLeft}
            className="space-y-6"
          >
            {/* Top Performers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers (24h)</h2>
                </div>
                <Link href="/stats/top" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1">
                  See all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <motion.div variants={staggerContainer} className="space-y-3">
                {topPerformers.map((item, index) => (
                  <PerformanceCard key={item.id} item={item} index={index} showSparkline />
                ))}
              </motion.div>
            </div>

            {/* Trending Collections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Collections</h2>
              </div>
              <motion.div variants={staggerContainer} className="space-y-3">
                {trending.map((item, index) => (
                  <PerformanceCard key={item.id} item={item} index={index} showSparkline />
                ))}
              </motion.div>
            </div>

            {/* Newly Listed */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Newly Listed</h2>
              </div>
              <motion.div variants={staggerContainer} className="space-y-3">
                {newlyListed.map((item, index) => (
                  <PerformanceCard key={item.id} item={item} index={index} />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Center: Collection Analytics */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Collection Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Collection Analytics</h2>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Floor / Volume / Sales</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Floor price (30d)', value: '$42', change: '+12%', points: [2,4,3,6,5,8,7] },
                  { label: 'Volume trends', value: '+12% (7d)', change: '+8%', points: [5,7,6,9,8,12,11] },
                  { label: 'Sales activity', value: '320 sales', change: '+15%', points: [1,3,2,4,3,5,4] },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.label}</div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">{item.value}</div>
                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-medium ${
                        item.change?.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </div>
                      <Sparkline points={item.points} positive={item.change?.startsWith('+')} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Holder distribution', value: 'Top 10 hold 24%' },
                  { label: 'Floor history', value: '$18 → $42', change: '+133%' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                    <div className="font-semibold text-gray-900 dark:text-white mt-1">{item.value}</div>
                    {item.change && (
                      <div className="text-sm text-green-600 font-medium mt-1">{item.change}</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Collections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Collections</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {quickCollections.map((collection, index) => (
                  <motion.div
                    key={collection.name}
                    variants={scaleIn}
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                  >
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {collection.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Floor {collection.floor} • Vol {collection.volume}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: User Stats & Wallet Insights */}
          <motion.aside
            initial="initial"
            animate="animate"
            variants={slideInLeft}
            className="space-y-6"
          >
            {/* User Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Statistics</h2>
                </div>
                <Link href="/profile" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1">
                  View profile
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <motion.div variants={staggerContainer} className="space-y-4">
                {userStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={fadeInUp}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded bg-white dark:bg-gray-600">
                        {stat.icon}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{stat.label}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 dark:text-white">{stat.value}</div>
                      {stat.change && (
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          stat.trend === 'up' 
                            ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
                            : 'text-red-600 bg-red-50 dark:bg-red-900/20'
                        }`}>
                          {stat.change}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Favorite collections</h4>
                <div className="flex gap-2 flex-wrap">
                  {['Neon Canvas', 'SkyRift', 'Aurora Beats'].map((name) => (
                    <span 
                      key={name}
                      className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wallet Insights</h3>
              </div>
              
              <motion.div variants={staggerContainer} className="space-y-4 text-sm">
                {[
                  { label: 'Gas fees spent', value: 'Ξ 0.85' },
                  { label: 'Minting activity', value: '5 mints this month' },
                  { label: 'Trading frequency', value: '12 trades' },
                  { label: 'Profit / Loss', value: '−$1,250', negative: true },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    variants={fadeInUp}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
                  >
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className={`font-semibold ${
                      item.negative ? 'text-red-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
              </div>
              
              <motion.div variants={staggerContainer} className="space-y-4 text-sm">
                {[
                  { label: 'Category', options: ['All', 'Art', 'Gaming', 'Music', 'Sports'] },
                  { label: 'Date range', options: ['24h', '7d', '30d', 'All time'] },
                ].map((filter, index) => (
                  <motion.div key={filter.label} variants={fadeInUp}>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {filter.label}
                    </label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      {filter.options.map(option => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}