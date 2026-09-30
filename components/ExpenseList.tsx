'use client';

import React from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Trash2 } from 'lucide-react';

export default function ExpenseList() {
  const { expenses, members, deleteExpense } = useExpenseStore();

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || 'Unknown';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-100 mb-4">Expense Activity Ledger</h2>

      {expenses.length === 0 ? (
        <div className="py-8 text-center text-sm text-zinc-500">
          No expenses recorded yet. Click "Add Expense" to begin.
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80">
          {expenses.map((expense) => (
            <div key={expense.id} className="py-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-zinc-200">{expense.description}</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                    {expense.category}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Paid by <span className="text-zinc-300 font-medium">{getMemberName(expense.paidById)}</span> on{' '}
                  {expense.date} • Split among {expense.shares.length} people
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-zinc-200 font-mono">
                  ${expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-zinc-600 hover:text-rose-400 transition"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}