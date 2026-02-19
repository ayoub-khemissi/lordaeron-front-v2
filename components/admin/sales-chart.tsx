"use client";

import { useTranslations } from "next-intl";

interface SalesChartProps {
  data: { period: string; count: number; revenue: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  const t = useTranslations("admin.dashboard");
  const tc = useTranslations("admin.common");

  if (data.length === 0) return null;

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 mb-8">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">{t("salesTrend")}</h3>
      <div className="flex items-end gap-1 h-40">
        {data.map((d, i) => {
          const height = (d.revenue / maxRevenue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div
                className="w-full bg-wow-gold/20 hover:bg-wow-gold/40 rounded-t transition-colors cursor-pointer min-h-[2px]"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-gray-600 truncate w-full text-center">
                {d.period.slice(-5)}
              </span>
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs z-10 whitespace-nowrap">
                <p className="text-gray-300">{d.period}</p>
                <p className="text-purple-400">{d.revenue} {tc("shards")}</p>
                <p className="text-gray-400">{d.count} {tc("sales").toLowerCase()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
