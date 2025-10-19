'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader'; 

type Asset = {
  id: string;
  name: string;
  category: string;
  image?: string;
};

function VirtualAssetCard({ a }: { a: Asset }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="aspect-square bg-gray-100">
        <img src={a.image || '/placeholder-nft.png'} alt={a.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h4 className="font-semibold">{a.name}</h4>
        <div className="text-xs text-gray-500">{a.category}</div>
      </div>
    </div>
  );
}

export default function VirtualWorld() {
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
        <Loader message="Loading Virtual World..." />
      </div>
    );
  }

  const assets: Asset[] = [
    { id: 'v1', name: 'Parcel A-12', category: 'Land' },
    { id: 'v2', name: 'Stealth Avatar', category: 'Avatar' },
    { id: 'v3', name: 'Arcane Cloak', category: 'Wearable' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Virtual Worlds</h1>
          <p className="text-gray-600 mt-1">Metaverse land, avatars, wearables and virtual real estate marketplaces.</p>
        </header>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Featured Assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map(a => <VirtualAssetCard key={a.id} a={a} />)}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3D & Viewer</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">3D model viewer integration placeholder — replace with your viewer (e.g. model-viewer, three.js) to preview avatars and assets in 3D.</p>
            <Link href="/explore/virtual-worlds" className="inline-block mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg">Explore Virtual Marketplace</Link>
          </div>
        </section>
      </main>
    </div>
  );
}