"use client";

import type { ShopPurchaseWithItem } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { PurchaseTable } from "@/components/admin/purchase-table";
import { RefundModal } from "@/components/admin/refund-modal";

export default function AdminPurchasesPage() {
  const t = useTranslations("admin.purchases");
  const tc = useTranslations("admin.common");
  const [purchases, setPurchases] = useState<ShopPurchaseWithItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchAccount, setSearchAccount] = useState("");
  const [searchCharacter, setSearchCharacter] = useState("");
  const [offset, setOffset] = useState(0);

  const [refundTarget, setRefundTarget] = useState<ShopPurchaseWithItem | null>(
    null,
  );
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);
  const [retryStatus, setRetryStatus] = useState<{
    id: number;
    success: boolean;
    error?: string;
    message?: string;
  } | null>(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        offset: String(offset),
      });

      if (searchAccount) params.set("account_id", searchAccount);
      if (searchCharacter) params.set("character_name", searchCharacter);

      const res = await fetch(`/api/admin/purchases?${params}`);
      const data = await res.json();

      setPurchases(data.purchases || []);
      setTotal(data.total || 0);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [offset, searchAccount, searchCharacter]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleRetry = async (purchase: ShopPurchaseWithItem) => {
    try {
      const res = await fetch(`/api/admin/purchases/${purchase.id}/retry`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setRetryStatus({
          id: purchase.id,
          success: false,
          error: data.error || "serverError",
          message: data.message,
        });
      } else {
        setRetryStatus({ id: purchase.id, success: true });
      }

      fetchPurchases();
    } catch {
      setRetryStatus({ id: purchase.id, success: false, error: "serverError" });
    }

    setTimeout(() => setRetryStatus(null), 5000);
  };

  const handleRefund = async () => {
    if (!refundTarget) return;
    setRefundLoading(true);
    setRefundError(null);
    try {
      const res = await fetch(
        `/api/admin/purchases/${refundTarget.id}/refund`,
        { method: "POST" },
      );
      const data = await res.json();

      if (!res.ok || data.error) {
        setRefundError(data.error || "serverError");

        return;
      }

      setRefundTarget(null);
      fetchPurchases();
    } catch {
      setRefundError("serverError");
    } finally {
      setRefundLoading(false);
    }
  };

  const handleCloseRefund = () => {
    setRefundTarget(null);
    setRefundError(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-heading text-gray-100 mb-6">{t("title")}</h1>

      <div className="flex gap-3 mb-6">
        <Input
          className="max-w-[150px]"
          classNames={{ inputWrapper: "bg-[#161b22] border-gray-700" }}
          placeholder={t("account")}
          size="sm"
          type="number"
          value={searchAccount}
          onValueChange={setSearchAccount}
        />
        <Input
          className="max-w-[200px]"
          classNames={{ inputWrapper: "bg-[#161b22] border-gray-700" }}
          placeholder={t("character")}
          size="sm"
          value={searchCharacter}
          onValueChange={setSearchCharacter}
        />
        <Button
          className="bg-wow-gold/20 text-wow-gold"
          size="sm"
          onPress={() => {
            setOffset(0);
            fetchPurchases();
          }}
        >
          {tc("search")}
        </Button>
      </div>

      {retryStatus && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg text-sm ${
            retryStatus.success
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {retryStatus.success ? t("retrySuccess") : t("retryFailed")} (#
          {retryStatus.id})
          {retryStatus.message && (
            <span className="block text-xs opacity-70 mt-1">
              {retryStatus.message}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner color="warning" size="lg" />
        </div>
      ) : (
        <>
          <PurchaseTable
            purchases={purchases}
            onRefund={setRefundTarget}
            onRetry={handleRetry}
          />
          {total > 50 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                className="text-gray-400"
                isDisabled={offset === 0}
                size="sm"
                variant="light"
                onPress={() => setOffset(Math.max(0, offset - 50))}
              >
                {tc("previous")}
              </Button>
              <span className="text-sm text-gray-500 py-2">
                {offset + 1}-{Math.min(offset + 50, total)} / {total}
              </span>
              <Button
                className="text-gray-400"
                isDisabled={offset + 50 >= total}
                size="sm"
                variant="light"
                onPress={() => setOffset(offset + 50)}
              >
                {tc("next")}
              </Button>
            </div>
          )}
        </>
      )}

      <RefundModal
        error={refundError}
        isOpen={!!refundTarget}
        loading={refundLoading}
        purchase={refundTarget}
        onClose={handleCloseRefund}
        onConfirm={handleRefund}
      />
    </div>
  );
}
