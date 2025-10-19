'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader'; 

type PFP = {
  id: string;
  name: string;
  artist: string;
  collection: string;
  rarity: string;
  image?: string;
};

function PFPCard({ pfp }: { pfp: PFP }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="aspect-square bg-gray-100">
        <img 
          src={pfp.image || '/placeholder-nft.png'} 
          alt={pfp.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-lg">{pfp.name}</h4>
        <div className="text-sm text-gray-500">by {pfp.artist}</div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
            {pfp.collection}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            pfp.rarity === 'Legendary' ? 'bg-purple-100 text-purple-800' :
            pfp.rarity === 'Rare' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {pfp.rarity}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PFP() {
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
        <Loader message="Loading Profile Pictures..." />
      </div>
    );
  }

  const samplePFPs: PFP[] = [
    { 
      id: 'p1', 
      name: 'Cyber Punk #042', 
      artist: 'Neon Dreams', 
      collection: 'Cyber Punks',
      rarity: 'Legendary',
      image: '/placeholder-nft.png'
    },
    { 
      id: 'p2', 
      name: 'Ape #789', 
      artist: 'Bored Studio', 
      collection: 'Bored Apes',
      rarity: 'Rare',
      image: '/placeholder-nft.png'
    },
    { 
      id: 'p3', 
      name: 'Pudgy #156', 
      artist: 'Pudgy Penguins', 
      collection: 'Pudgy Penguins',
      rarity: 'Common',
      image: '/placeholder-nft.png'
    },
    { 
      id: 'p4', 
      name: 'Moonbird #233', 
      artist: 'Proof Collective', 
      collection: 'Moonbirds',
      rarity: 'Legendary',
      image: '/placeholder-nft.png'
    },
    { 
      id: 'p5', 
      name: 'Doodle #567', 
      artist: 'Doodles', 
      collection: 'Doodles',
      rarity: 'Rare',
      image: '/placeholder-nft.png'
    },
    { 
      id: 'p6', 
      name: 'Azuki #891', 
      artist: 'Chiru Labs', 
      collection: 'Azuki',
      rarity: 'Common',
      image: '/placeholder-nft.png'
    },
  ];

  const trendingCollections = [
    { id: 'c1', name: 'Bored Ape Yacht Club', volume: 'Ξ 1.2K' },
    { id: 'c2', name: 'CryptoPunks', volume: 'Ξ 980' },
    { id: 'c3', name: 'Moonbirds', volume: 'Ξ 750' },
    { id: 'c4', name: 'Doodles', volume: 'Ξ 620' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile Pictures (PFP)</h1>
          <p className="text-gray-600 text-lg">
            Avatar collections and digital identity NFTs. Find your next profile picture from top collections.
          </p>
        </header>

        {/* Stats & Filters Section */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-2">Total Collections</h3>
            <p className="text-2xl font-bold">248</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-2">24h Volume</h3>
            <p className="text-2xl font-bold">Ξ 2.4K</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-2">Top Collection</h3>
            <p className="text-lg font-semibold">Bored Apes</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-2">New Drops</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Collections & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Collections */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-3">Trending Collections</h3>
              <div className="space-y-2">
                {trendingCollections.map(collection => (
                  <div key={collection.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm font-medium">{collection.name}</span>
                    <span className="text-xs text-gray-500">{collection.volume}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Rarity</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>All Rarities</option>
                    <option>Legendary</option>
                    <option>Rare</option>
                    <option>Common</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Collection</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>All Collections</option>
                    <option>Bored Apes</option>
                    <option>CryptoPunks</option>
                    <option>Moonbirds</option>
                    <option>Doodles</option>
                    <option>Azuki</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>All Prices</option>
                    <option>Under Ξ 1</option>
                    <option>Ξ 1 - Ξ 5</option>
                    <option>Ξ 5 - Ξ 10</option>
                    <option>Over Ξ 10</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PFP Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured PFPs</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
                  Sort by: Newest
                </button>
                <Link 
                  href="/explore/pfp/marketplace" 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  View Marketplace
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {samplePFPs.map(pfp => (
                <PFPCard key={pfp.id} pfp={pfp} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-8">
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Load More PFPs
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}