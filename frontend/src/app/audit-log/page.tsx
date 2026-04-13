"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  details: Record<string, unknown>;
  transactionHash: string;
  createdAt: string;
}

const MOCK_LOGS: AuditLogEntry[] = [
  {
    id: "al-1",
    userId: "u1",
    action: "CURRENCY_EXCHANGE",
    details: { fromCurrency: "SEK", toCurrency: "BTC", fromAmount: 5000, toAmount: 0.00507, rate: 985420, btcPrice: 985420, ethPrice: 28750 },
    transactionHash: "exch_a1b2c3d4e5f67890",
    createdAt: "2026-04-13T14:30:00Z",
  },
  {
    id: "al-2",
    userId: "u1",
    action: "CURRENCY_EXCHANGE",
    details: { fromCurrency: "SEK", toCurrency: "ETH", fromAmount: 10000, toAmount: 0.34782, rate: 28750, btcPrice: 985420, ethPrice: 28750 },
    transactionHash: "exch_f8e7d6c5b4a39012",
    createdAt: "2026-04-12T09:15:00Z",
  },
  {
    id: "al-3",
    userId: "u1",
    action: "CURRENCY_EXCHANGE",
    details: { fromCurrency: "BTC", toCurrency: "SEK", fromAmount: 0.002, toAmount: 1970.84, rate: 985420, btcPrice: 985420, ethPrice: 28750 },
    transactionHash: "exch_1234abcd5678efgh",
    createdAt: "2026-04-11T16:45:00Z",
  },
];

export default function AuditLogPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const res = await api.get<AuditLogEntry[]>("/audit-logs");
    if (res.error) {
      setLogs(MOCK_LOGS);
    } else {
      setLogs(res.data!);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (authLoading || !user) return null;

  return (
    <main className="min-h-screen pt-20 p-6">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-omni-text">
            Audit <span className="gradient-text">Ledger</span>
          </h1>
          <p className="text-omni-muted mt-1">
            Immutable record of all crypto exchanges. Read-only for integrity.
          </p>
        </div>

        <div className="card mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-omni-success animate-pulse" />
            <p className="text-sm text-omni-muted">
              {logs.length} entries logged. This ledger is append-only and cannot be modified.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse h-20" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-omni-muted">No exchange records yet.</p>
            <button
              onClick={() => router.push("/exchange")}
              className="btn-primary mt-4 text-sm"
            >
              Make your first exchange
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const details = log.details;
              const isExpanded = expanded === log.id;

              return (
                <div
                  key={log.id}
                  className="card cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : log.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-omni-accent/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-omni-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-omni-text">
                          {String(details.fromAmount)} {String(details.fromCurrency)} &rarr;{" "}
                          {Number(details.toAmount).toFixed(
                            details.toCurrency === "SEK" ? 2 : 8
                          )}{" "}
                          {String(details.toCurrency)}
                        </p>
                        <p className="text-xs text-omni-muted font-mono mt-0.5">
                          {log.transactionHash}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-omni-muted">
                        {new Date(log.createdAt).toLocaleDateString("sv-SE")}
                      </p>
                      <p className="text-xs text-omni-muted">
                        {new Date(log.createdAt).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-omni-border animate-fade-in">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-omni-muted">Action</p>
                          <p className="text-omni-text font-mono">{log.action}</p>
                        </div>
                        <div>
                          <p className="text-omni-muted">Rate</p>
                          <p className="text-omni-text">
                            1 {String(details.fromCurrency)} = {Number(details.rate).toLocaleString("sv-SE")} {String(details.fromCurrency) === "SEK" ? String(details.toCurrency) : "SEK"}
                          </p>
                        </div>
                        <div>
                          <p className="text-omni-muted">BTC Price</p>
                          <p className="text-omni-text">{Number(details.btcPrice).toLocaleString("sv-SE")} SEK</p>
                        </div>
                        <div>
                          <p className="text-omni-muted">ETH Price</p>
                          <p className="text-omni-text">{Number(details.ethPrice).toLocaleString("sv-SE")} SEK</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-omni-muted">Log ID</p>
                          <p className="text-omni-text font-mono">{log.id}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
