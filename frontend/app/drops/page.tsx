'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Drop = {
  id: string;
  project: string;
  artist: string;
  start: string; // ISO
  end?: string; // optional ISO
  mintPriceUSD: number;
  supply: number;
  minted: number;
  category: 'Art' | 'Gaming' | 'Music' | 'Sports' | 'VirtualWorld' | 'Other';
  verified?: boolean;
  blueChip?: boolean;
  floorAfter?: number; // for past drops
};

type Stat = { label: string; value: string };

function useCountdown(targetIso: string | undefined) {
  const [remainingMs, setRemainingMs] = useState<number>(() => {
    if (!targetIso) return 0;
    return Math.max(new Date(targetIso).getTime() - Date.now(), 0);
  });

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();
    const tick = () => setRemainingMs(Math.max(target - Date.now(), 0));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const seconds = Math.floor((remainingMs / 1000) % 60);
  const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
  const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

  return { remainingMs, days, hours, minutes, seconds, isExpired: remainingMs <= 0 };
}

function formatCountdown({ days, hours, minutes, seconds }: ReturnType<typeof useCountdown>) {
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function ProgressBar({ minted, supply }: { minted: number; supply: number }) {
  const pct = Math.min(100, Math.round((minted / Math.max(1, supply)) * 100));
  return (
    <div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div style={{ width: `${pct}%` }} className="h-2 bg-purple-600" />
      </div>
      <div className="text-xs text-gray-500 mt-1">{minted} / {supply} minted ({pct}%)</div>
    </div>
  );
}

function DropCard({ drop, mode }: { drop: Drop; mode: 'upcoming' | 'live' | 'past' }) {
  const countdown = useCountdown(mode === 'past' ? drop.end : drop.start);
  const timeLabel = mode === 'live' ? 'Time remaining' : mode === 'upcoming' ? 'Starts in' : 'Ended';
  const remaining = formatCountdown(countdown);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{drop.project}</h3>
          <div className="text-sm text-gray-500">by {drop.artist} • {drop.category} {drop.verified && <span className="ml-2 inline text-xs text-white bg-green-600 px-2 py-0.5 rounded">Verified</span>}</div>
          <div className="mt-2 text-sm text-gray-700">
            Mint: <span className="font-medium">${drop.mintPriceUSD.toFixed(2)}</span>
            <span className="ml-3 text-xs text-gray-500">Supply: {drop.supply}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">{timeLabel}</div>
          <div className={`text-sm font-medium ${mode === 'live' ? 'text-red-600' : 'text-gray-800'}`}>{mode === 'past' ? (drop.floorAfter ? `$${drop.floorAfter} floor` : '—') : remaining}</div>
          <div className="mt-3 flex flex-col items-end gap-2">
            {mode === 'upcoming' && <button onClick={() => alert(`Remind set for ${drop.project}`)} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded">Notify Me</button>}
            {mode === 'live' && (
              <>
                <button onClick={() => alert(`Minting ${drop.project}`)} className="px-3 py-1 text-sm bg-purple-600 text-white rounded">Mint Now</button>
                <div className="w-40 mt-2"><ProgressBar minted={drop.minted} supply={drop.supply} /></div>
              </>
            )}
            {mode === 'past' && <Link href={`/marketplace/collections/${drop.id}`} className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded">View on Marketplace</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}

// mock data
const MOCK_DROPS: Drop[] = [
  { id: 'd1', project: 'Neon Canvas', artist: 'A. Rivera', start: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), mintPriceUSD: 50, supply: 1000, minted: 120, category: 'Art', verified: true },
  { id: 'd2', project: 'SkyRift Exo Blade', artist: 'SkyRift Studio', start: new Date(Date.now() - 1000 * 60 * 60).toISOString(), end: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), mintPriceUSD: 12, supply: 500, minted: 320, category: 'Gaming', verified: false },
  { id: 'd3', project: 'Aurora Beats Drop', artist: 'S. Vega', start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), end: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60).toISOString(), mintPriceUSD: 8, supply: 300, minted: 300, category: 'Music', verified: true, floorAfter: 18 },
  { id: 'd4', project: 'Legends Moment', artist: 'SportsX', start: new Date(Date.now() + 1000 * 60 * 30).toISOString(), mintPriceUSD: 5, supply: 100, minted: 5, category: 'Sports', blueChip: true },
  { id: 'd5', project: 'Parcel A-12', artist: 'MetaWorld', start: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), end: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), mintPriceUSD: 300, supply: 10, minted: 10, category: 'VirtualWorld', verified: true, floorAfter: 420 },
];

