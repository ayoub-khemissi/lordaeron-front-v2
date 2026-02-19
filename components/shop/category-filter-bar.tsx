"use client";

import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { useTranslations } from "next-intl";

interface CategoryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  showSets?: boolean;
  onShowSetsChange?: (value: boolean) => void;
  showItems?: boolean;
  onShowItemsChange?: (value: boolean) => void;
}

export function CategoryFilterBar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  showSets,
  onShowSetsChange,
  showItems,
  onShowItemsChange,
}: CategoryFilterBarProps) {
  const t = useTranslations("shop");

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          label={t("search")}
          placeholder={t("searchPlaceholder")}
          value={search}
          onValueChange={onSearchChange}
          classNames={{
            inputWrapper: "glass border-wow-gold/20 hover:border-wow-gold/30",
          }}
          className="flex-1"
          size="sm"
          isClearable
          onClear={() => onSearchChange("")}
        />
        <Select
          label={t("sortBy")}
          selectedKeys={[sortBy]}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string;
            if (key) onSortChange(key);
          }}
          classNames={{
            trigger: "glass border-wow-gold/20 hover:border-wow-gold/30",
            popoverContent: "bg-[#161b22] border border-wow-gold/15",
          }}
          size="sm"
          className="w-48"
        >
          <SelectItem key="price_asc">{t("sortPriceAsc")}</SelectItem>
          <SelectItem key="price_desc">{t("sortPriceDesc")}</SelectItem>
          <SelectItem key="newest">{t("sortNewest")}</SelectItem>
          <SelectItem key="oldest">{t("sortOldest")}</SelectItem>
          <SelectItem key="name_asc">{t("sortNameAsc")}</SelectItem>
          <SelectItem key="name_desc">{t("sortNameDesc")}</SelectItem>
          <SelectItem key="quality_asc">{t("sortQualityAsc")}</SelectItem>
          <SelectItem key="quality_desc">{t("sortQualityDesc")}</SelectItem>
        </Select>
      </div>
      {onShowSetsChange && onShowItemsChange && (
        <div className="flex gap-4">
          <Checkbox
            isSelected={showSets}
            onValueChange={onShowSetsChange}
            size="sm"
            classNames={{ label: "text-sm text-gray-300" }}
          >
            {t("filterSets")}
          </Checkbox>
          <Checkbox
            isSelected={showItems}
            onValueChange={onShowItemsChange}
            size="sm"
            classNames={{ label: "text-sm text-gray-300" }}
          >
            {t("filterItems")}
          </Checkbox>
        </div>
      )}
    </div>
  );
}
