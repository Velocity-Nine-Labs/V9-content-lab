'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Key,
  Plug,
  FileText,
  Send,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  Zap,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create', href: '/dashboard/create', icon: Sparkles },
  { name: 'Content Library', href: '/dashboard/content', icon: FileText },
  { name: 'Publish', href: '/dashboard/publish', icon: Send },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { name: 'Accounts', href: '/dashboard/accounts', icon: Plug },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-base-100 border-r border-base-300 min-h-screen transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-base-300">
          {!isCollapsed ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-bold">Content Lab</span>
                <span className="text-xs text-base-content/60 block">by V9 Labs</span>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard" className="flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-primary-content shadow-md'
                    : 'hover:bg-base-200'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-base-300">
          {/* Usage Stats */}
          {!isCollapsed && (
            <div className="px-3 py-2 mb-3 bg-base-200 rounded-xl">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-base-content/60">API Usage</span>
                <span className="font-medium">0 / 100</span>
              </div>
              <progress className="progress progress-primary w-full h-2" value="0" max="100"></progress>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl hover:bg-base-200 transition-colors text-base-content/60"
          >
            <ChevronLeft size={18} className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-base-content/60'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
