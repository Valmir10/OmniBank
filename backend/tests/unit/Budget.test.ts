import { Budget } from "../../src/domain/entities/Budget";

describe("Budget Entity", () => {
  const validProps = {
    userId: "user-123",
    category: "food" as const,
    limitAmount: 3000,
    currentSpent: 1500,
    month: 4,
    year: 2026,
  };

  it("should create a budget with valid properties", () => {
    const budget = Budget.create(validProps);

    expect(budget.userId).toBe(validProps.userId);
    expect(budget.category).toBe("food");
    expect(budget.limitAmount).toBe(3000);
    expect(budget.currentSpent).toBe(1500);
    expect(budget.id).toBeDefined();
  });

  it("should calculate remaining amount", () => {
    const budget = Budget.create(validProps);
    expect(budget.remainingAmount).toBe(1500);
  });

  it("should detect exceeded budget", () => {
    const budget = Budget.create({ ...validProps, currentSpent: 3500 });
    expect(budget.isExceeded).toBe(true);
  });

  it("should detect non-exceeded budget", () => {
    const budget = Budget.create(validProps);
    expect(budget.isExceeded).toBe(false);
  });

  it("should add spending correctly", () => {
    const budget = Budget.create(validProps);
    const updated = budget.addSpending(500);

    expect(updated.currentSpent).toBe(2000);
    expect(updated.remainingAmount).toBe(1000);
  });

  it("should return 0 remaining when exceeded", () => {
    const budget = Budget.create({ ...validProps, currentSpent: 4000 });
    expect(budget.remainingAmount).toBe(0);
  });
});
