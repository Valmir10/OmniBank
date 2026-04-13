"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { SpendingByCategory } from "@/types/dashboard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

export function SpendingBar({ data }: { data: SpendingByCategory[] }) {
  const isDark = useIsDark();

  const chartData = {
    labels: data.map((d) => CATEGORY_LABELS[d.category] || d.category),
    datasets: [
      {
        label: "Spending (SEK)",
        data: data.map((d) => d.total),
        backgroundColor: isDark ? "rgba(99, 102, 241, 0.6)" : "rgba(99, 102, 241, 0.7)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(99, 102, 241, 0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(226, 232, 240, 0.8)" },
        ticks: { color: isDark ? "#94a3b8" : "#475569", font: { size: 11 } },
      },
      y: {
        grid: { color: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(226, 232, 240, 0.8)" },
        ticks: {
          color: isDark ? "#94a3b8" : "#475569",
          font: { size: 11 },
          callback: (value: string | number) => `${Number(value).toLocaleString()} kr`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        titleColor: isDark ? "#e2e8f0" : "#0f172a",
        bodyColor: isDark ? "#94a3b8" : "#475569",
        borderColor: isDark ? "#334155" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx: TooltipItem<"bar">) =>
            `${(ctx.parsed.y ?? 0).toLocaleString("sv-SE")} kr`,
        },
      },
    },
  };

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
}
