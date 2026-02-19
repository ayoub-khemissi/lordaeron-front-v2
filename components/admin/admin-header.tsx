"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useAdminAuth } from "@/lib/admin-auth-context";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function AdminHeader() {
  const t = useTranslations("admin.nav");
  const locale = useLocale();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/admin/login`);
  };

  return (
    <header className="h-14 bg-[#0d1117] border-b border-gray-800 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        {admin && (
          <span className="text-sm text-gray-400">
            {admin.display_name}
            <span className="text-xs text-gray-600 ml-2">({admin.role})</span>
          </span>
        )}
        <Button
          className="text-red-400 hover:text-red-300"
          size="sm"
          variant="light"
          onPress={handleLogout}
        >
          {t("logout")}
        </Button>
      </div>
    </header>
  );
}
