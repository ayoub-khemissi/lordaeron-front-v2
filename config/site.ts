export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Lordaeron",
  description:
    "Lordaeron - Epic Progressive WoW Server",
  navItems: [
    { labelKey: "nav.howTo", href: "/how-to" },
    { labelKey: "nav.features", href: "/features" },
  ],
  navMenuItems: [
    { labelKey: "nav.howTo", href: "/how-to" },
    { labelKey: "nav.features", href: "/features" },
  ],
  links: {
    discord: "https://discord.gg/MqTzu6Qhn3",
  },
  realmlist: "set realmlist logon.lordaeron.com",
  version: "3.3.5a (Build 12340)",
};
