"use client";

import { useTranslations } from "next-intl";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface StatusDistributionChartProps {
  data: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  completed: "#22c55e",
  pending: "#eab308",
  failed: "#ef4444",
  expired: "#6b7280",
  refunded: "#f97316",
};

export function StatusDistributionChart({
  data,
}: StatusDistributionChartProps) {
  const t = useTranslations("admin.realMoney");

  if (data.length === 0) {
    return (
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
          {t("statusDistribution")}
        </h3>
        <div className="flex items-center justify-center h-[300px] text-gray-600 text-sm">
          {t("noData")}
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: t(`status_${d.status}`),
    value: d.count,
    status: d.status,
  }));

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
        {t("statusDistribution")}
      </h3>
      <ResponsiveContainer height={300} width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={chartData}
            dataKey="value"
            innerRadius={60}
            nameKey="name"
            outerRadius={100}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] || "#6b7280"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d1117",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#e5e7eb" }}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Legend
            formatter={(value: string) => (
              <span className="text-gray-300 text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
