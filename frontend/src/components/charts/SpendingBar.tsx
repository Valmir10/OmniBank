"use client";

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

export function SpendingBar({ data }: { data: SpendingByCategory[] }) {
  const chartData = {
    labels: data.map((d) => CATEGORY_LABELS[d.category] || d.category),
    datasets: [
      {
        label: "Spending (SEK)",
        data: data.map((d) => d.total),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(99, 102, 241, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: "rgba(30, 41, 59, 0.5)" },
        ticks: { color: "#94a3b8", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(30, 41, 59, 0.5)" },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (value: string | number) => `${Number(value).toLocaleString()} kr`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        borderColor: "#334155",
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
