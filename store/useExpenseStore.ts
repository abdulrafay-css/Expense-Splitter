import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Member, Expense } from '@/lib/types';

interface ExpenseState {
  members: Member[];
  expenses: Expense[];
  
  // Actions
  addMember: (name: string) => void;
  removeMember: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  settleDebt: (fromId: string, toId: string, amount: number) => void;
  resetAll: () => void;
}

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alex' },
  { id: '2', name: 'Bilal' },
  { id: '3', name: 'Charlie' },
  { id: '4', name: 'Diana' },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'e1',
    description: 'Airbnb Chalet',
    amount: 320,
    paidById: '1', // Alex paid
    category: 'Housing',
    date: '2026-09-25',
    splitType: 'EQUAL',
    shares: [
      { memberId: '1', amount: 80 },
      { memberId: '2', amount: 80 },
      { memberId: '3', amount: 80 },
      { memberId: '4', amount: 80 },
    ],
  },
  {
    id: 'e2',
    description: 'Roadtrip Highway Fuel',
    amount: 90,
    paidById: '2', // Bilal paid
    category: 'Transport',
    date: '2026-09-26',
    splitType: 'EQUAL',
    shares: [
      { memberId: '1', amount: 22.5 },
      { memberId: '2', amount: 22.5 },
      { memberId: '3', amount: 22.5 },
      { memberId: '4', amount: 22.5 },
    ],
  },
];

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      members: INITIAL_MEMBERS,
      expenses: INITIAL_EXPENSES,

      addMember: (name) =>
        set((state) => ({
          members: [...state.members, { id: Date.now().toString(), name }],
        })),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          expenses: state.expenses.filter(
            (e) => e.paidById !== id && !e.shares.some((s) => s.memberId === id)
          ),
        })),

      addExpense: (expenseData) =>
        set((state) => ({
          expenses: [
            { ...expenseData, id: Date.now().toString() },
            ...state.expenses,
          ],
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      settleDebt: (fromId, toId, amount) =>
        set((state) => {
          // Record a settlement transaction as an offsetting expense
          const fromMember = state.members.find((m) => m.id === fromId);
          const toMember = state.members.find((m) => m.id === toId);

          const settlementExpense: Expense = {
            id: Date.now().toString(),
            description: `Payment: ${fromMember?.name} -> ${toMember?.name}`,
            amount,
            paidById: fromId,
            category: 'Other',
            date: new Date().toISOString().split('T')[0],
            splitType: 'EXACT',
            shares: [{ memberId: toId, amount }],
          };

          return { expenses: [settlementExpense, ...state.expenses] };
        }),

      resetAll: () =>
        set({
          members: INITIAL_MEMBERS,
          expenses: INITIAL_EXPENSES,
        }),
    }),
    {
      name: 'splitwise-v2-storage',
    }
  )
);