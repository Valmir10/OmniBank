"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type Step = "idle" | "spar" | "sanction" | "done";

export default function VerifyPage() {
  const router = useRouter();
  const { user, isLoading, verifyIdentity } = useAuth();
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<{
    verified: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  if (user.isVerified) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-lg w-full text-center animate-fade-in">
          <div className="w-16 h-16 bg-omni-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-omni-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-omni-text mb-2">Identity Verified</h1>
          <p className="text-omni-muted mb-6">Your identity has already been verified. You have full access to all OmniBank features.</p>
          <button onClick={() => router.push("/dashboard")} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    // Step 1: SPAR lookup animation
    setStep("spar");
    await new Promise((r) => setTimeout(r, 1200));

    // Step 2: Sanction check animation
    setStep("sanction");
    await new Promise((r) => setTimeout(r, 1000));

    // Step 3: Actual API call
    const res = await verifyIdentity();
    setStep("done");
    setResult(res);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Verify Your Identity
          </h1>
          <p className="text-omni-muted">
            Simulated KYC/AML verification using mTLS SPAR lookup and sanctions
            screening
          </p>
        </div>

        <div className="card space-y-6">
          {/* Process steps */}
          <div className="space-y-4">
            <VerifyStep
              number={1}
              title="SPAR Registry Lookup"
              description="mTLS handshake + identity verification against Swedish Population Register"
              status={
                step === "idle"
                  ? "pending"
                  : step === "spar"
                    ? "active"
                    : "done"
              }
            />
            <VerifyStep
              number={2}
              title="Sanctions List Screening"
              description="Cross-reference against EU/UN/OFAC consolidated sanctions database"
              status={
                step === "idle" || step === "spar"
                  ? "pending"
                  : step === "sanction"
                    ? "active"
                    : "done"
              }
            />
            <VerifyStep
              number={3}
              title="Verification Complete"
              description="Account upgraded to verified status with full access"
              status={step === "done" ? "done" : "pending"}
            />
          </div>

          {/* Result */}
          {result && (
            <div
              className={`rounded-lg p-4 text-sm ${
                result.verified
                  ? "bg-omni-success/10 border border-omni-success/30 text-omni-success"
                  : "bg-omni-danger/10 border border-omni-danger/30 text-omni-danger"
              }`}
            >
              {result.message}
            </div>
          )}

          {/* Action button */}
          {!result?.verified && (
            <button
              onClick={handleVerify}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Start Verification"}
            </button>
          )}

          {result?.verified && (
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary w-full"
            >
              Continue to Dashboard
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function VerifyStep({
  number,
  title,
  description,
  status,
}: {
  number: number;
  title: string;
  description: string;
  status: "pending" | "active" | "done";
}) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium transition-all duration-500 ${
          status === "done"
            ? "bg-omni-success/20 text-omni-success"
            : status === "active"
              ? "bg-omni-accent/20 text-omni-accent animate-pulse-glow"
              : "bg-omni-border text-omni-muted"
        }`}
      >
        {status === "done" ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <div>
        <p
          className={`font-medium text-sm transition-colors ${
            status === "active"
              ? "text-omni-accent"
              : status === "done"
                ? "text-omni-success"
                : "text-omni-muted"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-omni-muted/70 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
