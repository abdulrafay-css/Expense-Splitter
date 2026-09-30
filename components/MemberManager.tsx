'use client';

import React, { useState } from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { UserPlus, X } from 'lucide-react';

export default function MemberManager() {
  const [name, setName] = useState('');
  const { members, addMember, removeMember } = useExpenseStore();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMember(name.trim());
    setName('');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-100 mb-3">Group Members</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="New friend name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        {members.map((m) => (
          <span
            key={m.id}
            className="inline-flex items-center gap-1 text-xs bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-md text-zinc-300"
          >
            {m.name}
            {members.length > 2 && (
              <button
                onClick={() => removeMember(m.id)}
                className="text-zinc-500 hover:text-rose-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}