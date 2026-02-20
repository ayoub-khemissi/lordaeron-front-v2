"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const NAV_ITEMS = [
  { key: "dashboard", href: "", icon: "\uD83D\uDCCA" },
  { key: "items", href: "/items", icon: "\uD83D\uDCE6" },
  { key: "sets", href: "/sets", icon: "\uD83D\uDC57" },
  { key: "purchases", href: "/purchases", icon: "\uD83D\uDED2" },
  { key: "bans", href: "/bans", icon: "\uD83D\uDEAB" },
  { key: "audit", href: "/audit", icon: "\uD83D\uDCDD" },
  { key: "contactMessages", href: "/contact-messages", icon: "\uD83D\uDCE7" },
  { key: "realMoney", href: "/real-money", icon: "\uD83D\uDCB0" },
];

export function AdminSidebar() {
  const t = useTranslations("admin.nav");
  const locale = useLocale();
  const pathname = usePathname();

  const basePath = `/${locale}/admin`;

  return (
    <aside className="w-64 min-h-screen bg-[#0d1117] border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <NextLink className="flex items-center gap-2" href={basePath}>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-wow-gold to-wow-gold-dark flex items-center justify-center">
            <span className="text-black font-black text-sm">L</span>
          </div>
          <span className="font-bold text-lg wow-gradient-text">ADMIN</span>
        </NextLink>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const href = `${basePath}${item.href}`;
            const isActive =
              item.href === ""
                ? pathname === basePath || pathname === `${basePath}/`
                : pathname.startsWith(href);

            return (
              <li key={item.key}>
                <NextLink
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-wow-gold/10 text-wow-gold border border-wow-gold/20"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  }`}
                  href={href}
                >
                  <span>{item.icon}</span>
                  <span>{t(item.key)}</span>
                </NextLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
