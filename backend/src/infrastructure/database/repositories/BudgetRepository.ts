import { Pool } from "pg";
import { Budget } from "../../../domain/entities/Budget";
import { IBudgetRepository } from "../../../domain/repositories/IBudgetRepository";
import { TransactionCategory } from "../../../domain/entities/Transaction";

export class BudgetRepository implements IBudgetRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<Budget | null> {
    const result = await this.pool.query("SELECT * FROM budgets WHERE id = $1", [id]);
    if (result.rows.length === 0) return null;
    return this.toDomain(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<Budget[]> {
    const result = await this.pool.query(
      "SELECT * FROM budgets WHERE user_id = $1 ORDER BY year DESC, month DESC",
      [userId]
    );
    return result.rows.map((row) => this.toDomain(row));
  }

  async findByUserIdAndCategory(
    userId: string,
    category: TransactionCategory,
    month: number,
    year: number
  ): Promise<Budget | null> {
    const result = await this.pool.query(
      "SELECT * FROM budgets WHERE user_id = $1 AND category = $2 AND month = $3 AND year = $4",
      [userId, category, month, year]
    );
    if (result.rows.length === 0) return null;
    return this.toDomain(result.rows[0]);
  }

  async create(budget: Budget): Promise<Budget> {
    const result = await this.pool.query(
      `INSERT INTO budgets (id, user_id, category, limit_amount, current_spent, month, year, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        budget.id, budget.userId, budget.category, budget.limitAmount,
        budget.currentSpent, budget.month, budget.year, budget.createdAt, budget.updatedAt,
      ]
    );
    return this.toDomain(result.rows[0]);
  }

  async update(budget: Budget): Promise<Budget> {
    const result = await this.pool.query(
      `UPDATE budgets SET limit_amount = $1, current_spent = $2, updated_at = $3
       WHERE id = $4 RETURNING *`,
      [budget.limitAmount, budget.currentSpent, budget.updatedAt, budget.id]
    );
    if (result.rows.length === 0) throw new Error("Budget not found");
    return this.toDomain(result.rows[0]);
  }

  private toDomain(row: Record<string, unknown>): Budget {
    return Budget.create({
      id: row.id as string,
      userId: row.user_id as string,
      category: row.category as TransactionCategory,
      limitAmount: parseFloat(row.limit_amount as string),
      currentSpent: parseFloat(row.current_spent as string),
      month: row.month as number,
      year: row.year as number,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }
}
