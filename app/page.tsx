'use client';

import React from 'react';
import BalanceOverview from '@/components/BalanceOverview';
import DebtSettlementList from '@/components/DebtSettlementList';
import ExpenseList from '@/components/ExpenseList';
import MemberManager from '@/components/MemberManager';
import AddExpenseModal from '@/components/AddExpenseModal';

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Top Banner Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Weekend Trip Ledger</h1>
          <p className="text-xs text-zinc-400">
            Log expenses, calculate exact shares, and resolve group balances.
          </p>
        </div>
        <AddExpenseModal />
      </div>

      {/* Net Balances Strip */}
      <BalanceOverview />

      {/* Main Grid: Left = Settlements & Ledger, Right = Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DebtSettlementList />
          <ExpenseList />
        </div>
        <div className="space-y-6">
          <MemberManager />
        </div>
      </div>
    </div>
  );
}