'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Send,
  Image as ImageIcon,
  Video,
  Calendar,
  Globe,
  Check,
  AlertCircle,
} from 'lucide-react';

const platforms = [
  { id: 'twitter', name: 'X (Twitter)', icon: '𝕏', maxLength: 280 },
  { id: 'instagram', name: 'Instagram', icon: '📸', maxLength: 2200 },
  { id: 'facebook', name: 'Facebook', icon: '📘', maxLength: 63206 },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', maxLength: 3000 },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', maxLength: 2200 },
];

export default function PublishPage() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [scheduleType, setScheduleType] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;
    
    setIsPublishing(true);
    try {
      const payload = {
        text: content,
        platforms: selectedPlatforms,
        ...(scheduleType === 'schedule' && {
          scheduledFor: new Date(`${scheduleDate}T${scheduleTime}`).toISOString(),
        }),
      };

      const res = await fetch('/api/v1/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(scheduleType === 'now' ? 'Published successfully!' : 'Scheduled successfully!');
        setContent('');
        setSelectedPlatforms([]);
      } else {
        alert('Publishing failed. Please try again.');
      }
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Publishing failed. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const getMinLength = () => {
    const selected = platforms.filter(p => selectedPlatforms.includes(p.id));
    return selected.length > 0 ? Math.min(...selected.map(p => p.maxLength)) : 280;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="text-sm breadcrumbs mb-2">
          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li>Publish</li>
          </ul>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold flex items-center gap-2">
          <Send className="text-primary" />
          Publish Content
        </h1>
        <p className="text-base-content/60 mt-1">
          Post to multiple platforms at once
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Content Input */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">Content</h2>
              <textarea
                className="textarea textarea-bordered h-40 text-lg"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMediaType(mediaType === 'image' ? 'none' : 'image')}
                    className={`btn btn-sm ${mediaType === 'image' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    <ImageIcon size={16} />
                    Image
                  </button>
                  <button
                    onClick={() => setMediaType(mediaType === 'video' ? 'none' : 'video')}
                    className={`btn btn-sm ${mediaType === 'video' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    <Video size={16} />
                    Video
                  </button>
                </div>
                <div className="text-sm text-base-content/60">
                  {content.length} / {getMinLength()}
                </div>
              </div>

              {mediaType !== 'none' && (
                <div className="mt-4 p-8 border-2 border-dashed border-base-300 rounded-xl text-center">
                  <input type="file" className="hidden" id="media-upload" accept={mediaType === 'image' ? 'image/*' : 'video/*'} />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    {mediaType === 'image' ? <ImageIcon size={32} className="mx-auto mb-2 text-base-content/40" /> : <Video size={32} className="mx-auto mb-2 text-base-content/40" />}
                    <p className="text-base-content/60">Click to upload {mediaType}</p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Options */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">When to publish?</h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    className="radio radio-primary"
                    checked={scheduleType === 'now'}
                    onChange={() => setScheduleType('now')}
                  />
                  <span>Publish now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    className="radio radio-primary"
                    checked={scheduleType === 'schedule'}
                    onChange={() => setScheduleType('schedule')}
                  />
                  <span>Schedule for later</span>
                </label>
              </div>

              {scheduleType === 'schedule' && (
                <div className="flex gap-4 mt-4">
                  <div className="form-control flex-1">
                    <label className="label"><span className="label-text">Date</span></label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  <div className="form-control flex-1">
                    <label className="label"><span className="label-text">Time</span></label>
                    <input
                      type="time"
                      className="input input-bordered"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Platform Selection */}
        <div className="space-y-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Globe size={20} />
                Select Platforms
              </h2>
              <div className="space-y-2">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const isTooLong = content.length > platform.maxLength;
                  
                  return (
                    <label
                      key={platform.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-base-200 border-2 border-transparent hover:bg-base-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={isSelected}
                        onChange={() => togglePlatform(platform.id)}
                      />
                      <span className="text-2xl">{platform.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-xs text-base-content/60">Max {platform.maxLength} chars</div>
                      </div>
                      {isSelected && isTooLong && (
                        <AlertCircle size={18} className="text-warning" />
                      )}
                    </label>
                  );
                })}
              </div>

              {selectedPlatforms.length === 0 && (
                <p className="text-sm text-base-content/60 mt-2">
                  Select at least one platform to publish
                </p>
              )}
            </div>
          </div>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={!content.trim() || selectedPlatforms.length === 0 || isPublishing}
            className={`btn btn-primary btn-lg w-full ${isPublishing ? 'loading' : ''}`}
          >
            {isPublishing ? 'Publishing...' : (
              <>
                {scheduleType === 'now' ? <Send size={20} /> : <Calendar size={20} />}
                {scheduleType === 'now' ? 'Publish Now' : 'Schedule Post'}
              </>
            )}
          </button>

          {/* Preview */}
          {content && selectedPlatforms.length > 0 && (
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="font-bold text-sm mb-2">Preview</h3>
                <div className="bg-base-200 rounded-lg p-3">
                  <p className="text-sm whitespace-pre-wrap">{content}</p>
                </div>
                <div className="flex gap-1 mt-2">
                  {selectedPlatforms.map(p => {
                    const platform = platforms.find(pl => pl.id === p);
                    return (
                      <span key={p} className="badge badge-sm">{platform?.icon}</span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
