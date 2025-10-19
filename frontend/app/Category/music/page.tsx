'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader'; 

type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audio?: string;
};

function AudioPlayer({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <audio src={src} ref={audioRef} onEnded={() => setPlaying(false)} />
      <button onClick={toggle} className="px-3 py-1 bg-purple-600 text-white rounded">
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

export default function Music() {
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
        <Loader message="Loading Music..." />
      </div>
    );
  }

  const tracks: Track[] = [
    { id: 'm1', title: 'Aurora Beats', artist: 'S. Vega', duration: '2:45', audio: '' },
    { id: 'm2', title: 'Echoes', artist: 'R. Snow', duration: '3:10', audio: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Music NFTs</h1>
          <p className="text-gray-600 mt-1">Audio-driven collectibles, albums and exclusive drops with royalty info and previews.</p>
        </header>

        {/* Music Collections */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Featured Albums</h2>
          <div className="flex gap-4 flex-wrap">
            <Link href="/explore/music/album-1" className="px-4 py-2 bg-white border border-gray-200 rounded shadow-sm">Synthwave Drops</Link>
            <Link href="/explore/music/album-2" className="px-4 py-2 bg-white border border-gray-200 rounded shadow-sm">Acoustic Sessions</Link>
          </div>
        </section>

        {/* Tracks with audio preview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Listen to previews</h2>
          <div className="space-y-4">
            {tracks.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-gray-500">{t.artist} • {t.duration}</div>
                </div>
                <AudioPlayer src={t.audio} />
              </div>
            ))}
          </div>
        </section>

        {/* Royalty and artist drops */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Artist Drops & Royalties</h2>
          <p className="text-sm text-gray-600">Each music NFT includes metadata about royalties paid to the creator on secondary sales.</p>
        </section>
      </main>
    </div>
  );
}