'use client';

import { useEffect, useState } from 'react';

type Screenshot = {
  filename: string;
  saved_to: string;
  size_bytes: number;
  raw_text: string;
  cleaned_text: string;
  category: string;
};

export default function ScreenshotsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold">Processed Screenshots</h1>
        <p className="mt-2 text-zinc-400">
          View uploaded screenshots and their extracted data.
        </p>

        {loading && <p className="mt-8">Loading...</p>}
        {error && <p className="mt-8 text-red-400">{error}</p>}

        {!loading && !error && screenshots.length === 0 && (
          <p className="mt-8 text-zinc-400">No screenshots uploaded yet.</p>
        )}

        <div className="mt-8 grid gap-6">
          {screenshots.map((shot, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <img
                src={`http://127.0.0.1:8000/${shot.saved_to.replace("\\", "/")}`}
                alt={shot.filename}
                className="mt-4 w-full max-w-md rounded-lg border border-zinc-700"
               />
              <h2 className="text-xl font-medium">{shot.filename}</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Category: <span className="text-white">{shot.category}</span>
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Size: <span className="text-white">{shot.size_bytes} bytes</span>
              </p>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-zinc-300">Cleaned Text</h3>
                <p className="mt-1 text-sm text-zinc-400">{shot.cleaned_text}</p>
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