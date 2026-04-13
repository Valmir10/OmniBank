"use client";

import { useState } from "react";
import { AggregatedTransaction } from "@/types/dashboard";

const CATEGORY_LABELS: Record<string, string> = {
  rent: "Rent",
  food: "Food",
  transport: "Transport",
  entertainment: "Entertainment",
  utilities: "Utilities",
  salary: "Salary",
  crypto_exchange: "Crypto",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  rent: "bg-red-500/20 text-red-400",
  food: "bg-green-500/20 text-green-400",
  transport: "bg-blue-500/20 text-blue-400",
  entertainment: "bg-purple-500/20 text-purple-400",
  utilities: "bg-yellow-500/20 text-yellow-400",
  salary: "bg-cyan-500/20 text-cyan-400",
  crypto_exchange: "bg-pink-500/20 text-pink-400",
  other: "bg-gray-500/20 text-gray-400",
};

export function TransactionList({
  transactions,
}: {
  transactions: AggregatedTransaction[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.category === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full transition-all ${
              filter === cat
                ? "bg-omni-accent text-white"
                : "bg-omni-darker text-omni-muted hover:bg-omni-border"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filtered.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 rounded-lg bg-omni-darker/50 hover:bg-omni-darker transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  CATEGORY_COLORS[tx.category] || "bg-gray-500/20 text-gray-400"
                }`}
              >
                {(CATEGORY_LABELS[tx.category] || tx.category).charAt(0)}
              </span>
              <div>
                <p className="text-sm font-medium text-omni-text">
                  {tx.description}
                </p>
                <p className="text-xs text-omni-muted">
                  {tx.bankName} &middot; {tx.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  tx.type === "credit" ? "text-omni-success" : "text-omni-text"
                }`}
              >
                {tx.type === "credit" ? "+" : "-"}
                {tx.amount.toLocaleString("sv-SE")} kr
              </p>
              <p className="text-xs text-omni-muted">
                {CATEGORY_LABELS[tx.category] || tx.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
