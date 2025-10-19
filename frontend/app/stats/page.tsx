'use client';

import React from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader'; 
type Stat = { label: string; value: string };

function StatCard({ label, value }: Stat) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function Sparkline({ points = [3,6,4,8,5,9,6] }: { points?: number[] }) {
  const max = Math.max(...points);
  const w = 120;
  const h = 36;
  const step = w / Math.max(1, points.length - 1);
  const coords = points.map((p, i) => `${i * step},${h - (p / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <polyline points={coords} fill="none" stroke="#7c3aed" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StatsPage() {
  const marketOverview: Stat[] = [
    { label: '24h Volume', value: 'Ξ 120' },
    { label: '7d Volume', value: 'Ξ 980' },
    { label: '30d Volume', value: 'Ξ 3,420' },
    { label: 'Traders (24h)', value: '1,240' },
    { label: 'Avg Sale', value: '$75' },
    { label: 'Market Cap', value: '$1.2M' },
  ];

  const topPerformers = [
    { id: 'c1', name: 'Neon Canvas', change: '+42%', volume: 'Ξ 320' },
    { id: 'c2', name: 'SkyRift', change: '+31%', volume: 'Ξ 210' },
    { id: 'c3', name: 'Aurora Beats', change: '+18%', volume: 'Ξ 90' },
  ];

  const trending = [
    { id: 't1', name: 'Emerging Digital Artists', floor: '$12' },
    { id: 't2', name: 'Play2Earn Showcases', floor: '$4' },
  ];

  const newlyListed = [
    { id: 'n1', name: 'Parcel A-12', price: '$300' },
    { id: 'n2', name: 'Exo Blade', price: '$80' },
  ];

  const userStats: Stat[] = [
    { label: 'Portfolio value', value: '$1,240' },
    { label: 'NFTs owned', value: '12' },
    { label: 'Total spent', value: '$2,200' },
    { label: 'Total earned', value: '$950' },
    { label: 'ROI', value: '−56%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Stats Dashboard</h1>
          <p className="text-gray-600 mt-1">Market overview, collection analytics, and wallet insights.</p>
        </header>

        {/* Market Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {marketOverview.map(s => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Top performers & Trending */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Top Performers (24h)</h2>
                <Link href="/stats/top" className="text-sm text-purple-600">See all</Link>
              </div>
              <ul className="space-y-3">
                {topPerformers.map(tp => (
                  <li key={tp.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{tp.name}</div>
                      <div className="text-xs text-gray-500">Vol: {tp.volume}</div>
                    </div>
                    <div className={`text-sm font-semibold ${tp.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{tp.change}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3">Trending Collections</h2>
              <div className="space-y-3">
                {trending.map(t => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-gray-500">Floor: {t.floor}</div>
                    </div>
                    <div className="w-28"><Sparkline /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3">Newly Listed</h2>
              <ul className="space-y-2">
                {newlyListed.map(n => (
                  <li key={n.id} className="flex items-center justify-between text-sm">
                    <div className="text-gray-700">{n.name}</div>
                    <div className="text-gray-900 font-medium">{n.price}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center: Collection Analytics */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Collection Analytics</h2>
                <div className="text-sm text-gray-500">Floor / Volume / Sales</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Floor price (30d)</div>
                  <div className="font-semibold mt-1">$42</div>
                  <div className="mt-2"><Sparkline points={[2,4,3,6,5,8,7]} /></div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Volume trends</div>
                  <div className="font-semibold mt-1">+12% (7d)</div>
                  <div className="mt-2"><Sparkline points={[5,7,6,9,8,12,11]} /></div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Sales activity</div>
                  <div className="font-semibold mt-1">320 sales</div>
                  <div className="mt-2"><Sparkline points={[1,3,2,4,3,5,4]} /></div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Holder distribution</div>
                  <div className="font-semibold mt-1">Top 10 hold 24%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Floor history</div>
                  <div className="font-semibold mt-1">$18 → $42</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Top Collections (quick view)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium">Neon Canvas</div>
                  <div className="text-xs text-gray-500">Floor $12</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium">SkyRift</div>
                  <div className="text-xs text-gray-500">Floor $8</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium">Aurora Beats</div>
                  <div className="text-xs text-gray-500">Floor $5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: User Stats & Wallet Insights */}
          <aside className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Your Statistics</h2>
                <Link href="/profile" className="text-sm text-purple-600">View profile</Link>
              </div>
              <div className="space-y-2">
                {userStats.map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">{s.label}</div>
                    <div className="font-medium text-gray-900">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Favorite collections</h4>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">Neon Canvas</span>
                  <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">SkyRift</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Wallet Insights</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div>Gas fees spent: <span className="font-semibold">Ξ 0.85</span></div>
                <div>Minting activity: <span className="font-semibold">5 mints this month</span></div>
                <div>Trading frequency: <span className="font-semibold">12 trades</span></div>
                <div>Profit / Loss: <span className="font-semibold text-red-600">−$1,250</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Filters</h3>
              <div className="space-y-2 text-sm">
                <label className="block">
                  <span className="text-xs text-gray-500">Category</span>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>All</option>
                    <option>Art</option>
                    <option>Gaming</option>
                    <option>Music</option>
                    <option>Sports</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs text-gray-500">Date range</span>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>24h</option>
                    <option>7d</option>
                    <option>30d</option>
                    <option>All time</option>
                  </select>
                </label>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
