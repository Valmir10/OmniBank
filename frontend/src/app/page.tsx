import Link from "next/link";
import { AuthRedirect } from "@/components/ui/AuthRedirect";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AuthRedirect />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-omni-dark">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-omni-accent/10 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-omni-accent/30 bg-omni-accent/5 text-omni-accent text-sm">
            Trusted by the next generation of finance
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your finances,{" "}
            <span className="gradient-text">unified.</span>
          </h1>
          <p className="text-omni-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            OmniBank brings all your bank accounts, budgets, and crypto into one
            intelligent dashboard. Real-time alerts, instant exchanges, and
            complete control over your money.
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="btn-primary text-base px-8 py-3.5"
            >
              Open Free Account
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-base px-8 py-3.5"
            >
              Sign In
            </Link>
          </div>

          {/* Mock dashboard preview */}
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-omni-accent/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative rounded-xl border border-omni-border bg-omni-card/80 backdrop-blur-sm p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-omni-muted ml-2">omnibank.app/dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-omni-darker rounded-lg p-3">
                  <p className="text-[10px] text-omni-muted">Total Balance</p>
                  <p className="text-lg font-bold gradient-text">43,070 kr</p>
                </div>
                <div className="bg-omni-darker rounded-lg p-3">
                  <p className="text-[10px] text-omni-muted">This Month</p>
                  <p className="text-lg font-bold text-omni-success">+32,000 kr</p>
                </div>
                <div className="bg-omni-darker rounded-lg p-3">
                  <p className="text-[10px] text-omni-muted">BTC Holdings</p>
                  <p className="text-lg font-bold text-omni-warning">0.0507</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-omni-darker rounded-lg p-3 h-32 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-omni-accent/60 rounded-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="w-32 bg-omni-darker rounded-lg p-3 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-omni-accent/60 border-t-purple-500/60 border-r-cyan-500/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-omni-border bg-omni-card/50 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "3", label: "Bank Integrations" },
            { value: "< 1s", label: "Real-time Alerts" },
            { value: "BTC/ETH", label: "Crypto Support" },
            { value: "256-bit", label: "Encryption" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-omni-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features deep dive */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-omni-text mb-4">
              Everything you need, <span className="gradient-text">nothing you don&apos;t</span>
            </h2>
            <p className="text-omni-muted max-w-lg mx-auto">
              Four powerful modules that work together to give you complete financial clarity.
            </p>
          </div>

          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-omni-accent/10 text-omni-accent text-xs font-medium mb-4">
                  Open Banking
                </div>
                <h3 className="text-2xl font-bold text-omni-text mb-4">
                  All your accounts. One dashboard.
                </h3>
                <p className="text-omni-muted mb-6 leading-relaxed">
                  Connect accounts from OmniBank, Nordea, SEB, and more through
                  PSD2-compliant aggregation. See your total balance, spending
                  patterns, and category breakdowns in real time.
                </p>
                <ul className="space-y-3">
                  {["Multi-bank aggregation via PSD2", "Spending categorization with charts", "Transaction history across all banks"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-omni-muted">
                      <div className="w-5 h-5 rounded-full bg-omni-success/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-omni-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card bg-omni-darker/50 p-8">
                <div className="space-y-3">
                  {[
                    { bank: "OmniBank", amount: "10,000 kr", tag: "Internal" },
                    { bank: "Nordea", amount: "24,350 kr", tag: "PSD2" },
                    { bank: "SEB", amount: "8,720 kr", tag: "PSD2" },
                  ].map((acc) => (
                    <div key={acc.bank} className="flex items-center justify-between p-3 rounded-lg bg-omni-card border border-omni-border">
                      <div>
                        <p className="text-sm font-medium text-omni-text">{acc.bank}</p>
                        <p className="text-xs text-omni-muted">{acc.tag}</p>
                      </div>
                      <p className="text-sm font-bold text-omni-text">{acc.amount}</p>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-omni-border flex justify-between">
                    <p className="text-sm text-omni-muted">Total</p>
                    <p className="text-lg font-bold gradient-text">43,070 kr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 card bg-omni-darker/50 p-8">
                <div className="space-y-4">
                  {[
                    { cat: "Food", spent: 813, limit: 3000, color: "bg-green-500" },
                    { cat: "Rent", spent: 8500, limit: 9000, color: "bg-red-500" },
                    { cat: "Transport", spent: 1035, limit: 1200, color: "bg-blue-500" },
                  ].map((b) => (
                    <div key={b.cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-omni-text">{b.cat}</span>
                        <span className="text-omni-muted">{b.spent.toLocaleString()} / {b.limit.toLocaleString()} kr</span>
                      </div>
                      <div className="w-full bg-omni-card rounded-full h-2">
                        <div className={`h-2 rounded-full ${b.color}`} style={{ width: `${(b.spent / b.limit) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 rounded-lg bg-omni-warning/10 border border-omni-warning/30">
                    <p className="text-xs text-omni-warning font-medium">Budget Alert: Transport is at 86%</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-block px-3 py-1 rounded-full bg-omni-warning/10 text-omni-warning text-xs font-medium mb-4">
                  Smart Budgeting
                </div>
                <h3 className="text-2xl font-bold text-omni-text mb-4">
                  Know before you overspend.
                </h3>
                <p className="text-omni-muted mb-6 leading-relaxed">
                  Set monthly limits per category. When a transaction pushes you
                  past 80%, you get an instant push notification via WebSocket -
                  no page refresh needed.
                </p>
                <ul className="space-y-3">
                  {["Per-category monthly budgets", "Real-time WebSocket push alerts", "Visual progress tracking"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-omni-muted">
                      <div className="w-5 h-5 rounded-full bg-omni-success/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-omni-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-4">
                  Crypto Exchange
                </div>
                <h3 className="text-2xl font-bold text-omni-text mb-4">
                  Swap instantly. Every trade recorded.
                </h3>
                <p className="text-omni-muted mb-6 leading-relaxed">
                  Exchange SEK to BTC or ETH with live CoinGecko prices. Every
                  swap is an atomic database transaction - your SEK goes down and
                  crypto goes up simultaneously. No partial states, ever.
                </p>
                <ul className="space-y-3">
                  {["Atomic PostgreSQL transactions", "Live prices from CoinGecko", "Immutable audit ledger with hashes"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-omni-muted">
                      <div className="w-5 h-5 rounded-full bg-omni-success/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-omni-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card bg-omni-darker/50 p-8">
                <div className="text-center mb-6">
                  <p className="text-xs text-omni-muted mb-1">BTC / SEK</p>
                  <p className="text-3xl font-bold text-omni-text">985,420</p>
                  <p className="text-xs text-omni-success mt-1">+2.4% today</p>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 p-3 rounded-lg bg-omni-card border border-omni-border text-center">
                    <p className="text-xs text-omni-muted">From</p>
                    <p className="text-sm font-bold text-omni-text">10,000 SEK</p>
                  </div>
                  <svg className="w-5 h-5 text-omni-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="flex-1 p-3 rounded-lg bg-omni-card border border-omni-border text-center">
                    <p className="text-xs text-omni-muted">To</p>
                    <p className="text-sm font-bold text-omni-text">0.01015 BTC</p>
                  </div>
                </div>
                <div className="p-2 rounded bg-omni-card text-center">
                  <p className="text-[10px] text-omni-muted font-mono">tx_hash: exch_a1b2c3d4e5f6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security section */}
      <section className="py-24 px-6 bg-omni-card/30 border-y border-omni-border">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-omni-text mb-4">
            Built with <span className="gradient-text">security first</span>
          </h2>
          <p className="text-omni-muted max-w-lg mx-auto mb-12">
            Every layer of OmniBank is designed with financial compliance and data integrity in mind.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "KYC/AML Compliance",
                desc: "Simulated mTLS SPAR registry lookup and EU/UN sanctions screening before account verification.",
              },
              {
                title: "Atomic Transactions",
                desc: "PostgreSQL BEGIN/COMMIT ensures your money never exists in two places at once. ROLLBACK on any failure.",
              },
              {
                title: "Immutable Audit Log",
                desc: "Every crypto exchange is permanently recorded with transaction hashes. Read-only by design.",
              },
            ].map((item) => (
              <div key={item.title} className="card text-left">
                <div className="w-10 h-10 rounded-lg bg-omni-accent/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-omni-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-omni-text mb-2">{item.title}</h3>
                <p className="text-sm text-omni-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-omni-text mb-4">
            Ready to take control?
          </h2>
          <p className="text-omni-muted mb-8">
            Create your free account in seconds. No credit card required.
          </p>
          <Link href="/register" className="btn-primary text-base px-10 py-4 inline-block">
            Get Started for Free
          </Link>
        </div>
      </section>


    </main>
  );
}
