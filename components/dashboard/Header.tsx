'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Plus, Bell, Zap } from 'lucide-react';
import ButtonAccount from '@/components/ButtonAccount';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/dashboard/content?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-base-100 border-b border-base-300 px-4 lg:px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Logo */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-bold">Content Lab</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="join w-full">
            <input
              type="text"
              placeholder="Search content..."
              className="input input-bordered join-item flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary join-item">
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Create Button */}
          <Link href="/dashboard/create" className="btn btn-primary btn-sm gap-1">
            <Plus size={18} />
            <span className="hidden sm:inline">Create</span>
          </Link>

          {/* Quick Actions */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
              <Plus size={20} />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
              <li>
                <Link href="/dashboard/create?type=text">
                  <span>📝</span> Generate Text
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create?type=image">
                  <span>🖼️</span> Generate Image
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create?type=video">
                  <span>🎬</span> Generate Video
                </Link>
              </li>
              <li>
                <Link href="/dashboard/publish">
                  <span>📤</span> Quick Publish
                </Link>
              </li>
            </ul>
          </div>

          {/* Notifications */}
          <button className="btn btn-ghost btn-circle btn-sm">
            <div className="indicator">
              <Bell size={20} />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          {/* User Account */}
          <ButtonAccount />
        </div>
      </div>

      {/* Mobile Search */}
      <form onSubmit={handleSearch} className="md:hidden mt-3">
        <div className="join w-full">
          <input
            type="text"
            placeholder="Search content..."
            className="input input-bordered input-sm join-item flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm join-item">
            <Search size={16} />
          </button>
        </div>
      </form>
    </header>
  );
}
