'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader'; 

type Artwork = {
  id: string;
  title: string;
  artist: string;
  style: string;
  medium: string;
  image?: string;
};

function ArtworkCard({ art }: { art: Artwork }) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-video bg-gray-100">
        <img
          src={art.image || '/placeholder-nft.png'}
          alt={art.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900">{art.title}</h3>
        <div className="text-xs text-gray-500">by {art.artist}</div>
        <div className="mt-2 text-xs text-gray-600">
          <span className="mr-2 px-2 py-1 bg-gray-50 rounded">{art.style}</span>
          <span className="mr-2 px-2 py-1 bg-gray-50 rounded">{art.medium}</span>
        </div>
      </div>
    </article>
  );
}

function ArtistSpotlight({ name, bio }: { name: string; bio: string }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{bio}</p>
      <Link
        href={`/profile`}
        className="text-sm text-purple-600 mt-2 inline-block"
      >
        View profile →
      </Link>
    </div>
  );
}

export default function Art() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    style: 'All',
    medium: 'All',
    artist: 'All',
  });

  useEffect(() => {
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // ✅ Centered loader
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading Art..." />
      </div>
    );
  }

  const sampleArt: Artwork[] = [
    {
      id: '1',
      title: 'Neon Dreams',
      artist: 'A. Rivera',
      style: 'Neo-Expressionism',
      medium: 'Digital',
      image: '/placeholder-nft.png',
    },
    {
      id: '2',
      title: 'Silent Waves',
      artist: 'M. Chen',
      style: 'Abstract',
      medium: 'Photography',
      image: '/placeholder-nft.png',
    },
    {
      id: '3',
      title: 'Golden Hour',
      artist: 'L. Ito',
      style: 'Impressionism',
      medium: 'Painting',
      image: '/placeholder-nft.png',
    },
  ];

  const featuredCollections = [
    { id: 'fc1', title: 'Emerging Digital Artists' },
    { id: 'fc2', title: 'Photography: The Modern Lens' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Art</h1>
          <p className="text-gray-600 mt-1">
            Curated NFT art: paintings, illustrations, and digital artwork.
          </p>
        </header>

        {/* Filters */}
        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Filters</h3>
            <div className="space-y-2">
              <label className="block text-sm">Style</label>
              <select
                className="w-full border rounded p-2"
                value={filters.style}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, style: e.target.value }))
                }
              >
                <option>All</option>
                <option>Abstract</option>
                <option>Impressionism</option>
                <option>Neo-Expressionism</option>
                <option>Digital</option>
              </select>

              <label className="block text-sm mt-2">Medium</label>
              <select
                className="w-full border rounded p-2"
                value={filters.medium}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, medium: e.target.value }))
                }
              >
                <option>All</option>
                <option>Digital</option>
                <option>Painting</option>
                <option>Photography</option>
              </select>

              <label className="block text-sm mt-2">Artist</label>
              <select
                className="w-full border rounded p-2"
                value={filters.artist}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, artist: e.target.value }))
                }
              >
                <option>All</option>
                <option>A. Rivera</option>
                <option>M. Chen</option>
                <option>L. Ito</option>
              </select>
            </div>
          </div>

          {/* Featured Collections */}
          <div className="md:col-span-2 grid gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-3">Featured Collections</h3>
              <div className="flex gap-3 flex-wrap">
                {featuredCollections.map((c) => (
                  <Link
                    key={c.id}
                    href={`/explore/collections/${c.id}`}
                    className="px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded border border-gray-100 text-sm text-gray-800"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Marketplace stats */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Total Artworks</div>
                <div className="text-2xl font-bold">1,248</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Top Artist</div>
                <div className="text-lg font-semibold">A. Rivera</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">24h Volume</div>
                <div className="text-lg font-semibold">Ξ 120</div>
              </div>
            </div>
          </div>
        </section>

        {/* Artwork Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Discover Art</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleArt.map((a) => (
              <ArtworkCard key={a.id} art={a} />
            ))}
          </div>
        </section>

        {/* Artist Spotlights */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Artist Spotlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ArtistSpotlight
              name="A. Rivera"
              bio="Digital artist exploring neon palettes and surreal landscapes. Recent drop sold out in minutes."
            />
            <ArtistSpotlight
              name="M. Chen"
              bio="Photographer and NFT creator blending documentary and generative elements."
            />
            <ArtistSpotlight
              name="L. Ito"
              bio="Painter focusing on texture and light — now transitioning to tokenized works."
            />
          </div>
        </section>
      </main>
    </div>
  );
}