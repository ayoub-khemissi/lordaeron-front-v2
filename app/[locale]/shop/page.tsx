"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@heroui/spinner";
import { Tabs, Tab } from "@heroui/tabs";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import Image from "next/image";

import { useAuth } from "@/lib/auth-context";
import { ShopHeader } from "@/components/shop/shop-header";
import { RealmCharacterSelector } from "@/components/shop/realm-character-selector";
import { CategoryNav } from "@/components/shop/category-nav";
import { ItemGrid } from "@/components/shop/item-grid";
import { SetGrid } from "@/components/shop/set-grid";
import { HighlightsCarousel } from "@/components/shop/highlights-carousel";

import { ItemDetailModal } from "@/components/shop/item-detail-modal";
import { SetDetailModal } from "@/components/shop/set-detail-modal";
import { PurchaseModal } from "@/components/shop/purchase-modal";
import { GiftModal } from "@/components/shop/gift-modal";
import { PurchaseHistory } from "@/components/shop/purchase-history";
import { CategoryFilterBar } from "@/components/shop/category-filter-bar";
import type { ShopItemLocalized, ShopSetLocalized, Character, ShopCategory, ShopPurchaseWithItem } from "@/types";

export default function ShopPage() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<ShopItemLocalized[]>([]);
  const [sets, setSets] = useState<ShopSetLocalized[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("shop");
  const [showSetFilter, setShowSetFilter] = useState(true);
  const [showItemFilter, setShowItemFilter] = useState(true);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Modal states
  const [detailItem, setDetailItem] = useState<ShopItemLocalized | null>(null);
  const [purchaseItem, setPurchaseItem] = useState<ShopItemLocalized | null>(null);
  const [giftItem, setGiftItem] = useState<ShopItemLocalized | null>(null);
  const [detailSet, setDetailSet] = useState<ShopSetLocalized | null>(null);
  const [purchaseSet, setPurchaseSet] = useState<ShopSetLocalized | null>(null);
  const [giftSet, setGiftSet] = useState<ShopSetLocalized | null>(null);
  const [purchases, setPurchases] = useState<ShopPurchaseWithItem[]>([]);

  // Refund states
  const [refundTarget, setRefundTarget] = useState<ShopPurchaseWithItem | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundResult, setRefundResult] = useState<"success" | "error" | null>(null);
  const [refundError, setRefundError] = useState("");

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ locale });
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedCharacter) {
        params.set("race_id", String(selectedCharacter.race));
        params.set("class_id", String(selectedCharacter.class));
        params.set("level", String(selectedCharacter.level));
      }

      const setParams = new URLSearchParams({ locale });
      if (selectedCharacter) {
        setParams.set("class_id", String(selectedCharacter.class));
        setParams.set("level", String(selectedCharacter.level));
      }

      const [itemsRes, setsRes, charsRes, accountRes] = await Promise.all([
        fetch(`/api/shop/items?${params}`),
        fetch(`/api/shop/sets?${setParams}`),
        fetch("/api/shop/characters"),
        fetch("/api/account"),
      ]);

      const itemsData = await itemsRes.json();
      const setsData = await setsRes.json();
      const charsData = await charsRes.json();
      const accountData = await accountRes.json();

      const chars = charsData.characters || [];
      setItems(itemsData.items || []);
      setSets(setsData.sets || []);
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
  }, [user, locale, selectedCategory, selectedCharacter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchPurchases = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/shop/purchases");
      const data = await res.json();
      setPurchases(data.purchases || []);
    } catch {
      // Silent fail
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "history") fetchPurchases();
  }, [activeTab, fetchPurchases]);

  // Restore preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lordaeron_shop_prefs");
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.sortBy) setSortBy(prefs.sortBy);
        if (typeof prefs.showSets === "boolean") setShowSetFilter(prefs.showSets);
        if (typeof prefs.showItems === "boolean") setShowItemFilter(prefs.showItems);
      }
    } catch {
      // Ignore parse errors
    }
    setPrefsLoaded(true);
  }, []);

  // Persist preferences to localStorage on change
  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      localStorage.setItem(
        "lordaeron_shop_prefs",
        JSON.stringify({ sortBy, showSets: showSetFilter, showItems: showItemFilter })
      );
    } catch {
      // Ignore storage errors
    }
  }, [sortBy, showSetFilter, showItemFilter, prefsLoaded]);

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

  const handleSetPurchase = async () => {
    if (!purchaseSet || !selectedCharacter) return;
    const res = await fetch("/api/shop/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        set_id: purchaseSet.id,
        character_guid: selectedCharacter.guid,
        character_name: selectedCharacter.name,
        realm_id: 1,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "serverError");
    fetchData();
  };

  const handleGift = async (giftToName: string, giftMessage: string) => {
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
        gift_message: giftMessage,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "serverError");
    fetchData();
  };

  const handleSetGift = async (giftToName: string, giftMessage: string) => {
    if (!giftSet || !selectedCharacter) return;
    const res = await fetch("/api/shop/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        set_id: giftSet.id,
        character_guid: selectedCharacter.guid,
        character_name: selectedCharacter.name,
        realm_id: 1,
        is_gift: true,
        gift_to_character_name: giftToName,
        gift_message: giftMessage,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "serverError");
    fetchData();
  };

  const handleRefund = async () => {
    if (!refundTarget) return;
    setRefundLoading(true);
    try {
      const res = await fetch(`/api/shop/purchases/${refundTarget.id}/refund`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setRefundResult("error");
        setRefundError(data.error || "serverError");
      } else {
        setRefundResult("success");
        fetchPurchases();
        fetchData();
      }
    } catch {
      setRefundResult("error");
      setRefundError("serverError");
    } finally {
      setRefundLoading(false);
    }
  };

  const handleRefundClose = () => {
    setRefundTarget(null);
    setRefundResult(null);
    setRefundError("");
  };

  // Sort function shared between items and sets
  const sortFn = <T extends { discounted_price: number; id: number; name: string; quality?: number }>(a: T, b: T) => {
    switch (sortBy) {
      case "price_asc":
        return a.discounted_price - b.discounted_price;
      case "price_desc":
        return b.discounted_price - a.discounted_price;
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "quality_asc":
        return (a.quality ?? 0) - (b.quality ?? 0);
      case "quality_desc":
        return (b.quality ?? 0) - (a.quality ?? 0);
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      default:
        return 0;
    }
  };

  // Filter & sort items
  const filteredItems = items
    .filter((item) => {
      if (!search) return true;
      return item.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort(sortFn);

  // Filter & sort sets
  const filteredSets = sets
    .filter((s) => {
      if (!search) return true;
      return s.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort(sortFn);

  const highlightedItems = items.filter((i) => i.is_highlighted);
  const highlightedSets = sets.filter((s) => s.is_highlighted);
  // Show sets only on the transmog category, combined with user filter
  const showSetsSection = selectedCategory === "transmog" && showSetFilter;

  // Build a virtual ShopItemLocalized for the PurchaseModal/GiftModal when buying a set
  const setAsPurchaseItem: ShopItemLocalized | null = purchaseSet
    ? {
        id: purchaseSet.id,
        category: "transmog",
        service_type: null,
        item_id: null,
        name: purchaseSet.name,
        description: purchaseSet.description,
        price: purchaseSet.price,
        discounted_price: purchaseSet.discounted_price,
        discount_percentage: purchaseSet.discount_percentage,
        realm_ids: null,
        race_ids: null,
        class_ids: purchaseSet.class_ids,
        faction: purchaseSet.faction,
        icon_url: purchaseSet.icon_url,
        quality: 4, // Epic purple for sets
        is_highlighted: purchaseSet.is_highlighted,
        is_refundable: false,
        min_level: purchaseSet.min_level,
        sort_order: purchaseSet.sort_order,
      }
    : null;

  const setAsGiftItem: ShopItemLocalized | null = giftSet
    ? {
        id: giftSet.id,
        category: "transmog",
        service_type: null,
        item_id: null,
        name: giftSet.name,
        description: giftSet.description,
        price: giftSet.price,
        discounted_price: giftSet.discounted_price,
        discount_percentage: giftSet.discount_percentage,
        realm_ids: null,
        race_ids: null,
        class_ids: giftSet.class_ids,
        faction: giftSet.faction,
        icon_url: giftSet.icon_url,
        quality: 4,
        is_highlighted: giftSet.is_highlighted,
        is_refundable: false,
        min_level: giftSet.min_level,
        sort_order: giftSet.sort_order,
      }
    : null;

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

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        variant="underlined"
        classNames={{
          tabList: "gap-4 w-full relative rounded-none p-0 border-b border-wow-gold/10 mb-6",
          cursor: "w-full bg-wow-gold",
          tab: "max-w-fit px-0 h-10",
          tabContent: "group-data-[selected=true]:text-wow-gold text-gray-400",
        }}
      >
        <Tab key="shop" title={t("title")} />
        <Tab key="history" title={t("history")} />
      </Tabs>

      {activeTab === "shop" ? (
        <>
          {!selectedCategory && (highlightedItems.length > 0 || highlightedSets.length > 0) && (
            <HighlightsCarousel
              items={highlightedItems}
              sets={highlightedSets}
              onItemClick={setDetailItem}
              onSetClick={setDetailSet}
            />
          )}

          <CategoryNav
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <CategoryFilterBar
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            {...(selectedCategory === "transmog" ? {
              showSets: showSetFilter,
              onShowSetsChange: setShowSetFilter,
              showItems: showItemFilter,
              onShowItemsChange: setShowItemFilter,
            } : {})}
          />

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            <>
              {/* Item sets section */}
              {showSetsSection && filteredSets.length > 0 && (
                <div className="mb-8 pb-6 border-b border-wow-gold/10">
                  <h2 className="text-lg font-heading text-purple-400 mb-4">
                    {t("itemSets")}
                  </h2>
                  <SetGrid sets={filteredSets} onSetClick={setDetailSet} />
                </div>
              )}

              {/* Individual items — on transmog, respect showItemFilter; other categories always show */}
              {(selectedCategory !== "transmog" || showItemFilter) && (
                <div>
                  {showSetsSection && filteredSets.length > 0 && (
                    <h2 className="text-lg font-heading text-wow-gold mb-4 mt-6">
                      {t("allItems")}
                    </h2>
                  )}
                  <ItemGrid items={filteredItems} onItemClick={setDetailItem} />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <PurchaseHistory purchases={purchases} locale={locale} onRefund={setRefundTarget} />
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

      <SetDetailModal
        set={detailSet}
        isOpen={!!detailSet}
        onClose={() => setDetailSet(null)}
        onBuy={() => {
          setPurchaseSet(detailSet);
          setDetailSet(null);
        }}
        onGift={() => {
          setGiftSet(detailSet);
          setDetailSet(null);
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

      {/* Set Purchase Modal — reuse PurchaseModal with virtual item */}
      <PurchaseModal
        item={setAsPurchaseItem}
        character={selectedCharacter}
        isOpen={!!purchaseSet}
        onClose={() => setPurchaseSet(null)}
        onConfirm={handleSetPurchase}
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

      {/* Set Gift Modal — reuse GiftModal with virtual item */}
      <GiftModal
        item={setAsGiftItem}
        character={selectedCharacter}
        isOpen={!!giftSet}
        onClose={() => setGiftSet(null)}
        onConfirm={handleSetGift}
        balance={balance}
      />

      {/* Refund Modal */}
      <Modal
        isOpen={!!refundTarget}
        onClose={handleRefundClose}
        classNames={{
          base: "bg-[#0d1117] border border-wow-gold/20",
          header: "border-b border-wow-gold/10",
          footer: "border-t border-wow-gold/10",
        }}
      >
        <ModalContent>
          <ModalHeader>{t("confirmRefund")}</ModalHeader>
          <ModalBody className="py-6">
            {refundResult === "success" ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">&#x2705;</div>
                <h3 className="text-lg font-medium text-green-400 mb-1">{t("refundSuccess")}</h3>
                <p className="text-gray-400 text-sm">{t("refundSuccessDesc")}</p>
              </div>
            ) : refundResult === "error" ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">&#x274C;</div>
                <p className="text-red-400">{t(`errors.${refundError}`)}</p>
              </div>
            ) : refundTarget ? (
              <>
                <p className="text-gray-300 text-sm mb-4">{t("confirmRefundDesc")}</p>
                <div className="bg-[#161b22] rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-400 mb-1">{t("item")}</p>
                  <div className="flex items-center gap-2">
                    {refundTarget.item_icon_url && (
                      <img src={refundTarget.item_icon_url} alt="" className="w-6 h-6 rounded" />
                    )}
                    <p className="text-gray-100 font-medium">
                      {(refundTarget[`item_name_${locale}` as keyof ShopPurchaseWithItem] as string) || refundTarget.item_name_en}
                    </p>
                  </div>
                </div>
                <div className="bg-[#161b22] rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">{t("pricePaid")}</p>
                  <div className="flex items-center gap-1">
                    <Image src="/img/icons/soul-shard.svg" alt="" width={18} height={18} />
                    <span className="text-lg text-purple-400 font-bold">{refundTarget.price_paid}</span>
                  </div>
                </div>
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            {refundResult ? (
              <Button onPress={handleRefundClose} className="bg-wow-gold text-black font-bold">
                {t("close")}
              </Button>
            ) : (
              <>
                <Button variant="light" onPress={handleRefundClose} className="text-gray-400">
                  {t("cancel")}
                </Button>
                <Button
                  onPress={handleRefund}
                  isLoading={refundLoading}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 text-black font-bold"
                >
                  {t("confirmRefund")}
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
