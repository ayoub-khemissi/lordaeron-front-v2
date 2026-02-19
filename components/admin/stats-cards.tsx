"use client";

import { Card, CardBody } from "@heroui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface StatsCardsProps {
  totalRevenue: number;
  totalPurchases: number;
  averageOrder: number;
  activeItems: number;
}

export function StatsCards({
  totalRevenue,
  totalPurchases,
  averageOrder,
  activeItems,
}: StatsCardsProps) {
  const t = useTranslations("admin.dashboard");

  const stats = [
    {
      label: t("totalRevenue"),
      value: totalRevenue.toLocaleString(),
      icon: "/img/icons/soul-shard.svg",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: t("totalPurchases"),
      value: totalPurchases.toLocaleString(),
      icon: null,
      emoji: "\uD83D\uDED2",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: t("averageOrder"),
      value: averageOrder.toLocaleString(),
      icon: null,
      emoji: "\uD83D\uDCB0",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: t("activeItems"),
      value: activeItems.toLocaleString(),
      icon: null,
      emoji: "\uD83D\uDCE6",
      color: "text-wow-gold",
      bg: "bg-wow-gold/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-[#161b22] border border-gray-800">
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              {stat.icon ? (
                <Image alt="" height={20} src={stat.icon} width={20} />
              ) : (
                <span className="text-lg">{stat.emoji}</span>
              )}
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
