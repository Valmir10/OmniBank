import { ExchangeCurrency } from "../../src/application/use-cases/ExchangeCurrency";
import { Account } from "../../src/domain/entities/Account";
import { IAccountRepository } from "../../src/domain/repositories/IAccountRepository";
import { CryptoApiService } from "../../src/infrastructure/external-apis/CryptoApiService";

// Mock pg Pool with transaction support
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockPool = {
  connect: jest.fn().mockResolvedValue(mockClient),
} as any;

describe("ExchangeCurrency Use Case", () => {
  let exchange: ExchangeCurrency;
  let mockAccountRepo: jest.Mocked<IAccountRepository>;
  let mockCryptoApi: jest.Mocked<CryptoApiService>;

  const sekAccount = Account.create({
    id: "acc-sek",
    userId: "user-1",
    currency: "SEK",
    balance: 50000,
  });

  const btcAccount = Account.create({
    id: "acc-btc",
    userId: "user-1",
    currency: "BTC",
    balance: 0.05,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockAccountRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdAndCurrency: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    mockCryptoApi = {
      getPrices: jest.fn().mockResolvedValue({
        btc: 1000000,
        eth: 30000,
        lastUpdated: new Date().toISOString(),
      }),
      getSekToCrypto: jest.fn(),
      getCryptoToSek: jest.fn(),
    } as unknown as jest.Mocked<CryptoApiService>;

    // Mock successful DB operations
    mockClient.query.mockImplementation(async (sql: string) => {
      if (sql === "BEGIN" || sql === "COMMIT" || sql === "ROLLBACK") return {};
      if (sql.includes("UPDATE accounts")) return { rows: [{ id: "acc" }] };
      if (sql.includes("INSERT INTO")) return { rows: [{}] };
      return { rows: [] };
    });

    exchange = new ExchangeCurrency(mockPool, mockAccountRepo, mockCryptoApi);
  });

  it("should exchange SEK to BTC with correct calculation", async () => {
    mockAccountRepo.findByUserIdAndCurrency
      .mockResolvedValueOnce(sekAccount)   // fromCurrency: SEK
      .mockResolvedValueOnce(btcAccount);  // toCurrency: BTC

    const result = await exchange.execute({
      userId: "user-1",
      fromCurrency: "SEK",
      toCurrency: "BTC",
      amount: 10000,
    });

    expect(result.fromAmount).toBe(10000);
    expect(result.fromCurrency).toBe("SEK");
    expect(result.toCurrency).toBe("BTC");
    expect(result.toAmount).toBe(0.01); // 10000 / 1000000
    expect(result.rate).toBe(1000000);
    expect(result.transactionHash).toMatch(/^exch_/);
  });

  it("should exchange BTC to SEK with correct calculation", async () => {
    mockAccountRepo.findByUserIdAndCurrency
      .mockResolvedValueOnce(btcAccount)   // fromCurrency: BTC
      .mockResolvedValueOnce(sekAccount);  // toCurrency: SEK

    const result = await exchange.execute({
      userId: "user-1",
      fromCurrency: "BTC",
      toCurrency: "SEK",
      amount: 0.01,
    });

    expect(result.toAmount).toBe(10000); // 0.01 * 1000000
    expect(result.toCurrency).toBe("SEK");
  });

  it("should throw error for same currency exchange", async () => {
    await expect(
      exchange.execute({
        userId: "user-1",
        fromCurrency: "SEK",
        toCurrency: "SEK",
        amount: 100,
      })
    ).rejects.toThrow("Cannot exchange same currency");
  });

  it("should throw error when source account not found", async () => {
    mockAccountRepo.findByUserIdAndCurrency.mockResolvedValue(null);

    await expect(
      exchange.execute({
        userId: "user-1",
        fromCurrency: "SEK",
        toCurrency: "BTC",
        amount: 100,
      })
    ).rejects.toThrow("No SEK account found");
  });

  it("should throw error for insufficient funds", async () => {
    mockAccountRepo.findByUserIdAndCurrency.mockResolvedValueOnce(sekAccount);
    // Mock the UPDATE to return empty (balance check failed)
    mockClient.query.mockImplementation(async (sql: string) => {
      if (sql === "BEGIN" || sql === "ROLLBACK") return {};
      if (sql.includes("UPDATE accounts SET balance = balance -")) return { rows: [] };
      return { rows: [] };
    });

    await expect(
      exchange.execute({
        userId: "user-1",
        fromCurrency: "SEK",
        toCurrency: "BTC",
        amount: 999999,
      })
    ).rejects.toThrow("Insufficient funds");
  });

  it("should use BEGIN/COMMIT for atomic transactions", async () => {
    mockAccountRepo.findByUserIdAndCurrency
      .mockResolvedValueOnce(sekAccount)
      .mockResolvedValueOnce(btcAccount);

    await exchange.execute({
      userId: "user-1",
      fromCurrency: "SEK",
      toCurrency: "BTC",
      amount: 1000,
    });

    const calls = mockClient.query.mock.calls.map((c: any[]) => c[0]);
    expect(calls[0]).toBe("BEGIN");
    expect(calls[calls.length - 1]).toBe("COMMIT");
  });

  it("should ROLLBACK on error", async () => {
    mockAccountRepo.findByUserIdAndCurrency.mockResolvedValueOnce(null);

    try {
      await exchange.execute({
        userId: "user-1",
        fromCurrency: "SEK",
        toCurrency: "BTC",
        amount: 100,
      });
    } catch {}

    const calls = mockClient.query.mock.calls.map((c: any[]) => c[0]);
    expect(calls).toContain("ROLLBACK");
  });
});
