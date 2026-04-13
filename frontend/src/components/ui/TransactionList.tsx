"use client";

import { useState } from "react";
import { AggregatedTransaction } from "@/types/dashboard";
import { api } from "@/services/api";
import { deleteMockTransaction } from "@/hooks/useDashboard";

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
  onDelete,
}: {
  transactions: AggregatedTransaction[];
  onDelete?: () => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "all",
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.category === filter);

  const handleDelete = async (id: string) => {
    setLoading(true);
    setMenuOpen(null);
    if (id.startsWith("mock-")) {
      deleteMockTransaction(id);
    } else {
      await api.delete(`/transactions/${id}`);
    }
    setLoading(false);
    if (onDelete) onDelete();
  };

  const handleEdit = (tx: AggregatedTransaction) => {
    setMenuOpen(null);
    setEditingTx(tx.id);
    setEditAmount(tx.amount.toString());
  };

  const handleSaveEdit = async (tx: AggregatedTransaction) => {
    const newAmount = parseFloat(editAmount);
    if (!newAmount || newAmount <= 0) return;

    setLoading(true);
    await api.patch(`/transactions/${tx.id}`, { amount: newAmount });
    setEditingTx(null);
    setLoading(false);
    if (onDelete) onDelete();
  };

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
            className="group flex items-center justify-between p-3 rounded-lg bg-omni-darker/50 hover:bg-omni-darker transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
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
            <div className="flex items-center gap-3">
              {editingTx === tx.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="input-field w-24 text-sm py-1 px-2"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(tx)}
                    disabled={loading}
                    className="text-xs text-omni-success hover:text-green-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTx(null)}
                    className="text-xs text-omni-muted hover:text-omni-text"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
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
                  {onDelete && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === tx.id ? null : tx.id)}
                        className="opacity-0 group-hover:opacity-100 text-omni-muted hover:text-omni-text transition-all p-1.5 rounded hover:bg-omni-border/50"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="4" r="1.5" />
                          <circle cx="10" cy="10" r="1.5" />
                          <circle cx="10" cy="16" r="1.5" />
                        </svg>
                      </button>
                      {menuOpen === tx.id && (
                        <div className="absolute right-0 top-8 z-20 bg-omni-card border border-omni-border rounded-lg shadow-xl py-1 w-32 animate-fade-in">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="w-full text-left px-3 py-2 text-xs text-omni-text hover:bg-omni-darker transition-colors"
                          >
                            Edit amount
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            disabled={loading}
                            className="w-full text-left px-3 py-2 text-xs text-omni-danger hover:bg-omni-danger/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
