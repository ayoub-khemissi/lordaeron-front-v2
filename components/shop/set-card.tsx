"use client";

import { Chip } from "@heroui/chip";
import { useTranslations } from "next-intl";

import { PriceDisplay } from "./price-display";
import { WowheadLink } from "@/components/wowhead-link";

import type { ShopSetLocalized } from "@/types";

interface SetCardProps {
  set: ShopSetLocalized;
  onClick: () => void;
}

export function SetCard({ set, onClick }: SetCardProps) {
  const t = useTranslations("shop");

  return (
    <button
      type="button"
      onClick={onClick}
      className="glass border-wow-gold/10 hover:border-wow-gold/30 rounded-xl p-4 text-left transition-all duration-200 cursor-pointer group w-full"
    >
      <div className="flex items-start gap-3 mb-3">
        {set.icon_url && (
          <div className="w-12 h-12 rounded-lg bg-wow-dark/50 border border-wow-gold/20 flex items-center justify-center overflow-hidden shrink-0">
            <img src={set.icon_url} alt={set.name} className="w-10 h-10 object-contain" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-purple-400 group-hover:text-wow-gold transition-colors truncate">
            {set.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {t("setPieces", { count: set.items.length })}
          </p>
        </div>
        {set.discount_percentage > 0 && (
          <Chip size="sm" className="bg-green-500/10 text-green-400 shrink-0">
            -{set.discount_percentage}%
          </Chip>
        )}
      </div>

      {set.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{set.description}</p>
      )}

      {/* Mini piece icons with Wowhead tooltips */}
      <div className="flex flex-wrap gap-1 mb-3">
        {set.items.slice(0, 9).map((piece) => (
          <div
            key={piece.id}
            className={`w-7 h-7 rounded border border-gray-700/50 bg-wow-dark/30 flex items-center justify-center overflow-hidden ${
              piece.icon_url ? "" : "text-[10px] text-gray-600"
            }`}
          >
            {piece.icon_url && piece.item_id ? (
              <WowheadLink itemId={piece.item_id} className="flex items-center justify-center">
                <img src={piece.icon_url} alt="" className="w-6 h-6 object-contain" />
              </WowheadLink>
            ) : piece.icon_url ? (
              <img src={piece.icon_url} alt="" className="w-6 h-6 object-contain" />
            ) : (
              "?"
            )}
          </div>
        ))}
      </div>

      {/* Restriction chips */}
      {(set.class_ids || set.faction !== "both") && (
        <div className="flex flex-wrap gap-1 mb-3">
          {set.class_ids && (
            <Chip size="sm" className="bg-cyan-500/10 text-cyan-300 text-[10px]">
              {set.class_ids.map((id) => t(`className_${id}`)).join(", ")}
            </Chip>
          )}
          {set.faction !== "both" && (
            <Chip
              size="sm"
              className={
                set.faction === "alliance"
                  ? "bg-wow-alliance/20 text-blue-300 text-[10px]"
                  : "bg-wow-horde/20 text-red-300 text-[10px]"
              }
            >
              {set.faction}
            </Chip>
          )}
        </div>
      )}

      <PriceDisplay
        price={set.price}
        discountedPrice={set.discounted_price}
        discountPercentage={set.discount_percentage}
        size="sm"
      />
    </button>
  );
}
