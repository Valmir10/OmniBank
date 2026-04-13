import { Transaction, TransactionCategory } from "../../domain/entities/Transaction";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import { IBudgetRepository } from "../../domain/repositories/IBudgetRepository";
import { Currency } from "../../domain/entities/Account";

export interface CreateTransactionDTO {
  userId: string;
  accountId: string;
  type: "deposit" | "withdrawal";
  category: TransactionCategory;
  amount: number;
  description: string;
}

export interface BudgetAlert {
  budgetId: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  exceeded: boolean;
  message: string;
}

export interface CreateTransactionResult {
  transaction: {
    id: string;
    type: string;
    category: string;
    amount: number;
    currency: Currency;
    description: string;
    transactionHash: string;
  };
  budgetAlert: BudgetAlert | null;
}

export class CreateTransaction {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository,
    private budgetRepository: IBudgetRepository
  ) {}

  async execute(dto: CreateTransactionDTO): Promise<CreateTransactionResult> {
    const account = await this.accountRepository.findById(dto.accountId);
    if (!account) throw new Error("Account not found");
    if (account.userId !== dto.userId) throw new Error("Unauthorized");

    // Update account balance
    const updatedAccount =
      dto.type === "deposit"
        ? account.credit(dto.amount)
        : account.debit(dto.amount);

    await this.accountRepository.update(updatedAccount);

    // Create transaction
    const transaction = Transaction.create({
      accountId: dto.accountId,
      type: dto.type,
      category: dto.category,
      amount: dto.amount,
      currency: account.currency,
      description: dto.description,
    });

    await this.transactionRepository.create(transaction);

    // Check budget if it's a spending transaction
    let budgetAlert: BudgetAlert | null = null;
    if (dto.type === "withdrawal") {
      budgetAlert = await this.checkBudget(dto.userId, dto.category, dto.amount);
    }

    return {
      transaction: {
        id: transaction.id,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        transactionHash: transaction.transactionHash,
      },
      budgetAlert,
    };
  }

  private async checkBudget(
    userId: string,
    category: TransactionCategory,
    amount: number
  ): Promise<BudgetAlert | null> {
    const now = new Date();
    const budget = await this.budgetRepository.findByUserIdAndCategory(
      userId, category, now.getMonth() + 1, now.getFullYear()
    );

    if (!budget) return null;

    const updated = budget.addSpending(amount);
    await this.budgetRepository.update(updated);

    const percentUsed = (updated.currentSpent / updated.limitAmount) * 100;

    // Alert if over 80% or exceeded
    if (percentUsed >= 80) {
      return {
        budgetId: budget.id,
        category,
        limitAmount: updated.limitAmount,
        currentSpent: updated.currentSpent,
        exceeded: updated.isExceeded,
        message: updated.isExceeded
          ? `Budget exceeded! You spent ${updated.currentSpent.toLocaleString()} kr of ${updated.limitAmount.toLocaleString()} kr on ${category}`
          : `Warning: ${Math.round(percentUsed)}% of your ${category} budget used (${updated.currentSpent.toLocaleString()} / ${updated.limitAmount.toLocaleString()} kr)`,
      };
    }

    return null;
  }
}
