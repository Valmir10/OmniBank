"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

interface CryptoPrice {
  btc: number;
  eth: number;
  lastUpdated: string;
}

interface ExchangeResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  transactionHash: string;
}

const MOCK_PRICES: CryptoPrice = {
  btc: 985420,
  eth: 28750,
  lastUpdated: new Date().toISOString(),
};

type Currency = "SEK" | "BTC" | "ETH";

export default function ExchangePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [prices, setPrices] = useState<CryptoPrice>(MOCK_PRICES);
  const [fromCurrency, setFromCurrency] = useState<Currency>("SEK");
  const [toCurrency, setToCurrency] = useState<Currency>("BTC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExchangeResult | null>(null);
  const [error, setError] = useState("");
  const [recentSwaps, setRecentSwaps] = useState<ExchangeResult[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const fetchPrices = useCallback(async () => {
    const res = await api.get<CryptoPrice>("/exchange/prices");
    if (!res.error && res.data) setPrices(res.data);
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const estimatedOutput = (() => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return 0;
    if (fromCurrency === "SEK") {
      return val / (toCurrency === "BTC" ? prices.btc : prices.eth);
    }
    if (toCurrency === "SEK") {
      return val * (fromCurrency === "BTC" ? prices.btc : prices.eth);
    }
    const sekValue = val * (fromCurrency === "BTC" ? prices.btc : prices.eth);
    return sekValue / (toCurrency === "BTC" ? prices.btc : prices.eth);
  })();

  const handleSwap = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    const res = await api.post<ExchangeResult>("/exchange/swap", {
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.data!);
      setRecentSwaps((prev) => [res.data!, ...prev].slice(0, 5));
      setAmount("");
    }
  };

  if (authLoading || !user) return null;

  return (
    <main className="min-h-screen pt-20 p-6">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-omni-text">
            Crypto <span className="gradient-text">Exchange</span>
          </h1>
          <p className="text-omni-muted mt-1">
            Swap between SEK and cryptocurrencies with atomic transactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: prices + exchange form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live prices */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">B</div>
                  <p className="text-xs text-omni-muted uppercase tracking-wider">Bitcoin</p>
                </div>
                <p className="text-2xl font-bold text-omni-text">
                  {prices.btc.toLocaleString("sv-SE")} <span className="text-sm text-omni-muted">SEK</span>
                </p>
                <p className="text-xs text-omni-success mt-1">Live from CoinGecko</p>
              </div>
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">E</div>
                  <p className="text-xs text-omni-muted uppercase tracking-wider">Ethereum</p>
                </div>
                <p className="text-2xl font-bold text-omni-text">
                  {prices.eth.toLocaleString("sv-SE")} <span className="text-sm text-omni-muted">SEK</span>
                </p>
                <p className="text-xs text-omni-success mt-1">Updates every 30s</p>
              </div>
            </div>

            {/* Exchange form */}
            <div className="card space-y-5">
              <h2 className="text-lg font-semibold text-omni-text">Swap</h2>

              {error && (
                <div className="bg-omni-danger/10 border border-omni-danger/30 text-omni-danger text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              {result && (
                <div className="bg-omni-success/10 border border-omni-success/30 text-omni-success text-sm rounded-lg p-4">
                  <p className="font-semibold mb-1">Exchange successful!</p>
                  <p>
                    {result.fromAmount} {result.fromCurrency} {"->"}  {" "}
                    {result.toAmount.toFixed(result.toCurrency === "SEK" ? 2 : 8)} {result.toCurrency}
                  </p>
                  <p className="text-xs text-omni-muted mt-2 font-mono">
                    Hash: {result.transactionHash}
                  </p>
                </div>
              )}

              {/* From */}
              <div>
                <label className="block text-sm text-omni-muted mb-1.5">From</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    className="input-field flex-1"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="any"
                  />
                  <select
                    className="input-field w-28"
                    value={fromCurrency}
                    onChange={(e) => {
                      const val = e.target.value as Currency;
                      setFromCurrency(val);
                      if (val === toCurrency) setToCurrency(val === "SEK" ? "BTC" : "SEK");
                    }}
                  >
                    <option value="SEK">SEK</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
              </div>

              {/* Swap button */}
              <div className="flex justify-center">
                <button
                  onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }}
                  className="w-10 h-10 rounded-full bg-omni-darker border border-omni-border hover:border-omni-accent flex items-center justify-center transition-all hover:rotate-180 duration-300"
                >
                  <svg className="w-5 h-5 text-omni-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm text-omni-muted mb-1.5">To (estimated)</label>
                <div className="flex gap-3">
                  <div className="input-field flex-1 bg-omni-darker/50 text-omni-muted">
                    {estimatedOutput > 0
                      ? toCurrency === "SEK"
                        ? estimatedOutput.toFixed(2)
                        : estimatedOutput.toFixed(8)
                      : "0"}
                  </div>
                  <select
                    className="input-field w-28"
                    value={toCurrency}
                    onChange={(e) => {
                      const val = e.target.value as Currency;
                      setToCurrency(val);
                      if (val === fromCurrency) setFromCurrency(val === "SEK" ? "BTC" : "SEK");
                    }}
                  >
                    <option value="SEK">SEK</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSwap}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Swap"}
              </button>
            </div>
          </div>

          {/* Right column: info + recent */}
          <div className="space-y-6">
            {/* How it works */}
            <div className="card">
              <h3 className="text-sm font-semibold text-omni-text mb-4">How it works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Choose pair", desc: "Select from/to currency and enter amount" },
                  { step: "2", title: "Atomic swap", desc: "Debit and credit happen in one DB transaction" },
                  { step: "3", title: "Audit logged", desc: "Every swap is recorded with a unique hash" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-omni-accent/20 text-omni-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-omni-text">{item.title}</p>
                      <p className="text-xs text-omni-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent swaps this session */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-omni-text">Recent Swaps</h3>
                <Link href="/audit-log" className="text-xs text-omni-accent hover:text-omni-accent-light transition-colors">
                  View all
                </Link>
              </div>
              {recentSwaps.length === 0 ? (
                <p className="text-xs text-omni-muted text-center py-6">No swaps yet this session</p>
              ) : (
                <div className="space-y-2">
                  {recentSwaps.map((swap, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-omni-darker/50 text-xs">
                      <span className="text-omni-text">
                        {swap.fromAmount} {swap.fromCurrency}
                      </span>
                      <span className="text-omni-muted">{"->"}  </span>
                      <span className="text-omni-success">
                        {swap.toAmount.toFixed(swap.toCurrency === "SEK" ? 2 : 6)} {swap.toCurrency}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
