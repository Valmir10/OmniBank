"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBudgets } from "@/hooks/useBudgets";
import { TransactionCategory } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  entertainment: "Entertainment",
  rent: "Rent",
  transport: "Transport",
  utilities: "Utilities",
  salary: "Salary",
  crypto_exchange: "Crypto",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, { bar: string; bg: string }> = {
  food: { bar: "bg-green-500", bg: "bg-green-500/10" },
  entertainment: { bar: "bg-purple-500", bg: "bg-purple-500/10" },
  rent: { bar: "bg-red-500", bg: "bg-red-500/10" },
  transport: { bar: "bg-blue-500", bg: "bg-blue-500/10" },
  utilities: { bar: "bg-yellow-500", bg: "bg-yellow-500/10" },
  other: { bar: "bg-gray-500", bg: "bg-gray-500/10" },
};

export default function BudgetsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { budgets, loading, createBudget } = useBudgets();
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState<TransactionCategory>("food");
  const [newLimit, setNewLimit] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const totalBudget = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.currentSpent, 0);

  return (
    <main className="min-h-screen pt-20 p-6">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-omni-text">
              Budget <span className="gradient-text">Guardian</span>
            </h1>
            <p className="text-omni-muted mt-1">
              Real-time monitoring of your spending limits
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-sm"
          >
            {showForm ? "Cancel" : "New Budget"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="card mb-6 animate-slide-up">
            <h3 className="text-sm font-semibold text-omni-text mb-4">
              Create Budget
            </h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs text-omni-muted mb-1">Category</label>
                <select
                  className="input-field"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                >
                  {Object.entries(CATEGORY_LABELS)
                    .filter(([key]) => key !== "salary")
                    .map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-omni-muted mb-1">Monthly Limit (SEK)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 3000"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                />
              </div>
              <button
                className="btn-primary"
                onClick={async () => {
                  if (!newLimit) return;
                  await createBudget(newCategory, parseFloat(newLimit));
                  setNewLimit("");
                  setShowForm(false);
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-xs text-omni-muted uppercase tracking-wider mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-omni-text">{totalBudget.toLocaleString("sv-SE")} kr</p>
          </div>
          <div className="card">
            <p className="text-xs text-omni-muted uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-omni-warning">{totalSpent.toLocaleString("sv-SE")} kr</p>
          </div>
          <div className="card">
            <p className="text-xs text-omni-muted uppercase tracking-wider mb-1">Remaining</p>
            <p className="text-2xl font-bold text-omni-success">
              {(totalBudget - totalSpent).toLocaleString("sv-SE")} kr
            </p>
          </div>
        </div>

        {/* Budget items */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const percent = Math.min(100, (budget.currentSpent / budget.limitAmount) * 100);
              const colors = CATEGORY_COLORS[budget.category] || CATEGORY_COLORS.other;

              return (
                <div key={budget.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${colors.bg} ${
                          budget.isExceeded ? "text-red-400" : "text-omni-text"
                        }`}
                      >
                        {(CATEGORY_LABELS[budget.category] || "?").charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-omni-text">
                          {CATEGORY_LABELS[budget.category] || budget.category}
                        </p>
                        <p className="text-xs text-omni-muted">
                          {budget.month}/{budget.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-omni-text">
                        {budget.currentSpent.toLocaleString("sv-SE")} /{" "}
                        {budget.limitAmount.toLocaleString("sv-SE")} kr
                      </p>
                      <p
                        className={`text-xs ${
                          budget.isExceeded
                            ? "text-omni-danger"
                            : percent >= 80
                              ? "text-omni-warning"
                              : "text-omni-success"
                        }`}
                      >
                        {budget.isExceeded
                          ? "Exceeded!"
                          : `${budget.remainingAmount.toLocaleString("sv-SE")} kr remaining`}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-omni-darker rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        budget.isExceeded
                          ? "bg-omni-danger"
                          : percent >= 80
                            ? "bg-omni-warning"
                            : colors.bar
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
