"use client";

import type { ShopItemLocalized, ShopSetLocalized } from "@/types";

import { useTranslations } from "next-intl";

import { ItemCard } from "./item-card";
import { SetCard } from "./set-card";

interface HighlightsCarouselProps {
  items: ShopItemLocalized[];
  sets?: ShopSetLocalized[];
  onItemClick: (item: ShopItemLocalized) => void;
  onSetClick?: (set: ShopSetLocalized) => void;
}

export function HighlightsCarousel({
  items,
  sets = [],
  onItemClick,
  onSetClick,
}: HighlightsCarouselProps) {
  const t = useTranslations("shop");

  if (items.length === 0 && sets.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-heading wow-gradient-text mb-4">
        {t("highlights")}
      </h2>
      <div className="shimmer-line w-full mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sets.map((set) => (
          <SetCard
            key={`set-${set.id}`}
            set={set}
            onClick={() => onSetClick?.(set)}
          />
        ))}
        {items.map((item) => (
          <ItemCard
            key={`item-${item.id}`}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </section>
  );
}
