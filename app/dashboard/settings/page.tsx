'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    name: '',
    email: '',
    timezone: 'America/New_York',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailPublished: true,
    emailScheduled: true,
    emailWeeklyReport: true,
    pushPublished: false,
    pushErrors: true,
  });

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    defaultTone: 'professional',
    defaultModel: 'gpt-4',
    autoHashtags: true,
    autoEmojis: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    alert('Settings saved!');
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'ai', name: 'AI Settings', icon: Palette },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="text-sm breadcrumbs mb-2">
          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li>Settings</li>
          </ul>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold flex items-center gap-2">
          <Settings className="text-primary" />
          Settings
        </h1>
        <p className="text-base-content/60 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">Account Settings</h2>
            
            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Full Name</span></label>
              <input
                type="text"
                className="input input-bordered"
                value={accountSettings.name}
                onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                className="input input-bordered"
                value={accountSettings.email}
                onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-control mb-6">
              <label className="label"><span className="label-text">Timezone</span></label>
              <select
                className="select select-bordered"
                value={accountSettings.timezone}
                onChange={(e) => setAccountSettings({ ...accountSettings, timezone: e.target.value })}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">GMT/UTC</option>
                <option value="Europe/Paris">Central European Time (CET)</option>
              </select>
            </div>

            <div className="divider"></div>
            <h3 className="font-bold mb-4">Danger Zone</h3>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-warning">Export Data</button>
              <button className="btn btn-outline btn-error">Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">Notification Preferences</h2>
            
            <h3 className="font-bold mb-3">Email Notifications</h3>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={notifications.emailPublished}
                  onChange={(e) => setNotifications({ ...notifications, emailPublished: e.target.checked })}
                />
                <div>
                  <div className="font-medium">Content Published</div>
                  <div className="text-sm text-base-content/60">Get notified when your content is published</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={notifications.emailScheduled}
                  onChange={(e) => setNotifications({ ...notifications, emailScheduled: e.target.checked })}
                />
                <div>
                  <div className="font-medium">Scheduled Reminders</div>
                  <div className="text-sm text-base-content/60">Reminder before scheduled posts</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={notifications.emailWeeklyReport}
                  onChange={(e) => setNotifications({ ...notifications, emailWeeklyReport: e.target.checked })}
                />
                <div>
                  <div className="font-medium">Weekly Report</div>
                  <div className="text-sm text-base-content/60">Weekly performance summary</div>
                </div>
              </label>
            </div>

            <h3 className="font-bold mb-3">Push Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-secondary"
                  checked={notifications.pushPublished}
                  onChange={(e) => setNotifications({ ...notifications, pushPublished: e.target.checked })}
                />
                <div>
                  <div className="font-medium">Content Published</div>
                  <div className="text-sm text-base-content/60">Push notification when published</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-secondary"
                  checked={notifications.pushErrors}
                  onChange={(e) => setNotifications({ ...notifications, pushErrors: e.target.checked })}
                />
                <div>
                  <div className="font-medium">Error Alerts</div>
                  <div className="text-sm text-base-content/60">Get notified when something fails</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* AI Settings Tab */}
      {activeTab === 'ai' && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">AI Generation Settings</h2>
            
            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Default Tone</span></label>
              <select
                className="select select-bordered"
                value={aiSettings.defaultTone}
                onChange={(e) => setAiSettings({ ...aiSettings, defaultTone: e.target.value })}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="funny">Funny</option>
                <option value="inspirational">Inspirational</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            <div className="form-control mb-6">
              <label className="label"><span className="label-text">AI Model</span></label>
              <select
                className="select select-bordered"
                value={aiSettings.defaultModel}
                onChange={(e) => setAiSettings({ ...aiSettings, defaultModel: e.target.value })}
              >
                <option value="gpt-4">GPT-4 (Most capable)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                <option value="claude-3">Claude 3 (Anthropic)</option>
              </select>
            </div>

            <h3 className="font-bold mb-3">Auto-Enhancements</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={aiSettings.autoHashtags}
                  onChange={(e) => setAiSettings({ ...aiSettings, autoHashtags: e.target.checked })}
                />
                <div>
                  <div className="font-medium">Auto-generate Hashtags</div>
                  <div className="text-sm text-base-content/60">Add relevant hashtags to content</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={aiSettings.autoEmojis}
                  onChange={(e) => setAiSettings({ ...aiSettings, autoEmojis: e.target.checked })}
                />
                <div>
                  <div className="font-medium">Auto-add Emojis</div>
                  <div className="text-sm text-base-content/60">Add relevant emojis to content</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">Security Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
                <div>
                  <div className="font-medium">Password</div>
                  <div className="text-sm text-base-content/60">Last changed 30 days ago</div>
                </div>
                <button className="btn btn-outline btn-sm">Change Password</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-base-content/60">Add an extra layer of security</div>
                </div>
                <button className="btn btn-primary btn-sm">Enable 2FA</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
                <div>
                  <div className="font-medium">Active Sessions</div>
                  <div className="text-sm text-base-content/60">Manage your active sessions</div>
                </div>
                <button className="btn btn-outline btn-sm">View Sessions</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">Billing & Subscription</h2>
            
            <div className="alert alert-info mb-6">
              <span>You are currently on the <strong>Free Plan</strong></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-title">Current Plan</div>
                <div className="stat-value text-lg">Free</div>
                <div className="stat-desc">10 posts/month</div>
              </div>
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-title">Usage</div>
                <div className="stat-value text-lg">0 / 10</div>
                <div className="stat-desc">Posts this month</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-primary">Upgrade to Pro</button>
              <button className="btn btn-ghost">View Plans</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`btn btn-primary ${isSaving ? 'loading' : ''}`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
