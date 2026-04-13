import { CreateTransaction } from "../../src/application/use-cases/CreateTransaction";
import { Account } from "../../src/domain/entities/Account";
import { Budget } from "../../src/domain/entities/Budget";
import { ITransactionRepository } from "../../src/domain/repositories/ITransactionRepository";
import { IAccountRepository } from "../../src/domain/repositories/IAccountRepository";
import { IBudgetRepository } from "../../src/domain/repositories/IBudgetRepository";

describe("CreateTransaction Use Case", () => {
  let createTransaction: CreateTransaction;
  let mockTransactionRepo: jest.Mocked<ITransactionRepository>;
  let mockAccountRepo: jest.Mocked<IAccountRepository>;
  let mockBudgetRepo: jest.Mocked<IBudgetRepository>;

  const account = Account.create({
    id: "acc-1",
    userId: "user-1",
    currency: "SEK",
    balance: 5000,
  });

  beforeEach(() => {
    mockTransactionRepo = {
      findById: jest.fn(),
      findByAccountId: jest.fn(),
      create: jest.fn().mockImplementation(async (t) => t),
      findByAccountIdWithDateRange: jest.fn(),
    };
    mockAccountRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdAndCurrency: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockImplementation(async (a) => a),
    };
    mockBudgetRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdAndCategory: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockImplementation(async (b) => b),
    };

    createTransaction = new CreateTransaction(
      mockTransactionRepo, mockAccountRepo, mockBudgetRepo
    );
  });

  it("should create a withdrawal and debit the account", async () => {
    mockAccountRepo.findById.mockResolvedValue(account);
    mockBudgetRepo.findByUserIdAndCategory.mockResolvedValue(null);

    const result = await createTransaction.execute({
      userId: "user-1",
      accountId: "acc-1",
      type: "withdrawal",
      category: "food",
      amount: 200,
      description: "Grocery",
    });

    expect(result.transaction.amount).toBe(200);
    expect(result.transaction.type).toBe("withdrawal");
    expect(mockAccountRepo.update).toHaveBeenCalledTimes(1);
  });

  it("should create a deposit and credit the account", async () => {
    mockAccountRepo.findById.mockResolvedValue(account);

    const result = await createTransaction.execute({
      userId: "user-1",
      accountId: "acc-1",
      type: "deposit",
      category: "salary",
      amount: 10000,
      description: "Salary",
    });

    expect(result.transaction.type).toBe("deposit");
    expect(result.budgetAlert).toBeNull();
  });

  it("should trigger budget alert when spending exceeds 80%", async () => {
    mockAccountRepo.findById.mockResolvedValue(account);

    const budget = Budget.create({
      id: "b1",
      userId: "user-1",
      category: "food",
      limitAmount: 1000,
      currentSpent: 750,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    mockBudgetRepo.findByUserIdAndCategory.mockResolvedValue(budget);

    const result = await createTransaction.execute({
      userId: "user-1",
      accountId: "acc-1",
      type: "withdrawal",
      category: "food",
      amount: 100,
      description: "Lunch",
    });

    expect(result.budgetAlert).not.toBeNull();
    expect(result.budgetAlert!.exceeded).toBe(false);
    expect(result.budgetAlert!.currentSpent).toBe(850);
  });

  it("should trigger exceeded alert when budget is surpassed", async () => {
    mockAccountRepo.findById.mockResolvedValue(account);

    const budget = Budget.create({
      id: "b1",
      userId: "user-1",
      category: "food",
      limitAmount: 1000,
      currentSpent: 900,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    mockBudgetRepo.findByUserIdAndCategory.mockResolvedValue(budget);

    const result = await createTransaction.execute({
      userId: "user-1",
      accountId: "acc-1",
      type: "withdrawal",
      category: "food",
      amount: 200,
      description: "Dinner",
    });

    expect(result.budgetAlert).not.toBeNull();
    expect(result.budgetAlert!.exceeded).toBe(true);
    expect(result.budgetAlert!.currentSpent).toBe(1100);
  });

  it("should throw error for insufficient funds", async () => {
    mockAccountRepo.findById.mockResolvedValue(account);

    await expect(
      createTransaction.execute({
        userId: "user-1",
        accountId: "acc-1",
        type: "withdrawal",
        category: "rent",
        amount: 99999,
        description: "Too much",
      })
    ).rejects.toThrow("Insufficient funds");
  });

  it("should throw error for unauthorized account access", async () => {
    mockAccountRepo.findById.mockResolvedValue(account);

    await expect(
      createTransaction.execute({
        userId: "other-user",
        accountId: "acc-1",
        type: "withdrawal",
        category: "food",
        amount: 100,
        description: "Nope",
      })
    ).rejects.toThrow("Unauthorized");
  });
});
