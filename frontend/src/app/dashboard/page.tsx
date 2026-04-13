"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
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
            Here&apos;s your financial overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-sm text-omni-muted mb-1">SEK Balance</p>
            <p className="text-2xl font-bold text-omni-text">10,000.00 kr</p>
            <p className="text-xs text-omni-success mt-2">Starting balance</p>
          </div>
          <div className="card">
            <p className="text-sm text-omni-muted mb-1">Verification Status</p>
            <p className="text-2xl font-bold">
              {user.isVerified ? (
                <span className="text-omni-success">Verified</span>
              ) : (
                <span className="text-omni-warning">Pending</span>
              )}
            </p>
            {!user.isVerified && (
              <button
                onClick={() => router.push("/verify")}
                className="text-xs text-omni-accent hover:text-omni-accent-light mt-2 transition-colors"
              >
                Verify now
              </button>
            )}
          </div>
          <div className="card">
            <p className="text-sm text-omni-muted mb-1">Account ID</p>
            <p className="text-sm font-mono text-omni-text truncate">
              {user.id}
            </p>
            <p className="text-xs text-omni-muted mt-2">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 card">
          <h2 className="text-lg font-semibold text-omni-text mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Open Banking", desc: "Coming soon" },
              { label: "Budget Alerts", desc: "Coming soon" },
              { label: "Crypto Exchange", desc: "Coming soon" },
              { label: "Audit Log", desc: "Coming soon" },
            ].map((action) => (
              <button
                key={action.label}
                className="p-4 rounded-lg bg-omni-darker border border-omni-border hover:border-omni-accent/30 transition-all text-left"
              >
                <p className="text-sm font-medium text-omni-text">
                  {action.label}
                </p>
                <p className="text-xs text-omni-muted mt-1">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
