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
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold">Processed Screenshots</h1>
        <p className="mt-2 text-zinc-400">
          View uploaded screenshots and search by extracted text.
        </p>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search screenshots by text, category, or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
          />
        </div>

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
                    : 'border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800'
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

        {loading && <p className="mt-8">Loading...</p>}
        {error && <p className="mt-8 text-red-400">{error}</p>}

        {!loading && !error && filteredScreenshots.length === 0 && (
          <p className="mt-8 text-zinc-400">No matching screenshots found.</p>
        )}

        <div className="mt-8 grid gap-6">
          {filteredScreenshots.map((shot, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <img
                src={`http://127.0.0.1:8000/${shot.saved_to.replaceAll('\\', '/')}`}
                alt={shot.filename}
                className="w-full max-w-md rounded-xl border border-zinc-700"
              />

              <h2 className="mt-4 text-2xl font-medium">{shot.filename}</h2>

              <p className="mt-2 text-sm text-zinc-400">
                Category: <span className="text-white">{shot.category}</span>
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Size: <span className="text-white">{shot.size_bytes} bytes</span>
              </p>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-zinc-300">Cleaned Text</h3>
                <p className="mt-1 text-sm text-zinc-400 break-words">
                  {shot.cleaned_text}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-zinc-300">Raw OCR Text</h3>
                <pre className="mt-1 overflow-x-auto rounded-xl bg-black p-4 text-xs text-zinc-400">
                  {shot.raw_text}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}