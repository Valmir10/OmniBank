"use client";

import { BudgetAlert } from "@/types";

export function NotificationPanel({
  alerts,
  onDismiss,
}: {
  alerts: BudgetAlert[];
  onDismiss: (index: number) => void;
}) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-40 w-96 space-y-3 animate-slide-up">
      {alerts.map((alert, i) => (
        <div
          key={`${alert.budgetId}-${i}`}
          className={`rounded-lg p-4 border backdrop-blur-md shadow-lg transition-all ${
            alert.exceeded
              ? "bg-omni-danger/10 border-omni-danger/40"
              : "bg-omni-warning/10 border-omni-warning/40"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                  alert.exceeded ? "text-omni-danger" : "text-omni-warning"
                }`}
              >
                {alert.exceeded ? "Budget Exceeded" : "Budget Warning"}
              </p>
              <p className="text-xs text-omni-muted mt-1">{alert.message}</p>
              <div className="mt-2 w-full bg-omni-darker rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    alert.exceeded ? "bg-omni-danger" : "bg-omni-warning"
                  }`}
                  style={{
                    width: `${Math.min(100, (alert.currentSpent / alert.limitAmount) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => onDismiss(i)}
              className="text-omni-muted hover:text-omni-text text-lg leading-none"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
