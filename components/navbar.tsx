"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import Image from "next/image";
import NextLink from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { DiscordIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";

export const Navbar = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}`);
  };

  return (
    <HeroUINavbar
      classNames={{
        base: "bg-wow-darker/60 backdrop-blur-xl border-b border-wow-gold/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]",
        wrapper: "px-4 sm:px-6",
      }}
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-2 group"
            href={`/${locale}`}
          >
            <Image
              alt="Lordaeron"
              className="drop-shadow-[0_0_6px_rgba(199,156,62,0.4)]"
              height={32}
              src="/img/logo/logo.png"
              width={32}
            />
            <span className="font-bold text-xl wow-gradient-text tracking-widest group-hover:drop-shadow-[0_0_8px_rgba(199,156,62,0.5)] transition-all">
              LORDAERON
            </span>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-1 justify-start ml-6">
          {siteConfig.navItems
            .filter((item) => item.href !== "/shop" || user)
            .map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className="text-gray-200 hover:text-wow-gold px-3 py-2 rounded-lg hover:bg-wow-gold/5 transition-all duration-300 text-sm font-medium"
                  href={`/${locale}${item.href === "/" ? "" : item.href}`}
                >
                  {t(item.labelKey)}
                </NextLink>
              </NavbarItem>
            ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2 items-center">
          <Link
            isExternal
            aria-label="Discord"
            className="text-gray-400 hover:text-[#5865F2] transition-colors"
            href={siteConfig.links.discord}
          >
            <DiscordIcon className="w-5 h-5" />
          </Link>
          <div className="w-px h-5 bg-default-700/50 mx-1" />
          <LocaleSwitcher />
        </NavbarItem>

        {/* Auth section */}
        <NavbarItem className="hidden md:flex gap-2">
          {loading ? (
            <div className="w-24 h-8 rounded-lg bg-white/5 animate-pulse" />
          ) : user ? (
            /* Logged in: user dropdown */
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  className="glass border-wow-gold/20 hover:border-wow-gold/40 transition-colors gap-2 px-3"
                  size="sm"
                  variant="flat"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-wow-gold/40 to-wow-gold-dark/40 flex items-center justify-center border border-wow-gold/30">
                    <span className="text-xs font-bold wow-gradient-text">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-wow-gold text-sm font-medium">
                    {user.username}
                  </span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User menu"
                classNames={{
                  base: "bg-[#161b22] border border-wow-gold/15",
                }}
              >
                <DropdownItem
                  key="account"
                  className="text-gray-300 hover:text-wow-gold"
                  onPress={() => router.push(`/${locale}/account`)}
                >
                  {t("nav.account")}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-red-400"
                  color="danger"
                  onPress={handleLogout}
                >
                  {t("nav.logout")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            /* Not logged in: login/register buttons */
            <>
              <Button
                as={NextLink}
                className="text-gray-200 hover:text-wow-blue"
                href={`/${locale}/login`}
                size="sm"
                variant="light"
              >
                {t("nav.login")}
              </Button>
              <Button
                as={NextLink}
                className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold glow-gold hover:shadow-[0_0_25px_rgba(199,156,62,0.4)] transition-shadow"
                href={`/${locale}/register`}
                size="sm"
              >
                {t("nav.register")}
              </Button>
            </>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <LocaleSwitcher />
        <NavbarMenuToggle className="text-gray-400" />
      </NavbarContent>

      <NavbarMenu className="bg-wow-darker/95 backdrop-blur-xl pt-6 border-t border-wow-gold/10">
        <div className="mx-4 mt-2 flex flex-col gap-1">
          {siteConfig.navMenuItems
            .filter((item) => item.href !== "/shop" || user)
            .map((item) => (
              <NavbarMenuItem key={item.href}>
                <NextLink
                  className="text-gray-200 hover:text-wow-gold transition-all text-lg block py-2 px-3 rounded-lg hover:bg-wow-gold/5"
                  href={`/${locale}${item.href === "/" ? "" : item.href}`}
                >
                  {t(item.labelKey)}
                </NextLink>
              </NavbarMenuItem>
            ))}

          {/* Mobile auth section */}
          <div className="shimmer-line w-full my-3" />

          {!loading && user ? (
            <>
              <NavbarMenuItem>
                <NextLink
                  className="text-wow-gold hover:text-wow-gold-light transition-all text-lg block py-2 px-3 rounded-lg hover:bg-wow-gold/5 font-medium"
                  href={`/${locale}/account`}
                >
                  {t("nav.account")}
                </NextLink>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <button
                  className="text-red-400 hover:text-red-300 transition-all text-lg block py-2 px-3 rounded-lg hover:bg-red-500/5 w-full text-left"
                  onClick={handleLogout}
                >
                  {t("nav.logout")}
                </button>
              </NavbarMenuItem>
            </>
          ) : !loading ? (
            <>
              <NavbarMenuItem>
                <NextLink
                  className="text-gray-400 hover:text-wow-blue transition-all text-lg block py-2 px-3 rounded-lg hover:bg-wow-blue/5"
                  href={`/${locale}/login`}
                >
                  {t("nav.login")}
                </NextLink>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <NextLink
                  className="text-wow-gold hover:text-wow-gold-light transition-all text-lg block py-2 px-3 rounded-lg hover:bg-wow-gold/5 font-medium"
                  href={`/${locale}/register`}
                >
                  {t("nav.register")}
                </NextLink>
              </NavbarMenuItem>
            </>
          ) : null}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
