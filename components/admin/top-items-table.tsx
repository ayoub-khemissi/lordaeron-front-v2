"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { WowheadLink } from "@/components/wowhead-link";
import { getLocalizedName } from "@/lib/shop-utils";

interface TopItemsTableProps {
  items: { id: number; name_en: string; name_fr: string; name_es: string; name_de: string; name_it: string; item_id: number | null; count: number; revenue: number }[];
}

export function TopItemsTable({ items }: TopItemsTableProps) {
  const t = useTranslations("admin.dashboard");
  const tc = useTranslations("admin.common");
  const locale = useLocale();

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 mb-8">
      <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">{t("topItems")}</h3>
      <Table
        aria-label="Top items"
        classNames={{
          wrapper: "bg-transparent shadow-none p-0",
          th: "bg-transparent text-gray-500 border-b border-gray-800",
          td: "text-gray-300",
        }}
        removeWrapper
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>{t("topItems")}</TableColumn>
          <TableColumn>{tc("sales")}</TableColumn>
          <TableColumn>{tc("revenue")}</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-gray-500">{index + 1}</TableCell>
              <TableCell className="font-medium">
                {item.item_id ? (
                  <WowheadLink itemId={item.item_id} className="text-gray-300 hover:text-wow-gold">
                    {getLocalizedName(item, locale)}
                  </WowheadLink>
                ) : (
                  getLocalizedName(item, locale)
                )}
              </TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Image src="/img/icons/soul-shard.svg" alt="" width={14} height={14} />
                  <span className="text-purple-400">{item.revenue.toLocaleString()}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
