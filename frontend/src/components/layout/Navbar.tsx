"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-omni-darker/80 backdrop-blur-md border-b border-omni-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold gradient-text">
          OmniBank
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-omni-muted hover:text-omni-text transition-colors text-sm"
              >
                Dashboard
              </Link>
              <Link
                href="/budgets"
                className="text-omni-muted hover:text-omni-text transition-colors text-sm"
              >
                Budgets
              </Link>
              <Link
                href="/exchange"
                className="text-omni-muted hover:text-omni-text transition-colors text-sm"
              >
                Exchange
              </Link>
              <Link
                href="/audit-log"
                className="text-omni-muted hover:text-omni-text transition-colors text-sm"
              >
                Ledger
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-omni-muted">{user.name}</span>
                {user.isVerified ? (
                  <span className="text-xs bg-omni-success/20 text-omni-success px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                ) : (
                  <Link
                    href="/verify"
                    className="text-xs bg-omni-warning/20 text-omni-warning px-2 py-0.5 rounded-full hover:bg-omni-warning/30 transition-colors"
                  >
                    Unverified
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-sm text-omni-muted hover:text-omni-danger transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm py-2 px-4">
                Log In
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
