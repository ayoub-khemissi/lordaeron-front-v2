"use client";

import type { ShopSetLocalized } from "@/types";

import { useTranslations } from "next-intl";

import { SetCard } from "./set-card";

interface SetGridProps {
  sets: ShopSetLocalized[];
  onSetClick: (set: ShopSetLocalized) => void;
}

export function SetGrid({ sets, onSetClick }: SetGridProps) {
  const t = useTranslations("shop");

  if (sets.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">{t("noSets")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sets.map((set) => (
        <SetCard key={set.id} set={set} onClick={() => onSetClick(set)} />
      ))}
    </div>
  );
}
