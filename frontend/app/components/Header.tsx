'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Search, Plus, Compass, User } from 'lucide-react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { address } = useAccount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31-1.19-6-4.98-6-9V8.3l6-3.3 6 3.3V11c0 4.02-2.69 7.81-6 9z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
              NFT Market
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, collections, and accounts"
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
              />
            </div>
          </form>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {/* Explore */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Compass className="h-4 w-4" />
              <span>Explore</span>
            </Link>

            {/* Create */}
            <Link
              href="/create"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Link>

            {/* Profile - Only show when wallet is connected */}
            {address && (
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            )}

            {/* Wallet Connect Button */}
            <div className="ml-2">
              <ConnectButton 
                showBalance={false}
                chainStatus="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}