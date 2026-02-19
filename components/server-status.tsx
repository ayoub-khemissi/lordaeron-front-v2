"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export const ServerStatus = () => {
  const t = useTranslations("common");
  const [online, setOnline] = useState<boolean | null>(null);
  const [realmName, setRealmName] = useState("Lordaeron");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/server/status");
        const data = await res.json();

        setOnline(data.online);
        setRealmName(data.name || "Lordaeron");
      } catch {
        setOnline(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-3 px-6 py-3 rounded-full
        glass
        ${online === true ? "glow-pulse border-green-500/20" : online === false ? "border-red-500/20" : "border-default-700/20"}
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Animated dot */}
      <span className="relative flex h-3 w-3">
        {online && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${
            online === null
              ? "bg-default-400"
              : online
                ? "bg-green-400"
                : "bg-red-500"
          }`}
        />
      </span>

      <span className="text-sm font-medium text-gray-200">
        {realmName}:{" "}
        <span
          className={
            online === null
              ? "text-gray-400"
              : online
                ? "text-green-400"
                : "text-red-400"
          }
        >
          {online === null ? t("loading") : online ? t("online") : t("offline")}
        </span>
      </span>
    </motion.div>
  );
};
