"use client";

import { useTranslations } from "next-intl";

interface ShardEconomyCardProps {
  shardsPurchased: number;
  shardsSpent: number;
  shardsBalance: number;
}

export function ShardEconomyCard({
  shardsPurchased,
  shardsSpent,
  shardsBalance,
}: ShardEconomyCardProps) {
  const t = useTranslations("admin.realMoney");

  const spentPercent =
    shardsPurchased > 0 ? Math.round((shardsSpent / shardsPurchased) * 100) : 0;

  const items = [
    {
      label: t("shardsPurchased"),
      value: shardsPurchased.toLocaleString(),
      color: "text-green-400",
      barColor: "bg-green-500",
      percent: 100,
    },
    {
      label: t("shardsSpent"),
      value: shardsSpent.toLocaleString(),
      color: "text-orange-400",
      barColor: "bg-orange-500",
      percent: spentPercent,
    },
    {
      label: t("shardsBalance"),
      value: shardsBalance.toLocaleString(),
      color: "text-purple-400",
      barColor: "bg-purple-500",
      percent:
        shardsPurchased > 0
          ? Math.round((shardsBalance / shardsPurchased) * 100)
          : 0,
    },
  ];

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
        {t("shardEconomy")}
      </h3>
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">{item.label}</span>
              <span className={`text-sm font-semibold ${item.color}`}>
                {item.value}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`${item.barColor} h-2 rounded-full transition-all`}
                style={{ width: `${Math.min(item.percent, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
