import Link from 'next/link';
import React from 'react';

export default function Photography() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Photography</h1>
        <p className="text-gray-700 mb-6">
          Discover photographic NFTs from talented photographers around the world.
        </p>
        <Link href="/explore/photography" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg">
          Browse Photography Collection
        </Link>
      </main>
    </div>
  );
}
