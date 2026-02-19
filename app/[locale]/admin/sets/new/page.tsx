"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { SetForm } from "@/components/admin/set-form";

export default function AdminNewSetPage() {
  const t = useTranslations("admin.sets");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/${locale}/admin/sets`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading text-gray-100 mb-6">{t("addSet")}</h1>
      <SetForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
