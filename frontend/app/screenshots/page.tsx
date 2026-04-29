'use client';

import { useEffect, useMemo, useState } from 'react';

type Screenshot = {
  filename: string;
  saved_to: string;
  size_bytes: number;
  raw_text: string;
  cleaned_text: string;
  category: string;
};

const categories = ['all', 'receipt', 'shopping', 'travel', 'other'];

function getCategoryBadgeStyles(category: string) {
  switch (category.toLowerCase()) {
    case 'receipt':
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    case 'shopping':
      return 'bg-sky-500/15 text-sky-300 border border-sky-500/30';
    case 'travel':
      return 'bg-violet-500/15 text-violet-300 border border-violet-500/30';
    default:
      return 'bg-zinc-700/40 text-zinc-300 border border-zinc-600';
  }
}

export default function ScreenshotsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/screenshots');
        const data = await response.json();
        setScreenshots(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load screenshots.');
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, []);

  const stats = useMemo(() => {
    return {
      total: screenshots.length,
      receipt: screenshots.filter((s) => s.category === 'receipt').length,
      shopping: screenshots.filter((s) => s.category === 'shopping').length,
      travel: screenshots.filter((s) => s.category === 'travel').length,
      other: screenshots.filter((s) => s.category === 'other').length,
    };
  }, [screenshots]);

  const filteredScreenshots = useMemo(() => {
    const query = search.toLowerCase().trim();

    return screenshots.filter((shot) => {
      const matchesSearch =
        !query ||
        shot.filename.toLowerCase().includes(query) ||
        shot.category.toLowerCase().includes(query) ||
        shot.cleaned_text.toLowerCase().includes(query) ||
        shot.raw_text.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'all' || shot.category.toLowerCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [screenshots, search, selectedCategory]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">SnapSense</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Processed Screenshots</h1>
          <p className="mt-2 text-zinc-400">
            Browse, filter, and search screenshots by extracted text.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-sm text-zinc-400">Total</p>
            <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-sm text-zinc-400">Receipts</p>
            <p className="mt-2 text-2xl font-semibold">{stats.receipt}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-sm text-zinc-400">Shopping</p>
            <p className="mt-2 text-2xl font-semibold">{stats.shopping}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-sm text-zinc-400">Travel</p>
            <p className="mt-2 text-2xl font-semibold">{stats.travel}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-sm text-zinc-400">Other</p>
            <p className="mt-2 text-2xl font-semibold">{stats.other}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
          <input
            type="text"
            placeholder="Search screenshots by text, category, or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-black'
                      : 'border border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-800'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            Showing {filteredScreenshots.length} screenshot
            {filteredScreenshots.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading && <p className="mt-8 text-zinc-400">Loading...</p>}
        {error && <p className="mt-8 text-red-400">{error}</p>}

        {!loading && !error && filteredScreenshots.length === 0 && (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
            No matching screenshots found.
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filteredScreenshots.map((shot, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
              <div className="p-5">
                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                  <img
                    src={`http://127.0.0.1:8000/${shot.saved_to.replaceAll('\\', '/')}`}
                    alt={shot.filename}
                    className="h-64 w-full object-cover"
                  />
                </div>

                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold leading-snug break-words">
                      {shot.filename}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      {(shot.size_bytes / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getCategoryBadgeStyles(
                      shot.category
                    )}`}
                  >
                    {shot.category}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-zinc-300">Extracted Text Preview</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
                    {shot.cleaned_text || 'No extracted text available.'}
                  </p>
                </div>

                <details className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-zinc-300">
                    Show details
                  </summary>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Cleaned Text
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400 break-words">
                        {shot.cleaned_text}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Raw OCR Text
                      </p>
                      <pre className="mt-2 overflow-x-auto rounded-xl bg-black p-4 text-xs text-zinc-400 whitespace-pre-wrap">
                        {shot.raw_text}
                      </pre>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}