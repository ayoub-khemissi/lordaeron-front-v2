"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import { FinancialKPICards } from "@/components/admin/financial/financial-kpi-cards";
import { RevenueChart } from "@/components/admin/financial/revenue-chart";
import { StatusDistributionChart } from "@/components/admin/financial/status-distribution-chart";
import { PackageRevenueChart } from "@/components/admin/financial/package-revenue-chart";
import { ShardEconomyCard } from "@/components/admin/financial/shard-economy-card";
import { TransactionTable } from "@/components/admin/financial/transaction-table";
import { TopSpendersTable } from "@/components/admin/financial/top-spenders-table";

interface KPIs {
  totalEurCents: number;
  totalTransactions: number;
  avgTransactionCents: number;
  refundRate: number;
  refundEurCents: number;
  uniqueBuyers: number;
  shardsPurchased: number;
  shardsSpent: number;
  shardsBalance: number;
}

interface OverviewData {
  kpis: KPIs;
  statusDistribution: { status: string; count: number }[];
  revenueTrend: { period: string; eur_cents: number; count: number }[];
  revenueByPackage: {
    price_eur_cents: number;
    package_shards: number;
    count: number;
    total_eur_cents: number;
  }[];
  topSpenders: {
    account_id: number;
    transaction_count: number;
    total_eur_cents: number;
    total_shards: number;
  }[];
}

interface Transaction {
  id: number;
  account_id: number;
  package_shards: number;
  price_eur_cents: number;
  currency: string;
  status: string;
  created_at: string;
}

const PERIOD_OPTIONS = [
  { key: "daily", days: 30 },
  { key: "weekly", days: 90 },
  { key: "monthly", days: 365 },
];

const STATUS_OPTIONS = ["", "pending", "completed", "failed", "expired", "refunded"];

export default function RealMoneyPage() {
  const t = useTranslations("admin.realMoney");
  const tc = useTranslations("admin.common");

  // Overview state
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [periodIdx, setPeriodIdx] = useState(0);

  // Transaction list state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txLoading, setTxLoading] = useState(true);
  const [txOffset, setTxOffset] = useState(0);
  const [filterAccount, setFilterAccount] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const period = PERIOD_OPTIONS[periodIdx];

  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const res = await fetch(
        `/api/admin/financial?period=${period.key}&days=${period.days}`,
      );
      const data = await res.json();

      setOverview(data);
    } catch {
      // Silent fail
    } finally {
      setOverviewLoading(false);
    }
  }, [period.key, period.days]);

  const fetchTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const params = new URLSearchParams({
        view: "transactions",
        limit: "50",
        offset: String(txOffset),
      });

      if (filterAccount) params.set("account_id", filterAccount);
      if (filterStatus) params.set("status", filterStatus);

      const res = await fetch(`/api/admin/financial?${params}`);
      const data = await res.json();

      setTransactions(data.transactions || []);
      setTxTotal(data.total || 0);
    } catch {
      // Silent fail
    } finally {
      setTxLoading(false);
    }
  }, [txOffset, filterAccount, filterStatus]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-gray-100">{t("title")}</h1>
        <div className="flex gap-2">
          {PERIOD_OPTIONS.map((opt, i) => (
            <Button
              key={opt.key}
              className={
                i === periodIdx
                  ? "bg-wow-gold/20 text-wow-gold"
                  : "text-gray-400"
              }
              size="sm"
              variant={i === periodIdx ? "flat" : "light"}
              onPress={() => setPeriodIdx(i)}
            >
              {t(`period_${opt.key}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview section */}
      {overviewLoading ? (
        <div className="flex justify-center py-16">
          <Spinner color="warning" size="lg" />
        </div>
      ) : overview ? (
        <>
          <FinancialKPICards
            avgTransactionCents={overview.kpis.avgTransactionCents}
            refundRate={overview.kpis.refundRate}
            shardsBalance={overview.kpis.shardsBalance}
            totalEurCents={overview.kpis.totalEurCents}
            totalTransactions={overview.kpis.totalTransactions}
            uniqueBuyers={overview.kpis.uniqueBuyers}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2">
              <RevenueChart data={overview.revenueTrend} />
            </div>
            <div>
              <StatusDistributionChart data={overview.statusDistribution} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <PackageRevenueChart data={overview.revenueByPackage} />
            <ShardEconomyCard
              shardsBalance={overview.kpis.shardsBalance}
              shardsPurchased={overview.kpis.shardsPurchased}
              shardsSpent={overview.kpis.shardsSpent}
            />
          </div>

          <div className="mb-8">
            <TopSpendersTable spenders={overview.topSpenders} />
          </div>
        </>
      ) : null}

      {/* Divider */}
      <div className="border-t border-gray-800 my-8" />

      {/* Transaction list section */}
      <h2 className="text-xl font-heading text-gray-100 mb-4">
        {t("transactionList")}
      </h2>

      <div className="flex gap-3 mb-6">
        <Input
          className="max-w-[150px]"
          classNames={{ inputWrapper: "bg-[#161b22] border-gray-700" }}
          placeholder={t("account")}
          size="sm"
          type="number"
          value={filterAccount}
          onValueChange={setFilterAccount}
        />
        <Select
          className="max-w-[180px]"
          classNames={{
            trigger: "bg-[#161b22] border-gray-700",
          }}
          placeholder={t("status")}
          selectedKeys={filterStatus ? [filterStatus] : []}
          size="sm"
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as string;

            setFilterStatus(val || "");
          }}
        >
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <SelectItem key={s}>{t(`status_${s}`)}</SelectItem>
          ))}
        </Select>
        <Button
          className="bg-wow-gold/20 text-wow-gold"
          size="sm"
          onPress={() => {
            setTxOffset(0);
            fetchTransactions();
          }}
        >
          {tc("search")}
        </Button>
        {(filterAccount || filterStatus) && (
          <Button
            className="text-gray-400"
            size="sm"
            variant="light"
            onPress={() => {
              setFilterAccount("");
              setFilterStatus("");
              setTxOffset(0);
            }}
          >
            {t("clearFilters")}
          </Button>
        )}
      </div>

      {txLoading ? (
        <div className="flex justify-center py-16">
          <Spinner color="warning" size="lg" />
        </div>
      ) : (
        <>
          <TransactionTable transactions={transactions} />
          {txTotal > 50 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                className="text-gray-400"
                isDisabled={txOffset === 0}
                size="sm"
                variant="light"
                onPress={() => setTxOffset(Math.max(0, txOffset - 50))}
              >
                {tc("previous")}
              </Button>
              <span className="text-sm text-gray-500 py-2">
                {txOffset + 1}-{Math.min(txOffset + 50, txTotal)} / {txTotal}
              </span>
              <Button
                className="text-gray-400"
                isDisabled={txOffset + 50 >= txTotal}
                size="sm"
                variant="light"
                onPress={() => setTxOffset(txOffset + 50)}
              >
                {tc("next")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
