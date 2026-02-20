"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useTranslations } from "next-intl";

interface TopSpender {
  account_id: number;
  transaction_count: number;
  total_eur_cents: number;
  total_shards: number;
}

interface TopSpendersTableProps {
  spenders: TopSpender[];
}

export function TopSpendersTable({ spenders }: TopSpendersTableProps) {
  const t = useTranslations("admin.realMoney");

  if (spenders.length === 0) {
    return (
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
          {t("topSpenders")}
        </h3>
        <p className="text-gray-600 text-sm text-center py-8">{t("noData")}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
        {t("topSpenders")}
      </h3>
      <Table
        aria-label="Top Spenders"
        classNames={{
          wrapper: "bg-transparent shadow-none p-0",
          th: "bg-[#0d1117] text-gray-500 border-b border-gray-800",
          td: "text-gray-300",
        }}
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>{t("account")}</TableColumn>
          <TableColumn>{t("transactions")}</TableColumn>
          <TableColumn>{t("totalEur")}</TableColumn>
          <TableColumn>{t("totalShards")}</TableColumn>
        </TableHeader>
        <TableBody>
          {spenders.map((s, i) => (
            <TableRow key={s.account_id}>
              <TableCell className="text-gray-500 font-semibold">
                {i + 1}
              </TableCell>
              <TableCell>{s.account_id}</TableCell>
              <TableCell>{s.transaction_count}</TableCell>
              <TableCell className="text-green-400">
                {(s.total_eur_cents / 100).toFixed(2)} EUR
              </TableCell>
              <TableCell className="text-purple-400">
                {s.total_shards.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
