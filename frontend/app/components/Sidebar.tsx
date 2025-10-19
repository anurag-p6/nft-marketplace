'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  Plus,
  Image,
  Gamepad2,
  Music,
  Camera,
  Trophy,
  Globe,
  Users,
  BookOpen,
  HelpCircle,
  Server,
  Handshake,
  Zap,
  FileText,
  Mail,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import HoverSidebar from '../HoverSidebar/HoverSidebar';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon, label, href, active, collapsed }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
      active
        ? 'bg-blue-50 text-blue-600 border border-blue-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    } ${collapsed ? 'justify-center' : ''}`}
  >
    <div className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
      {icon}
    </div>
    {!collapsed && <span className="text-sm font-medium">{label}</span>}
  </Link>
);

interface CategoryItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const CategoryItem = ({ icon, label, href, active }: CategoryItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
      active
        ? 'bg-blue-50 text-blue-600 font-medium'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <div className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span>{label}</span>
  </Link>
);

interface SectionProps {
  title: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

const Section = ({ title, collapsed, children }: SectionProps) => {
  if (collapsed) return <div className="space-y-1">{children}</div>;
  
  return (
    <div className="mb-6">
      <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    { icon: <Home />, label: 'Home', href: '/', active: pathname === '/' },
    { icon: <TrendingUp />, label: 'Drops', href: '/drops', active: pathname === '/drops' },
    { icon: <BarChart3 />, label: 'Stats', href: '/stats', active: pathname === '/stats' },
    { icon: <Plus />, label: 'Create', href: '/create', active: pathname === '/create' },
  ];

  const categories = [
    { icon: <Image />, label: 'Art', href: '/Category/art', active: pathname === '/Category/art' },
    { icon: <Gamepad2 />, label: 'Gaming', href: '/Category/gaming', active: pathname === '/Category/gaming' },
    { icon: <Music />, label: 'Music', href: '/Category/music', active: pathname === '/Category/music' },
    { icon: <Camera />, label: 'Photography', href: '/Category/photography', active: pathname === '/Category/photography' },
    { icon: <Users />, label: 'PFP', href: '/Category/pfp', active: pathname === '/Category/pfp' },
    { icon: <Trophy />, label: 'Sports', href: '/Category/sports', active: pathname === '/Category/sports' },
    { icon: <Globe />, label: 'Virtual Worlds', href: '/Category/virtual-worlds', active: pathname === '/Category/virtualworld' },
  ];

  const resources = [
    { icon: <BookOpen />, label: 'Learn', href: '/learn', active: pathname === '/learn' },
    { icon: <HelpCircle />, label: 'Help Center', href: '/help', active: pathname === '/help' },
    { icon: <Server />, label: 'Status', href: '/status', active: pathname === '/status' },
    { icon: <Handshake />, label: 'Partners', href: '/partners', active: pathname === '/partners' },
    { icon: <Zap />, label: 'Gas Free', href: '/gas-free', active: pathname === '/gas-free' },
    { icon: <FileText />, label: 'Blog', href: '/blog', active: pathname === '/blog' },
    { icon: <BookOpen />, label: 'Docs', href: '/docs', active: pathname === '/docs' },
    { icon: <Mail />, label: 'Newsletter', href: '/newsletter', active: pathname === '/newsletter' },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-6 z-30 p-1.5 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 z-50 flex flex-col ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className={`flex-1 p-4 ${isCollapsed ? 'lg:px-3' : ''}`}>
          {/* Logo */}
          <div className={`flex items-center gap-3 mb-8 pt-2 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-lg font-bold text-gray-900 block">NFT Market</span>
                <span className="text-xs text-gray-500 block">Digital Marketplace</span>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <Section title="Navigation" collapsed={isCollapsed}>
            {mainNavItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
                collapsed={isCollapsed}
              />
            ))}
          </Section>

          {/* Categories */}
         {/* Browse Categories */}
<HoverSidebar title="Browse by Category">
  <Section title="Categories" collapsed={isCollapsed}>
    {categories.map((Category) => (
      <CategoryItem
        key={Category.href}
        icon={Category.icon}
        label={Category.label}
        href={Category.href}
        active={Category.active}
      />
    ))}
  </Section>
</HoverSidebar>

{/* Resources */}
<HoverSidebar title="Resources">
  <Section title="Resources" collapsed={isCollapsed}>
    {resources.map((resource) => (
      <CategoryItem
        key={resource.href}
        icon={resource.icon}
        label={resource.label}
        href={resource.href}
        active={resource.active}
      />
    ))}
  </Section>
</HoverSidebar>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors ${
            isCollapsed ? 'lg:justify-center' : ''
          }`}>
            <Globe className="w-4 h-4" />
            {!isCollapsed && <span>English</span>}
          </button>
        </div>
      </aside>
    </>
  );
}