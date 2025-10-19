'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Loader from '@/components/Loader'; 

export default function Photography() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading Photography..." />
      </div>
    );
  }

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