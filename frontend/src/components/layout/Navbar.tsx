"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/budgets", label: "Budgets" },
  { href: "/exchange", label: "Exchange" },
  { href: "/audit-log", label: "Ledger" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-omni-darker/80 backdrop-blur-md border-b border-omni-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            OmniBank
          </Link>

          {user ? (
            <>
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-omni-muted hover:text-omni-text transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-omni-border">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-omni-accent to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-omni-muted">{user.name}</span>
                  </Link>
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
                </div>
              </div>

              {/* Mobile: avatar + hamburger */}
              <div className="flex md:hidden items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-omni-accent to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <button
                  onClick={() => setMenuOpen(true)}
                  className="text-omni-muted hover:text-omni-text transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="btn-secondary text-sm py-2 px-4">
                Log In
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Fullscreen mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-omni-dark flex flex-col md:hidden animate-fade-in">
          <div className="flex justify-end p-6">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-omni-accent hover:text-omni-accent-light transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-omni-muted hover:text-omni-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!user?.isVerified && (
              <Link
                href="/verify"
                onClick={() => setMenuOpen(false)}
                className="text-lg text-omni-warning hover:text-yellow-400 transition-colors border border-omni-warning/30 px-6 py-2 rounded-lg"
              >
                Verify Identity
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
