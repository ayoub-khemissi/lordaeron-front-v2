"use client";

import { useTranslations } from "next-intl";

import { ItemCard } from "./item-card";
import type { ShopItemLocalized } from "@/types";

interface ItemGridProps {
  items: ShopItemLocalized[];
  onItemClick: (item: ShopItemLocalized) => void;
}

export function ItemGrid({ items, onItemClick }: ItemGridProps) {
  const t = useTranslations("shop");

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">{t("noItems")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );
}
