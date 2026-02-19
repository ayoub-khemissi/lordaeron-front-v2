import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-01-28.clover",
    });
  }

  return _stripe;
}

export interface SoulShardPackage {
  id: string;
  baseShards: number;
  shards: number;
  bonusPercent: number;
  priceEurCents: number;
}

export const SOUL_SHARD_PACKAGES: SoulShardPackage[] = [
  { id: "shards_500", baseShards: 500, shards: 500, bonusPercent: 0, priceEurCents: 500 },
  { id: "shards_1000", baseShards: 1000, shards: 1150, bonusPercent: 15, priceEurCents: 1000 },
  { id: "shards_2500", baseShards: 2500, shards: 3000, bonusPercent: 20, priceEurCents: 2500 },
  { id: "shards_5000", baseShards: 5000, shards: 6250, bonusPercent: 25, priceEurCents: 5000 },
  { id: "shards_10000", baseShards: 10000, shards: 14000, bonusPercent: 40, priceEurCents: 10000 },
];

export function getPackageById(id: string): SoulShardPackage | undefined {
  return SOUL_SHARD_PACKAGES.find((p) => p.id === id);
}

export function getSmallestPackageCoveringDeficit(
  deficit: number,
): SoulShardPackage {
  return (
    SOUL_SHARD_PACKAGES.find((p) => p.shards >= deficit) ??
    SOUL_SHARD_PACKAGES[SOUL_SHARD_PACKAGES.length - 1]
  );
}
