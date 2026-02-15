"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTranslations, useLocale } from "next-intl";
import NextLink from "next/link";
import { motion } from "framer-motion";

export const RegisterForm = () => {
  const t = useTranslations("register");
  const locale = useLocale();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.username) errs.username = t("errors.usernameRequired");
    else if (form.username.length < 3 || form.username.length > 16)
      errs.username = t("errors.usernameLength");
    else if (!/^[a-zA-Z0-9]+$/.test(form.username))
      errs.username = t("errors.usernameAlphanumeric");

    if (!form.email) errs.email = t("errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = t("errors.emailInvalid");

    if (!form.password) errs.password = t("errors.passwordRequired");
    else if (form.password.length < 6 || form.password.length > 16)
      errs.password = t("errors.passwordLength");

    if (form.password !== form.confirmPassword)
      errs.confirmPassword = t("errors.passwordMismatch");

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "usernameTaken") {
          setErrors({ username: t("errors.usernameTaken") });
        } else {
          setErrors({ server: t("errors.serverError") });
        }
        return;
      }

      setSuccess(true);
    } catch {
      setErrors({ server: t("errors.serverError") });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass glow-gold rounded-2xl max-w-md mx-auto p-10 text-center"
      >
        <div className="text-5xl mb-4">&#9989;</div>
        <p className="text-green-400 text-lg mb-6">{t("success")}</p>
        <Button
          as={NextLink}
          href={`/${locale}/login`}
          className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold glow-gold"
        >
          {t("loginLink")}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="relative max-w-md mx-auto">
      {/* Background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-wow-gold/5 via-wow-blue/5 to-wow-gold/5 rounded-3xl blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative glass glow-gold rounded-2xl overflow-hidden"
      >
        {/* Top accent image */}
        <div className="relative h-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/img/Wrath of the Lich King Classic Cinematic Stills/Wrath_of_the_Lich_King_Classic_Cinematic_Still__(3).jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(10,14,20,0.95)]" />
          <div className="absolute bottom-4 left-6">
            <h1 className="text-2xl font-bold wow-gradient-text">{t("title")}</h1>
            <p className="text-gray-400 text-sm">{t("subtitle")}</p>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t("username")}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              isInvalid={!!errors.username}
              errorMessage={errors.username}
              variant="bordered"
              classNames={{
                inputWrapper: "border-white/10 bg-white/[0.03] hover:border-wow-gold/30 focus-within:!border-wow-gold/50",
                label: "text-gray-400",
              }}
            />
            <Input
              label={t("email")}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              variant="bordered"
              classNames={{
                inputWrapper: "border-white/10 bg-white/[0.03] hover:border-wow-gold/30 focus-within:!border-wow-gold/50",
                label: "text-gray-400",
              }}
            />
            <Input
              label={t("password")}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              variant="bordered"
              classNames={{
                inputWrapper: "border-white/10 bg-white/[0.03] hover:border-wow-gold/30 focus-within:!border-wow-gold/50",
                label: "text-gray-400",
              }}
            />
            <Input
              label={t("confirmPassword")}
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              variant="bordered"
              classNames={{
                inputWrapper: "border-white/10 bg-white/[0.03] hover:border-wow-gold/30 focus-within:!border-wow-gold/50",
                label: "text-gray-400",
              }}
            />

            {errors.server && (
              <p className="text-danger text-sm text-center">{errors.server}</p>
            )}

            <Button
              type="submit"
              isLoading={loading}
              className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold mt-2 h-12 glow-gold-strong hover:shadow-[0_0_40px_rgba(199,156,62,0.5)] transition-all"
              size="lg"
            >
              {t("submit")}
            </Button>

            <p className="text-center text-gray-400 text-sm mt-1">
              {t("haveAccount")}{" "}
              <NextLink
                href={`/${locale}/login`}
                className="text-wow-blue hover:text-wow-blue-ice hover:underline transition-colors"
              >
                {t("loginLink")}
              </NextLink>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
