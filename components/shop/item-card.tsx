"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useTranslations } from "next-intl";

import { PriceDisplay } from "./price-display";
import { WowheadLink } from "@/components/wowhead-link";
import { getQualityColor } from "@/lib/shop-utils";
import type { ShopItemLocalized } from "@/types";

interface ItemCardProps {
  item: ShopItemLocalized;
  onClick: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const t = useTranslations("shop");
  const tHome = useTranslations("home");

  return (
    <Card
      isPressable
      onPress={onClick}
      className="glass border-wow-gold/10 hover:border-wow-gold/30 transition-all duration-300 hover:glow-gold group"
    >
      <CardBody className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            {item.icon_url && (
              <div className="w-12 h-12 rounded-lg bg-wow-dark/50 border border-wow-gold/20 flex items-center justify-center mb-2 overflow-hidden">
                {item.item_id ? (
                  <WowheadLink itemId={item.item_id} className="flex items-center justify-center">
                    <img src={item.icon_url} alt={item.name} className="w-10 h-10 object-contain" />
                  </WowheadLink>
                ) : (
                  <img src={item.icon_url} alt={item.name} className="w-10 h-10 object-contain" />
                )}
              </div>
            )}
            <h3 className={`font-medium ${getQualityColor(item.quality)} ${item.quality == null ? "group-hover:text-wow-gold" : ""} transition-colors line-clamp-2`}>
              {item.item_id ? (
                <WowheadLink itemId={item.item_id} className="text-inherit hover:text-wow-gold">
                  {item.name}
                </WowheadLink>
              ) : (
                item.name
              )}
            </h3>
          </div>
          {item.discount_percentage > 0 && (
            <Chip
              size="sm"
              className="bg-green-500/20 text-green-400 border-green-500/30"
              variant="bordered"
            >
              -{item.discount_percentage}%
            </Chip>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {item.faction !== "both" && (
            <Chip
              size="sm"
              className={
                item.faction === "alliance"
                  ? "bg-wow-alliance/20 text-blue-300"
                  : "bg-wow-horde/20 text-red-300"
              }
            >
              {item.faction === "alliance" ? tHome("alliance") : tHome("horde")}
            </Chip>
          )}
          {!item.is_refundable && (
            <Chip size="sm" className="bg-red-500/10 text-red-400">
              {t("nonRefundable")}
            </Chip>
          )}
        </div>
      </CardBody>

      <CardFooter className="px-4 pb-4 pt-2">
        <PriceDisplay
          price={item.price}
          discountedPrice={item.discounted_price}
          discountPercentage={item.discount_percentage}
          size="sm"
        />
      </CardFooter>
    </Card>
  );
}
