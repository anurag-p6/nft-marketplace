'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '../public/logo';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  isExpanded: boolean;
}

const SidebarItem = ({ icon, label, href, active, isExpanded }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
      active
        ? 'bg-purple-50 text-purple-600 font-semibold'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
    title={!isExpanded ? label : undefined}
  >
    <div className="w-5 h-5 flex-shrink-0">{icon}</div>
    <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
      {label}
    </span>
  </Link>
);

interface CategoryItemProps {
  label: string;
  href: string;
  active?: boolean;
  isExpanded: boolean;
}

const CategoryItem = ({ label, href, active, isExpanded }: CategoryItemProps) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-lg text-sm transition-all ${
      active
        ? 'bg-purple-50 text-purple-600 font-medium'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
    title={!isExpanded ? label : undefined}
  >
    <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
      {label}
    </span>
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 pt-24 lg:pt-6">
          {/* Main Navigation */}
          <nav className="space-y-1 mb-8">
            <SidebarItem
              icon={
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              label="Home"
              href="/"
              active={pathname === '/'}
            />
            <SidebarItem
              icon={
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              label="Drops"
              href="/drops"
              active={pathname === '/drops'}
            />
            <SidebarItem
              icon={
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              label="Stats"
              href="/stats"
              active={pathname === '/stats'}
            />
            <SidebarItem
              icon={
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Create"
              href="/create"
              active={pathname === '/create'}
            />
          </nav>

          {/* Browse Categories */}
          <div className="mb-8">
            <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Browse by Category
            </h3>
            <div className="space-y-1">
              <CategoryItem label="All NFTs" href="/explore/all" active={pathname === '/explore/all'} />
              <CategoryItem label="Art" href="/explore/art" active={pathname === '/explore/art'} />
              <CategoryItem label="Gaming" href="/explore/gaming" active={pathname === '/explore/gaming'} />
              <CategoryItem label="Memberships" href="/explore/memberships" active={pathname === '/explore/memberships'} />
              <CategoryItem label="Music" href="/explore/music" active={pathname === '/explore/music'} />
              <CategoryItem label="Photography" href="/explore/photography" active={pathname === '/explore/photography'} />
              <CategoryItem label="PFPs" href="/explore/pfps" active={pathname === '/explore/pfps'} />
              <CategoryItem label="Sports" href="/explore/sports" active={pathname === '/explore/sports'} />
              <CategoryItem label="Virtual Worlds" href="/explore/virtual-worlds" active={pathname === '/explore/virtual-worlds'} />
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Resources
            </h3>
            <div className="space-y-1">
              <CategoryItem label="Learn" href="/learn" active={pathname === '/learn'} />
              <CategoryItem label="Help Center" href="/help" active={pathname === '/help'} />
              <CategoryItem label="Platform Status" href="/status" active={pathname === '/status'} />
              <CategoryItem label="Partners" href="/partners" active={pathname === '/partners'} />
              <CategoryItem label="Gas Free" href="/gas-free" active={pathname === '/gas-free'} />
              <CategoryItem label="Blog" href="/blog" active={pathname === '/blog'} />
              <CategoryItem label="Docs" href="/docs" active={pathname === '/docs'} />
              <CategoryItem label="Newsletter" href="/newsletter" active={pathname === '/newsletter'} />
            </div>
          </div>

          {/* Language Selector */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg w-full transition-colors">
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>Language</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}