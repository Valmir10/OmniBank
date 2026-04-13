import { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { MockBankApi, ExternalAccount, ExternalTransaction } from "../../infrastructure/external-apis/MockBankApi";

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

export class AggregatorService {
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository,
    private mockBankApi: MockBankApi
  ) {}

  async getDashboardData(userId: string): Promise<DashboardData> {
    // Fetch from internal + external in parallel
    const [internalAccounts, internalTransactions, externalAccounts, externalTransactions] =
      await Promise.all([
        this.accountRepository.findByUserId(userId),
        this.getInternalTransactions(userId),
        this.mockBankApi.getAccounts(),
        this.mockBankApi.getTransactions(),
      ]);

    const accounts: AggregatedAccount[] = [
      ...internalAccounts.map((a) => ({
        source: "omnibank" as const,
        bankName: "OmniBank",
        accountId: a.id,
        currency: a.currency,
        balance: a.balance,
      })),
      ...externalAccounts.map((a: ExternalAccount) => ({
        source: "external" as const,
        bankName: a.bankName,
        accountId: a.accountNumber,
        currency: a.currency,
        balance: a.balance,
      })),
    ];

    const transactions: AggregatedTransaction[] = [
      ...internalTransactions.map((t) => ({
        id: t.id,
        source: "omnibank" as const,
        bankName: "OmniBank",
        type: t.type,
        category: t.category,
        amount: t.amount,
        currency: t.currency,
        description: t.description,
        date: t.createdAt.toISOString().split("T")[0],
      })),
      ...externalTransactions.map((t: ExternalTransaction) => ({
        id: t.id,
        source: "external" as const,
        bankName: t.bankName,
        type: t.type,
        category: t.category,
        amount: t.amount,
        currency: t.currency,
        description: t.description,
        date: t.date,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    const spendingByCategory = this.calculateSpendingByCategory(transactions);

    return { accounts, totalBalance, transactions, spendingByCategory };
  }

  private async getInternalTransactions(userId: string) {
    const accounts = await this.accountRepository.findByUserId(userId);
    const allTransactions = await Promise.all(
      accounts.map((a) => this.transactionRepository.findByAccountId(a.id))
    );
    return allTransactions.flat();
  }

  private calculateSpendingByCategory(
    transactions: AggregatedTransaction[]
  ): SpendingByCategory[] {
    const spending = new Map<string, number>();

    for (const t of transactions) {
      if (t.type === "debit" || t.type === "withdrawal") {
        const current = spending.get(t.category) || 0;
        spending.set(t.category, current + t.amount);
      }
    }

    return Array.from(spending.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }
}
