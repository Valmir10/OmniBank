"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { DashboardData } from "@/types/dashboard";

function getMockData(): DashboardData {
  return {
    accounts: [
      { source: "omnibank", bankName: "OmniBank", accountId: "ob-001", currency: "SEK", balance: 10000 },
      { source: "external", bankName: "Nordea", accountId: "NE-8821-4455", currency: "SEK", balance: 24350.75 },
      { source: "external", bankName: "SEB", accountId: "SB-1192-7733", currency: "SEK", balance: 8720 },
    ],
    totalBalance: 43070.75,
    transactions: [
      { id: "1", source: "external", bankName: "Nordea", type: "debit", category: "food", amount: 189, currency: "SEK", description: "ICA Maxi", date: "2026-04-12" },
      { id: "2", source: "external", bankName: "SEB", type: "debit", category: "food", amount: 67, currency: "SEK", description: "Pressbyran", date: "2026-04-11" },
      { id: "3", source: "external", bankName: "Nordea", type: "debit", category: "transport", amount: 950, currency: "SEK", description: "SL Manadskortet", date: "2026-04-10" },
      { id: "4", source: "external", bankName: "Nordea", type: "debit", category: "entertainment", amount: 149, currency: "SEK", description: "Spotify Premium", date: "2026-04-09" },
      { id: "5", source: "external", bankName: "SEB", type: "debit", category: "food", amount: 312, currency: "SEK", description: "Coop Konsum", date: "2026-04-08" },
      { id: "6", source: "external", bankName: "SEB", type: "debit", category: "entertainment", amount: 199, currency: "SEK", description: "Netflix", date: "2026-04-07" },
      { id: "7", source: "external", bankName: "SEB", type: "debit", category: "transport", amount: 85, currency: "SEK", description: "Bolt taxi", date: "2026-04-06" },
      { id: "8", source: "external", bankName: "SEB", type: "debit", category: "utilities", amount: 450, currency: "SEK", description: "Vattenfall el", date: "2026-04-05" },
      { id: "9", source: "external", bankName: "Nordea", type: "debit", category: "food", amount: 245, currency: "SEK", description: "Willys", date: "2026-04-04" },
      { id: "10", source: "external", bankName: "Nordea", type: "debit", category: "other", amount: 399, currency: "SEK", description: "H and M", date: "2026-04-03" },
      { id: "11", source: "external", bankName: "Nordea", type: "debit", category: "rent", amount: 8500, currency: "SEK", description: "Hyra april", date: "2026-04-01" },
      { id: "12", source: "external", bankName: "Nordea", type: "credit", category: "salary", amount: 32000, currency: "SEK", description: "Lon april", date: "2026-04-01" },
    ],
    spendingByCategory: [
      { category: "rent", total: 8500 },
      { category: "transport", total: 1035 },
      { category: "food", total: 813 },
      { category: "utilities", total: 450 },
      { category: "other", total: 399 },
      { category: "entertainment", total: 348 },
    ],
  };
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
