import { Budget } from "../../domain/entities/Budget";
import { IBudgetRepository } from "../../domain/repositories/IBudgetRepository";
import { TransactionCategory } from "../../domain/entities/Transaction";

export interface CreateBudgetDTO {
  userId: string;
  category: TransactionCategory;
  limitAmount: number;
  month: number;
  year: number;
}

export interface BudgetResponse {
  id: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  remainingAmount: number;
  isExceeded: boolean;
  month: number;
  year: number;
}

export class ManageBudget {
  constructor(private budgetRepository: IBudgetRepository) {}

  async create(dto: CreateBudgetDTO): Promise<BudgetResponse> {
    const existing = await this.budgetRepository.findByUserIdAndCategory(
      dto.userId, dto.category, dto.month, dto.year
    );
    if (existing) {
      throw new Error(`Budget for ${dto.category} already exists for ${dto.month}/${dto.year}`);
    }

    const budget = Budget.create({
      userId: dto.userId,
      category: dto.category,
      limitAmount: dto.limitAmount,
      currentSpent: 0,
      month: dto.month,
      year: dto.year,
    });

    const saved = await this.budgetRepository.create(budget);
    return this.toResponse(saved);
  }

  async getUserBudgets(userId: string): Promise<BudgetResponse[]> {
    const budgets = await this.budgetRepository.findByUserId(userId);
    return budgets.map((b) => this.toResponse(b));
  }

  async updateLimit(budgetId: string, newLimit: number): Promise<BudgetResponse> {
    const budget = await this.budgetRepository.findById(budgetId);
    if (!budget) throw new Error("Budget not found");

    const updated = Budget.create({
      ...budget,
      limitAmount: newLimit,
      updatedAt: new Date(),
    });

    const saved = await this.budgetRepository.update(updated);
    return this.toResponse(saved);
  }

  private toResponse(budget: Budget): BudgetResponse {
    return {
      id: budget.id,
      category: budget.category,
      limitAmount: budget.limitAmount,
      currentSpent: budget.currentSpent,
      remainingAmount: budget.remainingAmount,
      isExceeded: budget.isExceeded,
      month: budget.month,
      year: budget.year,
    };
  }
}
