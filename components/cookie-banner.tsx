"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { useTranslations, useLocale } from "next-intl";
import NextLink from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "lordaeron_cookie_consent";

export const CookieBanner = () => {
  const t = useTranslations("cookieBanner");
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);

    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          exit={{ y: 100, opacity: 0 }}
          initial={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto max-w-4xl">
            <div className="glass glow-gold rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-300 text-sm text-center sm:text-left">
                {t("message")}{" "}
                <NextLink
                  className="text-wow-gold hover:text-wow-gold-light hover:underline transition-colors"
                  href={`/${locale}/privacy-policy`}
                >
                  {t("learnMore")}
                </NextLink>
              </p>
              <Button
                className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold min-w-[100px] shrink-0"
                size="sm"
                onPress={handleAccept}
              >
                {t("accept")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
