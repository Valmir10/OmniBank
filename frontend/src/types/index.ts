export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type Currency = "SEK" | "BTC" | "ETH";

export interface Account {
  id: string;
  userId: string;
  currency: Currency;
  balance: number;
}

export type TransactionType = "deposit" | "withdrawal" | "transfer" | "exchange";
export type TransactionCategory =
  | "food"
  | "entertainment"
  | "rent"
  | "salary"
  | "transport"
  | "utilities"
  | "crypto_exchange"
  | "other";

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  description: string;
  transactionHash: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  month: number;
  year: number;
}

export interface BudgetAlert {
  budgetId: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  exceeded: boolean;
  message: string;
}
