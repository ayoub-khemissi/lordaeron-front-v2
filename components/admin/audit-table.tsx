"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { useLocale, useTranslations } from "next-intl";

interface AuditLog {
  id: number;
  admin_id: number;
  admin_name: string;
  action: string;
  target_type: string;
  target_id: number | null;
  details: string | null;
  created_at: string;
}

interface AuditTableProps {
  logs: AuditLog[];
}

export function AuditTable({ logs }: AuditTableProps) {
  const t = useTranslations("admin.audit");
  const locale = useLocale();

  const translateAction = (action: string) => {
    try {
      return t(`action_${action}`);
    } catch {
      return action;
    }
  };

  const translateTarget = (targetType: string) => {
    try {
      return t(`target_${targetType}`);
    } catch {
      return targetType;
    }
  };

  return (
    <Table
      aria-label="Audit log"
      classNames={{
        wrapper: "bg-[#161b22] border border-gray-800",
        th: "bg-[#0d1117] text-gray-500 border-b border-gray-800",
        td: "text-gray-300",
      }}
    >
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>{t("admin")}</TableColumn>
        <TableColumn>{t("action")}</TableColumn>
        <TableColumn>{t("target")}</TableColumn>
        <TableColumn>{t("details")}</TableColumn>
        <TableColumn>{t("date")}</TableColumn>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="text-gray-500">#{log.id}</TableCell>
            <TableCell>{log.admin_name}</TableCell>
            <TableCell>
              <span className="text-sm bg-gray-800/50 px-2 py-0.5 rounded">
                {translateAction(log.action)}
              </span>
            </TableCell>
            <TableCell className="text-sm">
              {translateTarget(log.target_type)}{log.target_id ? ` #${log.target_id}` : ""}
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-xs text-gray-500">
              {log.details ? (typeof log.details === "string" ? log.details : JSON.stringify(log.details)) : "-"}
            </TableCell>
            <TableCell className="text-sm text-gray-400">
              {new Date(log.created_at).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
