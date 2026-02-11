'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
} from 'lucide-react';

const platformIcons: Record<string, string> = {
  twitter: '𝕏',
  instagram: '📸',
  facebook: '📘',
  linkedin: '💼',
  tiktok: '🎵',
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // Mock data
  const stats = {
    impressions: { value: 12450, change: 15.2 },
    engagement: { value: 3.8, change: -2.1 },
    clicks: { value: 856, change: 8.4 },
    followers: { value: 2341, change: 5.7 },
  };

  const platformStats = [
    { platform: 'twitter', posts: 12, impressions: 4500, engagement: 4.2 },
    { platform: 'instagram', posts: 8, impressions: 5200, engagement: 5.1 },
    { platform: 'linkedin', posts: 6, impressions: 2100, engagement: 3.4 },
    { platform: 'facebook', posts: 4, impressions: 650, engagement: 2.8 },
  ];

  const topPosts = [
    { id: '1', content: 'AI is revolutionizing content creation...', platform: 'twitter', impressions: 2300, engagement: 156 },
    { id: '2', content: 'Behind the scenes of our latest project', platform: 'instagram', impressions: 1800, engagement: 234 },
    { id: '3', content: '5 tips for better productivity', platform: 'linkedin', impressions: 1200, engagement: 89 },
  ];

  // Mock chart data
  const chartData = [
    { day: 'Mon', impressions: 1200, engagement: 45 },
    { day: 'Tue', impressions: 1800, engagement: 62 },
    { day: 'Wed', impressions: 1500, engagement: 51 },
    { day: 'Thu', impressions: 2200, engagement: 78 },
    { day: 'Fri', impressions: 1900, engagement: 65 },
    { day: 'Sat', impressions: 800, engagement: 28 },
    { day: 'Sun', impressions: 1050, engagement: 35 },
  ];

  const maxImpressions = Math.max(...chartData.map(d => d.impressions));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-sm breadcrumbs mb-2">
            <ul>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li>Analytics</li>
            </ul>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold flex items-center gap-2">
            <BarChart3 className="text-primary" />
            Analytics
          </h1>
          <p className="text-base-content/60 mt-1">
            Track your content performance
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="select select-bordered"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="twitter">X (Twitter)</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
          </select>
          <div className="btn-group">
            <button className={`btn ${timeRange === '7d' ? 'btn-active' : ''}`} onClick={() => setTimeRange('7d')}>7D</button>
            <button className={`btn ${timeRange === '30d' ? 'btn-active' : ''}`} onClick={() => setTimeRange('30d')}>30D</button>
            <button className={`btn ${timeRange === '90d' ? 'btn-active' : ''}`} onClick={() => setTimeRange('90d')}>90D</button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-figure text-primary">
            <Eye size={24} />
          </div>
          <div className="stat-title">Impressions</div>
          <div className="stat-value text-2xl">{stats.impressions.value.toLocaleString()}</div>
          <div className={`stat-desc flex items-center gap-1 ${stats.impressions.change >= 0 ? 'text-success' : 'text-error'}`}>
            {stats.impressions.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(stats.impressions.change)}%
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-figure text-secondary">
            <Heart size={24} />
          </div>
          <div className="stat-title">Engagement Rate</div>
          <div className="stat-value text-2xl">{stats.engagement.value}%</div>
          <div className={`stat-desc flex items-center gap-1 ${stats.engagement.change >= 0 ? 'text-success' : 'text-error'}`}>
            {stats.engagement.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(stats.engagement.change)}%
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-figure text-accent">
            <MessageCircle size={24} />
          </div>
          <div className="stat-title">Clicks</div>
          <div className="stat-value text-2xl">{stats.clicks.value}</div>
          <div className={`stat-desc flex items-center gap-1 ${stats.clicks.change >= 0 ? 'text-success' : 'text-error'}`}>
            {stats.clicks.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(stats.clicks.change)}%
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow">
          <div className="stat-figure text-info">
            <Users size={24} />
          </div>
          <div className="stat-title">Total Followers</div>
          <div className="stat-value text-2xl">{stats.followers.value.toLocaleString()}</div>
          <div className={`stat-desc flex items-center gap-1 ${stats.followers.change >= 0 ? 'text-success' : 'text-error'}`}>
            {stats.followers.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(stats.followers.change)}%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions Chart */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">Impressions Over Time</h2>
            <div className="h-48 flex items-end gap-2">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:bg-primary-focus"
                    style={{ height: `${(data.impressions / maxImpressions) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-base-content/60">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">Platform Performance</h2>
            <div className="space-y-4">
              {platformStats.map((stat) => (
                <div key={stat.platform} className="flex items-center gap-4">
                  <span className="text-2xl w-8">{platformIcons[stat.platform]}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium capitalize">{stat.platform}</span>
                      <span className="text-sm text-base-content/60">{stat.impressions.toLocaleString()} impressions</span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={stat.impressions}
                      max={Math.max(...platformStats.map(p => p.impressions))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Top Performing Posts</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Platform</th>
                  <th>Impressions</th>
                  <th>Engagement</th>
                </tr>
              </thead>
              <tbody>
                {topPosts.map((post) => (
                  <tr key={post.id} className="hover">
                    <td className="max-w-xs truncate">{post.content}</td>
                    <td>
                      <span className="text-xl">{platformIcons[post.platform]}</span>
                    </td>
                    <td>{post.impressions.toLocaleString()}</td>
                    <td>{post.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
