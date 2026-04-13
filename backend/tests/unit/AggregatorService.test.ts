import { AggregatorService } from "../../src/application/services/AggregatorService";
import { Account } from "../../src/domain/entities/Account";
import { IAccountRepository } from "../../src/domain/repositories/IAccountRepository";
import { ITransactionRepository } from "../../src/domain/repositories/ITransactionRepository";
import { MockBankApi } from "../../src/infrastructure/external-apis/MockBankApi";

describe("AggregatorService", () => {
  let service: AggregatorService;
  let mockAccountRepo: jest.Mocked<IAccountRepository>;
  let mockTransactionRepo: jest.Mocked<ITransactionRepository>;
  let mockBankApi: jest.Mocked<MockBankApi>;

  beforeEach(() => {
    mockAccountRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdAndCurrency: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockTransactionRepo = {
      findById: jest.fn(),
      findByAccountId: jest.fn(),
      create: jest.fn(),
      findByAccountIdWithDateRange: jest.fn(),
    };
    mockBankApi = {
      getAccounts: jest.fn(),
      getTransactions: jest.fn(),
    } as unknown as jest.Mocked<MockBankApi>;

    service = new AggregatorService(
      mockAccountRepo,
      mockTransactionRepo,
      mockBankApi
    );
  });

  it("should aggregate internal and external accounts", async () => {
    mockAccountRepo.findByUserId.mockResolvedValue([
      Account.create({ userId: "u1", currency: "SEK", balance: 5000 }),
    ]);
    mockTransactionRepo.findByAccountId.mockResolvedValue([]);
    mockBankApi.getAccounts.mockResolvedValue([
      { bankName: "Nordea", accountNumber: "NE-123", currency: "SEK", balance: 10000 },
    ]);
    mockBankApi.getTransactions.mockResolvedValue([]);

    const result = await service.getDashboardData("u1");

    expect(result.accounts).toHaveLength(2);
    expect(result.accounts[0].bankName).toBe("OmniBank");
    expect(result.accounts[1].bankName).toBe("Nordea");
    expect(result.totalBalance).toBe(15000);
  });

  it("should calculate spending by category from external transactions", async () => {
    mockAccountRepo.findByUserId.mockResolvedValue([]);
    mockBankApi.getAccounts.mockResolvedValue([]);
    mockBankApi.getTransactions.mockResolvedValue([
      { id: "1", bankName: "Nordea", type: "debit", category: "food", amount: 200, currency: "SEK", description: "ICA", date: "2026-04-12" },
      { id: "2", bankName: "SEB", type: "debit", category: "food", amount: 100, currency: "SEK", description: "Coop", date: "2026-04-11" },
      { id: "3", bankName: "Nordea", type: "debit", category: "rent", amount: 8000, currency: "SEK", description: "Hyra", date: "2026-04-01" },
      { id: "4", bankName: "Nordea", type: "credit", category: "salary", amount: 30000, currency: "SEK", description: "Lon", date: "2026-04-01" },
    ]);

    const result = await service.getDashboardData("u1");

    expect(result.spendingByCategory).toHaveLength(2);
    expect(result.spendingByCategory[0]).toEqual({ category: "rent", total: 8000 });
    expect(result.spendingByCategory[1]).toEqual({ category: "food", total: 300 });
  });

  it("should sort transactions by date descending", async () => {
    mockAccountRepo.findByUserId.mockResolvedValue([]);
    mockBankApi.getAccounts.mockResolvedValue([]);
    mockBankApi.getTransactions.mockResolvedValue([
      { id: "1", bankName: "A", type: "debit", category: "food", amount: 10, currency: "SEK", description: "Old", date: "2026-04-01" },
      { id: "2", bankName: "B", type: "debit", category: "food", amount: 20, currency: "SEK", description: "New", date: "2026-04-12" },
    ]);

    const result = await service.getDashboardData("u1");

    expect(result.transactions[0].description).toBe("New");
    expect(result.transactions[1].description).toBe("Old");
  });

  it("should fetch internal and external data in parallel", async () => {
    mockAccountRepo.findByUserId.mockResolvedValue([]);
    mockBankApi.getAccounts.mockResolvedValue([]);
    mockBankApi.getTransactions.mockResolvedValue([]);

    await service.getDashboardData("u1");

    expect(mockAccountRepo.findByUserId).toHaveBeenCalledWith("u1");
    expect(mockBankApi.getAccounts).toHaveBeenCalled();
    expect(mockBankApi.getTransactions).toHaveBeenCalled();
  });
});
