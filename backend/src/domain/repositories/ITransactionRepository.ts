import { Transaction } from "../entities/Transaction";

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  create(transaction: Transaction): Promise<Transaction>;
  findByAccountIdWithDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]>;
  delete(id: string): Promise<boolean>;
  updateAmount(id: string, amount: number): Promise<void>;
}
