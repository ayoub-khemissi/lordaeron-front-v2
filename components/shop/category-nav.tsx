"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { useTranslations } from "next-intl";

import { SHOP_CATEGORIES } from "@/lib/shop-utils";
import type { ShopCategory } from "@/types";

interface CategoryNavProps {
  selectedCategory: ShopCategory | null;
  onCategoryChange: (category: ShopCategory | null) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  services: "\u2699\uFE0F",
  bags: "\uD83C\uDF92",
  heirlooms: "\uD83D\uDDE1\uFE0F",
  transmog: "\uD83D\uDC57",
  mounts: "\uD83D\uDC0E",
  tabards: "\uD83D\uDEE1\uFE0F",
  pets: "\uD83D\uDC3E",
  toys: "\uD83C\uDFAE",
};

export function CategoryNav({ selectedCategory, onCategoryChange }: CategoryNavProps) {
  const t = useTranslations("shop");

  return (
    <div className="mb-6 overflow-x-auto">
      <Tabs
        selectedKey={selectedCategory || "all"}
        onSelectionChange={(key) => {
          onCategoryChange(key === "all" ? null : (key as ShopCategory));
        }}
        variant="underlined"
        classNames={{
          tabList: "gap-2 w-full relative rounded-none p-0 border-b border-wow-gold/10",
          cursor: "w-full bg-wow-gold",
          tab: "max-w-fit px-4 h-10",
          tabContent: "group-data-[selected=true]:text-wow-gold text-gray-400",
        }}
      >
        <Tab key="all" title={t("allItems")} />
        {SHOP_CATEGORIES.map((cat) => (
          <Tab
            key={cat}
            title={
              <div className="flex items-center gap-2">
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{t(`categories.${cat}`)}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}
