import { Transaction } from "../../src/domain/entities/Transaction";

describe("Transaction Entity", () => {
  const validProps = {
    accountId: "account-123",
    type: "deposit" as const,
    category: "salary" as const,
    amount: 5000,
    currency: "SEK" as const,
    description: "Monthly salary",
  };

  it("should create a transaction with valid properties", () => {
    const tx = Transaction.create(validProps);

    expect(tx.accountId).toBe(validProps.accountId);
    expect(tx.type).toBe("deposit");
    expect(tx.category).toBe("salary");
    expect(tx.amount).toBe(5000);
    expect(tx.currency).toBe("SEK");
    expect(tx.description).toBe("Monthly salary");
    expect(tx.transactionHash).toBeDefined();
    expect(tx.transactionHash).toMatch(/^tx_/);
    expect(tx.id).toBeDefined();
  });

  it("should throw error for non-positive amount", () => {
    expect(() => Transaction.create({ ...validProps, amount: 0 })).toThrow(
      "Transaction amount must be positive"
    );
    expect(() => Transaction.create({ ...validProps, amount: -100 })).toThrow(
      "Transaction amount must be positive"
    );
  });

  it("should use provided transaction hash", () => {
    const tx = Transaction.create({
      ...validProps,
      transactionHash: "custom_hash_123",
    });
    expect(tx.transactionHash).toBe("custom_hash_123");
  });
});
