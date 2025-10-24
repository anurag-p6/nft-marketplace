'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Search, Plus, Compass, User, Sun, Moon } from 'lucide-react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { address } = useAccount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // This is where you would typically integrate with a proper theme provider
    // For now, we'll just toggle the state to show the button works
    console.log('Dark mode toggled:', !darkMode);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${darkMode ? 'border-gray-700 bg-gray-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-xl`}>
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between gap-6">
         

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, collections, and accounts"
                className={`block w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 hover:border-gray-500' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
              />
            </div>
          </form>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Explore */}
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
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
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
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