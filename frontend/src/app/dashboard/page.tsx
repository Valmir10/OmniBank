"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { TransactionList } from "@/components/ui/TransactionList";

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
  const { data, loading: dashLoading } = useDashboard();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen pt-20 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-omni-text">
            Welcome, <span className="gradient-text">{user.name}</span>
          </h1>
          <p className="text-omni-muted mt-1">
            Your aggregated financial overview across all banks
          </p>
        </div>

        {dashLoading || !data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <>
            {/* Account cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card border-omni-accent/30 md:col-span-1">
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

              {data.accounts.map((acc) => (
                <div key={acc.accountId} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-omni-muted uppercase tracking-wider">
                      {acc.bankName}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        acc.source === "omnibank"
                          ? "bg-omni-accent/20 text-omni-accent"
                          : "bg-omni-border text-omni-muted"
                      }`}
                    >
                      {acc.source === "omnibank" ? "Internal" : "PSD2"}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-omni-text">
                    {acc.balance.toLocaleString("sv-SE")} kr
                  </p>
                  <p className="text-xs text-omni-muted mt-1 font-mono">
                    {acc.accountId}
                  </p>
                </div>
              ))}
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

            {/* Transactions */}
            <div className="card">
              <h2 className="text-lg font-semibold text-omni-text mb-4">
                Recent Transactions
              </h2>
              <TransactionList transactions={data.transactions} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
