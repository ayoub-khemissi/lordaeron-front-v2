"use client";

import { useTranslations } from "next-intl";

interface FinancialKPICardsProps {
  totalEurCents: number;
  totalTransactions: number;
  avgTransactionCents: number;
  refundRate: number;
  uniqueBuyers: number;
  shardsBalance: number;
}

function formatEur(cents: number) {
  return (cents / 100).toFixed(2);
}

export function FinancialKPICards({
  totalEurCents,
  totalTransactions,
  avgTransactionCents,
  refundRate,
  uniqueBuyers,
  shardsBalance,
}: FinancialKPICardsProps) {
  const t = useTranslations("admin.realMoney");

  const cards = [
    {
      label: t("totalRevenue"),
      value: `${formatEur(totalEurCents)} EUR`,
      color: "text-green-400",
    },
    {
      label: t("totalTransactions"),
      value: totalTransactions.toLocaleString(),
      color: "text-blue-400",
    },
    {
      label: t("avgTransaction"),
      value: `${formatEur(avgTransactionCents)} EUR`,
      color: "text-purple-400",
    },
    {
      label: t("refundRate"),
      value: `${refundRate}%`,
      color: refundRate > 5 ? "text-red-400" : "text-gray-300",
    },
    {
      label: t("uniqueBuyers"),
      value: uniqueBuyers.toLocaleString(),
      color: "text-wow-gold",
    },
    {
      label: t("shardsInCirculation"),
      value: shardsBalance.toLocaleString(),
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#161b22] border border-gray-800 rounded-xl p-5"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {card.label}
          </p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
