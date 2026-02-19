"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useTranslations } from "next-intl";

import { AuditTable } from "@/components/admin/audit-table";

export default function AdminAuditPage() {
  const t = useTranslations("admin.audit");
  const tc = useTranslations("admin.common");
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/audit?limit=50&offset=${offset}`);
      const data = await res.json();

      if (data.error) {
        console.error("Audit log fetch error:", data.error);
      }
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Audit log fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading text-gray-100 mb-6">{t("title")}</h1>

      <AuditTable logs={logs} />

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
    </div>
  );
}
