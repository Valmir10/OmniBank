"use client";

import { useState } from "react";
import { api } from "@/services/api";

interface Props {
  accountId: string;
  onSuccess: () => void;
}

const CATEGORIES = [
  { value: "salary", label: "Salary" },
  { value: "food", label: "Food" },
  { value: "rent", label: "Rent" },
  { value: "transport", label: "Transport" },
  { value: "entertainment", label: "Entertainment" },
  { value: "utilities", label: "Utilities" },
  { value: "other", label: "Other" },
];

export function AddTransactionForm({ accountId, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"deposit" | "withdrawal">("withdrawal");
  const [category, setCategory] = useState("food");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await api.post("/transactions", {
      accountId,
      type,
      category,
      amount: parseFloat(amount),
      description,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setAmount("");
      setDescription("");
      setOpen(false);
      onSuccess();
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary text-sm">
        + Add Transaction
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card animate-slide-up space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-omni-text">New Transaction</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-omni-muted hover:text-omni-text text-sm"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-omni-danger/10 border border-omni-danger/30 text-omni-danger text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Type toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("withdrawal")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            type === "withdrawal"
              ? "bg-omni-danger/20 text-omni-danger border border-omni-danger/30"
              : "bg-omni-darker text-omni-muted border border-omni-border"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => { setType("deposit"); setCategory("salary"); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            type === "deposit"
              ? "bg-omni-success/20 text-omni-success border border-omni-success/30"
              : "bg-omni-darker text-omni-muted border border-omni-border"
          }`}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-omni-muted mb-1">Amount (SEK)</label>
          <input
            type="number"
            className="input-field"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-omni-muted mb-1">Category</label>
          <select
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-omni-muted mb-1">Description</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Grocery shopping"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-sm disabled:opacity-50"
      >
        {loading ? "Saving..." : type === "deposit" ? "Add Income" : "Add Expense"}
      </button>
    </form>
  );
}
