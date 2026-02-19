"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import type { ShopBan } from "@/types";

interface BanTableProps {
  bans: ShopBan[];
  onRemove: (ban: ShopBan) => void;
}

export function BanTable({ bans, onRemove }: BanTableProps) {
  const t = useTranslations("admin.bans");
  const tc = useTranslations("admin.common");

  return (
    <Table
      aria-label="Bans"
      classNames={{
        wrapper: "bg-[#161b22] border border-gray-800",
        th: "bg-[#0d1117] text-gray-500 border-b border-gray-800",
        td: "text-gray-300",
      }}
    >
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>{t("accountId")}</TableColumn>
        <TableColumn>{t("reason")}</TableColumn>
        <TableColumn>{t("expiresAt")}</TableColumn>
        <TableColumn>{t("active")}</TableColumn>
        <TableColumn>{t("actions")}</TableColumn>
      </TableHeader>
      <TableBody>
        {bans.map((ban) => (
          <TableRow key={ban.id}>
            <TableCell className="text-gray-500">#{ban.id}</TableCell>
            <TableCell>{ban.account_id}</TableCell>
            <TableCell className="max-w-[200px] truncate">{ban.reason}</TableCell>
            <TableCell className="text-sm">
              {ban.expires_at ? new Date(ban.expires_at).toLocaleDateString() : t("permanent")}
            </TableCell>
            <TableCell>
              <Chip
                size="sm"
                className={ban.is_active ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}
              >
                {ban.is_active ? t("active") : tc("inactive")}
              </Chip>
            </TableCell>
            <TableCell>
              {!!ban.is_active && (
                <Button
                  size="sm"
                  variant="light"
                  className="text-red-400 hover:text-red-300"
                  onPress={() => onRemove(ban)}
                >
                  {t("remove")}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
