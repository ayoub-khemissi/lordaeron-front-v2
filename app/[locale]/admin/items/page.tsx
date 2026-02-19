"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { WowheadLink } from "@/components/wowhead-link";
import { getLocalizedName } from "@/lib/shop-utils";
import type { ShopCategory, ShopItem } from "@/types";

export default function AdminItemsPage() {
  const t = useTranslations("admin.items");
  const tCat = useTranslations("shop.categories");
  const locale = useLocale();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/items");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeactivate = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch(`/api/admin/items/${id}`, { method: "DELETE" });
    fetchItems();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-gray-100">{t("title")}</h1>
        <Button
          as={NextLink}
          href={`/${locale}/admin/items/new`}
          className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold"
        >
          {t("addItem")}
        </Button>
      </div>

      <Table
        aria-label="Shop items"
        classNames={{
          wrapper: "bg-[#161b22] border border-gray-800",
          th: "bg-[#0d1117] text-gray-500 border-b border-gray-800",
          td: "text-gray-300",
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>{t("name")}</TableColumn>
          <TableColumn>{t("category")}</TableColumn>
          <TableColumn>{t("price")}</TableColumn>
          <TableColumn>{t("discount")}</TableColumn>
          <TableColumn>{t("status")}</TableColumn>
          <TableColumn>{t("actions")}</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-gray-500">#{item.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.icon_url && <img src={item.icon_url} alt="" className="w-6 h-6 rounded" />}
                  {item.item_id ? (
                    <WowheadLink itemId={item.item_id} className="text-gray-300 hover:text-wow-gold">
                      {getLocalizedName(item, locale)}
                    </WowheadLink>
                  ) : (
                    <span>{getLocalizedName(item, locale)}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Chip size="sm" className="bg-gray-800 text-gray-300">{tCat(item.category as ShopCategory)}</Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Image src="/img/icons/soul-shard.svg" alt="" width={14} height={14} />
                  <span className="text-purple-400">{item.price}</span>
                </div>
              </TableCell>
              <TableCell>
                {item.discount_percentage > 0 ? (
                  <Chip size="sm" className="bg-green-500/10 text-green-400">-{item.discount_percentage}%</Chip>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  className={item.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}
                >
                  {item.is_active ? t("active") : t("inactive")}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    as={NextLink}
                    href={`/${locale}/admin/items/${item.id}/edit`}
                    size="sm"
                    variant="light"
                    className="text-blue-400"
                  >
                    {t("editItem")}
                  </Button>
                  {item.is_active && (
                    <Button
                      size="sm"
                      variant="light"
                      className="text-red-400"
                      onPress={() => handleDeactivate(item.id)}
                    >
                      {t("delete")}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
