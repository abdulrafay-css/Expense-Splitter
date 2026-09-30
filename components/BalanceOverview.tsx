'use client';

import React from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { calculateBalances } from '@/lib/settlementEngine';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function BalanceOverview() {
  const { members, expenses } = useExpenseStore();
  const balances = calculateBalances(members, expenses);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-zinc-100">Member Net Balances</h2>
        <span className="text-xs text-zinc-400">
          Total Spent: <strong className="text-zinc-200">${totalSpent.toFixed(2)}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {members.map((member) => {
          const balance = balances[member.id]?.netBalance || 0;
          const isPositive = balance > 0.01;
          const isNegative = balance < -0.01;

          return (
            <div
              key={member.id}
              className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm text-zinc-200">{member.name}</span>
                {isPositive && <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
                {isNegative && <ArrowDownLeft className="w-4 h-4 text-rose-400" />}
                {!isPositive && !isNegative && <CheckCircle2 className="w-4 h-4 text-zinc-500" />}
              </div>

              <div className="mt-3">
                <div className="text-xs text-zinc-500">
                  {isPositive ? 'Gets back' : isNegative ? 'Owes group' : 'Settled up'}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isPositive
                      ? 'text-emerald-400'
                      : isNegative
                      ? 'text-rose-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {isPositive ? `+$${balance.toFixed(2)}` : isNegative ? `-$${Math.abs(balance).toFixed(2)}` : '$0.00'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}