"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";

import { useAuth } from "@/lib/auth-context";
import { ShopHeader } from "@/components/shop/shop-header";
import { RealmCharacterSelector } from "@/components/shop/realm-character-selector";
import { ItemGrid } from "@/components/shop/item-grid";
import { ItemDetailModal } from "@/components/shop/item-detail-modal";
import { PurchaseModal } from "@/components/shop/purchase-modal";
import { GiftModal } from "@/components/shop/gift-modal";
import { CategoryFilterBar } from "@/components/shop/category-filter-bar";
import { SHOP_CATEGORIES } from "@/lib/shop-utils";
import type { ShopItemLocalized, Character, ShopCategory } from "@/types";

export default function CategoryPage() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const category = params.category as ShopCategory;
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<ShopItemLocalized[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price");

  const [detailItem, setDetailItem] = useState<ShopItemLocalized | null>(null);
  const [purchaseItem, setPurchaseItem] = useState<ShopItemLocalized | null>(null);
  const [giftItem, setGiftItem] = useState<ShopItemLocalized | null>(null);

  // Validate category
  useEffect(() => {
    if (!SHOP_CATEGORIES.includes(category as (typeof SHOP_CATEGORIES)[number])) {
      router.push(`/${locale}/shop`);
    }
  }, [category, locale, router]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const searchParams = new URLSearchParams({ locale, category });
      if (selectedCharacter) {
        searchParams.set("race_id", String(selectedCharacter.race));
        searchParams.set("class_id", String(selectedCharacter.class));
      }

      const [itemsRes, charsRes, accountRes] = await Promise.all([
        fetch(`/api/shop/items?${searchParams}`),
        fetch("/api/shop/characters"),
        fetch("/api/account"),
      ]);

      const itemsData = await itemsRes.json();
      const charsData = await charsRes.json();
      const accountData = await accountRes.json();

      const chars = charsData.characters || [];
      setItems(itemsData.items || []);
      setCharacters(chars);
      if (!selectedCharacter && chars.length > 0) {
        setSelectedCharacter(chars[0]);
      }
      setBalance(accountData.soulShards || 0);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [user, locale, category, selectedCharacter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePurchase = async () => {
    if (!purchaseItem || !selectedCharacter) return;
    const res = await fetch("/api/shop/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_id: purchaseItem.id,
        character_guid: selectedCharacter.guid,
        character_name: selectedCharacter.name,
        realm_id: 1,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "serverError");
    fetchData();
  };

  const handleGift = async (giftToName: string) => {
    if (!giftItem || !selectedCharacter) return;
    const res = await fetch("/api/shop/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_id: giftItem.id,
        character_guid: selectedCharacter.guid,
        character_name: selectedCharacter.name,
        realm_id: 1,
        is_gift: true,
        gift_to_character_name: giftToName,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "serverError");
    fetchData();
  };

  const filteredItems = items
    .filter((item) => {
      if (!search) return true;
      return item.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.discounted_price - b.discounted_price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading wow-gradient-text mb-4">{t("title")}</h1>
        <p className="text-gray-400">{t("errors.unauthorized")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ShopHeader balance={balance} />

      <RealmCharacterSelector
        characters={characters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={setSelectedCharacter}
      />

      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="light"
          size="sm"
          onPress={() => router.push(`/${locale}/shop`)}
          className="text-gray-400 hover:text-wow-gold"
        >
          ← {t("allItems")}
        </Button>
        <h2 className="text-xl font-heading wow-gradient-text">
          {t(`categories.${category}`)}
        </h2>
      </div>

      <CategoryFilterBar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" color="warning" />
        </div>
      ) : (
        <ItemGrid items={filteredItems} onItemClick={setDetailItem} />
      )}

      <ItemDetailModal
        item={detailItem}
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        onBuy={() => {
          setPurchaseItem(detailItem);
          setDetailItem(null);
        }}
        onGift={() => {
          setGiftItem(detailItem);
          setDetailItem(null);
        }}
        hasCharacter={!!selectedCharacter}
      />

      <PurchaseModal
        item={purchaseItem}
        character={selectedCharacter}
        isOpen={!!purchaseItem}
        onClose={() => setPurchaseItem(null)}
        onConfirm={handlePurchase}
        balance={balance}
      />

      <GiftModal
        item={giftItem}
        character={selectedCharacter}
        isOpen={!!giftItem}
        onClose={() => setGiftItem(null)}
        onConfirm={handleGift}
        balance={balance}
      />
    </div>
  );
}
