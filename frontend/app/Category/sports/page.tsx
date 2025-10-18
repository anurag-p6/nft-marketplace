'use client';

import React from 'react';
import Link from 'next/link';

type Card = {
  id: string;
  title: string;
  player?: string;
  team?: string;
  image?: string;
};

function TradingCard({ card }: { card: Card }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="aspect-video bg-gray-100">
        <img src={card.image || '/placeholder-nft.png'} alt={card.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h4 className="font-semibold">{card.title}</h4>
        <div className="text-xs text-gray-500">{card.player} • {card.team}</div>
      </div>
    </div>
  );
}

export default function Sports() {
  const sampleCards: Card[] = [
    { id: 's1', title: 'Legendary Moment #1', player: 'J. Doe', team: 'Tigers' },
    { id: 's2', title: 'Rising Star Card', player: 'A. Smith', team: 'Raptors' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Sports</h1>
          <p className="text-gray-600 mt-1">Collectible player cards, sports moments and highlights tokenized as NFTs.</p>
        </header>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Highlights & Moments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleCards.map(c => <TradingCard key={c.id} card={c} />)}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Team Collections</h2>
          <div className="flex gap-3 flex-wrap">
            <Link href="/explore/sports/team/tigers" className="px-3 py-2 bg-white rounded border border-gray-200">Tigers Collection</Link>
            <Link href="/explore/sports/team/raptors" className="px-3 py-2 bg-white rounded border border-gray-200">Raptors Collection</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
