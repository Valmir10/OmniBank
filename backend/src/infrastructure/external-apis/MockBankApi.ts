export interface ExternalAccount {
  bankName: string;
  accountNumber: string;
  currency: string;
  balance: number;
}

export interface ExternalTransaction {
  id: string;
  bankName: string;
  type: "debit" | "credit";
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

const MOCK_ACCOUNTS: ExternalAccount[] = [
  { bankName: "Nordea", accountNumber: "NE-8821-4455", currency: "SEK", balance: 24350.75 },
  { bankName: "SEB", accountNumber: "SB-1192-7733", currency: "SEK", balance: 8720.0 },
];

const MOCK_TRANSACTIONS: ExternalTransaction[] = [
  { id: "ext-1", bankName: "Nordea", type: "debit", category: "food", amount: 189.0, currency: "SEK", description: "ICA Maxi", date: "2026-04-12" },
  { id: "ext-2", bankName: "Nordea", type: "debit", category: "transport", amount: 950.0, currency: "SEK", description: "SL M\u00e5nadskortet", date: "2026-04-10" },
  { id: "ext-3", bankName: "Nordea", type: "debit", category: "entertainment", amount: 149.0, currency: "SEK", description: "Spotify Premium", date: "2026-04-09" },
  { id: "ext-4", bankName: "Nordea", type: "credit", category: "salary", amount: 32000.0, currency: "SEK", description: "L\u00f6n april", date: "2026-04-01" },
  { id: "ext-5", bankName: "Nordea", type: "debit", category: "rent", amount: 8500.0, currency: "SEK", description: "Hyra april", date: "2026-04-01" },
  { id: "ext-6", bankName: "SEB", type: "debit", category: "food", amount: 67.0, currency: "SEK", description: "Pressbyrån", date: "2026-04-11" },
  { id: "ext-7", bankName: "SEB", type: "debit", category: "utilities", amount: 450.0, currency: "SEK", description: "Vattenfall el", date: "2026-04-05" },
  { id: "ext-8", bankName: "SEB", type: "debit", category: "food", amount: 312.0, currency: "SEK", description: "Coop Konsum", date: "2026-04-08" },
  { id: "ext-9", bankName: "SEB", type: "debit", category: "entertainment", amount: 199.0, currency: "SEK", description: "Netflix", date: "2026-04-07" },
  { id: "ext-10", bankName: "SEB", type: "debit", category: "transport", amount: 85.0, currency: "SEK", description: "Bolt taxi", date: "2026-04-06" },
  { id: "ext-11", bankName: "Nordea", type: "debit", category: "food", amount: 245.0, currency: "SEK", description: "Willys", date: "2026-04-04" },
  { id: "ext-12", bankName: "Nordea", type: "debit", category: "other", amount: 399.0, currency: "SEK", description: "H&M kläder", date: "2026-04-03" },
];

export class MockBankApi {
  async getAccounts(): Promise<ExternalAccount[]> {
    await new Promise((r) => setTimeout(r, 120));
    return MOCK_ACCOUNTS;
  }

  async getTransactions(): Promise<ExternalTransaction[]> {
    await new Promise((r) => setTimeout(r, 100));
    return MOCK_TRANSACTIONS;
  }
}
