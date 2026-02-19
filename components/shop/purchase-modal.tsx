"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { PriceDisplay } from "./price-display";
import { getQualityColor } from "@/lib/shop-utils";
import type { ShopItemLocalized, Character } from "@/types";

interface PurchaseModalProps {
  item: ShopItemLocalized | null;
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  balance: number;
}

export function PurchaseModal({
  item,
  character,
  isOpen,
  onClose,
  onConfirm,
  balance,
}: PurchaseModalProps) {
  const t = useTranslations("shop");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!item || !character) return null;

  const finalPrice = item.discounted_price;
  const canAfford = balance >= finalPrice;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setResult("success");
    } catch (err: unknown) {
      setResult("error");
      setErrorMsg(err instanceof Error ? err.message : "serverError");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setErrorMsg("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      classNames={{
        base: "bg-[#0d1117] border border-wow-gold/20",
        header: "border-b border-wow-gold/10",
        footer: "border-t border-wow-gold/10",
      }}
    >
      <ModalContent>
        <ModalHeader>{t("confirmPurchase")}</ModalHeader>
        <ModalBody className="py-6">
          {result === "success" ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">&#x2705;</div>
              <h3 className="text-lg font-medium text-green-400 mb-1">{t("purchaseSuccess")}</h3>
              <p className="text-gray-400 text-sm">{t("purchaseSuccessDesc")}</p>
            </div>
          ) : result === "error" ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">&#x274C;</div>
              <p className="text-red-400">{t(`errors.${errorMsg}`)}</p>
            </div>
          ) : (
            <>
              <div className="bg-[#161b22] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-1">{t("item")}</p>
                <p className={`${getQualityColor(item.quality)} font-medium`}>{item.name}</p>
              </div>
              <div className="bg-[#161b22] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-1">{t("purchaseFor")}</p>
                <p className="text-wow-gold font-medium">{character.name}</p>
              </div>
              <div className="bg-[#161b22] rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">{t("price")}</p>
                <PriceDisplay
                  price={item.price}
                  discountedPrice={item.discounted_price}
                  discountPercentage={item.discount_percentage}
                  size="lg"
                />
                {!canAfford && (
                  <p className="text-red-400 text-sm mt-2">{t("errors.insufficientBalance")}</p>
                )}
                {item.is_refundable && item.category !== "services" && (
                  <p className="text-xs text-gray-400 mt-2">{t("refundPolicyNote")}</p>
                )}
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {result ? (
            <Button onPress={handleClose} className="bg-wow-gold text-black font-bold">
              {t("close")}
            </Button>
          ) : (
            <>
              <Button variant="light" onPress={handleClose} className="text-gray-400">
                {t("cancel")}
              </Button>
              <Button
                onPress={handleConfirm}
                isLoading={loading}
                isDisabled={!canAfford}
                className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold"
              >
                {t("confirm")}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
