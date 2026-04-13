"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { Budget, TransactionCategory } from "@/types";

interface BudgetResponse {
  id: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  remainingAmount: number;
  isExceeded: boolean;
  month: number;
  year: number;
}

const MOCK_BUDGETS: BudgetResponse[] = [
  { id: "b1", category: "food", limitAmount: 3000, currentSpent: 813, remainingAmount: 2187, isExceeded: false, month: 4, year: 2026 },
  { id: "b2", category: "entertainment", limitAmount: 500, currentSpent: 348, remainingAmount: 152, isExceeded: false, month: 4, year: 2026 },
  { id: "b3", category: "transport", limitAmount: 1200, currentSpent: 1035, remainingAmount: 165, isExceeded: false, month: 4, year: 2026 },
  { id: "b4", category: "rent", limitAmount: 9000, currentSpent: 8500, remainingAmount: 500, isExceeded: false, month: 4, year: 2026 },
  { id: "b5", category: "utilities", limitAmount: 600, currentSpent: 450, remainingAmount: 150, isExceeded: false, month: 4, year: 2026 },
];

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    const res = await api.get<BudgetResponse[]>("/budgets");
    if (res.error) {
      setBudgets(MOCK_BUDGETS);
    } else {
      setBudgets(res.data!);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const createBudget = useCallback(
    async (category: TransactionCategory, limitAmount: number) => {
      const now = new Date();
      const res = await api.post<BudgetResponse>("/budgets", {
        category,
        limitAmount,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      if (!res.error) {
        setBudgets((prev) => [...prev, res.data!]);
      }
      return res;
    },
    []
  );

  return { budgets, loading, createBudget, refetch: fetchBudgets };
}
