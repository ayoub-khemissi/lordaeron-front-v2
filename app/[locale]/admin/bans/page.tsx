"use client";

import type { ShopBan } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useTranslations } from "next-intl";

import { BanTable } from "@/components/admin/ban-table";
import { BanModal } from "@/components/admin/ban-modal";

export default function AdminBansPage() {
  const t = useTranslations("admin.bans");
  const [bans, setBans] = useState<ShopBan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchBans = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bans");
      const data = await res.json();

      setBans(data.bans || []);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBans();
  }, [fetchBans]);

  const handleAddBan = async (data: {
    account_id: number;
    reason: string;
    expires_at: string | null;
  }) => {
    await fetch("/api/admin/bans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchBans();
  };

  const handleRemoveBan = async (ban: ShopBan) => {
    await fetch(`/api/admin/bans/${ban.id}`, { method: "DELETE" });
    fetchBans();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-gray-100">{t("title")}</h1>
        <Button
          className="bg-red-500 text-white font-bold"
          onPress={() => setShowModal(true)}
        >
          {t("addBan")}
        </Button>
      </div>

      <BanTable bans={bans} onRemove={handleRemoveBan} />

      <BanModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddBan}
      />
    </div>
  );
}
