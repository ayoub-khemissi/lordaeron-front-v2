"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { useLocale, useTranslations } from "next-intl";

interface Transaction {
  id: number;
  account_id: number;
  package_shards: number;
  price_eur_cents: number;
  currency: string;
  status: string;
  created_at: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-500/10 text-green-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  failed: "bg-red-500/10 text-red-400",
  expired: "bg-gray-500/10 text-gray-400",
  refunded: "bg-orange-500/10 text-orange-400",
};

export function TransactionTable({ transactions }: TransactionTableProps) {
  const t = useTranslations("admin.realMoney");
  const locale = useLocale();

  return (
    <Table
      aria-label="Transactions"
      classNames={{
        wrapper: "bg-[#161b22] border border-gray-800",
        th: "bg-[#0d1117] text-gray-500 border-b border-gray-800",
        td: "text-gray-300",
      }}
    >
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>{t("account")}</TableColumn>
        <TableColumn>{t("package")}</TableColumn>
        <TableColumn>{t("amount")}</TableColumn>
        <TableColumn>{t("status")}</TableColumn>
        <TableColumn>{t("date")}</TableColumn>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="text-gray-500">#{tx.id}</TableCell>
            <TableCell>{tx.account_id}</TableCell>
            <TableCell>
              <span className="text-purple-400">
                {tx.package_shards.toLocaleString()}
              </span>{" "}
              <span className="text-gray-500 text-xs">shards</span>
            </TableCell>
            <TableCell className="text-green-400">
              {(tx.price_eur_cents / 100).toFixed(2)} EUR
            </TableCell>
            <TableCell>
              <Chip className={STATUS_COLORS[tx.status]} size="sm">
                {t(`status_${tx.status}`)}
              </Chip>
            </TableCell>
            <TableCell className="text-sm text-gray-400">
              {new Date(tx.created_at).toLocaleString(locale, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
