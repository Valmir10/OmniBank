import { Budget } from "../entities/Budget";
import { TransactionCategory } from "../entities/Transaction";

export interface IBudgetRepository {
  findById(id: string): Promise<Budget | null>;
  findByUserId(userId: string): Promise<Budget[]>;
  findByUserIdAndCategory(
    userId: string,
    category: TransactionCategory,
    month: number,
    year: number
  ): Promise<Budget | null>;
  create(budget: Budget): Promise<Budget>;
  update(budget: Budget): Promise<Budget>;
}
