import { Expense, Member, MemberBalance, DebtTransfer } from './types';

/**
 * 1. Computes total spent, total share, and net position per member.
 */
export function calculateBalances(members: Member[], expenses: Expense[]): Record<string, MemberBalance> {
  const balances: Record<string, MemberBalance> = {};

  members.forEach((m) => {
    balances[m.id] = { memberId: m.id, paid: 0, share: 0, netBalance: 0 };
  });

  expenses.forEach((expense) => {
    // Add amount to the person who paid
    if (balances[expense.paidById]) {
      balances[expense.paidById].paid += expense.amount;
    }

    // Add shares to all participants
    expense.shares.forEach((share) => {
      if (balances[share.memberId]) {
        balances[share.memberId].share += share.amount;
      }
    });
  });

  // Calculate net = paid - share
  Object.values(balances).forEach((b) => {
    b.netBalance = Number((b.paid - b.share).toFixed(2));
  });

  return balances;
}

/**
 * 2. Greedy Debt Simplification Algorithm
 * Matches the biggest debtor with the biggest creditor iteratively.
 */
export function computeSimplifiedDebts(balances: Record<string, MemberBalance>): DebtTransfer[] {
  interface BalanceNode {
    id: string;
    amount: number;
  }

  const debtors: BalanceNode[] = [];
  const creditors: BalanceNode[] = [];

  Object.values(balances).forEach((b) => {
    const net = Number(b.netBalance.toFixed(2));
    if (net < -0.01) {
      debtors.push({ id: b.memberId, amount: -net }); // Convert to positive amount owed
    } else if (net > 0.01) {
      creditors.push({ id: b.memberId, amount: net });
    }
  });

  const transfers: DebtTransfer[] = [];

  // Sort descending by value
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0; // debtor pointer
  let j = 0; // creditor pointer

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settledAmount = Math.min(debtor.amount, creditor.amount);

    if (settledAmount > 0.01) {
      transfers.push({
        from: debtor.id,
        to: creditor.id,
        amount: Number(settledAmount.toFixed(2)),
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (Math.abs(debtor.amount) < 0.01) i++;
    if (Math.abs(creditor.amount) < 0.01) j++;
  }

  return transfers;
}