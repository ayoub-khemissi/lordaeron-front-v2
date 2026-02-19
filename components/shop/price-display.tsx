"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface PriceDisplayProps {
  price: number;
  discountedPrice: number;
  discountPercentage: number;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  price,
  discountedPrice,
  discountPercentage,
  size = "md",
}: PriceDisplayProps) {
  const t = useTranslations("shop");
  const hasDiscount = discountPercentage > 0;

  const sizeClasses = {
    sm: { icon: 14, price: "text-sm", original: "text-xs" },
    md: { icon: 18, price: "text-base", original: "text-sm" },
    lg: { icon: 22, price: "text-xl", original: "text-base" },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <Image src="/img/icons/soul-shard.svg" alt="Soul Shards" width={s.icon} height={s.icon} />
      <div className="flex items-center gap-2">
        <span className={`font-bold text-purple-400 ${s.price}`}>
          {hasDiscount ? discountedPrice.toLocaleString() : price.toLocaleString()}
        </span>
        {hasDiscount && (
          <>
            <span className={`text-gray-500 line-through ${s.original}`}>
              {price.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
              -{discountPercentage}% {t("discount")}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
