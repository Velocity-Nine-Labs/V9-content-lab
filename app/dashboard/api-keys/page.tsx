'use client';

import { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  scopes: string[];
  isActive: boolean;
  usage: {
    totalRequests: number;
    lastUsedAt: string | null;
  };
  createdAt: string;
  expiresAt: string | null;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('never');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/v1/keys');
      const data = await response.json();
      if (data.success) {
        setKeys(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    try {
      const response = await fetch('/api/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName || 'API Key',
          expiresInDays: newKeyExpiry === 'never' ? null : parseInt(newKeyExpiry),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewlyCreatedKey(data.data.key);
        fetchKeys();
      }
    } catch (error) {
      console.error('Failed to create key:', error);
    }
  };

  const deleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`/api/v1/keys?id=${keyId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchKeys();
      }
    } catch (error) {
      console.error('Failed to delete key:', error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Key size={32} />
              API Keys
            </h1>
            <p className="text-base-content/70 mt-1">
              Manage your API keys for programmatic access
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Create New Key
          </button>
        </div>

        {/* Info Alert */}
        <div className="alert alert-info mb-6">
          <AlertCircle size={20} />
          <div>
            <p className="font-medium">Keep your API keys secure</p>
            <p className="text-sm">Never share your API keys in public repositories or client-side code.</p>
          </div>
        </div>

        {/* Keys List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : keys.length === 0 ? (
          <div className="card bg-base-200">
            <div className="card-body items-center text-center py-12">
              <Key size={48} className="text-base-content/30 mb-4" />
              <h3 className="text-lg font-semibold">No API keys yet</h3>
              <p className="text-base-content/70">Create your first API key to start using the API</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary mt-4"
              >
                <Plus size={20} />
                Create API Key
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key.id} className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{key.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-base-300 px-2 py-1 rounded text-sm">
                          {key.keyPreview}
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.keyPreview, key.id)}
                          className="btn btn-ghost btn-xs"
                        >
                          {copiedId === key.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${key.isActive ? 'badge-success' : 'badge-error'}`}>
                        {key.isActive ? 'Active' : 'Revoked'}
                      </span>
                      <button
                        onClick={() => deleteKey(key.id)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-base-content/70">
                    <div className="flex items-center gap-1">
                      <Activity size={14} />
                      <span>{key.usage.totalRequests.toLocaleString()} requests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {key.expiresAt && (
                      <div className="flex items-center gap-1">
                        <AlertCircle size={14} />
                        <span>Expires {new Date(key.expiresAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {key.scopes.map((scope) => (
                      <span key={scope} className="badge badge-outline badge-sm">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              {newlyCreatedKey ? (
                <>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Check className="text-success" size={24} />
                    API Key Created
                  </h3>
                  <div className="alert alert-warning mt-4">
                    <AlertCircle size={20} />
                    <span>Copy this key now. It won't be shown again!</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 bg-base-200 p-3 rounded-lg">
                      <code className="flex-1 text-sm break-all">{newlyCreatedKey}</code>
                      <button
                        onClick={() => copyToClipboard(newlyCreatedKey, 'new')}
                        className="btn btn-ghost btn-sm"
                      >
                        {copiedId === 'new' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="modal-action">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewlyCreatedKey(null);
                        setNewKeyName('');
                      }}
                      className="btn btn-primary"
                    >
                      Done
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">Create New API Key</h3>
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Key Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="My API Key"
                      className="input input-bordered"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Expiration</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={newKeyExpiry}
                      onChange={(e) => setNewKeyExpiry(e.target.value)}
                    >
                      <option value="never">Never expires</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                  <div className="modal-action">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button onClick={createKey} className="btn btn-primary">
                      Create Key
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="modal-backdrop" onClick={() => !newlyCreatedKey && setShowCreateModal(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
