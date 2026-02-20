export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Lordaeron",
  description: "Lordaeron - Epic Progressive WoW Server",
  baseUrl: "https://www.lordaeron.eu",
  tagline: "The Ultimate Epic Progressive WoW Experience",
  navItems: [
    { labelKey: "nav.howTo", href: "/how-to" },
    { labelKey: "nav.features", href: "/features" },
    { labelKey: "nav.news", href: "/news" },
    { labelKey: "nav.shop", href: "/shop" },
  ],
  navMenuItems: [
    { labelKey: "nav.howTo", href: "/how-to" },
    { labelKey: "nav.features", href: "/features" },
    { labelKey: "nav.news", href: "/news" },
    { labelKey: "nav.shop", href: "/shop" },
  ],
  links: {
    discord: "https://discord.gg/MqTzu6Qhn3",
  },
  realmlist: "set realmlist logon.lordaeron.com",
  version: "3.3.5a (Build 12340)",
};
