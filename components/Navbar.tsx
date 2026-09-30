'use client';

import React from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { RotateCcw, Wallet } from 'lucide-react';

export default function Navbar() {
  const resetAll = useExpenseStore((state) => state.resetAll);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-emerald-400">
          <Wallet className="w-6 h-6 text-emerald-500" />
          <span>EquiSplit <span className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full">v2</span></span>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset to initial demo data?')) resetAll();
          }}
          className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo
        </button>
      </div>
    </header>
  );
}