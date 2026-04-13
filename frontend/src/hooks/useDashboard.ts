"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { DashboardData, AggregatedTransaction } from "@/types/dashboard";

const DELETED_MOCK_KEY = "omnibank_deleted_mocks";

function getDeletedMockIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const stored = localStorage.getItem(DELETED_MOCK_KEY);
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

function addDeletedMockId(id: string) {
  const ids = getDeletedMockIds();
  ids.add(id);
  localStorage.setItem(DELETED_MOCK_KEY, JSON.stringify([...ids]));
}

function getBaseMockTransactions(): AggregatedTransaction[] {
  return [
    { id: "mock-1", source: "external", bankName: "Nordea", type: "debit", category: "food", amount: 189, currency: "SEK", description: "ICA Maxi", date: "2026-04-12" },
    { id: "mock-2", source: "external", bankName: "SEB", type: "debit", category: "food", amount: 67, currency: "SEK", description: "Pressbyr\u00e5n", date: "2026-04-11" },
    { id: "mock-3", source: "external", bankName: "Nordea", type: "debit", category: "transport", amount: 950, currency: "SEK", description: "SL M\u00e5nadskortet", date: "2026-04-10" },
    { id: "mock-4", source: "external", bankName: "Nordea", type: "debit", category: "entertainment", amount: 149, currency: "SEK", description: "Spotify Premium", date: "2026-04-09" },
    { id: "mock-5", source: "external", bankName: "SEB", type: "debit", category: "food", amount: 312, currency: "SEK", description: "Coop Konsum", date: "2026-04-08" },
    { id: "mock-6", source: "external", bankName: "SEB", type: "debit", category: "entertainment", amount: 199, currency: "SEK", description: "Netflix", date: "2026-04-07" },
    { id: "mock-7", source: "external", bankName: "SEB", type: "debit", category: "transport", amount: 85, currency: "SEK", description: "Bolt taxi", date: "2026-04-06" },
    { id: "mock-8", source: "external", bankName: "SEB", type: "debit", category: "utilities", amount: 450, currency: "SEK", description: "Vattenfall el", date: "2026-04-05" },
    { id: "mock-9", source: "external", bankName: "Nordea", type: "debit", category: "food", amount: 245, currency: "SEK", description: "Willys", date: "2026-04-04" },
    { id: "mock-10", source: "external", bankName: "Nordea", type: "debit", category: "other", amount: 399, currency: "SEK", description: "H&M kl\u00e4der", date: "2026-04-03" },
    { id: "mock-11", source: "external", bankName: "Nordea", type: "debit", category: "rent", amount: 8500, currency: "SEK", description: "Hyra april", date: "2026-04-01" },
    { id: "mock-12", source: "external", bankName: "Nordea", type: "credit", category: "salary", amount: 32000, currency: "SEK", description: "L\u00f6n april", date: "2026-04-01" },
  ];
}

function getMockData(): DashboardData {
  const deletedIds = getDeletedMockIds();
  const transactions = getBaseMockTransactions().filter((t) => !deletedIds.has(t.id));

  const spendingMap = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === "debit") {
      spendingMap.set(t.category, (spendingMap.get(t.category) || 0) + t.amount);
    }
  }
  const spendingByCategory = [...spendingMap.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const totalSpending = spendingByCategory.reduce((s, c) => s + c.total, 0);
  const income = transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);

  return {
    accounts: [
      { source: "omnibank", bankName: "OmniBank", accountId: "ob-001", currency: "SEK", balance: 10000 },
      { source: "external", bankName: "Nordea", accountId: "NE-8821-4455", currency: "SEK", balance: 24350.75 },
      { source: "external", bankName: "SEB", accountId: "SB-1192-7733", currency: "SEK", balance: 8720 },
    ],
    totalBalance: 43070.75 - totalSpending + income - (43070.75 - 10000 - 24350.75 - 8720) + (totalSpending > 0 ? 0 : 0),
    transactions,
    spendingByCategory,
  };
}

export function deleteMockTransaction(id: string) {
  addDeletedMockId(id);
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await api.get<DashboardData>("/dashboard");

    if (res.error) {
      setData(getMockData());
    } else {
      setData(res.data!);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}
