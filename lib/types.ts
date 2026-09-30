export interface Member {
  id: string;
  name: string;
  avatar?: string;
}

export type SplitType = 'EQUAL' | 'EXACT';

export interface SplitShare {
  memberId: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  category: 'Food' | 'Transport' | 'Housing' | 'Entertainment' | 'Other';
  date: string;
  splitType: SplitType;
  shares: SplitShare[];
}

export interface DebtTransfer {
  from: string; // Member ID
  to: string;   // Member ID
  amount: number;
}

export interface MemberBalance {
  memberId: string;
  paid: number;
  share: number;
  netBalance: number; // positive = owed money, negative = owes money
}