"use client";

import type { AccountInfo } from "@/types";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";

import { useAuth } from "@/lib/auth-context";
import { ContactForm } from "@/components/contact-form";

export const ContactContent = () => {
  const t = useTranslations("contact");
  const locale = useLocale();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace(`/${locale}/login`);

      return;
    }

    const fetchAccount = async () => {
      try {
        const res = await fetch("/api/account");

        if (res.status === 401) {
          router.replace(`/${locale}/login`);

          return;
        }

        const data = await res.json();

        setAccount(data.account);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [user, authLoading, router, locale]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">{t("loginRequired")}</p>
        <NextLink
          className="text-wow-gold hover:text-wow-gold-light hover:underline transition-colors"
          href={`/${locale}/login`}
        >
          {t("loginLink")}
        </NextLink>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  return <ContactForm email={account.email} username={account.username} />;
};
