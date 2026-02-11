'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Mic,
  Sparkles,
  Wand2,
  Copy,
  Check,
  Download,
  Send,
} from 'lucide-react';

type ContentType = 'text' | 'image' | 'video' | 'voice';

const contentTypes = [
  { id: 'text', name: 'Text', icon: FileText, description: 'Captions, posts, threads' },
  { id: 'image', name: 'Image', icon: ImageIcon, description: 'AI-generated images' },
  { id: 'video', name: 'Video', icon: Video, description: 'Short-form videos' },
  { id: 'voice', name: 'Voiceover', icon: Mic, description: 'AI voice generation' },
];

const textTemplates = [
  { id: 'tweet', name: 'Tweet/X Post', maxLength: 280 },
  { id: 'thread', name: 'Twitter Thread', maxLength: 2000 },
  { id: 'instagram', name: 'Instagram Caption', maxLength: 2200 },
  { id: 'linkedin', name: 'LinkedIn Post', maxLength: 3000 },
  { id: 'tiktok', name: 'TikTok Caption', maxLength: 2200 },
  { id: 'youtube', name: 'YouTube Description', maxLength: 5000 },
];

export default function CreatePage() {
  const [activeType, setActiveType] = useState<ContentType>('text');
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState('tweet');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeType,
          prompt,
          options: {
            template,
            tone,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data.content);
      } else {
        // Demo: generate mock content
        setResult(`Here's an AI-generated ${template} about "${prompt}":\n\n${prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}\n\n#AI #ContentCreation #V9Labs`);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      // Demo fallback
      setResult(`Generated content for: ${prompt}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="text-sm breadcrumbs mb-2">
          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li>Create Content</li>
          </ul>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold flex items-center gap-2">
          <Sparkles className="text-primary" />
          Create Content
        </h1>
        <p className="text-base-content/60 mt-1">
          Generate AI-powered content in seconds
        </p>
      </div>

      {/* Content Type Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id as ContentType)}
              className={`card bg-base-100 hover:shadow-lg transition-all cursor-pointer ${
                isActive ? 'ring-2 ring-primary shadow-lg' : 'shadow'
              }`}
            >
              <div className="card-body items-center text-center py-6">
                <Icon size={32} className={isActive ? 'text-primary' : 'text-base-content/60'} />
                <h3 className="font-bold mt-2">{type.name}</h3>
                <p className="text-xs text-base-content/60">{type.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <Wand2 size={20} />
              Generation Settings
            </h2>

            {activeType === 'text' && (
              <>
                {/* Template */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Content Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    {textTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Tone */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Tone</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="funny">Funny</option>
                    <option value="inspirational">Inspirational</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>
              </>
            )}

            {/* Prompt */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">
                  {activeType === 'text' ? 'What should we write about?' :
                   activeType === 'image' ? 'Describe the image you want' :
                   activeType === 'video' ? 'Describe the video concept' :
                   'What text should we speak?'}
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-32"
                placeholder={
                  activeType === 'text' ? 'E.g., Write a tweet about the benefits of AI automation for small businesses...' :
                  activeType === 'image' ? 'E.g., A futuristic office with AI robots working alongside humans...' :
                  activeType === 'video' ? 'E.g., A 15-second promo video showcasing our product features...' :
                  'E.g., Welcome to our channel! Today we will discuss...'
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`btn btn-primary btn-lg w-full ${isGenerating ? 'loading' : ''}`}
            >
              {isGenerating ? 'Generating...' : (
                <>
                  <Sparkles size={20} />
                  Generate {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Section */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Generated Content</h2>
              {result && (
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="btn btn-ghost btn-sm">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Download size={16} />
                  </button>
                </div>
              )}
            </div>

            {result ? (
              <div className="bg-base-200 rounded-xl p-4 min-h-[200px]">
                {activeType === 'text' && (
                  <p className="whitespace-pre-wrap">{result}</p>
                )}
                {activeType === 'image' && (
                  <div className="flex items-center justify-center h-48 bg-base-300 rounded-lg">
                    <ImageIcon size={48} className="text-base-content/30" />
                  </div>
                )}
                {activeType === 'video' && (
                  <div className="flex items-center justify-center h-48 bg-base-300 rounded-lg">
                    <Video size={48} className="text-base-content/30" />
                  </div>
                )}
                {activeType === 'voice' && (
                  <div className="flex items-center justify-center h-48 bg-base-300 rounded-lg">
                    <Mic size={48} className="text-base-content/30" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-base-content/40">
                <Sparkles size={48} className="mb-4" />
                <p>Your generated content will appear here</p>
              </div>
            )}

            {result && (
              <div className="flex gap-2 mt-4">
                <button className="btn btn-outline flex-1">
                  Save to Library
                </button>
                <Link href="/dashboard/publish" className="btn btn-primary flex-1">
                  <Send size={16} />
                  Publish
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
