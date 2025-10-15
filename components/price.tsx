import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

import { useCurrency } from "@/lib/context/currency-format";
import { formatBigNumbers } from "@/lib/utils";

export const PriceDisplay = ({ value, longNumbers = false }: { value: number; longNumbers?: boolean }) => {
  const { formatPrice } = useCurrency();

  return <> {formatPrice(value, longNumbers)} </>;
};

export const PriceChangeChip = ({ changePercent, className }: { changePercent: number; className?: string; showDecimals?: boolean }) => {
  const { textColor, icon, chipColor } = getChangeConfig(changePercent);

  return (
    <Chip
      aria-label={`price change percent: ${changePercent}%`}
      className={`${textColor} ${className}`}
      color={chipColor as any}
      size="sm"
      variant="flat">
      <div className="flex items-center font-medium gap-0.5">
        <Icon aria-hidden="true" icon={icon} />
        <span>{formatBigNumbers(Math.abs(changePercent), 2)}%</span>
      </div>
    </Chip>
  );
};

const getChangeConfig = (value: number) => {
  const isPositive = value >= 0;

  return {
    isPositive,
    icon: isPositive ? "mdi:arrow-up" : "mdi:arrow-down",
    chipColor: isPositive ? "success" : "danger",
    textColor: isPositive ? "text-success-500" : "text-error-500",
  };
};
