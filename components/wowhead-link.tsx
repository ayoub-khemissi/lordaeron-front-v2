"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

declare global {
  interface Window {
    $WowheadPower?: { refreshLinks: () => void };
  }
}

const WOWHEAD_LOCALE: Record<string, string> = {
  en: "",
  fr: "fr/",
  es: "es/",
  de: "de/",
  it: "it/",
};

interface WowheadLinkProps {
  itemId: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps children with a Wowhead tooltip link for a WotLK item.
 * On hover, the Wowhead power.js script will show the item tooltip.
 * The link and tooltip language match the current site locale.
 */
export function WowheadLink({ itemId, children, className }: WowheadLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const locale = useLocale();
  const localePath = WOWHEAD_LOCALE[locale] ?? "";

  useEffect(() => {
    const timer = setTimeout(() => {
      window.$WowheadPower?.refreshLinks();
    }, 100);
    return () => clearTimeout(timer);
  }, [itemId, locale]);

  return (
    <a
      ref={ref}
      href={`https://www.wowhead.com/wotlk/${localePath}item=${itemId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}
