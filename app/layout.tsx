import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "WoW private server",
    "World of Warcraft private server",
    "WoW 3.3.5a",
    "WotLK server",
    "Wrath of the Lich King",
    "progressive server",
    "epic progressive",
    "WoW progressive raid",
    "Vanilla WoW",
    "TBC server",
    "Burning Crusade",
    "transmog WoW",
    "transmogrification",
    "crossfaction",
    "free to play WoW",
    "WoW server 2025",
    "serveur privé WoW",
    "serveur progressif",
    "WoW gratuit",
    "Lordaeron",
    "Lordaeron WoW",
    "raid progression",
    "x5 rates",
    "AOE loot",
    "tank as DPS",
    "WoW classic progressive",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: "/img/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "Lordaeron — Epic Progressive WoW Private Server",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/og/og-twitter.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#060a0f" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
