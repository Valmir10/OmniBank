"use client";

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { SpendingByCategory } from "@/types/dashboard";

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS: Record<string, string> = {
  rent: "#ef4444",
  food: "#22c55e",
  transport: "#3b82f6",
  entertainment: "#a855f7",
  utilities: "#f59e0b",
  salary: "#06b6d4",
  crypto_exchange: "#ec4899",
  other: "#6b7280",
};

const CATEGORY_LABELS: Record<string, string> = {
  rent: "Rent",
  food: "Food",
  transport: "Transport",
  entertainment: "Entertainment",
  utilities: "Utilities",
  salary: "Salary",
  crypto_exchange: "Crypto",
  other: "Other",
};

function useIsDark() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export function SpendingDoughnut({ data }: { data: SpendingByCategory[] }) {
  const isDark = useIsDark();

  const chartData = {
    labels: data.map((d) => CATEGORY_LABELS[d.category] || d.category),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map(
          (d) => CATEGORY_COLORS[d.category] || "#6b7280"
        ),
        borderColor: isDark ? "#111827" : "#ffffff",
        borderWidth: 3,
        hoverBorderWidth: 2,
        hoverBorderColor: isDark ? "#e2e8f0" : "#0f172a",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: isDark ? "#94a3b8" : "#475569",
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        titleColor: isDark ? "#e2e8f0" : "#0f172a",
        bodyColor: isDark ? "#94a3b8" : "#475569",
        borderColor: isDark ? "#334155" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) =>
            `${ctx.label}: ${ctx.parsed.toLocaleString("sv-SE")} kr`,
        },
      },
    },
  };

  return (
    <div className="h-72">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
