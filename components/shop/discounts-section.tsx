"use client";

import { useTranslations } from "next-intl";

import { ItemCard } from "./item-card";
import type { ShopItemLocalized } from "@/types";

interface DiscountsSectionProps {
  items: ShopItemLocalized[];
  onItemClick: (item: ShopItemLocalized) => void;
}

export function DiscountsSection({ items, onItemClick }: DiscountsSectionProps) {
  const t = useTranslations("shop");

  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-heading text-green-400 mb-4">{t("discounts")}</h2>
      <div className="shimmer-line w-full mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
    </section>
  );
}
