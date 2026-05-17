'use client';

import { useState } from 'react';

const BOT_TYPES = [
  // Normal Users - kategori baru!
  { id: 'chrome', name: '👤 Chrome (Desktop)', category: 'normal' },
  { id: 'firefox', name: '👤 Firefox (Desktop)', category: 'normal' },
  { id: 'safari', name: '👤 Safari (Desktop)', category: 'normal' },
  { id: 'edge', name: '👤 Edge (Desktop)', category: 'normal' },
  { id: 'mobile_chrome', name: '📱 Chrome (Mobile)', category: 'normal' },
  { id: 'mobile_safari', name: '📱 Safari (Mobile)', category: 'normal' },
  
  // Bots
  { id: 'googlebot', name: '🤖 Googlebot', category: 'bot' },
  { id: 'googlebot-smartphone', name: '🤖 Googlebot Smartphone', category: 'bot' },
  { id: 'facebookbot', name: '🤖 Facebook Bot', category: 'bot' },
  { id: 'twitterbot', name: '🤖 Twitter Bot', category: 'bot' },
  { id: 'linkedinbot', name: '🤖 LinkedIn Bot', category: 'bot' },
  { id: 'bingbot', name: '🤖 Bing Bot', category: 'bot' },
  { id: 'slackbot', name: '🤖 Slack Bot', category: 'bot' },
  { id: 'whatsapp', name: '🤖 WhatsApp', category: 'bot' },
  { id: 'telegrambot', name: '🤖 Telegram Bot', category: 'bot' },
  { id: 'discordbot', name: '🤖 Discord Bot', category: 'bot' },
];

interface FetchResult {
  html: string;
  statusCode: number;
  headers: Record<string, string>;
  metaTags: Record<string, string>;
  finalUrl: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [botType, setBotType] = useState('chrome');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [error, setError] = useState('');
  const [view, setView] = useState<'preview' | 'html' | 'meta'>('preview');
  const [copied, setCopied] = useState(false);

  const handleFetch = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, botType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result?.html) return;
    
    try {
      await navigator.clipboard.writeText(result.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  // Kelompokkan bot types
  const normalUsers = BOT_TYPES.filter(b => b.category === 'normal');
  const bots = BOT_TYPES.filter(b => b.category === 'bot');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🔍 Bot Viewer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lihat bagaimana bot crawler atau user normal melihat website Anda
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL Website
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih User Agent
              </label>
              <select
                value={botType}
                onChange={(e) => setBotType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <optgroup label="👤 Normal Users (Browser)">
                  {normalUsers.map((bot) => (
                    <option key={bot.id} value={bot.id}>
                      {bot.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🤖 Bots & Crawlers">
                  {bots.map((bot) => (
                    <option key={bot.id} value={bot.id}>
                      {bot.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <button
              onClick={handleFetch}
              disabled={loading || !url}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <span>Fetch Website</span>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center p-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setView('preview')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      view === 'preview'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setView('html')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      view === 'html'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    HTML Source
                  </button>
                  <button
                    onClick={() => setView('meta')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      view === 'meta'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Meta Tags
                  </button>
                </div>

                {/* Copy Button - hanya muncul di tab HTML Source */}
                {view === 'html' && (
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy HTML</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`ml-2 font-semibold ${result.statusCode === 200 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.statusCode}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Final URL:</span>
                  <span className="ml-2 font-mono text-xs text-gray-900 dark:text-gray-100 break-all">
                    {result.finalUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {view === 'preview' && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={result.html}
                    className="w-full h-[600px]"
                    sandbox="allow-same-origin"
                    title="Preview"
                  />
                </div>
              )}

              {view === 'html' && (
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                    <code>{result.html}</code>
                  </pre>
                </div>
              )}

              {view === 'meta' && (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {Object.entries(result.metaTags).map(([key, value]) => (
                      <div
                        key={key}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                          {key}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 break-words">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
