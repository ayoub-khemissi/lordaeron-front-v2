"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@heroui/spinner";

import { StatsCards } from "@/components/admin/stats-cards";
import { SalesChart } from "@/components/admin/sales-chart";
import { TopItemsTable } from "@/components/admin/top-items-table";

export default function AdminDashboardPage() {
  const t = useTranslations("admin.dashboard");
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalPurchases: number;
    averageOrderValue: number;
    activeItems: number;
    topItems: {
      id: number;
      name_en: string;
      name_fr: string;
      name_es: string;
      name_de: string;
      name_it: string;
      item_id: number | null;
      count: number;
      revenue: number;
    }[];
    trend: { period: string; count: number; revenue: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats?period=daily&days=30");
        const data = await res.json();

        setStats(data);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <h1 className="text-2xl font-heading text-gray-100 mb-6">{t("title")}</h1>

      <StatsCards
        activeItems={stats.activeItems ?? 0}
        averageOrder={stats.averageOrderValue ?? 0}
        totalPurchases={stats.totalPurchases ?? 0}
        totalRevenue={stats.totalRevenue ?? 0}
      />

      <SalesChart data={stats.trend || []} />

      <TopItemsTable items={stats.topItems || []} />
    </div>
  );
}
