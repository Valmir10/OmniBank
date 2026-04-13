"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { TransactionList } from "@/components/ui/TransactionList";
import { AddTransactionForm } from "@/components/ui/AddTransactionForm";

const SpendingDoughnut = dynamic(
  () => import("@/components/charts/SpendingDoughnut").then((m) => m.SpendingDoughnut),
  { ssr: false }
);
const SpendingBar = dynamic(
  () => import("@/components/charts/SpendingBar").then((m) => m.SpendingBar),
  { ssr: false }
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data, loading: dashLoading, refetch } = useDashboard();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return null;
  }

  const omnibankAccount = data?.accounts.find((a) => a.source === "omnibank");
  const totalSpending = data?.spendingByCategory.reduce((sum, c) => sum + c.total, 0) || 0;

  return (
    <main className="min-h-screen pt-20 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Header with greeting */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-omni-text">
              Welcome back, <span className="gradient-text">{user.name}</span>
            </h1>
            <p className="text-omni-muted mt-1">
              Your aggregated financial overview across all banks
            </p>
          </div>
          {omnibankAccount && (
            <AddTransactionForm accountId={omnibankAccount.accountId} onSuccess={refetch} />
          )}
        </div>

        {dashLoading || !data ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <>
            {/* Summary row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card border-omni-accent/30">
                <p className="text-xs text-omni-muted uppercase tracking-wider mb-1">
                  Total Balance
                </p>
                <p className="text-3xl font-bold gradient-text">
                  {data.totalBalance.toLocaleString("sv-SE")} kr
                </p>
                <p className="text-xs text-omni-muted mt-2">
                  {data.accounts.length} accounts aggregated
                </p>
              </div>
              <div className="card">
                <p className="text-xs text-omni-muted uppercase tracking-wider mb-1">
                  Monthly Spending
                </p>
                <p className="text-2xl font-bold text-omni-text">
                  {totalSpending.toLocaleString("sv-SE")} kr
                </p>
                <p className="text-xs text-omni-danger mt-2">
                  Across {data.spendingByCategory.length} categories
                </p>
              </div>
              <div className="card">
                <p className="text-xs text-omni-muted uppercase tracking-wider mb-1">
                  Transactions
                </p>
                <p className="text-2xl font-bold text-omni-text">
                  {data.transactions.length}
                </p>
                <p className="text-xs text-omni-muted mt-2">This month</p>
              </div>
              <div className="card">
                <p className="text-xs text-omni-muted uppercase tracking-wider mb-1">
                  Status
                </p>
                <p className="text-2xl font-bold text-omni-success">Active</p>
                <p className="text-xs text-omni-muted mt-2">
                  {user.isVerified ? "KYC Verified" : "Pending verification"}
                </p>
              </div>
            </div>

            {/* Bank accounts */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-omni-text mb-4">Your Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.accounts.map((acc) => (
                  <div key={acc.accountId} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          acc.source === "omnibank"
                            ? "bg-omni-accent/20 text-omni-accent"
                            : "bg-omni-border text-omni-muted"
                        }`}>
                          {acc.bankName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-omni-text">{acc.bankName}</p>
                          <p className="text-[10px] text-omni-muted font-mono">{acc.accountId}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        acc.source === "omnibank"
                          ? "bg-omni-accent/20 text-omni-accent"
                          : "bg-omni-border text-omni-muted"
                      }`}>
                        {acc.source === "omnibank" ? "Internal" : "PSD2"}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-omni-text">
                      {acc.balance.toLocaleString("sv-SE")} <span className="text-sm text-omni-muted">{acc.currency}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-lg font-semibold text-omni-text mb-4">
                  Spending by Category
                </h2>
                <SpendingDoughnut data={data.spendingByCategory} />
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold text-omni-text mb-4">
                  Category Breakdown
                </h2>
                <SpendingBar data={data.spendingByCategory} />
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Exchange Crypto", href: "/exchange", desc: "Swap SEK to BTC/ETH" },
                { label: "Set Budget", href: "/budgets", desc: "Manage spending limits" },
                { label: "Audit Ledger", href: "/audit-log", desc: "View exchange history" },
                { label: "Your Profile", href: "/profile", desc: "Settings & preferences" },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="card group hover:border-omni-accent/50 text-left">
                  <p className="text-sm font-medium text-omni-text group-hover:text-omni-accent transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-omni-muted mt-1">{action.desc}</p>
                </Link>
              ))}
            </div>

            {/* Transactions */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-omni-text">
                  Recent Transactions
                </h2>
                <span className="text-xs text-omni-muted">{data.transactions.length} total</span>
              </div>
              <TransactionList transactions={data.transactions} onDelete={refetch} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
