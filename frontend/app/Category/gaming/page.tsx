'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader'; 

type GameItem = {
  id: string;
  name: string;
  game: string;
  type: string;
  rarity: string;
  image?: string;
};

function GameItemCard({ item }: { item: GameItem }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="aspect-square bg-gray-100">
        <img src={item.image || '/placeholder-nft.png'} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h4 className="font-semibold">{item.name}</h4>
        <div className="text-xs text-gray-500">{item.game} • {item.type}</div>
        <div className="mt-2 text-xs">
          <span className="px-2 py-1 bg-yellow-50 rounded border border-yellow-100 text-yellow-700">{item.rarity}</span>
        </div>
      </div>
    </div>
  );
}

export default function Gaming() {
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
        <Loader message="Loading Gaming Items..." />
      </div>
    );
  }

  const demoItems: GameItem[] = [
    { id: 'g1', name: 'Exo Blade', game: 'SkyRift', type: 'Weapon', rarity: 'Epic' },
    { id: 'g2', name: 'Mystic Mount', game: 'RealmRun', type: 'Mount', rarity: 'Legendary' },
    { id: 'g3', name: 'Pixel Hero', game: 'ArenaX', type: 'Character', rarity: 'Rare' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Gaming</h1>
          <p className="text-gray-600 mt-1">In-game items, characters and assets — discover play-to-earn integrations and marketplaces.</p>
        </header>

        {/* Highlights */}
        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium">Play-to-Earn Integrations</h3>
            <p className="text-sm text-gray-600 mt-2">Connect your wallet to play supported games and earn token rewards.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium">Game Showcases</h3>
            <p className="text-sm text-gray-600 mt-2">Featured collections from top game studios and indie creators.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium">Market</h3>
            <p className="text-sm text-gray-600 mt-2">Browse in-game items by title, type, and rarity.</p>
          </div>
        </section>

        {/* Game Items */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular Game Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoItems.map(i => <GameItemCard key={i.id} item={i} />)}
          </div>
        </section>

        {/* Marketplace link */}
        <section>
          <Link href="/explore/gaming" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg">Browse full gaming marketplace</Link>
        </section>
      </main>
    </div>
  );
}