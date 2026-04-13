import { Pool } from "pg";
import { Account, Currency } from "../../../domain/entities/Account";
import { IAccountRepository } from "../../../domain/repositories/IAccountRepository";

export class AccountRepository implements IAccountRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<Account | null> {
    const result = await this.pool.query(
      "SELECT * FROM accounts WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.toDomain(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const result = await this.pool.query(
      "SELECT * FROM accounts WHERE user_id = $1",
      [userId]
    );
    return result.rows.map((row) => this.toDomain(row));
  }

  async findByUserIdAndCurrency(userId: string, currency: Currency): Promise<Account | null> {
    const result = await this.pool.query(
      "SELECT * FROM accounts WHERE user_id = $1 AND currency = $2",
      [userId, currency]
    );
    if (result.rows.length === 0) return null;
    return this.toDomain(result.rows[0]);
  }

  async create(account: Account): Promise<Account> {
    const result = await this.pool.query(
      `INSERT INTO accounts (id, user_id, currency, balance, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [account.id, account.userId, account.currency, account.balance, account.createdAt, account.updatedAt]
    );
    return this.toDomain(result.rows[0]);
  }

  async update(account: Account): Promise<Account> {
    const result = await this.pool.query(
      `UPDATE accounts SET balance = $1, updated_at = $2
       WHERE id = $3 RETURNING *`,
      [account.balance, account.updatedAt, account.id]
    );
    if (result.rows.length === 0) throw new Error("Account not found");
    return this.toDomain(result.rows[0]);
  }

  private toDomain(row: Record<string, unknown>): Account {
    return Account.create({
      id: row.id as string,
      userId: row.user_id as string,
      currency: row.currency as Currency,
      balance: parseFloat(row.balance as string),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }
}
