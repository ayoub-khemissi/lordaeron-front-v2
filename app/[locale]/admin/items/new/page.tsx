"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { ItemForm } from "@/components/admin/item-form";

export default function AdminNewItemPage() {
  const t = useTranslations("admin.items");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/${locale}/admin/items`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading text-gray-100 mb-6">{t("addItem")}</h1>
      <ItemForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
