'use client';

import React from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { calculateBalances, computeSimplifiedDebts } from '@/lib/settlementEngine';
import { ArrowRight, CheckCheck } from 'lucide-react';

export default function DebtSettlementList() {
  const { members, expenses, settleDebt } = useExpenseStore();

  const balances = calculateBalances(members, expenses);
  const settlements = computeSimplifiedDebts(balances);

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || 'Unknown';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Settlement Suggestions</h2>
          <p className="text-xs text-zinc-400">Minimal cash transfers to clear all debts (Greedy Graph)</p>
        </div>
        <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">
          {settlements.length} transfer{settlements.length === 1 ? '' : 's'}
        </span>
      </div>

      {settlements.length === 0 ? (
        <div className="py-8 text-center text-sm text-zinc-500">
          🎉 All debts are settled! Nobody owes anything.
        </div>
      ) : (
        <div className="space-y-2.5">
          {settlements.map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/60"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-rose-400">{getMemberName(tx.from)}</span>
                <span className="text-zinc-500 text-xs">owes</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                <span className="font-semibold text-emerald-400">{getMemberName(tx.to)}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-zinc-200">
                  ${tx.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => settleDebt(tx.from, tx.to, tx.amount)}
                  className="flex items-center gap-1 text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md transition"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Settle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}