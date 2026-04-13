import { Account } from "../../src/domain/entities/Account";

describe("Account Entity", () => {
  const validProps = {
    userId: "user-123",
    currency: "SEK" as const,
    balance: 1000,
  };

  it("should create an account with valid properties", () => {
    const account = Account.create(validProps);

    expect(account.userId).toBe(validProps.userId);
    expect(account.currency).toBe("SEK");
    expect(account.balance).toBe(1000);
    expect(account.id).toBeDefined();
  });

  it("should throw error for negative balance", () => {
    expect(() => Account.create({ ...validProps, balance: -100 })).toThrow(
      "Account balance cannot be negative"
    );
  });

  it("should credit an account", () => {
    const account = Account.create(validProps);
    const credited = account.credit(500);

    expect(credited.balance).toBe(1500);
    expect(credited.id).toBe(account.id);
  });

  it("should debit an account", () => {
    const account = Account.create(validProps);
    const debited = account.debit(300);

    expect(debited.balance).toBe(700);
  });

  it("should throw error for insufficient funds on debit", () => {
    const account = Account.create(validProps);
    expect(() => account.debit(2000)).toThrow("Insufficient funds");
  });

  it("should throw error for non-positive credit amount", () => {
    const account = Account.create(validProps);
    expect(() => account.credit(0)).toThrow("Credit amount must be positive");
    expect(() => account.credit(-100)).toThrow("Credit amount must be positive");
  });

  it("should throw error for non-positive debit amount", () => {
    const account = Account.create(validProps);
    expect(() => account.debit(0)).toThrow("Debit amount must be positive");
  });
});
