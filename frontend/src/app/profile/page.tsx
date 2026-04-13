"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const memberSince = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <main className="min-h-screen pt-20 p-6">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold text-omni-text mb-8">
          Your <span className="gradient-text">Profile</span>
        </h1>

        {/* Avatar & basic info */}
        <div className="card mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-omni-accent to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-omni-text">{user.name}</h2>
              <p className="text-sm text-omni-muted">{user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                {user.isVerified ? (
                  <span className="text-xs bg-omni-success/20 text-omni-success px-2.5 py-1 rounded-full">
                    KYC Verified
                  </span>
                ) : (
                  <button
                    onClick={() => router.push("/verify")}
                    className="text-xs bg-omni-warning/20 text-omni-warning px-2.5 py-1 rounded-full hover:bg-omni-warning/30 transition-colors"
                  >
                    Unverified - Click to verify
                  </button>
                )}
                <span className="text-xs text-omni-muted">
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account details */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-omni-text mb-4">Account Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-omni-border">
              <div>
                <p className="text-sm font-medium text-omni-text">Account ID</p>
                <p className="text-xs text-omni-muted">Your unique identifier</p>
              </div>
              <p className="text-sm text-omni-muted font-mono">{user.id.substring(0, 16)}...</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-omni-border">
              <div>
                <p className="text-sm font-medium text-omni-text">Email</p>
                <p className="text-xs text-omni-muted">Primary contact</p>
              </div>
              <p className="text-sm text-omni-muted">{user.email}</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-omni-border">
              <div>
                <p className="text-sm font-medium text-omni-text">Verification Status</p>
                <p className="text-xs text-omni-muted">KYC/AML compliance</p>
              </div>
              <p className={`text-sm ${user.isVerified ? "text-omni-success" : "text-omni-warning"}`}>
                {user.isVerified ? "Verified" : "Pending"}
              </p>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-omni-text">Account Type</p>
                <p className="text-xs text-omni-muted">Subscription tier</p>
              </div>
              <span className="text-xs bg-omni-accent/20 text-omni-accent px-2.5 py-1 rounded-full">
                Premium
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-omni-text mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-omni-border">
              <div>
                <p className="text-sm font-medium text-omni-text">Theme</p>
                <p className="text-xs text-omni-muted">Switch between dark and light mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative w-14 h-7 rounded-full transition-colors duration-300 flex items-center px-1"
                style={{
                  backgroundColor: theme === "dark" ? "rgb(99 102 241)" : "#cbd5e1",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center"
                  style={{
                    transform: theme === "dark" ? "translateX(0)" : "translateX(28px)",
                  }}
                >
                  <span className="text-[10px]">{theme === "dark" ? "D" : "L"}</span>
                </div>
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-omni-border">
              <div>
                <p className="text-sm font-medium text-omni-text">Currency Display</p>
                <p className="text-xs text-omni-muted">Default display currency</p>
              </div>
              <span className="text-sm text-omni-muted">SEK (kr)</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-omni-text">Notifications</p>
                <p className="text-xs text-omni-muted">Budget alert push notifications</p>
              </div>
              <span className="text-xs bg-omni-success/20 text-omni-success px-2.5 py-1 rounded-full">
                Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card border-omni-danger/20">
          <h3 className="text-lg font-semibold text-omni-danger mb-4">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-omni-text">Sign out</p>
              <p className="text-xs text-omni-muted">Log out from this device</p>
            </div>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="text-sm text-omni-danger hover:text-red-400 border border-omni-danger/30 hover:bg-omni-danger/10 px-4 py-2 rounded-lg transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
