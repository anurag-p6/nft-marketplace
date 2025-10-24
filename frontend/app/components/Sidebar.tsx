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
  X
} from 'lucide-react';

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
        ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    } ${collapsed ? 'justify-center' : ''}`}
  >
    <div className={`w-5 h-5 flex-shrink-0 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
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
  collapsed?: boolean;
}

const CategoryItem = ({ icon, label, href, active, collapsed }: CategoryItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
      active
        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    } ${collapsed ? 'justify-center' : ''}`}
  >
    <div className={`w-4 h-4 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
      {icon}
    </div>
    {!collapsed && <span>{label}</span>}
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
      <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
    { icon: <Image />, label: 'Art', href: '/category/art', active: pathname === '/category/art' },
    { icon: <Gamepad2 />, label: 'Gaming', href: '/category/gaming', active: pathname === '/category/gaming' },
    { icon: <Music />, label: 'Music', href: '/category/music', active: pathname === '/category/music' },
    { icon: <Camera />, label: 'Photography', href: '/category/photography', active: pathname === '/category/photography' },
    { icon: <Users />, label: 'PFP', href: '/category/pfp', active: pathname === '/category/pfp' },
    { icon: <Trophy />, label: 'Sports', href: '/category/sports', active: pathname === '/category/sports' },
    { icon: <Globe />, label: 'Virtual Worlds', href: '/category/virtual-worlds', active: pathname === '/category/virtual-worlds' },
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
      {/* Desktop Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-6 z-30 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-all duration-300 z-30 flex flex-col ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className={`flex-1 p-4 ${isCollapsed ? 'lg:px-3' : ''}`}>
          {/* Logo - Hidden when collapsed */}
         

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
          <Section title="Categories" collapsed={isCollapsed}>
            {categories.map((category) => (
              <CategoryItem
                key={category.href}
                icon={category.icon}
                label={category.label}
                href={category.href}
                active={category.active}
                collapsed={isCollapsed}
              />
            ))}
          </Section>

          {/* Resources */}
          <Section title="Resources" collapsed={isCollapsed}>
            {resources.map((resource) => (
              <CategoryItem
                key={resource.href}
                icon={resource.icon}
                label={resource.label}
                href={resource.href}
                active={resource.active}
                collapsed={isCollapsed}
              />
            ))}
          </Section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors ${
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