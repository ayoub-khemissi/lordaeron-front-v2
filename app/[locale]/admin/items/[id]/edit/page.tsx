"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@heroui/spinner";

import { ItemForm } from "@/components/admin/item-form";
import type { ShopItem } from "@/types";

export default function AdminEditItemPage() {
  const t = useTranslations("admin.items");
  const tc = useTranslations("admin.common");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/admin/items/${id}`);
        const data = await res.json();
        setItem(data.item);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/${locale}/admin/items`);
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

  if (!item) {
    return <p className="text-gray-400">{tc("itemNotFound")}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-heading text-gray-100 mb-6">
        {t("editItem")}: {item.name_en}
      </h1>
      <ItemForm item={item} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
