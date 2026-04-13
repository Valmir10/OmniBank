import { Pool } from "pg";
import { Transaction } from "../../../domain/entities/Transaction";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { Currency } from "../../../domain/entities/Account";
import { TransactionType, TransactionCategory } from "../../../domain/entities/Transaction";

export class TransactionRepository implements ITransactionRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<Transaction | null> {
    const result = await this.pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.toDomain(result.rows[0]);
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const result = await this.pool.query(
      "SELECT * FROM transactions WHERE account_id = $1 ORDER BY created_at DESC",
      [accountId]
    );
    return result.rows.map((row) => this.toDomain(row));
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const result = await this.pool.query(
      `INSERT INTO transactions (id, account_id, type, category, amount, currency, description, transaction_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        transaction.id,
        transaction.accountId,
        transaction.type,
        transaction.category,
        transaction.amount,
        transaction.currency,
        transaction.description,
        transaction.transactionHash,
        transaction.createdAt,
      ]
    );
    return this.toDomain(result.rows[0]);
  }

  async findByAccountIdWithDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const result = await this.pool.query(
      `SELECT * FROM transactions
       WHERE account_id = $1 AND created_at >= $2 AND created_at <= $3
       ORDER BY created_at DESC`,
      [accountId, startDate, endDate]
    );
    return result.rows.map((row) => this.toDomain(row));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(
      "DELETE FROM transactions WHERE id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async updateAmount(id: string, amount: number): Promise<void> {
    await this.pool.query(
      "UPDATE transactions SET amount = $1 WHERE id = $2",
      [amount, id]
    );
  }

  private toDomain(row: Record<string, unknown>): Transaction {
    return Transaction.create({
      id: row.id as string,
      accountId: row.account_id as string,
      type: row.type as TransactionType,
      category: row.category as TransactionCategory,
      amount: parseFloat(row.amount as string),
      currency: row.currency as Currency,
      description: row.description as string,
      transactionHash: row.transaction_hash as string,
      createdAt: new Date(row.created_at as string),
    });
  }
}
