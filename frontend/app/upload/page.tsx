'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setResult('Please choose a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setResult('Upload failed.');
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold">Upload a Screenshot</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Choose an image and send it to your FastAPI backend.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-300 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />

          <button
            onClick={handleUpload}
            className="mt-4 rounded-xl bg-black px-4 py-2 font-medium text-white dark:bg-white dark:text-black"
          >
            Upload
          </button>

          {result && (
            <pre className="mt-6 overflow-x-auto rounded-xl bg-zinc-100 p-4 text-sm dark:bg-zinc-950">
              {result}
            </pre>
          )}
        </div>
      </div>
    </main>
  );
}