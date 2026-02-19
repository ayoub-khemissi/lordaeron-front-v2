"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { getLocalizedName } from "@/lib/shop-utils";
import type { ShopSet } from "@/types";

export default function AdminSetsPage() {
  const t = useTranslations("admin.sets");
  const locale = useLocale();
  const [sets, setSets] = useState<ShopSet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSets = async () => {
    try {
      const res = await fetch("/api/admin/sets");
      const data = await res.json();
      setSets(data.sets || []);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const handleDeactivate = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch(`/api/admin/sets/${id}`, { method: "DELETE" });
    fetchSets();
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
          href={`/${locale}/admin/sets/new`}
          className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold"
        >
          {t("addSet")}
        </Button>
      </div>

      <Table
        aria-label="Shop sets"
        classNames={{
          wrapper: "bg-[#161b22] border border-gray-800",
          th: "bg-[#0d1117] text-gray-500 border-b border-gray-800",
          td: "text-gray-300",
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>{t("name")}</TableColumn>
          <TableColumn>{t("pieces")}</TableColumn>
          <TableColumn>{t("price")}</TableColumn>
          <TableColumn>{t("discount")}</TableColumn>
          <TableColumn>{t("status")}</TableColumn>
          <TableColumn>{t("actions")}</TableColumn>
        </TableHeader>
        <TableBody>
          {sets.map((set) => (
            <TableRow key={set.id}>
              <TableCell className="text-gray-500">#{set.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {set.icon_url && <img src={set.icon_url} alt="" className="w-6 h-6 rounded" />}
                  <span>{getLocalizedName(set, locale)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Chip size="sm" className="bg-purple-500/10 text-purple-400">
                  {t("piecesCount")}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Image src="/img/icons/soul-shard.svg" alt="" width={14} height={14} />
                  <span className="text-purple-400">{set.price}</span>
                </div>
              </TableCell>
              <TableCell>
                {set.discount_percentage > 0 ? (
                  <Chip size="sm" className="bg-green-500/10 text-green-400">-{set.discount_percentage}%</Chip>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  className={set.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}
                >
                  {set.is_active ? t("active") : t("inactive")}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    as={NextLink}
                    href={`/${locale}/admin/sets/${set.id}/edit`}
                    size="sm"
                    variant="light"
                    className="text-blue-400"
                  >
                    {t("editSet")}
                  </Button>
                  {set.is_active && (
                    <Button
                      size="sm"
                      variant="light"
                      className="text-red-400"
                      onPress={() => handleDeactivate(set.id)}
                    >
                      {t("deactivate")}
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
