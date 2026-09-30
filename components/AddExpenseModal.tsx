'use client';

import React, { useState } from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { SplitType, SplitShare } from '@/lib/types';
import { Plus, X } from 'lucide-react';

export default function AddExpenseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { members, addExpense } = useExpenseStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState(members[0]?.id || '');
  const [category, setCategory] = useState<'Food' | 'Transport' | 'Housing' | 'Entertainment' | 'Other'>('Food');
  const [splitType, setSplitType] = useState<SplitType>('EQUAL');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map((m) => m.id));
  const [exactShares, setExactShares] = useState<Record<string, string>>({});

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      if (selectedMembers.length === 1) return; // Must have at least 1 participant
      setSelectedMembers(selectedMembers.filter((m) => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount) || totalAmount <= 0) return alert('Enter a valid amount');
    if (!description.trim()) return alert('Description is required');

    let calculatedShares: SplitShare[] = [];

    if (splitType === 'EQUAL') {
      const sharePerPerson = Number((totalAmount / selectedMembers.length).toFixed(2));
      calculatedShares = selectedMembers.map((id) => ({
        memberId: id,
        amount: sharePerPerson,
      }));
    } else {
      // EXACT
      let sum = 0;
      calculatedShares = selectedMembers.map((id) => {
        const val = parseFloat(exactShares[id] || '0');
        sum += val;
        return { memberId: id, amount: val };
      });

      if (Math.abs(sum - totalAmount) > 0.05) {
        return alert(`Shares sum ($${sum}) does not equal total amount ($${totalAmount})`);
      }
    }

    addExpense({
      description,
      amount: totalAmount,
      paidById,
      category,
      date: new Date().toISOString().split('T')[0],
      splitType,
      shares: calculatedShares,
    });

    // Reset Form
    setDescription('');
    setAmount('');
    setExactShares({});
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium px-4 py-2 rounded-lg text-sm transition"
      >
        <Plus className="w-4 h-4" />
        Add Expense
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Add an Expense</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Dinner, Groceries, Uber"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Paid By</label>
                  <select
                    value={paidById}
                    onChange={(e) => setPaidById(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Housing">Housing</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Split Method</label>
                  <select
                    value={splitType}
                    onChange={(e: any) => setSplitType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none"
                  >
                    <option value="EQUAL">Split Equally</option>
                    <option value="EXACT">Exact Amounts</option>
                  </select>
                </div>
              </div>

              {/* Participant Selection */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Participants</label>
                <div className="flex flex-wrap gap-1.5">
                  {members.map((m) => {
                    const isSelected = selectedMembers.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => toggleMember(m.id)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exact Splits inputs if selected */}
              {splitType === 'EXACT' && (
                <div className="space-y-2 max-h-36 overflow-y-auto p-2 border border-zinc-800 rounded-lg bg-zinc-950">
                  {selectedMembers.map((id) => (
                    <div key={id} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300">{members.find((m) => m.id === id)?.name}</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={exactShares[id] || ''}
                        onChange={(e) =>
                          setExactShares({ ...exactShares, [id]: e.target.value })
                        }
                        className="w-24 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-right text-zinc-100"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-2 rounded-lg text-sm transition mt-2"
              >
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}