export default function DropsPage() {
  const [category, setCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [blueChipOnly, setBlueChipOnly] = useState(false);

  const now = Date.now();

  const filtered = useMemo(() => {
    return MOCK_DROPS.filter(d => {
      if (category !== 'All' && d.category !== category) return false;
      if (minPrice !== '' && d.mintPriceUSD < Number(minPrice)) return false;
      if (maxPrice !== '' && d.mintPriceUSD > Number(maxPrice)) return false;
      if (verifiedOnly && !d.verified) return false;
      if (blueChipOnly && !d.blueChip) return false;
      if (startDate && new Date(d.start).getTime() < new Date(startDate).getTime()) return false;
      if (endDate && new Date(d.start).getTime() > new Date(endDate).getTime()) return false;
      return true;
    });
  }, [category, minPrice, maxPrice, verifiedOnly, blueChipOnly, startDate, endDate]);

  const upcoming = filtered.filter(d => new Date(d.start).getTime() > now);
  const live = filtered.filter(d => new Date(d.start).getTime() <= now && (d.end ? new Date(d.end).getTime() > now : true));
  const past = filtered.filter(d => d.end ? new Date(d.end).getTime() < now : false);

  const stats: Stat[] = [
    { label: '24h Volume', value: 'Ξ 120' },
    { label: '7d Volume', value: 'Ξ 980' },
    { label: '30d Volume', value: 'Ξ 3,420' },
    { label: 'Traders (24h)', value: '1,240' },
    { label: 'Avg Sale', value: '$75' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Drops</h1>
          <p className="text-gray-600">Find upcoming, live and past drops. Filter by category, price, date and more.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Filters & Stats (acts like sidebar) */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="space-y-3">
                <label className="block text-sm">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
                  <option>All</option>
                  <option>Art</option>
                  <option>Gaming</option>
                  <option>Music</option>
                  <option>Sports</option>
                  <option>VirtualWorld</option>
                  <option>Other</option>
                </select>

                <div className="flex gap-2">
                  <input placeholder="Min $" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-1/2 p-2 border rounded" />
                  <input placeholder="Max $" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-1/2 p-2 border rounded" />
                </div>

                <label className="block text-sm">Date range</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border rounded mb-2" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border rounded" />

                <div className="flex flex-col mt-2">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} />
                    Verified artists only
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={blueChipOnly} onChange={e => setBlueChipOnly(e.target.checked)} />
                    Blue-chip projects
                  </label>
                </div>

                <button onClick={() => { setCategory('All'); setMinPrice('' as any); setMaxPrice('' as any); setStartDate(''); setEndDate(''); setVerifiedOnly(false); setBlueChipOnly(false); }} className="mt-3 w-full text-sm p-2 bg-gray-100 rounded">Reset filters</button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-3">Market Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">{s.label}</div>
                    <div className="font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Your Stats</h4>
                <div className="text-sm text-gray-700">Portfolio: <span className="font-semibold">$1,240</span></div>
                <div className="text-sm text-gray-700">NFTs owned: <span className="font-semibold">12</span></div>
                <div className="text-sm text-gray-700">Total spent: <span className="font-semibold">$2,200</span></div>
              </div>
            </div>
          </aside>

          {/* Main: Drops lists */}
          <section className="lg:col-span-3 space-y-6">
            {/* Live Now */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Live Now</h2>
                <Link href="/drops/live" className="text-sm text-purple-600">See all</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {live.length > 0 ? live.map(d => <DropCard key={d.id} drop={d} mode="live" />) : <div className="text-sm text-gray-500">No live drops currently</div>}
              </div>
            </div>

            {/* Upcoming */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Upcoming Drops</h2>
                <Link href="/drops/upcoming" className="text-sm text-purple-600">See calendar</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcoming.length > 0 ? upcoming.sort((a,b)=> new Date(a.start).getTime()-new Date(b.start).getTime()).map(d => <DropCard key={d.id} drop={d} mode="upcoming" />) : <div className="text-sm text-gray-500">No upcoming drops</div>}
              </div>
            </div>

            {/* Past Drops */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Past Drops</h2>
                <Link href="/drops/past" className="text-sm text-purple-600">View archive</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {past.length > 0 ? past.map(d => <DropCard key={d.id} drop={d} mode="past" />) : <div className="text-sm text-gray-500">No past drops found</div>}
              </div>
            </div>

            {/* Collection Analytics / Additional Dashboard */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Collection Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Floor Price (30d)</div>
                  <div className="font-semibold mt-1">$42</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Volume trend</div>
                  <div className="font-semibold mt-1">+12% (7d)</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Holder distribution</div>
                  <div className="font-semibold mt-1">Top 10 hold 24%</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Wallet Insights</h4>
                <div className="text-sm text-gray-700">Gas fees spent: <span className="font-semibold">Ξ 0.85</span></div>
                <div className="text-sm text-gray-700">Minting activity: <span className="font-semibold">5 mints this month</span></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
