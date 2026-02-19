"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useLocale, useTranslations } from "next-intl";

import { getLocalizedName } from "@/lib/shop-utils";
import type { ShopPurchaseWithItem } from "@/types";

interface RefundModalProps {
  purchase: ShopPurchaseWithItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function RefundModal({ purchase, isOpen, onClose, onConfirm, loading, error }: RefundModalProps) {
  const t = useTranslations("admin.purchases");
  const tc = useTranslations("admin.common");
  const locale = useLocale();

  return (
    <Modal isOpen={isOpen} onClose={onClose} classNames={{ base: "bg-[#161b22] border border-gray-800" }}>
      <ModalContent>
        {purchase && (
          <>
            <ModalHeader>{t("confirmRefund")}</ModalHeader>
            <ModalBody>
              <div className="space-y-2 text-sm text-gray-300">
                <p>#{purchase.id}</p>
                <p>{t("item")}: {getLocalizedName(purchase, locale, "item_name")}</p>
                <p>{t("character")}: {purchase.character_name}</p>
                <p>{t("price")}: {purchase.price_paid} Soul Shards</p>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-3">{t(`reason_${error}`)}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} className="text-gray-400">{tc("cancel")}</Button>
              <Button
                onPress={onConfirm}
                isLoading={loading}
                className="bg-orange-500 text-white font-bold"
              >
                {t("refund")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
