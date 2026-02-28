"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

import { EquipmentSlot } from "@/types/armory";

const WOWHEAD_LOCALE: Record<string, string> = {
  en: "",
  fr: "fr/",
  es: "es/",
  de: "de/",
  it: "it/",
};

/** Left column slot order (top to bottom) — matches WoW character sheet */
const LEFT_SLOTS = [0, 1, 2, 14, 4, 3, 18, 8];
/** Right column slot order */
const RIGHT_SLOTS = [9, 5, 6, 7, 10, 11, 12, 13];
/** Bottom row: Main Hand, Off Hand, Ranged */
const BOTTOM_SLOTS = [15, 16, 17];

interface EquipmentPanelProps {
  equipment: EquipmentSlot[];
  children: React.ReactNode; // ModelViewer goes here
}

function SlotIcon({
  item,
  locale,
}: {
  item: EquipmentSlot | undefined;
  locale: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const localePath = WOWHEAD_LOCALE[locale] ?? "";

  useEffect(() => {
    if (!item) return;

    let cancelled = false;

    // Fetch icon name from Wowhead XML
    fetch(`/api/armory/icon/${item.itemEntry}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.icon) {
          setIconUrl(
            `https://wow.zamimg.com/images/wow/icons/large/${data.icon}.jpg`,
          );
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const timer = setTimeout(() => {
      (window as any).$WowheadPower?.refreshLinks();
    }, 100);

    return () => clearTimeout(timer);
  }, [item, iconUrl]);

  if (!item) {
    return (
      <div className="w-11 h-11 rounded-md border border-white/10 bg-black/40" />
    );
  }

  return (
    <a
      ref={ref}
      className="block w-11 h-11 rounded-md border border-wow-gold/30 bg-black/60 overflow-hidden hover:border-wow-gold/70 transition-colors"
      href={`https://www.wowhead.com/wotlk/${localePath}item=${item.itemEntry}`}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(e) => e.stopPropagation()}
    >
      {iconUrl && (
        <img
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          src={iconUrl}
        />
      )}
    </a>
  );
}

export function EquipmentPanel({ equipment, children }: EquipmentPanelProps) {
  const locale = useLocale();
  const equipmentMap = new Map(equipment.map((e) => [e.slot, e]));

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Main area: left slots — model — right slots */}
      <div className="flex items-start gap-2 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-1.5 pt-2">
          {LEFT_SLOTS.map((slotId) => (
            <SlotIcon
              key={slotId}
              item={equipmentMap.get(slotId)}
              locale={locale}
            />
          ))}
        </div>

        {/* Model viewer */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* Right column */}
        <div className="flex flex-col gap-1.5 pt-2">
          {RIGHT_SLOTS.map((slotId) => (
            <SlotIcon
              key={slotId}
              item={equipmentMap.get(slotId)}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Bottom row: weapons */}
      <div className="flex gap-1.5 justify-center">
        {BOTTOM_SLOTS.map((slotId) => (
          <SlotIcon
            key={slotId}
            item={equipmentMap.get(slotId)}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
