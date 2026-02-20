"use client";

import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PackageRevenueChartProps {
  data: {
    price_eur_cents: number;
    package_shards: number;
    count: number;
    total_eur_cents: number;
  }[];
}

export function PackageRevenueChart({ data }: PackageRevenueChartProps) {
  const t = useTranslations("admin.realMoney");

  if (data.length === 0) {
    return (
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
          {t("revenueByPackage")}
        </h3>
        <div className="flex items-center justify-center h-[300px] text-gray-600 text-sm">
          {t("noData")}
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: `${d.package_shards} shards`,
    revenue: d.total_eur_cents / 100,
    count: d.count,
    price: (d.price_eur_cents / 100).toFixed(2),
  }));

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
        {t("revenueByPackage")}
      </h3>
      <ResponsiveContainer height={300} width="100%">
        <BarChart data={chartData}>
          <CartesianGrid stroke="#1e2733" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="#4b5563"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <YAxis
            stroke="#4b5563"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d1117",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#e5e7eb",
            }}
            formatter={(value) => [
              `${Number(value ?? 0).toFixed(2)} EUR`,
              t("revenue"),
            ]}
          />
          <Bar dataKey="revenue" fill="#f5a623" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
