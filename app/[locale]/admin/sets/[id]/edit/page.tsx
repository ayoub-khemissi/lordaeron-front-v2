"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@heroui/spinner";

import { SetForm } from "@/components/admin/set-form";
import type { ShopSetWithItems } from "@/types";

export default function AdminEditSetPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("admin.sets");
  const locale = useLocale();
  const router = useRouter();
  const [set, setSet] = useState<ShopSetWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    paramsPromise.then(async (params) => {
      try {
        const res = await fetch(`/api/admin/sets/${params.id}`);
        const data = await res.json();
        setSet(data.set || null);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    });
  }, [paramsPromise]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!set) return;
    setSaving(true);
    try {
      const params = await paramsPromise;
      const res = await fetch(`/api/admin/sets/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/${locale}/admin/sets`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  if (!set) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">{t("setNotFound")}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading text-gray-100 mb-6">{t("editSet")}</h1>
      <SetForm set={set} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
