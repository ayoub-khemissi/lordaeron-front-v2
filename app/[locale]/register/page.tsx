"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Spinner } from "@heroui/spinner";

import { RegisterForm } from "@/components/register-form";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/${locale}/account`);
    }
  }, [user, loading, router, locale]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  return (
    <div
      className="relative min-h-[calc(100vh-64px)] bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('/img/Burning Crusade Classic  The Gods of ZulAman Screenshots 1080p/BCC_Zul_Aman_Raid_001_1920x1080_png_jpgcopy.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-wow-darker/90" />
      <div className="relative container mx-auto max-w-7xl px-6 py-16 flex items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
