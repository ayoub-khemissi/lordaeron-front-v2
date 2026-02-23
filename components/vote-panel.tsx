"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useAuth } from "@/lib/auth-context";

interface VoteSite {
  id: number;
  name: string;
  slug: string;
  voteUrl: string;
  imageUrl: string | null;
  rewardShards: number;
  cooldownHours: number;
  lastVotedAt: string | null;
  canVote: boolean;
}

function CooldownTimer({
  lastVotedAt,
  cooldownHours,
}: {
  lastVotedAt: string;
  cooldownHours: number;
}) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function update() {
      const cooldownMs = cooldownHours * 60 * 60 * 1000;
      const lastVote = new Date(lastVotedAt).getTime();
      const end = lastVote + cooldownMs;
      const diff = end - Date.now();

      if (diff <= 0) {
        setRemaining("");

        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setRemaining(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
      );
    }

    update();
    const interval = setInterval(update, 30_000);

    return () => clearInterval(interval);
  }, [lastVotedAt, cooldownHours]);

  if (!remaining) return null;

  return <span className="text-xs text-gray-400 font-mono">{remaining}</span>;
}

export function VotePanel() {
  const t = useTranslations("vote");
  const { user, loading: authLoading } = useAuth();
  const [sites, setSites] = useState<VoteSite[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch("/api/vote/sites");

      if (!res.ok) return;

      const data = await res.json();

      setSites(data.sites || []);
    } catch {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSites();

      // Refresh every 5 minutes to update cooldowns
      const interval = setInterval(fetchSites, 5 * 60 * 1000);

      return () => clearInterval(interval);
    } else {
      setSites([]);
      setLoaded(false);
    }
  }, [user, fetchSites]);

  if (authLoading || !user || !loaded || sites.length === 0) return null;

  return (
    <div className="fixed right-4 top-20 z-40 hidden lg:block">
      {collapsed ? (
        <button
          className="glass border-wow-gold/20 hover:border-wow-gold/40 rounded-lg px-3 py-2 text-xs text-wow-gold font-medium transition-all hover:bg-wow-gold/5 flex items-center gap-1.5"
          onClick={() => setCollapsed(false)}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          {t("expand")}
        </button>
      ) : (
        <div className="glass border-wow-gold/15 rounded-xl w-48 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
            <span className="text-xs font-semibold wow-gradient-text uppercase tracking-wider">
              {t("title")}
            </span>
            <button
              className="text-gray-500 hover:text-gray-300 transition-colors"
              onClick={() => setCollapsed(true)}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>

          {/* Sites */}
          <div className="p-2 space-y-2">
            {sites.map((site) => (
              <div key={site.id} className="space-y-1">
                {site.canVote ? (
                  <a
                    className="block group"
                    href={site.voteUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {site.imageUrl ? (
                      <div className="relative rounded-lg overflow-hidden border border-wow-gold/20 group-hover:border-wow-gold/50 transition-all">
                        <Image
                          unoptimized
                          alt={site.name}
                          className="w-full h-auto"
                          height={31}
                          src={site.imageUrl}
                          width={88}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center rounded-lg border border-wow-gold/20 group-hover:border-wow-gold/50 bg-wow-gold/5 group-hover:bg-wow-gold/10 py-2 transition-all">
                        <span className="text-xs font-medium text-wow-gold">
                          {t("vote")} — {site.name}
                        </span>
                      </div>
                    )}
                  </a>
                ) : (
                  <div className="relative">
                    {site.imageUrl ? (
                      <div className="relative rounded-lg overflow-hidden border border-white/5 opacity-40">
                        <Image
                          unoptimized
                          alt={site.name}
                          className="w-full h-auto grayscale"
                          height={31}
                          src={site.imageUrl}
                          width={88}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center rounded-lg border border-white/5 bg-white/5 py-2 opacity-40">
                        <span className="text-xs font-medium text-gray-400">
                          {t("voted")} — {site.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between px-1">
                  {site.canVote ? (
                    <span className="text-[10px] text-wow-gold/80 font-medium">
                      {t("reward", { shards: site.rewardShards })}
                    </span>
                  ) : site.lastVotedAt ? (
                    <>
                      <span className="text-[10px] text-gray-500">
                        {t("cooldown")}
                      </span>
                      <CooldownTimer
                        cooldownHours={site.cooldownHours}
                        lastVotedAt={site.lastVotedAt}
                      />
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
