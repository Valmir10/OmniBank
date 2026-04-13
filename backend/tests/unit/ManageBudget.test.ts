import { ManageBudget } from "../../src/application/use-cases/ManageBudget";
import { Budget } from "../../src/domain/entities/Budget";
import { IBudgetRepository } from "../../src/domain/repositories/IBudgetRepository";

describe("ManageBudget Use Case", () => {
  let manageBudget: ManageBudget;
  let mockBudgetRepo: jest.Mocked<IBudgetRepository>;

  beforeEach(() => {
    mockBudgetRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdAndCategory: jest.fn(),
      create: jest.fn().mockImplementation(async (b) => b),
      update: jest.fn().mockImplementation(async (b) => b),
    };
    manageBudget = new ManageBudget(mockBudgetRepo);
  });

  it("should create a new budget", async () => {
    mockBudgetRepo.findByUserIdAndCategory.mockResolvedValue(null);

    const result = await manageBudget.create({
      userId: "user-1",
      category: "food",
      limitAmount: 3000,
      month: 4,
      year: 2026,
    });

    expect(result.category).toBe("food");
    expect(result.limitAmount).toBe(3000);
    expect(result.currentSpent).toBe(0);
    expect(result.isExceeded).toBe(false);
    expect(mockBudgetRepo.create).toHaveBeenCalledTimes(1);
  });

  it("should throw error for duplicate budget", async () => {
    mockBudgetRepo.findByUserIdAndCategory.mockResolvedValue(
      Budget.create({
        userId: "user-1",
        category: "food",
        limitAmount: 3000,
        currentSpent: 0,
        month: 4,
        year: 2026,
      })
    );

    await expect(
      manageBudget.create({
        userId: "user-1",
        category: "food",
        limitAmount: 3000,
        month: 4,
        year: 2026,
      })
    ).rejects.toThrow("already exists");
  });

  it("should get all budgets for a user", async () => {
    mockBudgetRepo.findByUserId.mockResolvedValue([
      Budget.create({ userId: "u1", category: "food", limitAmount: 3000, currentSpent: 1000, month: 4, year: 2026 }),
      Budget.create({ userId: "u1", category: "rent", limitAmount: 9000, currentSpent: 8500, month: 4, year: 2026 }),
    ]);

    const results = await manageBudget.getUserBudgets("u1");

    expect(results).toHaveLength(2);
    expect(results[0].remainingAmount).toBe(2000);
    expect(results[1].remainingAmount).toBe(500);
  });

  it("should update budget limit", async () => {
    mockBudgetRepo.findById.mockResolvedValue(
      Budget.create({ id: "b1", userId: "u1", category: "food", limitAmount: 3000, currentSpent: 1000, month: 4, year: 2026 })
    );

    const result = await manageBudget.updateLimit("b1", 5000);

    expect(result.limitAmount).toBe(5000);
    expect(result.remainingAmount).toBe(4000);
  });
});
