export interface AggregatedAccount {
  source: "omnibank" | "external";
  bankName: string;
  accountId: string;
  currency: string;
  balance: number;
}

export interface AggregatedTransaction {
  id: string;
  source: "omnibank" | "external";
  bankName: string;
  type: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

export interface SpendingByCategory {
  category: string;
  total: number;
}

export interface DashboardData {
  accounts: AggregatedAccount[];
  totalBalance: number;
  transactions: AggregatedTransaction[];
  spendingByCategory: SpendingByCategory[];
}
