"use client";

import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RevenueChartProps {
  data: { period: string; eur_cents: number; count: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const t = useTranslations("admin.realMoney");

  if (data.length === 0) {
    return (
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
          {t("revenueTrend")}
        </h3>
        <div className="flex items-center justify-center h-[300px] text-gray-600 text-sm">
          {t("noData")}
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    period: d.period,
    eur: d.eur_cents / 100,
    count: d.count,
  }));

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
        {t("revenueTrend")}
      </h3>
      <ResponsiveContainer height={300} width="100%">
        <LineChart data={chartData}>
          <CartesianGrid stroke="#1e2733" strokeDasharray="3 3" />
          <XAxis
            dataKey="period"
            stroke="#4b5563"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={(v) => v.slice(-5)}
          />
          <YAxis
            stroke="#4b5563"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            yAxisId="eur"
          />
          <YAxis
            orientation="right"
            stroke="#4b5563"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            yAxisId="count"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d1117",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#e5e7eb",
            }}
            formatter={(value, name) => [
              name === "eur" ? `${Number(value ?? 0).toFixed(2)} EUR` : value,
              name === "eur" ? t("revenue") : t("transactions"),
            ]}
          />
          <Legend
            formatter={(value: string) =>
              value === "eur" ? t("revenue") : t("transactions")
            }
          />
          <Line
            dataKey="eur"
            dot={false}
            stroke="#f5a623"
            strokeWidth={2}
            type="monotone"
            yAxisId="eur"
          />
          <Line
            dataKey="count"
            dot={false}
            stroke="#6366f1"
            strokeWidth={2}
            type="monotone"
            yAxisId="count"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
