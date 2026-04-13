"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { TransactionCategory } from "@/types";
import { DashboardData } from "@/types/dashboard";

export interface BudgetWithSpending {
  id: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  remainingAmount: number;
  isExceeded: boolean;
  month: number;
  year: number;
}

interface RawBudget {
  id: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  remainingAmount: number;
  isExceeded: boolean;
  month: number;
  year: number;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);

    // Fetch budgets and dashboard data in parallel
    const [budgetRes, dashRes] = await Promise.all([
      api.get<RawBudget[]>("/budgets"),
      api.get<DashboardData>("/dashboard"),
    ]);

    const rawBudgets = budgetRes.data || [];
    const spendingByCategory = dashRes.data?.spendingByCategory || [];

    // Merge: use actual spending from transactions
    const spendingMap = new Map(spendingByCategory.map((s) => [s.category, s.total]));

    const merged: BudgetWithSpending[] = rawBudgets.map((b) => {
      const realSpent = spendingMap.get(b.category) || b.currentSpent;
      const remaining = Math.max(0, b.limitAmount - realSpent);
      return {
        ...b,
        currentSpent: realSpent,
        remainingAmount: remaining,
        isExceeded: realSpent > b.limitAmount,
      };
    });

    setBudgets(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const createBudget = useCallback(
    async (category: TransactionCategory, limitAmount: number) => {
      const now = new Date();
      const res = await api.post<RawBudget>("/budgets", {
        category,
        limitAmount,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      if (!res.error) {
        await fetchBudgets();
      }
      return res;
    },
    [fetchBudgets]
  );

  return { budgets, loading, createBudget, refetch: fetchBudgets };
}
