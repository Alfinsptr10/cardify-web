import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Showcase | Cardify',
  description: 'Explore the best digital greeting cards and photobooth strips created by the Cardify community.',
};

export default function ShowcasePage() {
  return (
    <main className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center bg-[#FDFBF3] text-[#1C1917]">
      <h1 className="text-4xl font-bold font-playfair mb-4">Showcase</h1>
      <p className="text-stone-500">Kumpulan karya terbaik dari Cardify akan segera hadir di sini.</p>
    </main>
  );
}