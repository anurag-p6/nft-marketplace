'use client';

import { useAccount, useBalance, useEnsName } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  ExternalLink, 
  Settings, 
  Heart, 
  Clock, 
  Plus,
  Sparkles,
  Users,
  TrendingUp,
  Award,
  Wallet,
  Image as ImageIcon,
  Zap,
  Crown,
  Star
} from 'lucide-react';
import NFTCard from '@/app/components/NFTCard';
import { getUserNFTs, NFTData } from '@/utils/fetchNFTs';
import Loader from '@/app/components/Loader';

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

type TabType = 'collected' | 'created' | 'favorited' | 'activity';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('collected');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!address) return;

      setLoading(true);
      try {
        const userNFTs = await getUserNFTs(address);
        setNfts(userNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to view your profile</p>
        </motion.div>
      </div>
    );
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const profileStats = [
    { label: 'NFTs Collected', value: nfts.length.toString(), icon: <ImageIcon className="w-4 h-4" /> },
    { label: 'Collections', value: '3', icon: <Users className="w-4 h-4" /> },
    { label: 'Total Value', value: '$1,240', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Achievements', value: '5', icon: <Award className="w-4 h-4" /> },
  ];

  const tabs = [
    { id: 'collected' as TabType, name: 'Collected', icon: <ImageIcon className="w-4 h-4" />, count: nfts.length },
    { id: 'created' as TabType, name: 'Created', icon: <Plus className="w-4 h-4" />, count: 0 },
    { id: 'favorited' as TabType, name: 'Favorited', icon: <Heart className="w-4 h-4" />, count: 0 },
    { id: 'activity' as TabType, name: 'Activity', icon: <Clock className="w-4 h-4" />, count: 0 },
  ];

  const recentActivity = [
    { type: 'mint', name: 'Neon Canvas #124', time: '2 hours ago', icon: <Zap className="w-4 h-4 text-green-500" /> },
    { type: 'sale', name: 'SkyRift Exo Blade', time: '1 day ago', icon: <TrendingUp className="w-4 h-4 text-blue-500" /> },
    { type: 'like', name: 'Aurora Beats Drop', time: '3 days ago', icon: <Heart className="w-4 h-4 text-red-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                {ensName ? ensName[0].toUpperCase() : address.slice(2, 4).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-2 rounded-full shadow-lg">
                <Crown className="w-5 h-5" />
              </div>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {ensName || 'Unnamed Collector'}
                  </h1>
                  <div className="flex items-center gap-3">
                    <code className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200">
                      {truncateAddress(address)}
                    </code>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(address)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 mt-4 lg:mt-0"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              </div>

              {/* Balance & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {balance && (
                  <motion.div
                    variants={fadeInUp}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5" />
                      <span className="font-medium">Wallet Balance</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-2 gap-4"
                >
                  {profileStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      variants={scaleIn}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-center items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                        {stat.icon}
                        <span className="text-xs">{stat.label}</span>
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.aside
            initial="initial"
            animate="animate"
            variants={slideInLeft}
            className="lg:col-span-1 space-y-6"
          >
            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <span className="flex-1 text-left">{tab.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {activity.icon}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'First NFT', earned: true, icon: '🎯' },
                  { name: 'Collector', earned: true, icon: '🏆' },
                  { name: 'Trader', earned: false, icon: '💎' },
                  { name: 'Creator', earned: false, icon: '🎨' },
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      achievement.earned
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <span className="text-lg">{achievement.icon}</span>
                    <span className="text-sm font-medium">{achievement.name}</span>
                    {achievement.earned && (
                      <Star className="w-4 h-4 ml-auto fill-current" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.section
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                >
                  {activeTab === 'collected' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Your Collection
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {nfts.length} items
                        </span>
                      </div>

                      {loading ? (
                        <div className="text-center py-16">
                          <Loader message="Loading your NFTs..." />
                        </div>
                      ) : nfts.length > 0 ? (
                        <motion.div
                          variants={staggerContainer}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                          {nfts.map((nft, index) => (
                            <motion.div
                              key={nft.tokenId}
                              variants={fadeInUp}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, y: -5 }}
                            >
                              <NFTCard nft={nft} showOwner={false} />
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-16"
                        >
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            No NFTs yet
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Start collecting NFTs to build your digital art collection and see them displayed here
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/explore')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center gap-2 mx-auto"
                          >
                            <Sparkles className="w-4 h-4" />
                            Explore NFTs
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {activeTab === 'created' && (
                    <div className="text-center py-16">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <Plus className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        No creations yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Create your first NFT to showcase your digital artwork
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/create')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        <Zap className="w-4 h-4" />
                        Create NFT
                      </motion.button>
                    </div>
                  )}

                  {activeTab === 'favorited' && (
                    <div className="text-center py-16">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        No favorites yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Start exploring and add NFTs to your favorites
                      </p>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="text-center py-16">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <Clock className="w-12 h-12 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        No activity yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your trading and collection activity will appear here
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}